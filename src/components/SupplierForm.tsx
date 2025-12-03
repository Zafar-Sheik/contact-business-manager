"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Building,
  CreditCard,
  MapPin,
  Phone,
  User,
  Tag,
  Wallet,
  DollarSign,
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
import { Supplier, SupplierInsert } from "@/types/supplier";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const supplierSchema = z.object({
  supplier_name: z.string().min(1, "Supplier Name is required."),
  supplier_code: z.string().min(1, "Supplier Code is required."),
  contact_person: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  cell_number: z.string().nullable().optional(),
  contra: z.string().nullable().optional(),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  initialData?: Supplier;
  onSubmit: (data: SupplierInsert) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const SupplierForm: React.FC<SupplierFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      supplier_name: initialData?.supplier_name || "",
      supplier_code: initialData?.supplier_code || "",
      contact_person: initialData?.contact_person || "",
      address: initialData?.address || "",
      cell_number: initialData?.cell_number || "",
      contra: initialData?.contra || "",
    },
  });

  const formValues = form.watch();

  const handleSubmit = (values: SupplierFormValues) => {
    const data: SupplierInsert = {
      supplier_name: values.supplier_name,
      supplier_code: values.supplier_code,
      contact_person: values.contact_person || null, // Add this line
      address: values.address || null,
      cell_number: values.cell_number || null,
      contra: values.contra || null,
      current_balance: initialData?.current_balance || 0,
      ageing_balance: initialData?.ageing_balance || 0,
    };
    onSubmit(data);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      formValues.supplier_name &&
      formValues.supplier_code
    ) {
      e.preventDefault();
      form.handleSubmit(handleSubmit)();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {initialData ? "Edit Supplier" : "Add New Supplier"}
            </h1>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200">
              <Building className="h-3 w-3 mr-1" />
              Supplier
            </Badge>
          </div>
          <p className="text-gray-600 text-sm">
            {initialData
              ? "Update supplier information and details"
              : "Add a new supplier to your supplier management system"}
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5">
                {/* Supplier Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Supplier Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="supplier_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Tag className="h-3.5 w-3.5 mr-1.5" />
                            Supplier Code
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="SUP-001"
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              onKeyPress={handleKeyPress}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="supplier_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Building className="h-3.5 w-3.5 mr-1.5" />
                            Supplier Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Supplier Corporation"
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              onKeyPress={handleKeyPress}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="contact_person"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                          <User className="h-3.5 w-3.5 mr-1.5" />
                          Contact Person
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Smith (Optional)"
                            className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            onKeyPress={handleKeyPress}
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1.5" />
                          Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123 Industrial Park, City, Province"
                            className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            onKeyPress={handleKeyPress}
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cell_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Phone className="h-3.5 w-3.5 mr-1.5" />
                            Contact Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="082 123 4567"
                                className="h-11 pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                onKeyPress={handleKeyPress}
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
                      name="contra"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                            Contra Account
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contra account reference (Optional)"
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              onKeyPress={handleKeyPress}
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

                {/* Current Balance Display */}
                {initialData && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Wallet className="h-4 w-4 text-blue-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-800">
                        Current Financial Status
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Current Balance:</span>
                        <span
                          className={`font-bold ${
                            initialData.current_balance > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}>
                          {formatCurrency(initialData.current_balance)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Ageing Balance:</span>
                        <span className="font-medium text-amber-600">
                          {formatCurrency(initialData.ageing_balance)}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {initialData.current_balance > 0
                          ? "Supplier is owed money"
                          : "Supplier owes the company"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="h-11 flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-purple-500/20">
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {initialData ? "Saving..." : "Adding..."}
                      </div>
                    ) : initialData ? (
                      "Save Changes"
                    ) : (
                      <>
                        <Building className="h-4 w-4 mr-2" />
                        Add Supplier
                      </>
                    )}
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

export default SupplierForm;
