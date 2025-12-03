"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Upload,
  Image,
  X,
  Loader2,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Banknote,
  MessageSquare,
  Layout,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  CompanyProfile,
  AppConfig,
  CompanyProfileInsert,
  AppConfigInsert,
} from "@/types/profile";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const profileSchema = z.object({
  // Company Profile Fields
  name: z.string().min(1, "Company Name is required."),
  address: z.string().nullable().optional(),
  email: z.string().email("Invalid email format").min(1, "Email is required."),
  phone: z.string().nullable().optional(),
  vatnumber: z.string().nullable().optional(),
  regnumber: z.string().nullable().optional(),
  logodataurl: z.string().nullable().optional(),

  // VAT Banking Details
  bank_name: z.string().nullable().optional(),
  account_number: z.string().nullable().optional(),
  branch_code: z.string().nullable().optional(),

  // NEW: Non-VAT Banking Details
  non_vat_bank_name: z.string().nullable().optional(),
  non_vat_account_number: z.string().nullable().optional(),
  non_vat_branch_code: z.string().nullable().optional(),

  // App Config Fields (Messages)
  slipmessage1: z.string().nullable().optional(),
  slipmessage2: z.string().nullable().optional(),
  slipmessage3: z.string().nullable().optional(),

  // App Config Fields (Layout)
  show_logo_on_documents: z.boolean().default(true),
  default_document_style: z.enum(["Standard", "Modern"]).default("Standard"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface CompanyProfileFormProps {
  initialProfile: CompanyProfile | null;
  initialConfig: AppConfig | null;
  isSaving: boolean;
  onSave: (
    profileData: CompanyProfileInsert,
    configData: AppConfigInsert
  ) => void;
}

const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({
  initialProfile,
  initialConfig,
  isSaving,
  onSave,
}) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialProfile?.name || "",
      address: initialProfile?.address || "",
      email: initialProfile?.email || "",
      phone: initialProfile?.phone || "",
      vatnumber: initialProfile?.vatnumber || "",
      regnumber: initialProfile?.regnumber || "",
      logodataurl: initialProfile?.logodataurl || "",

      bank_name: initialProfile?.bank_name || "",
      account_number: initialProfile?.account_number || "",
      branch_code: initialProfile?.branch_code || "",

      non_vat_bank_name: initialProfile?.non_vat_bank_name || "",
      non_vat_account_number: initialProfile?.non_vat_account_number || "",
      non_vat_branch_code: initialProfile?.non_vat_branch_code || "",

      slipmessage1: initialConfig?.slipmessage1 || "",
      slipmessage2: initialConfig?.slipmessage2 || "",
      slipmessage3: initialConfig?.slipmessage3 || "",

      show_logo_on_documents:
        initialConfig?.document_layout_config?.show_logo_on_documents ?? true,
      default_document_style:
        initialConfig?.document_layout_config?.default_document_style ??
        "Standard",
    },
  });

  const [activeTab, setActiveTab] = useState("company");

  const handleSubmit = (values: ProfileFormValues) => {
    const profileData: CompanyProfileInsert = {
      name: values.name,
      email: values.email,
      address: values.address || null,
      phone: values.phone || null,
      vatnumber: values.vatnumber || null,
      regnumber: values.regnumber || null,
      logodataurl: values.logodataurl || null,
      website: initialProfile?.website || null,
      licensenumber: initialProfile?.licensenumber || null,

      bank_name: values.bank_name || null,
      account_number: values.account_number || null,
      branch_code: values.branch_code || null,

      non_vat_bank_name: values.non_vat_bank_name || null,
      non_vat_account_number: values.non_vat_account_number || null,
      non_vat_branch_code: values.non_vat_branch_code || null,
    };

    const configData: AppConfigInsert = {
      slipmessage1: values.slipmessage1 || null,
      slipmessage2: values.slipmessage2 || null,
      slipmessage3: values.slipmessage3 || null,
      document_layout_config: {
        show_logo_on_documents: values.show_logo_on_documents,
        default_document_style: values.default_document_style,
      },
      allowstockbelowcost: initialConfig?.allowstockbelowcost ?? null,
      dontsellbelowcost: initialConfig?.dontsellbelowcost ?? null,
      wahabaseurl: initialConfig?.wahabaseurl ?? null,
      wahaapikey: initialConfig?.wahaapikey ?? null,
      wahasessions: initialConfig?.wahasessions ?? null,
      replynowphonenumber: initialConfig?.replynowphonenumber ?? null,
    };

    onSave(profileData, configData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dummyUrl = URL.createObjectURL(file);
      form.setValue("logodataurl", dummyUrl);
    }
  };

  const handleRemoveImage = () => {
    form.setValue("logodataurl", null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Company Profile
            </h1>
            <Badge variant="secondary" className="text-sm">
              Settings
            </Badge>
          </div>
          <p className="text-gray-600 text-sm">
            Manage your company details, branding, and document settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="company"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Building className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Company</span>
            </TabsTrigger>
            <TabsTrigger
              value="banking"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Banknote className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Banking</span>
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger
              value="layout"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Layout className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Layout</span>
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-4">
                  {/* Company Tab */}
                  <TabsContent value="company" className="space-y-6 m-0">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Company Details
                        </h3>
                      </div>

                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                                <Building className="h-3.5 w-3.5 mr-1.5" />
                                Company Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="MR Power (Pty) Ltd"
                                  className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                                <Mail className="h-3.5 w-3.5 mr-1.5" />
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="info@mrpower.com"
                                  className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                                <Phone className="h-3.5 w-3.5 mr-1.5" />
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="011 123 4567"
                                  className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="vatnumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  VAT No
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="VAT Number"
                                    className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="regnumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Reg No
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Registration No"
                                    className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                                Address
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Physical Address"
                                  className="min-h-[80px] bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Image className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Company Logo
                        </h3>
                      </div>

                      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                            Upload Logo (Recommended: 200×200px, PNG)
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <div className="flex items-center justify-center space-x-3">
                                <Input
                                  id="logo_upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  asChild
                                  className="flex-1 h-11 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50">
                                  <label
                                    htmlFor="logo_upload"
                                    className="cursor-pointer flex items-center justify-center">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Logo
                                  </label>
                                </Button>
                              </div>

                              {form.watch("logodataurl") ? (
                                <div className="flex flex-col items-center space-y-3">
                                  <div className="relative p-4 bg-white rounded-lg border shadow-sm">
                                    <img
                                      src={form.watch("logodataurl")!}
                                      alt="Logo Preview"
                                      className="h-20 w-20 object-contain"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border shadow-sm hover:bg-gray-50"
                                      onClick={handleRemoveImage}>
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <p className="text-xs text-green-600 font-medium">
                                    ✓ Logo uploaded successfully
                                  </p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center space-y-3">
                                  <div className="h-24 w-24 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                                    <Image className="h-10 w-10 text-gray-400" />
                                  </div>
                                  <p className="text-xs text-gray-500 text-center">
                                    No logo uploaded
                                  </p>
                                </div>
                              )}
                            </div>
                          </FormControl>
                        </FormItem>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Banking Tab */}
                  <TabsContent value="banking" className="space-y-6 m-0">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Banknote className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          VAT Banking Details
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        These details appear on VAT invoices
                      </p>

                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="bank_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Bank Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="FNB / Standard Bank"
                                  className="h-11 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="account_number"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Account Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="1234567890"
                                    className="h-11 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="branch_code"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Branch Code
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="250655"
                                    className="h-11 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Banknote className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Non-VAT Banking Details
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        These details appear on non-VAT invoices
                      </p>

                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="non_vat_bank_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Bank Name (Non-VAT)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="FNB / Standard Bank"
                                  className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="non_vat_account_number"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Account Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="1234567890"
                                    className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="non_vat_branch_code"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Branch Code
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="250655"
                                    className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Messages Tab */}
                  <TabsContent value="messages" className="space-y-6 m-0">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <MessageSquare className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Document Messages
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">
                        Custom messages that appear at the bottom of your
                        invoices and quotes
                      </p>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="slipmessage1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Message Line 1
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="Thank you for your business!"
                                    className="h-11 pl-10 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                  />
                                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500">
                                    <MessageSquare className="h-4 w-4" />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="slipmessage2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Message Line 2
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="Payment due within 7 days."
                                    className="h-11 pl-10 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                  />
                                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500">
                                    <MessageSquare className="h-4 w-4" />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="slipmessage3"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Message Line 3
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="E&OE"
                                    className="h-11 pl-10 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                  />
                                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500">
                                    <MessageSquare className="h-4 w-4" />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Check className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-800 mb-1">
                              Pro Tip
                            </h4>
                            <p className="text-xs text-gray-600">
                              Use these messages for payment terms, thank you
                              notes, or legal disclaimers.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Layout Tab */}
                  <TabsContent value="layout" className="space-y-6 m-0">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <Layout className="h-5 w-5 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Document Layout
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="show_logo_on_documents"
                          render={({ field }) => (
                            <FormItem className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                              <div className="flex items-start space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="h-5 w-5 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                                  />
                                </FormControl>
                                <div className="space-y-1 flex-1">
                                  <FormLabel className="text-sm font-semibold text-gray-800 cursor-pointer">
                                    Show Logo on Documents
                                  </FormLabel>
                                  <p className="text-xs text-gray-600">
                                    Display your company logo on invoices,
                                    quotes, and receipts
                                  </p>
                                </div>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="default_document_style"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                                Default Document Style
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                                    <SelectValue placeholder="Select style" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white border-gray-200">
                                  <SelectItem
                                    value="Standard"
                                    className="focus:bg-orange-50">
                                    <div className="flex items-center">
                                      <div className="p-2 bg-blue-50 rounded mr-3">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium">Standard</p>
                                        <p className="text-xs text-gray-500">
                                          Classic business layout
                                        </p>
                                      </div>
                                    </div>
                                  </SelectItem>
                                  <SelectItem
                                    value="Modern"
                                    className="focus:bg-orange-50">
                                    <div className="flex items-center">
                                      <div className="p-2 bg-purple-50 rounded mr-3">
                                        <Layout className="h-4 w-4 text-purple-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium">Modern</p>
                                        <p className="text-xs text-gray-500">
                                          Clean, minimal design
                                        </p>
                                      </div>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Save Button */}
                  <div className="pt-6 mt-6 border-t">
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg shadow-blue-500/20">
                      {isSaving ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving Changes...
                        </div>
                      ) : (
                        "Save All Changes"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyProfileForm;
