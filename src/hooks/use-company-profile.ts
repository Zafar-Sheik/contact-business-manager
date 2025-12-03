import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { CompanyProfile, CompanyProfileInsert, CompanyProfileUpdate, AppConfig, AppConfigInsert, AppConfigUpdate } from "@/types/profile";
import { showError, showSuccess } from "@/utils/toast";

const PROFILE_QUERY_KEY = "company_profile";
const CONFIG_QUERY_KEY = "app_config";

// Fetch Company Profile (single row)
const fetchCompanyProfile = async (userId: string): Promise<CompanyProfile | null> => {
  const { data, error } = await supabase
    .from("company_profile")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means 'No rows found'
    throw new Error(error.message);
  }
  return data as CompanyProfile | null;
};

// Fetch App Config (single row)
const fetchAppConfig = async (userId: string): Promise<AppConfig | null> => {
  const { data, error } = await supabase
    .from("app_config")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }
  return data as AppConfig | null;
};

export const useCompanyProfile = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const enabled = !!userId && !isSessionLoading;

  // Query 1: Company Profile
  const { data: profile, isLoading: isProfileLoading } = useQuery<CompanyProfile | null>({
    queryKey: [PROFILE_QUERY_KEY, userId],
    queryFn: () => fetchCompanyProfile(userId!),
    enabled: enabled,
  });
  
  // Query 2: App Config
  const { data: config, isLoading: isConfigLoading } = useQuery<AppConfig | null>({
    queryKey: [CONFIG_QUERY_KEY, userId],
    queryFn: () => fetchAppConfig(userId!),
    enabled: enabled,
  });
  
  const isLoading = isProfileLoading || isConfigLoading || isSessionLoading;

  // Mutation to save/update profile data
  const saveProfileMutation = useMutation({
    mutationFn: async (data: CompanyProfileInsert) => {
      if (!userId) throw new Error("User not authenticated.");
      
      if (profile) {
        // Update existing profile
        const { data: updatedProfile, error } = await supabase
          .from("company_profile")
          .update(data)
          .eq("id", profile.id)
          .select()
          .single();
        
        if (error) throw new Error(error.message);
        return updatedProfile;
      } else {
        // Insert new profile
        const { data: newProfile, error } = await supabase
          .from("company_profile")
          .insert([{ ...data, user_id: userId }])
          .select()
          .single();
          
        if (error) throw new Error(error.message);
        return newProfile;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
      showSuccess("Company profile saved successfully.");
    },
    onError: (error) => {
      showError(`Failed to save company profile: ${error.message}`);
    },
  });
  
  // Mutation to save/update config data
  const saveConfigMutation = useMutation({
    mutationFn: async (data: AppConfigInsert) => {
      if (!userId) throw new Error("User not authenticated.");
      
      if (config) {
        // Update existing config
        const { data: updatedConfig, error } = await supabase
          .from("app_config")
          .update(data)
          .eq("id", config.id)
          .select()
          .single();
        
        if (error) throw new Error(error.message);
        return updatedConfig;
      } else {
        // Insert new config
        const { data: newConfig, error } = await supabase
          .from("app_config")
          .insert([{ ...data, user_id: userId }])
          .select()
          .single();
          
        if (error) throw new Error(error.message);
        return newConfig;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONFIG_QUERY_KEY] });
      showSuccess("App configuration saved successfully.");
    },
    onError: (error) => {
      showError(`Failed to save app configuration: ${error.message}`);
    },
  });

  return {
    profile: profile,
    config: config,
    isLoading,
    saveProfile: saveProfileMutation.mutate,
    saveConfig: saveConfigMutation.mutate,
    isSavingProfile: saveProfileMutation.isPending,
    isSavingConfig: saveConfigMutation.isPending,
  };
};