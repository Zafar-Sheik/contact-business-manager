"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Phone,
  MapPin,
  IdCard,
  Wallet,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Calendar,
  Briefcase,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Staff, StaffInsert, PayMethod } from "@/types/staff";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const payMethods: PayMethod[] = ["Daily", "Weekly", "Monthly"];

const staffSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  id_number: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  cell_number: z.string().nullable().optional(),
  pay_method: z.enum(["Daily", "Weekly", "Monthly"]),
  rate: z.coerce.number().min(0, "Rate must be non-negative."),
  deductions: z.coerce
    .number()
    .min(0, "Deductions must be non-negative.")
    .default(0),
  advance: z.coerce.number().min(0, "Advance must be non-negative.").default(0),
  loans: z.coerce.number().min(0, "Loans must be non-negative.").default(0),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface StaffFormProps {
  initialData?: Staff;
  onSubmit: (data: StaffInsert) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      id_number: initialData?.id_number || "",
      address: initialData?.address || "",
      cell_number: initialData?.cell_number || "",
      pay_method: initialData?.pay_method || "Daily",
      rate: initialData?.rate || 0,
      deductions: initialData?.deductions || 0,
      advance: initialData?.advance || 0,
      loans: initialData?.loans || 0,
    },
  });

  const formValues = form.watch();

  const salaryTotal = useMemo(() => {
    const rate = formValues.rate || 0;
    const deductions = formValues.deductions || 0;
    const loans = formValues.loans || 0;
    const advance = formValues.advance || 0;
    return rate - deductions - loans + advance;
  }, [formValues]);

  const handleSubmit = (values: StaffFormValues) => {
    const data: StaffInsert = {
      first_name: values.first_name,
      last_name: values.last_name,
      pay_method: values.pay_method,
      rate: values.rate,
      deductions: values.deductions,
      advance: values.advance,
      loans: values.loans,

      id_number: values.id_number || null,
      address: values.address || null,
      cell_number: values.cell_number || null,

      salary_total: salaryTotal,
    };
    onSubmit(data);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && formValues.first_name && formValues.last_name) {
      e.preventDefault();
      form.handleSubmit(handleSubmit)();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {initialData ? "Edit Staff" : "Add New Staff"}
            </h1>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200">
              <User className="h-3 w-3 mr-1" />
              Staff
            </Badge>
          </div>
          <p className="text-gray-600 text-sm">
            {initialData
              ? "Update staff member information"
              : "Add a new staff member to your system"}
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Personal Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="John"
                                className="h-11 pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                onKeyPress={handleKeyPress}
                                {...field}
                              />
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
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

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="id_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <IdCard className="h-3.5 w-3.5 mr-1.5" />
                            ID Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ID Number"
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
                      name="cell_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Phone className="h-3.5 w-3.5 mr-1.5" />
                            Cell Number
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
                          <Input
                            placeholder="123 Main Street, City, Province"
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

                {/* Pay Structure */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Wallet className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Pay Structure
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="pay_method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                            Pay Method
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Select pay method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-gray-200">
                              {payMethods.map((method) => (
                                <SelectItem key={method} value={method}>
                                  <div className="flex items-center">
                                    <div className="p-2 bg-green-50 rounded mr-3">
                                      <Briefcase className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{method}</p>
                                      <p className="text-xs text-gray-500">
                                        {method === "Daily"
                                          ? "Paid daily"
                                          : method === "Weekly"
                                          ? "Paid weekly"
                                          : "Paid monthly"}
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                            Base Rate
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="h-11 pl-8 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                onKeyPress={handleKeyPress}
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

                {/* Financial Adjustments */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Financial Adjustments
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="deductions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <TrendingDown className="h-3.5 w-3.5 mr-1.5" />
                            Deductions
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="h-11 pl-8 bg-gray-50 border-gray-200 focus:border-red-500 focus:ring-red-500"
                                onKeyPress={handleKeyPress}
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

                    <FormField
                      control={form.control}
                      name="advance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                            Advance
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="h-11 pl-8 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                onKeyPress={handleKeyPress}
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

                    <FormField
                      control={form.control}
                      name="loans"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <TrendingDown className="h-3.5 w-3.5 mr-1.5" />
                            Loans
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="h-11 pl-8 bg-gray-50 border-gray-200 focus:border-red-500 focus:ring-red-500"
                                onKeyPress={handleKeyPress}
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

                {/* Salary Preview */}
                {(formValues.rate > 0 ||
                  formValues.deductions > 0 ||
                  formValues.loans > 0 ||
                  formValues.advance > 0) && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Wallet className="h-4 w-4 text-blue-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-800">
                        Salary Preview
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Base Rate:</span>
                        <span className="font-medium text-green-600">
                          R{formValues.rate.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Total Deductions:</span>
                        <span className="font-medium text-red-600">
                          - R
                          {(formValues.deductions + formValues.loans).toFixed(
                            2
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Advance:</span>
                        <span className="font-medium text-green-600">
                          + R{formValues.advance.toFixed(2)}
                        </span>
                      </div>

                      <Separator className="my-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-800">
                          Net Salary:
                        </span>
                        <span
                          className={`text-lg font-bold ${
                            salaryTotal >= 0 ? "text-green-700" : "text-red-700"
                          }`}>
                          R{salaryTotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {salaryTotal >= 0
                          ? "Amount to be paid to staff member"
                          : "Staff member owes the company"}
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
                        <User className="h-4 w-4 mr-2" />
                        Add Staff
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

export default StaffForm;
