"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  CreditCard,
  Tag,
  FileText,
  Hash,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Client, ClientInsert } from "@/types/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const clientSchema = z.object({
  customer_name: z.string().min(1, "Company Name is required."),
  customer_code: z.string().min(1, "Customer Code is required."),
  owner: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  phone_number: z.string().nullable().optional(),
  email: z
    .string()
    .email("Invalid email format")
    .nullable()
    .optional()
    .or(z.literal("")),
  vat_no: z.string().nullable().optional(),
  reg_no: z.string().nullable().optional(),
  price_category: z.string().nullable().optional(),
  credit_limit: z.coerce
    .number()
    .min(0, "Credit limit must be non-negative.")
    .default(0),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: ClientInsert) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      customer_name: initialData?.customer_name || "",
      customer_code: initialData?.customer_code || "",
      owner: initialData?.owner || "",
      address: initialData?.address || "",
      phone_number: initialData?.phone_number || "",
      email: initialData?.email || "",
      vat_no: initialData?.vat_no || "",
      reg_no: initialData?.reg_no || "",
      price_category: initialData?.price_category || "",
      credit_limit: initialData?.credit_limit || 0,
    },
  });

  const handleSubmit = (values: ClientFormValues) => {
    const data: ClientInsert = {
      customer_name: values.customer_name,
      customer_code: values.customer_code,
      credit_limit: values.credit_limit,

      // Handle nullable fields
      owner: values.owner || null,
      address: values.address || null,
      phone_number: values.phone_number || null,
      email: values.email || null,
      vat_no: values.vat_no || null,
      reg_no: values.reg_no || null,
      price_category: values.price_category || null,

      // Preserve existing balance or default to 0
      current_balance: initialData?.current_balance || 0,
    };
    onSubmit(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {initialData ? "Edit Client" : "New Client"}
            </h1>
            <Badge variant="outline" className="text-sm">
              {initialData ? "Editing" : "New"}
            </Badge>
          </div>
          <p className="text-gray-600 text-sm">
            {initialData
              ? "Update client information and settings"
              : "Add a new client to your system"}
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Basic Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="customer_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Hash className="h-3.5 w-3.5 mr-1.5" />
                            Customer Code
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="CUST001"
                                className="h-11 pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                              />
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Hash className="h-4 w-4" />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customer_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Building className="h-3.5 w-3.5 mr-1.5" />
                            Company Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ABC Corporation"
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
                      name="owner"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <User className="h-3.5 w-3.5 mr-1.5" />
                            Contact Person
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Smith"
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

                {/* Contact Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Contact Details
                    </h3>
                  </div>

                  <div className="grid gap-3">
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
                            <Input
                              placeholder="123 Business Park, City"
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
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Phone
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="082 123 4567"
                                  className="h-11 pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                />
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
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
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Email
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="contact@company.com"
                                  className="h-11 pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Business Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Business Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="vat_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            VAT No
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="VAT123456"
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
                      name="reg_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Reg No
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="REG789012"
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

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="price_category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Tag className="h-3.5 w-3.5 mr-1.5" />
                            Price Category
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Standard"
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
                      name="credit_limit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                            Credit Limit
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="h-11 pl-8 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                R
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Sites Feature Notice */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        Multiple Sites Coming Soon
                      </h4>
                      <p className="text-xs text-gray-600">
                        Add multiple delivery addresses and site-specific
                        contacts in the next update.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg shadow-blue-500/20">
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </div>
                    ) : initialData ? (
                      "Save Changes"
                    ) : (
                      "Add Client"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="h-11 border-gray-300 text-gray-700 hover:bg-gray-50">
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientForm;
