"use client";

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Building,
  Settings,
  Shield,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  CreditCard,
  Bell,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import CompanyProfileForm from "@/components/CompanyProfileForm";
import {
  CompanyProfileInsert,
  AppConfigInsert,
  CompanyProfile,
  AppConfig,
} from "@/types/profile";

const ProfilePage: React.FC = () => {
  const {
    profile,
    config,
    isLoading,
    saveProfile,
    saveConfig,
    isSavingProfile,
    isSavingConfig,
  } = useCompanyProfile();

  const isSaving = isSavingProfile || isSavingConfig;
  const profileTabTriggerRef = useRef<HTMLButtonElement>(null);

  const handleSave = (
    profileData: CompanyProfileInsert,
    configData: AppConfigInsert
  ) => {
    saveProfile(profileData);
    saveConfig(configData);
  };

  // Helper function to safely access profile properties
  const getProfileValue = (
    profile: CompanyProfile | null | undefined,
    key: keyof CompanyProfile | string
  ) => {
    if (!profile) return "Not set";
    return (profile as any)[key] || "Not set";
  };

  // Helper function to safely access config properties
  const getConfigValue = (
    config: AppConfig | null | undefined,
    key: keyof AppConfig | string
  ) => {
    if (!config) return "Not set";
    return (config as any)[key] ?? "Not set";
  };

  const handleSwitchToProfileTab = () => {
    if (profileTabTriggerRef.current) {
      profileTabTriggerRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="h-10 w-10 border-gray-200 hover:bg-gray-50">
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Company Profile & Settings
                  </h1>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Manage your company information and application settings
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-white">
                <Shield className="h-3 w-3 mr-1" />
                Secure Settings
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="profile" className="mb-6">
          <div className="mb-6">
            <TabsList className="grid w-full md:w-auto grid-cols-2 md:flex bg-gray-100 p-1 rounded-xl">
              <TabsTrigger
                ref={profileTabTriggerRef}
                value="profile"
                className="rounded-lg data-[state=active]:bg-white">
                <User className="h-4 w-4 mr-2" />
                Company Profile
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-lg data-[state=active]:bg-white">
                <Settings className="h-4 w-4 mr-2" />
                App Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Company Information
                    </CardTitle>
                    <CardDescription>
                      Update your company details and contact information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {isLoading ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-1/2" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Current Profile Summary */}
                    {profile && (
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Current Profile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Building className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Company Name
                                </p>
                                <p className="font-semibold text-gray-900">
                                  {getProfileValue(profile, "company_name")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Mail className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-semibold text-gray-900">
                                  {getProfileValue(profile, "email")}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Phone className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="font-semibold text-gray-900">
                                  {getProfileValue(profile, "phone")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <MapPin className="h-4 w-4 text-red-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Address</p>
                                <p className="font-semibold text-gray-900">
                                  {getProfileValue(profile, "address")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Profile Form */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Update Profile
                        </h3>
                        <Badge variant="outline" className="bg-blue-50">
                          All fields are required
                        </Badge>
                      </div>

                      <CompanyProfileForm
                        initialProfile={profile}
                        initialConfig={config}
                        isSaving={isSaving}
                        onSave={handleSave}
                      />
                    </div>

                    {/* Information Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm mt-0.5">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">
                            Profile Security
                          </h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li className="flex items-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                              Your company information appears on invoices and
                              official documents
                            </li>
                            <li className="flex items-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                              Keep contact details updated for customer
                              communication
                            </li>
                            <li className="flex items-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                              Changes are saved securely and appear instantly
                              across the system
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Settings className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Application Settings
                    </CardTitle>
                    <CardDescription>
                      Configure system preferences and defaults
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {isLoading ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-1/2" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Current Settings Summary */}
                    {config && (
                      <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Current Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <CreditCard className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  VAT Rate
                                </p>
                                <p className="font-semibold text-gray-900">
                                  {getConfigValue(config, "vat_rate")}%
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <FileText className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Invoice Prefix
                                </p>
                                <p className="font-semibold text-gray-900">
                                  {getConfigValue(config, "invoice_prefix")}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Globe className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Currency
                                </p>
                                <p className="font-semibold text-gray-900">
                                  {getConfigValue(config, "currency")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Bell className="h-4 w-4 text-amber-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Payment Terms
                                </p>
                                <p className="font-semibold text-gray-900">
                                  {getConfigValue(config, "payment_terms_days")}{" "}
                                  days
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Settings Form - Same CompanyProfileForm handles both */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Update Settings
                        </h3>
                        <Badge variant="outline" className="bg-green-50">
                          Configure system defaults
                        </Badge>
                      </div>

                      {/* Note: The same CompanyProfileForm component handles both profile and config */}
                      <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl">
                        <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Settings Management
                        </h3>
                        <p className="text-gray-600 mb-4 max-w-md mx-auto">
                          Application settings are managed within the Company
                          Profile form. Switch to the Company Profile tab to
                          update both profile and configuration settings.
                        </p>
                        <Button
                          onClick={handleSwitchToProfileTab}
                          variant="outline"
                          className="border-gray-300">
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Go to Profile Tab
                        </Button>
                      </div>
                    </div>

                    {/* Information Section */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm mt-0.5">
                          <Bell className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">
                            Settings Information
                          </h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li className="flex items-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                              VAT rate is automatically applied to all invoices
                              and calculations
                            </li>
                            <li className="flex items-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                              Invoice prefix helps organize and identify your
                              invoice numbers
                            </li>
                            <li className="flex items-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                              Payment terms determine default due dates for
                              invoices
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Profile Status
                  </p>
                  <p className="font-bold text-gray-900">
                    {profile ? "Complete" : "Setup Required"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    VAT Configuration
                  </p>
                  <p className="font-bold text-gray-900">
                    {config
                      ? `${getConfigValue(config, "vat_rate")}% Rate`
                      : "Not set"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Globe className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Currency</p>
                  <p className="font-bold text-gray-900">
                    {config ? getConfigValue(config, "currency") : "Not set"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Status */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-lg ${
                  isSaving ? "bg-amber-100" : "bg-green-100"
                }`}>
                <Save
                  className={`h-5 w-5 ${
                    isSaving ? "text-amber-600" : "text-green-600"
                  }`}
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {isSaving ? "Saving Changes..." : "Ready to Save"}
                </p>
                <p className="text-sm text-gray-600">
                  {isSaving
                    ? "Please wait while we save your changes..."
                    : "Make changes and save to update your profile and settings"}
                </p>
              </div>
            </div>
            <Badge
              variant={isSaving ? "outline" : "default"}
              className={
                isSaving
                  ? "border-amber-300 text-amber-700 bg-amber-50"
                  : "bg-gradient-to-r from-blue-600 to-purple-600"
              }>
              {isSaving ? "Processing..." : "Changes Pending"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
