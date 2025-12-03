import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Client, ClientInsert, ClientUpdate } from "@/types/client";
import { showError, showSuccess } from "@/utils/toast";
import { mockClients } from "@/utils/mock-data";

const CLIENTS_QUERY_KEY = "clients";

// Fetch all clients for the current user
const fetchClients = async (userId: string): Promise<Client[]> => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .order("customer_name");

  if (error) throw new Error(error.message);
  
  // Inject mock data if no clients are found
  if (data.length === 0) {
    return mockClients.map(c => ({ ...c, user_id: userId }));
  }
  
  return data as Client[];
};

// Calculate total balance owing (sum of all positive current_balance)
const calculateTotalBalanceOwing = (clients: Client[]): number => {
  return clients.reduce((sum, client) => sum + Math.max(0, client.current_balance), 0);
};

export const useClients = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const enabled = !!userId && !isSessionLoading;

  const { data: clients, isLoading: isClientsLoading } = useQuery<Client[]>({
    queryKey: [CLIENTS_QUERY_KEY, userId],
    queryFn: () => fetchClients(userId!),
    enabled: enabled,
  });
  
  const totalBalanceOwing = clients ? calculateTotalBalanceOwing(clients) : 0;

  const addClientMutation = useMutation({
    mutationFn: async (clientData: ClientInsert) => {
      if (!userId) throw new Error("User not authenticated.");
      
      const { data, error } = await supabase
        .from("customers")
        .insert([{ ...clientData, user_id: userId }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
      showSuccess("Client added successfully.");
    },
    onError: (error) => {
      showError(`Failed to add client: ${error.message}`);
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async (client: ClientUpdate) => {
      const { id, ...updateData } = client;
      const { data, error } = await supabase
        .from("customers")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
      showSuccess("Client updated successfully.");
    },
    onError: (error) => {
      showError(`Failed to update client: ${error.message}`);
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
      showSuccess("Client deleted successfully.");
    },
    onError: (error) => {
      showError(`Failed to delete client: ${error.message}`);
    },
  });

  return {
    clients: clients || [],
    totalBalanceOwing,
    isLoading: isClientsLoading || isSessionLoading,
    addClient: addClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
    isAdding: addClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
  };
};