import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Workflow, WorkflowInsert, WorkflowItemInsert } from "@/types/workflow";
import { showError, showSuccess } from "@/utils/toast";
import { StockItemForInvoice } from "@/types/invoice"; // Import the new type

const WORKFLOWS_QUERY_KEY = "workflows";

// Fetch all workflows for the current user
const fetchWorkflows = async (userId: string): Promise<Workflow[]> => {
  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Workflow[];
};

// Fetch customers for selection list
const fetchCustomers = async (userId: string) => {
  const { data, error } = await supabase
    .from("customers")
    .select("id, customer_name")
    .eq("user_id", userId)
    .order("customer_name");

  if (error) throw new Error(error.message);
  return data;
};

// Fetch stock items for selection list (using StockItemForInvoice type)
const fetchStockItems = async (userId: string): Promise<StockItemForInvoice[]> => {
  const { data, error } = await supabase
    .from("stock_items")
    .select("id, stock_code, stock_descr, selling_price, vat")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("stock_code");

  if (error) throw new Error(error.message);
  return data as StockItemForInvoice[];
};

// Define the extended type for mutations
type WorkflowUpdateData = Partial<WorkflowInsert> & { id: string };

export const useWorkflows = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const enabled = !!userId && !isSessionLoading;

  const { data: workflows, isLoading: isWorkflowsLoading } = useQuery<Workflow[]>({
    queryKey: [WORKFLOWS_QUERY_KEY, userId],
    queryFn: () => fetchWorkflows(userId!),
    enabled: enabled,
  });

  const { data: customers, isLoading: isCustomersLoading } = useQuery({
    queryKey: ["customers", userId],
    queryFn: () => fetchCustomers(userId!),
    enabled: enabled,
  });
  
  const { data: stockItems, isLoading: isStockItemsLoading } = useQuery<StockItemForInvoice[]>({
    queryKey: ["stockItems", userId],
    queryFn: () => fetchStockItems(userId!),
    enabled: enabled,
  });

  const addWorkflowMutation = useMutation({
    mutationFn: async (workflowData: WorkflowInsert) => {
      if (!userId) throw new Error("User not authenticated.");
      
      // Destructure 'items' which is now optionally present on WorkflowInsert
      const { items, ...insertData } = workflowData;

      const { data, error } = await supabase
        .from("workflows")
        .insert([{ ...insertData, user_id: userId }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      
      // TODO: Add logic to insert workflow_items here once API is ready
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
      showSuccess("Workflow added successfully.");
    },
    onError: (error) => {
      showError(`Failed to add workflow: ${error.message}`);
    },
  });

  const updateWorkflowMutation = useMutation({
    mutationFn: async (workflow: WorkflowUpdateData) => {
      // Destructure 'items' which is now optionally present on WorkflowInsert
      const { items, ...updateData } = workflow;

      const { data, error } = await supabase
        .from("workflows")
        .update(updateData)
        .eq("id", workflow.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
      showSuccess("Workflow updated successfully.");
    },
    onError: (error) => {
      showError(`Failed to update workflow: ${error.message}`);
    },
  });

  const deleteWorkflowMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("workflows").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
      showSuccess("Workflow deleted successfully.");
    },
    onError: (error) => {
      showError(`Failed to delete workflow: ${error.message}`);
    },
  });

  return {
    workflows: workflows || [],
    customers: customers || [],
    stockItems: stockItems || [],
    isLoading: isWorkflowsLoading || isCustomersLoading || isStockItemsLoading || isSessionLoading,
    addWorkflow: addWorkflowMutation.mutate,
    updateWorkflow: updateWorkflowMutation.mutate,
    deleteWorkflow: deleteWorkflowMutation.mutate,
    isAdding: addWorkflowMutation.isPending,
    isUpdating: updateWorkflowMutation.isPending,
    isDeleting: deleteWorkflowMutation.isPending,
  };
};