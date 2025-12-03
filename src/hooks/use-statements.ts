import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Client, StatementEntry } from "@/types/client";
import { Invoice } from "@/types/invoice";
import { Payment } from "@/types/payment";

const STATEMENTS_QUERY_KEY = "statements";

// Fetch all clients
const fetchClients = async (userId: string): Promise<Client[]> => {
  const { data, error } = await supabase
    .from("customers")
    .select("id, customer_name, phone_number, email, current_balance")
    .eq("user_id", userId)
    .order("customer_name");

  if (error) throw new Error(error.message);
  return data as Client[];
};

// Fetch all relevant financial transactions (Invoices and Payments)
const fetchFinancialData = async (userId: string): Promise<{ invoices: Invoice[], payments: Payment[] }> => {
  // Fetch Invoices (only 'Sent' or 'Paid' status might be relevant for statements, but fetching all for completeness)
  const { data: invoicesData, error: invoicesError } = await supabase
    .from("invoices")
    .select("id, date, invoice_no, customer_id, total_amount, status")
    .eq("user_id", userId)
    .order("date", { ascending: true });

  if (invoicesError) throw new Error(invoicesError.message);

  // Fetch Payments
  const { data: paymentsData, error: paymentsError } = await supabase
    .from("payments")
    .select("id, date, customer_id, amount, method")
    .eq("user_id", userId)
    .order("date", { ascending: true });

  if (paymentsError) throw new Error(paymentsError.message);

  return { invoices: invoicesData as Invoice[], payments: paymentsData as Payment[] };
};

// Aggregation function to generate a statement for a single client
export const generateStatement = (
  clientId: string,
  invoices: Invoice[],
  payments: Payment[],
  endDate: Date = new Date()
): StatementEntry[] => {
  const clientInvoices = invoices
    .filter(inv => inv.customer_id === clientId && new Date(inv.date) <= endDate && inv.status !== 'Draft' && inv.status !== 'Cancelled')
    .map(inv => ({
      date: inv.date,
      type: 'Invoice' as const,
      reference: inv.invoice_no,
      amount: inv.total_amount,
    }));

  const clientPayments = payments
    .filter(pay => pay.customer_id === clientId && new Date(pay.date) <= endDate)
    .map(pay => ({
      date: pay.date,
      type: 'Payment' as const,
      reference: `PAY-${pay.id.substring(0, 4)}`,
      amount: -pay.amount, // Payments are negative
    }));

  const transactions = [...clientInvoices, ...clientPayments].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) return dateA - dateB;
    // Ensure invoices appear before payments on the same day for accurate running balance
    return a.type === 'Invoice' ? -1 : 1;
  });

  let runningBalance = 0;
  const statement: StatementEntry[] = [];

  for (const tx of transactions) {
    runningBalance += tx.amount;
    statement.push({
      ...tx,
      balance: runningBalance,
    });
  }

  return statement;
};


export const useStatements = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const userId = user?.id;

  const enabled = !!userId && !isSessionLoading;

  const { data: clients, isLoading: isClientsLoading } = useQuery<Client[]>({
    queryKey: ["statementClients", userId],
    queryFn: () => fetchClients(userId!),
    enabled: enabled,
  });
  
  const { data: financialData, isLoading: isFinancialDataLoading } = useQuery({
    queryKey: ["financialData", userId],
    queryFn: () => fetchFinancialData(userId!),
    enabled: enabled,
    initialData: { invoices: [], payments: [] },
  });

  const isLoading = isClientsLoading || isFinancialDataLoading || isSessionLoading;

  return {
    clients: clients || [],
    invoices: financialData.invoices,
    payments: financialData.payments,
    isLoading,
    generateStatement,
  };
};