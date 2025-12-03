import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Payment, PaymentInsert } from "@/types/payment";
import { showError, showSuccess } from "@/utils/toast";

const PAYMENTS_QUERY_KEY = "payments";

// Fetch all payments for the current user
const fetchPayments = async (userId: string): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from("payments")
    .select("*, customers(customer_name)")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Payment[];
};

// Fetch total payments for summary card
const fetchTotalPayments = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from("payments")
    .select("amount")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  
  return data.reduce((sum, payment) => sum + payment.amount, 0);
};

export const usePayments = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const enabled = !!userId && !isSessionLoading;

  const { data: payments, isLoading: isPaymentsLoading } = useQuery<Payment[]>({
    queryKey: [PAYMENTS_QUERY_KEY, userId],
    queryFn: () => fetchPayments(userId!),
    enabled: enabled,
  });
  
  const { data: totalPayments, isLoading: isTotalPaymentsLoading } = useQuery<number>({
    queryKey: ["totalPayments", userId],
    queryFn: () => fetchTotalPayments(userId!),
    enabled: enabled,
    initialData: 0,
  });

  const addPaymentMutation = useMutation({
    mutationFn: async (paymentData: PaymentInsert) => {
      if (!userId) throw new Error("User not authenticated.");
      
      // 1. Insert Payment
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert([{ ...paymentData, user_id: userId }])
        .select()
        .single();

      if (paymentError) throw new Error(paymentError.message);
      
      // 2. Update Customer Balance (Subtract payment amount from current_balance)
      if (paymentData.customer_id) {
        // Fetch current balance first
        const { data: customerData, error: fetchError } = await supabase
          .from("customers")
          .select("current_balance")
          .eq("id", paymentData.customer_id)
          .single();
          
        if (fetchError) throw new Error(`Failed to fetch customer balance: ${fetchError.message}`);
        
        const newBalance = customerData.current_balance - paymentData.amount;
        
        const { error: updateError } = await supabase
          .from("customers")
          .update({ current_balance: newBalance })
          .eq("id", paymentData.customer_id);
          
        if (updateError) throw new Error(`Failed to update customer balance: ${updateError.message}`);
      }

      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["clients"] }); // Invalidate clients query to update balances
      queryClient.invalidateQueries({ queryKey: ["totalPayments"] });
      showSuccess("Payment recorded successfully and client balance updated.");
    },
    onError: (error) => {
      showError(`Failed to record payment: ${error.message}`);
    },
  });

  return {
    payments: payments || [],
    totalPayments: totalPayments,
    isLoading: isPaymentsLoading || isSessionLoading || isTotalPaymentsLoading,
    addPayment: addPaymentMutation.mutate,
    isAdding: addPaymentMutation.isPending,
  };
};