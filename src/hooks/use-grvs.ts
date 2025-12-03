import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Grv, GrvInsert, GrvItemInsert, StockItemForGrv } from "@/types/grv"; // Updated import
import { Supplier } from "@/types/supplier";
import { showError, showSuccess } from "@/utils/toast";
import { StockItemInsert } from "@/types/stock"; // Import StockItemInsert

const GRVS_QUERY_KEY = "grvs";
const SUPPLIERS_QUERY_KEY = "suppliers";
const STOCK_QUERY_KEY = "stock_items";

// Define the expected structure from the PDF parser Edge Function
interface ParsedGrvData {
  supplier_name: string;
  reference: string;
  date: string; // ISO date
  order_no: string | null; // Added order_no field
  items: {
    stock_code: string;
    description: string;
    qty: number;
    cost_price: number;
  }[];
}

// Fetch all GRVs for the current user
const fetchGrvs = async (userId: string): Promise<Grv[]> => {
  const { data, error } = await supabase
    .from("grvs")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Grv[];
};

// Fetch suppliers for selection list
const fetchSuppliers = async (userId: string): Promise<Supplier[]> => {
  const { data, error } = await supabase
    .from("suppliers")
    .select("id, supplier_name")
    .eq("user_id", userId)
    .order("supplier_name");

  if (error) throw new Error(error.message);
  return data as Supplier[];
};

// Fetch stock items for selection list
const fetchStockItemsForGrv = async (userId: string): Promise<StockItemForGrv[]> => {
  const { data, error } = await supabase
    .from("stock_items")
    .select("id, stock_code, stock_descr, selling_price, vat, quantity_on_hand, cost_price")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("stock_code");

  if (error) throw new Error(error.message);
  return data as StockItemForGrv[];
};

