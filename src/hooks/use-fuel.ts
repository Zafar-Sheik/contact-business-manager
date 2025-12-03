import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { FuelLog, FuelLogInsert } from "@/types/fuel";
import { showError, showSuccess } from "@/utils/toast";

const FUEL_LOGS_QUERY_KEY = "fuelLogs";

// Fetch all fuel logs for the current user
const fetchFuelLogs = async (userId: string): Promise<FuelLog[]> => {
  const { data, error } = await supabase
    .from("fuel_logs")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return data as FuelLog[];
};

export const useFuel = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const enabled = !!userId && !isSessionLoading;

  const { data: fuelLogs, isLoading: isFuelLoading } = useQuery<FuelLog[]>({
    queryKey: [FUEL_LOGS_QUERY_KEY, userId],
    queryFn: () => fetchFuelLogs(userId!),
    enabled: enabled,
  });

  const addFuelLogMutation = useMutation({
    mutationFn: async (logData: FuelLogInsert) => {
      if (!userId) throw new Error("User not authenticated.");
      
      const { data, error } = await supabase
        .from("fuel_logs")
        .insert([{ ...logData, user_id: userId }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FUEL_LOGS_QUERY_KEY] });
      showSuccess("Fuel log recorded successfully.");
    },
    onError: (error) => {
      showError(`Failed to record fuel log: ${error.message}`);
    },
  });

  return {
    fuelLogs: fuelLogs || [],
    isLoading: isFuelLoading || isSessionLoading,
    addFuelLog: addFuelLogMutation.mutate,
    isAdding: addFuelLogMutation.isPending,
  };
};