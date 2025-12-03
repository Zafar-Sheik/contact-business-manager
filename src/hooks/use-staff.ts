import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Staff, StaffInsert, StaffUpdate } from "@/types/staff";
import { showError, showSuccess } from "@/utils/toast";

const STAFF_QUERY_KEY = "staff";

// Fetch all staff for the current user
const fetchStaff = async (userId: string): Promise<Staff[]> => {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("user_id", userId)
    .order("last_name");

  if (error) throw new Error(error.message);
  return data as Staff[];
};

export const useStaff = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const enabled = !!userId && !isSessionLoading;

  const { data: staff, isLoading: isStaffLoading } = useQuery<Staff[]>({
    queryKey: [STAFF_QUERY_KEY, userId],
    queryFn: () => fetchStaff(userId!),
    enabled: enabled,
  });

  const addStaffMutation = useMutation({
    mutationFn: async (staffData: StaffInsert) => {
      if (!userId) throw new Error("User not authenticated.");
      
      const { data, error } = await supabase
        .from("staff")
        .insert([{ ...staffData, user_id: userId }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_QUERY_KEY] });
      showSuccess("Staff member added successfully.");
    },
    onError: (error) => {
      showError(`Failed to add staff member: ${error.message}`);
    },
  });

  const updateStaffMutation = useMutation({
    mutationFn: async (staff: StaffUpdate) => {
      const { id, ...updateData } = staff;
      const { data, error } = await supabase
        .from("staff")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_QUERY_KEY] });
      showSuccess("Staff member updated successfully.");
    },
    onError: (error) => {
      showError(`Failed to update staff member: ${error.message}`);
    },
  });

  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_QUERY_KEY] });
      showSuccess("Staff member deleted successfully.");
    },
    onError: (error) => {
      showError(`Failed to delete staff member: ${error.message}`);
    },
  });

  return {
    staff: staff || [],
    isLoading: isStaffLoading || isSessionLoading,
    addStaff: addStaffMutation.mutate,
    updateStaff: updateStaffMutation.mutate,
    deleteStaff: deleteStaffMutation.mutate,
    isAdding: addStaffMutation.isPending,
    isUpdating: updateStaffMutation.isPending,
    isDeleting: deleteStaffMutation.isPending,
  };
};