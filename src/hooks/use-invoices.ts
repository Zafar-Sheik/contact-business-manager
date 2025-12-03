import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Invoice, InvoiceInsert, InvoiceItemInsert, Customer, StockItemForInvoice, InvoiceItem } from "@/types/invoice";
import { showError, showSuccess } from "@/utils/toast";
import { calculateDocumentTotals } from "@/utils/financial";
import { useCompanyProfile } from "./use-company-profile"; // Import the company profile hook
import { mockInvoices, mockCustomers, mockStockItemsForInvoice, mockInvoiceItemsMap } from "@/utils/mock-data";

const INVOICES_QUERY_KEY = "invoices";

// Utility function to generate the next sequential invoice number
const generateNextInvoiceNumber = (lastInvoiceNo: string | null): string => {
  const prefix = "INV-";
  if (!lastInvoiceNo || !lastInvoiceNo.startsWith(prefix)) {
    return `${prefix}001`;
  }
  
  const numberPart = lastInvoiceNo.substring(prefix.length);
  const currentNumber = parseInt(numberPart, 10);
  
  if (isNaN(currentNumber)) {
    return `${prefix}001`;
  }
  
  const nextNumber = currentNumber + 1;
  // Pad the number back to three digits (e.g., 1 -> 001, 12 -> 012)
  return `${prefix}${String(nextNumber).padStart(3, '0')}`;
};

// Fetch all invoices for the current user
const fetchInvoices = async (userId: string): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  
  // Inject mock data if no invoices are found
  if (data.length === 0) {
    // Ensure mock data includes is_vat_invoice field (defaulting to true for existing mocks)
    return mockInvoices.map(i => ({ ...i, user_id: userId, is_vat_invoice: true }));
  }
  
  return data as Invoice[];
};

// Fetch the highest invoice number
const fetchHighestInvoiceNumber = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from("invoices")
    .select("invoice_no")
    .eq("user_id", userId)
    .order("invoice_no", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means 'No rows found'
    throw new Error(error.message);
  }
  
  // If no real data, check mock data for highest number
  if (!data?.invoice_no) {
    const mockHighest = mockInvoices.reduce((max, inv) => {
      return inv.invoice_no > max ? inv.invoice_no : max;
    }, "INV-000");
    return mockHighest === "INV-000" ? null : mockHighest;
  }
  
  return data?.invoice_no || null;
};