export const useGrvs = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const enabled = !!userId && !isSessionLoading;

  const { data: grvs, isLoading: isGrvsLoading } = useQuery<Grv[]>({
    queryKey: [GRVS_QUERY_KEY, userId],
    queryFn: () => fetchGrvs(userId!),
    enabled: enabled,
  });

  const { data: suppliers, isLoading: isSuppliersLoading } = useQuery<Supplier[]>({
    queryKey: [SUPPLIERS_QUERY_KEY, userId],
    queryFn: () => fetchSuppliers(userId!),
    enabled: enabled,
  });
  
  const { data: stockItems, isLoading: isStockItemsLoading } = useQuery<StockItemForGrv[]>({ // Updated type here
    queryKey: ["grvStockItems", userId],
    queryFn: () => fetchStockItemsForGrv(userId!),
    enabled: enabled,
  });
  
  const addStockItemFromGrvMutation = useMutation({
    mutationFn: async (itemData: { stock_code: string, description: string, cost_price: number, supplier_name: string }) => {
      if (!userId) throw new Error("User not authenticated.");
      
      // Default values for a new stock item
      const newStockItem: StockItemInsert = {
        stock_code: itemData.stock_code,
        stock_descr: itemData.description,
        category: "Uncategorized",
        size: null,
        cost_price: itemData.cost_price,
        selling_price: itemData.cost_price * 1.5, // Default markup of 50%
        price_a: itemData.cost_price * 1.5,
        price_b: itemData.cost_price * 1.5,
        price_d: itemData.cost_price * 1.5,
        price_e: itemData.cost_price * 1.5,
        vat: 15, // Default VAT rate
        supplier: itemData.supplier_name,
        image_data_url: null,
        min_level: 0,
        max_level: 0,
        promotion: false,
        promo_start_date: null,
        promo_end_date: null,
        promo_price: null,
        is_active: true,
        quantity_on_hand: 0, // Initial quantity is 0, GRV will update it
        quantity_in_warehouse: 0,
        last_cost: itemData.cost_price,
      };
      
      const { data, error } = await supabase
        .from("stock_items")
        .insert([{ ...newStockItem, user_id: userId }])
        .select("id, stock_code, stock_descr, selling_price, vat, quantity_on_hand, cost_price")
        .single();

      if (error) throw new Error(error.message);
      
      showSuccess(`New stock item created: ${data.stock_code}`);
      return data as StockItemForGrv;
    },
    onSuccess: () => {
      // Invalidate the stock query so the next PDF upload gets the new item
      queryClient.invalidateQueries({ queryKey: ["grvStockItems"] });
      queryClient.invalidateQueries({ queryKey: [STOCK_QUERY_KEY] });
    },
    onError: (error) => {
      showError(`Failed to auto-create stock item: ${error.message}`);
    },
  });

  const addGrvMutation = useMutation({
    mutationFn: async (grvData: GrvInsert) => {
      if (!userId) throw new Error("User not authenticated.");
      
      const { items, ...insertData } = grvData;
      
      if (items.length === 0) {
        throw new Error("GRV must contain at least one item.");
      }

      // 1. Insert GRV Header
      const { data: grv, error: grvError } = await supabase
        .from("grvs")
        .insert([{ 
          ...insertData, 
          user_id: userId,
        }])
        .select()
        .single();

      if (grvError) throw new Error(grvError.message);
      
      // 2. Insert GRV Items
      const itemsToInsert = items.map(item => ({
        ...item,
        grv_id: grv.id,
      }));
      
      const { error: itemsError } = await supabase
        .from("grv_items")
        .insert(itemsToInsert);
        
      if (itemsError) throw new Error(itemsError.message);
      
      // 3. Update Stock Quantities and Costs
      for (const item of items) {
        if (item.stock_item_id) {
          // Fetch current stock data to calculate new quantity
          const { data: currentStock, error: fetchStockError } = await supabase
            .from("stock_items")
            .select("quantity_on_hand")
            .eq("id", item.stock_item_id)
            .single();
            
          if (fetchStockError) {
            console.error(`Failed to fetch stock item ${item.stock_item_id}: ${fetchStockError.message}`);
            continue; // Skip updating this item but continue with others
          }
          
          const newQuantity = currentStock.quantity_on_hand + item.qty;
          
          const { error: updateStockError } = await supabase
            .from("stock_items")
            .update({ 
              quantity_on_hand: newQuantity,
              cost_price: item.cost_price, // Update current cost price
              last_cost: item.cost_price, // Update last cost
              selling_price: item.selling_price, // Update selling price
            })
            .eq("id", item.stock_item_id);
            
          if (updateStockError) {
            console.error(`Failed to update stock item ${item.stock_item_id}: ${updateStockError.message}`);
          }
        }
      }
      
      // 4. Update Supplier Balance (Increase balance owing)
      if (grvData.supplier_id) {
        const totalGrvValue = items.reduce((sum, item) => sum + (item.qty * item.cost_price), 0);
        
        // Fetch current balance first
        const { data: supplierData, error: fetchSupplierError } = await supabase
          .from("suppliers")
          .select("current_balance")
          .eq("id", grvData.supplier_id)
          .single();
          
        if (fetchSupplierError) {
          console.error(`Failed to fetch supplier balance: ${fetchSupplierError.message}`);
        } else {
          const newBalance = supplierData.current_balance + totalGrvValue;
          
          const { error: updateSupplierError } = await supabase
            .from("suppliers")
            .update({ current_balance: newBalance })
            .eq("id", grvData.supplier_id);
            
          if (updateSupplierError) {
            console.error(`Failed to update supplier balance: ${updateSupplierError.message}`);
          }
        }
      }

      return grv;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GRVS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STOCK_QUERY_KEY] }); // Crucial to update stock page
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] }); // Crucial to update supplier page
      showSuccess("GRV recorded successfully and stock/supplier balances updated.");
    },
    onError: (error) => {
      showError(`Failed to record GRV: ${error.message}`);
    },
  });
  
  // Function to invoke the PDF parsing Edge Function
  const parseGrvPdf = async (file: File): Promise<ParsedGrvData> => {
    if (!userId) throw new Error("User not authenticated.");
    
    // Convert file to Base64 string for transport (or use FormData/Storage, but Base64 is simpler for Edge Function invocation)
    const base64File = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

    // NOTE: We are using the hardcoded URL for the Edge Function invocation.
    const { data, error } = await supabase.functions.invoke('parse-grv-pdf', {
      body: { fileContent: base64File, fileName: file.name },
    });

    if (error) {
      console.error("Edge Function Error:", error);
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
    
    if (data.error) {
      throw new Error(`PDF parsing failed: ${data.error}`);
    }

    return data as ParsedGrvData;
  };

  return {
    grvs: grvs || [],
    suppliers: suppliers || [],
    stockItems: stockItems || [],
    isLoading: isGrvsLoading || isSuppliersLoading || isStockItemsLoading || isSessionLoading,
    addGrv: addGrvMutation.mutate,
    parseGrvPdf, // Export the new parsing function
    addStockItemFromGrv: addStockItemFromGrvMutation.mutateAsync, // Export the new mutation
    isAdding: addGrvMutation.isPending,
    isCreatingStock: addStockItemFromGrvMutation.isPending,
  };
};