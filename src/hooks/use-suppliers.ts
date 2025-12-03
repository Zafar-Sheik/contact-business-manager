import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Supplier, SupplierInsert, SupplierUpdate } from "@/types/supplier";
import { showError, showSuccess } from "@/utils/toast";

const SUPPLIERS_QUERY_KEY = "suppliers";

// Fetch all suppliers for the current user
const fetchSuppliers = async (userId: string): Promise<Supplier[]> => {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", userId)
    .order("supplier_name");

  if (error) throw new Error(error.message);
  return data as Supplier[];
};

export const useSuppliers = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const enabled = !!userId && !isSessionLoading;

  const { data: suppliers, isLoading: isSuppliersLoading } = useQuery<Supplier[]>({
    queryKey: [SUPPLIERS_QUERY_KEY, userId],
    queryFn: () => fetchSuppliers(userId!),
    enabled: enabled,
  });

  const addSupplierMutation = useMutation({
    mutationFn: async (supplierData: SupplierInsert) => {
      if (!userId) throw new Error("User not authenticated.");
      
      const { data, error } = await supabase
        .from("suppliers")
        .insert([{ ...supplierData, user_id: userId }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
      showSuccess("Supplier added successfully.");
    },
    onError: (error) => {
      showError(`Failed to add supplier: ${error.message}`);
    },
  });

  const updateSupplierMutation = useMutation({
    mutationFn: async (supplier: SupplierUpdate) => {
      const { id, ...updateData } = supplier;
      const { data, error } = await supabase
        .from("suppliers")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
      showSuccess("Supplier updated successfully.");
    },
    onError: (error) => {
      showError(`Failed to update supplier: ${error.message}`);
    },
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("suppliers").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
      showSuccess("Supplier deleted successfully.");
    },
    onError: (error) => {
      showError(`Failed to delete supplier: ${error.message}`);
    },
  });

  return {
    suppliers: suppliers || [],
    isLoading: isSuppliersLoading || isSessionLoading,
    addSupplier: addSupplierMutation.mutate,
    updateSupplier: updateSupplierMutation.mutate,
    deleteSupplier: deleteSupplierMutation.mutate,
    isAdding: addSupplierMutation.isPending,
    isUpdating: updateSupplierMutation.isPending,
    isDeleting: deleteSupplierMutation.isPending,
  };
};