// Fetch items for a specific invoice
const fetchInvoiceItems = async (invoiceId: string): Promise<InvoiceItem[]> => {
  // Check mock data first
  if (mockInvoiceItemsMap[invoiceId]) {
    return mockInvoiceItemsMap[invoiceId];
  }
  
  const { data, error } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("created_at");

  if (error) throw new Error(error.message);
  return data as InvoiceItem[];
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
const fetchStockItemsForInvoice = async (userId: string): Promise<StockItemForInvoice[]> => {
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

// Define the extended type for mutations
type InvoiceUpdateData = Partial<InvoiceInsert> & { id: string };

export const useInvoices = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const { profile, config, isLoading: isProfileConfigLoading } = useCompanyProfile(); // Fetch profile/config
  const userId = user?.id;
  const queryClient = useQueryClient();

  const enabled = !!userId && !isSessionLoading;

  const { data: invoices, isLoading: isInvoicesLoading } = useQuery<Invoice[]>({
    queryKey: [INVOICES_QUERY_KEY, userId],
    queryFn: () => fetchInvoices(userId!),
    enabled: enabled,
  });
  
  const { data: lastInvoiceNo, isLoading: isLastInvoiceNoLoading } = useQuery<string | null>({
    queryKey: ["lastInvoiceNo", userId],
    queryFn: () => fetchHighestInvoiceNumber(userId!),
    enabled: enabled,
  });
  
  const nextInvoiceNo = generateNextInvoiceNumber(lastInvoiceNo);

  const { data: customers, isLoading: isCustomersLoading } = useQuery<Customer[]>({
    queryKey: ["invoiceCustomers", userId],
    queryFn: () => fetchCustomers(userId!),
    enabled: enabled,
  });
  
  const { data: stockItems, isLoading: isStockItemsLoading } = useQuery<StockItemForInvoice[]>({
    queryKey: ["invoiceStockItems", userId],
    queryFn: () => fetchStockItemsForInvoice(userId!),
    enabled: enabled,
  });

  const addInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: InvoiceInsert) => {
      if (!userId) throw new Error("User not authenticated.");
      
      const { items, is_vat_invoice, ...insertData } = invoiceData;
      
      // 1. Calculate totals
      const { subtotal, vat_amount, total_amount } = calculateDocumentTotals(items);

      // 2. Insert Invoice Header
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert([{ 
          ...insertData, 
          user_id: userId,
          subtotal: subtotal,
          vat_amount: vat_amount,
          total_amount: total_amount,
          status: insertData.status || 'Draft',
          is_vat_invoice: is_vat_invoice, // Persist VAT status
        }])
        .select()
        .single();

      if (invoiceError) throw new Error(invoiceError.message);
      
      // 3. Insert Invoice Items
      const itemsToInsert = items.map(item => ({
        ...item,
        invoice_id: invoice.id,
        line_total: item.quantity * item.unit_price * (1 + item.vat_rate / 100),
      }));
      
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(itemsToInsert);
        
      if (itemsError) throw new Error(itemsError.message);
      
      return invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["lastInvoiceNo"] }); // Invalidate to get the next number
      showSuccess("Invoice created successfully.");
    },
    onError: (error) => {
      showError(`Failed to create invoice: ${error.message}`);
    },
  });
  
  const updateInvoiceMutation = useMutation({
    mutationFn: async (invoice: InvoiceUpdateData) => {
      const { id, items, ...updateData } = invoice;
      
      // 1. Calculate totals if items are provided
      let calculatedTotals = {};
      if (items) {
        calculatedTotals = calculateDocumentTotals(items);
      }
      
      // 2. Update Invoice Header
      const { data: updatedInvoice, error: updateError } = await supabase
        .from("invoices")
        .update({ ...updateData, ...calculatedTotals })
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw new Error(updateError.message);
      
      // 3. Handle Item updates: Delete existing items and re-insert new ones
      if (items) {
        // Delete existing items
        const { error: deleteError } = await supabase
          .from("invoice_items")
          .delete()
          .eq("invoice_id", id);
          
        if (deleteError) throw new Error(`Failed to delete existing invoice items: ${deleteError.message}`);
        
        // Insert new items
        const itemsToInsert = items.map(item => ({
          ...item,
          invoice_id: id,
          line_total: item.quantity * item.unit_price * (1 + item.vat_rate / 100),
        }));
        
        const { error: insertError } = await supabase
          .from("invoice_items")
          .insert(itemsToInsert);
          
        if (insertError) throw new Error(`Failed to insert updated invoice items: ${insertError.message}`);
      }

      return updatedInvoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      showSuccess("Invoice updated successfully.");
    },
    onError: (error) => {
      showError(`Failed to update invoice: ${error.message}`);
    },
  });

  return {
    invoices: invoices || [],
    customers: customers || [],
    stockItems: stockItems || [],
    profile: profile, // Export profile
    config: config, // Export config
    nextInvoiceNo, // Export the generated number
    isLoading: isInvoicesLoading || isCustomersLoading || isStockItemsLoading || isSessionLoading || isProfileConfigLoading || isLastInvoiceNoLoading,
    addInvoice: addInvoiceMutation.mutate,
    updateInvoice: updateInvoiceMutation.mutate, // Export update mutation
    isAdding: addInvoiceMutation.isPending,
    isUpdating: updateInvoiceMutation.isPending, // Export updating status
    fetchInvoiceItems, // Export the new fetch function
  };
};