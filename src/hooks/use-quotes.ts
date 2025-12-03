import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Quote, QuoteInsert, QuoteItem, Customer, StockItemForInvoice } from "@/types/quote";
import { showError, showSuccess } from "@/utils/toast";
import { calculateDocumentTotals } from "@/utils/financial";
import { useCompanyProfile } from "./use-company-profile"; // Import the company profile hook
import { mockQuotes, mockCustomers, mockStockItemsForInvoice, mockQuoteItemsMap } from "@/utils/mock-data";

const QUOTES_QUERY_KEY = "quotes";

// Fetch all quotes for the current user
const fetchQuotes = async (userId: string): Promise<Quote[]> => {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  
  // Inject mock data if no quotes are found
  if (data.length === 0) {
    return mockQuotes.map(q => ({ ...q, user_id: userId }));
  }
  
  return data as Quote[];
};

// Fetch items for a specific quote
const fetchQuoteItems = async (quoteId: string): Promise<QuoteItem[]> => {
  // Check mock data first
  if (mockQuoteItemsMap[quoteId]) {
    return mockQuoteItemsMap[quoteId];
  }
  
  const { data, error } = await supabase
    .from("quote_items")
    .select("*")
    .eq("quote_id", quoteId)
    .order("created_at");

  if (error) throw new Error(error.message);
  return data as QuoteItem[];
};

// Fetch customers for selection list
const fetchCustomers = async (userId: string): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from("customers")
    .select("id, customer_name, phone_number")
    .eq("user_id", userId)
    .order("customer_name");

  if (error) throw new Error(error.message);
  
  // Inject mock data if no customers are found
  if (data.length === 0) {
    return mockCustomers;
  }
  
  return data as Customer[];
};

// Fetch stock items for selection list
const fetchStockItemsForQuote = async (userId: string): Promise<StockItemForInvoice[]> => {
  const { data, error } = await supabase
    .from("stock_items")
    .select("id, stock_code, stock_descr, selling_price, vat")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("stock_code");

  if (error) throw new Error(error.message);
  
  // Inject mock data if no stock items are found
  if (data.length === 0) {
    return mockStockItemsForInvoice;
  }
  
  return data as StockItemForInvoice[];
};

export const useQuotes = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const { profile, config, isLoading: isProfileConfigLoading } = useCompanyProfile(); // Fetch profile/config
  const userId = user?.id;
  const queryClient = useQueryClient();

  const enabled = !!userId && !isSessionLoading;

  const { data: quotes, isLoading: isQuotesLoading } = useQuery<Quote[]>({
    queryKey: [QUOTES_QUERY_KEY, userId],
    queryFn: () => fetchQuotes(userId!),
    enabled: enabled,
  });

  const { data: customers, isLoading: isCustomersLoading } = useQuery<Customer[]>({
    queryKey: ["quoteCustomers", userId],
    queryFn: () => fetchCustomers(userId!),
    enabled: enabled,
  });
  
  const { data: stockItems, isLoading: isStockItemsLoading } = useQuery<StockItemForInvoice[]>({
    queryKey: ["quoteStockItems", userId],
    queryFn: () => fetchStockItemsForQuote(userId!),
    enabled: enabled,
  });

  const addQuoteMutation = useMutation({
    mutationFn: async (quoteData: QuoteInsert) => {
      if (!userId) throw new Error("User not authenticated.");
      
      const { items, ...insertData } = quoteData;
      
      // 1. Calculate totals
      const { subtotal, vat_amount, total_amount } = calculateDocumentTotals(items);

      // 2. Insert Quote Header
      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .insert([{ 
          ...insertData, 
          user_id: userId,
          subtotal: subtotal,
          vat_amount: vat_amount,
          total_amount: total_amount,
          status: insertData.status || 'Draft',
        }])
        .select()
        .single();

      if (quoteError) throw new Error(quoteError.message);
      
      // 3. Insert Quote Items
      const itemsToInsert = items.map(item => ({
        ...item,
        quote_id: quote.id,
        line_total: item.quantity * item.unit_price * (1 + item.vat_rate / 100),
      }));
      
      const { error: itemsError } = await supabase
        .from("quote_items")
        .insert(itemsToInsert);
        
      if (itemsError) throw new Error(itemsError.message);
      
      return quote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
      showSuccess("Quote created successfully.");
    },
    onError: (error) => {
      showError(`Failed to create quote: ${error.message}`);
    },
  });
  
  // Mutation to convert a quote to an invoice (placeholder for now, just updates status)
  const convertToInvoiceMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      // In a real scenario, this would copy quote data to the invoices table.
      // For now, we just mark the quote as 'Invoiced'.
      const { data, error } = await supabase
        .from("quotes")
        .update({ status: 'Invoiced' })
        .eq("id", quoteId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] }); // Invalidate invoices too
      showSuccess("Quote successfully marked as Invoiced.");
    },
    onError: (error) => {
      showError(`Failed to convert quote to invoice: ${error.message}`);
    },
  });

  return {
    quotes: quotes || [],
    customers: customers || [],
    stockItems: stockItems || [],
    profile: profile, // Export profile
    config: config, // Export config
    isLoading: isQuotesLoading || isCustomersLoading || isStockItemsLoading || isSessionLoading || isProfileConfigLoading,
    addQuote: addQuoteMutation.mutate,
    convertToInvoice: convertToInvoiceMutation.mutate,
    isAdding: addQuoteMutation.isPending,
    isConverting: convertToInvoiceMutation.isPending,
    fetchQuoteItems,
  };
};