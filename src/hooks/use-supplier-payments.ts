import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { SupplierPayment, SupplierPaymentInsert } from "@/types/supplier-payment";
import { Supplier } from "@/types/supplier";
import { showError, showSuccess } from "@/utils/toast";

const SUPPLIER_PAYMENTS_QUERY_KEY = "supplierPayments";
const SUPPLIERS_QUERY_KEY = "suppliers"; // Re-use key from use-suppliers

// Fetch all supplier payments for the current user
const fetchSupplierPayments = async (userId: string): Promise<SupplierPayment[]> => {
  const { data, error } = await supabase
    .from("supplier_payments")
    .select("*, suppliers(supplier_name)")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  // Note: The return type is slightly simplified here, but the query includes supplier name
  return data as SupplierPayment[]; 
};

// Fetch suppliers (simplified version for form selection)
const fetchSuppliersForPayment = async (userId: string): Promise<Pick<Supplier, 'id' | 'supplier_name' | 'current_balance'>[]> => {
  const { data, error } = await supabase
    .from("suppliers")
    .select("id, supplier_name, current_balance")
    .eq("user_id", userId)
    .order("supplier_name");

  if (error) throw new Error(error.message);
  return data as Pick<Supplier, 'id' | 'supplier_name' | 'current_balance'>[];
};

export const useSupplierPayments = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const enabled = !!userId && !isSessionLoading;

  const { data: payments, isLoading: isPaymentsLoading } = useQuery<SupplierPayment[]>({
    queryKey: [SUPPLIER_PAYMENTS_QUERY_KEY, userId],
    queryFn: () => fetchSupplierPayments(userId!),
    enabled: enabled,
  });
  
  const { data: suppliers, isLoading: isSuppliersLoading } = useQuery<Pick<Supplier, 'id' | 'supplier_name' | 'current_balance'>[]>({
    queryKey: ["paymentSuppliers", userId],
    queryFn: () => fetchSuppliersForPayment(userId!),
    enabled: enabled,
  });

  const addSupplierPaymentMutation = useMutation({
    mutationFn: async (paymentData: SupplierPaymentInsert) => {
      if (!userId) throw new Error("User not authenticated.");
      
      // 1. Insert Payment
      const { data: payment, error: paymentError } = await supabase
        .from("supplier_payments")
        .insert([{ ...paymentData, user_id: userId }])
        .select()
        .single();

      if (paymentError) throw new Error(paymentError.message);
      
      // 2. Update Supplier Balance (Subtract payment amount from current_balance)
      if (paymentData.supplier_id) {
        // Fetch current balance first
        const { data: supplierData, error: fetchError } = await supabase
          .from("suppliers")
          .select("current_balance")
          .eq("id", paymentData.supplier_id)
          .single();
          
        if (fetchError) throw new Error(`Failed to fetch supplier balance: ${fetchError.message}`);
        
        // Supplier balance is typically positive if money is owed to them. Payment reduces this.
        const newBalance = supplierData.current_balance - paymentData.amount;
        
        const { error: updateError } = await supabase
          .from("suppliers")
          .update({ current_balance: newBalance })
          .eq("id", paymentData.supplier_id);
          
        if (updateError) throw new Error(`Failed to update supplier balance: ${updateError.message}`);
      }

      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIER_PAYMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] }); // Invalidate main suppliers list
      queryClient.invalidateQueries({ queryKey: ["paymentSuppliers"] }); // Invalidate local supplier list
      showSuccess("Supplier payment recorded successfully and balance updated.");
    },
    onError: (error) => {
      showError(`Failed to record supplier payment: ${error.message}`);
    },
  });

  return {
    payments: payments || [],
    suppliers: suppliers || [],
    isLoading: isPaymentsLoading || isSuppliersLoading || isSessionLoading,
    addPayment: addSupplierPaymentMutation.mutate,
    isAdding: addSupplierPaymentMutation.isPending,
  };
};