import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { StockItem, StockItemInsert, StockItemUpdate } from "@/types/stock";
import { showError, showSuccess } from "@/utils/toast";
import { mockStockItems } from "@/utils/mock-data";

const STOCK_QUERY_KEY = "stock_items";

// Fetch all stock items for the current user
const fetchStockItems = async (userId: string): Promise<StockItem[]> => {
  const { data, error } = await supabase
    .from("stock_items")
    .select("*")
    .eq("user_id", userId)
    .order("stock_code");

  if (error) throw new Error(error.message);
  
  // Inject mock data if no stock items are found
  if (data.length === 0) {
    return mockStockItems.map(s => ({ ...s, user_id: userId }));
  }
  
  return data as StockItem[];
};

export const useStock = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const enabled = !!userId && !isSessionLoading;

  const { data: stockItems, isLoading: isStockLoading } = useQuery<StockItem[]>({
    queryKey: [STOCK_QUERY_KEY, userId],
    queryFn: () => fetchStockItems(userId!),
    enabled: enabled,
  });
  
  // Calculate summary values
  const totalStockValue = stockItems ? stockItems.reduce((sum, item) => sum + (item.cost_price * item.quantity_on_hand), 0) : 0;
  const totalQuantity = stockItems ? stockItems.reduce((sum, item) => sum + item.quantity_on_hand, 0) : 0;


  const addStockItemMutation = useMutation({
    mutationFn: async (itemData: StockItemInsert) => {
      if (!userId) throw new Error("User not authenticated.");
      
      const { data, error } = await supabase
        .from("stock_items")
        .insert([{ ...itemData, user_id: userId }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STOCK_QUERY_KEY] });
      showSuccess("Stock item added successfully.");
    },
    onError: (error) => {
      showError(`Failed to add stock item: ${error.message}`);
    },
  });

  const updateStockItemMutation = useMutation({
    mutationFn: async (item: StockItemUpdate) => {
      const { id, ...updateData } = item;
      const { data, error } = await supabase
        .from("stock_items")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STOCK_QUERY_KEY] });
      showSuccess("Stock item updated successfully.");
    },
    onError: (error) => {
      showError(`Failed to update stock item: ${error.message}`);
    },
  });

  const deleteStockItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("stock_items").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STOCK_QUERY_KEY] });
      showSuccess("Stock item deleted successfully.");
    },
    onError: (error) => {
      showError(`Failed to delete stock item: ${error.message}`);
    },
  });

  return {
    stockItems: stockItems || [],
    totalStockValue,
    totalQuantity,
    isLoading: isStockLoading || isSessionLoading,
    addStockItem: addStockItemMutation.mutate,
    updateStockItem: updateStockItemMutation.mutate,
    deleteStockItem: deleteStockItemMutation.mutate,
    isAdding: addStockItemMutation.isPending,
    isUpdating: updateStockItemMutation.isPending,
    isDeleting: deleteStockItemMutation.isPending,
  };
};