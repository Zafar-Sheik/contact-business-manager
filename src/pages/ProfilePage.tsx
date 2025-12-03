"use client";

import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import CompanyProfileForm from "@/components/CompanyProfileForm";
import { CompanyProfileInsert, AppConfigInsert } from "@/types/profile";

const ProfilePage: React.FC = () => {
  const { 
    profile, 
    config, 
    isLoading, 
    saveProfile, 
    saveConfig, 
    isSavingProfile, 
    isSavingConfig 
  } = useCompanyProfile();
  
  const isSaving = isSavingProfile || isSavingConfig;

  const handleSave = (profileData: CompanyProfileInsert, configData: AppConfigInsert) => {
    // Since these are two separate tables, we trigger both mutations.
    saveProfile(profileData);
    saveConfig(configData);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold ml-2 flex items-center">
          <User className="h-6 w-6 mr-2" /> Company Profile & Settings
        </h1>
      </header>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <CompanyProfileForm
                initialProfile={profile}
                initialConfig={config}
                isSaving={isSaving}
                onSave={handleSave}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;