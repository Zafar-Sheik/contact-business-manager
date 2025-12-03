"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  Wallet,
  TrendingDown,
  Building,
  CheckCircle,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  SupplierPaymentInsert,
  SupplierPaymentMethod,
} from "@/types/supplier-payment";
import { Supplier } from "@/types/supplier";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const paymentMethods: SupplierPaymentMethod[] = ["Cash", "EFT"];

// Simplified Supplier type for form context
interface SupplierForForm
  extends Pick<Supplier, "id" | "supplier_name" | "current_balance"> {}

const supplierPaymentSchema = z.object({
  date: z.date({ required_error: "Date is required." }),
  supplier_id: z.string().min(1, "Supplier is required."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero."),
  method: z.enum(["Cash", "EFT"]),
  reference: z.string().nullable().optional(),
});

type SupplierPaymentFormValues = z.infer<typeof supplierPaymentSchema>;

interface SupplierPaymentFormProps {
  suppliers: SupplierForForm[];
  onSubmit: (data: SupplierPaymentInsert) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const SupplierPaymentForm: React.FC<SupplierPaymentFormProps> = ({
  suppliers,
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  const form = useForm<SupplierPaymentFormValues>({
    resolver: zodResolver(supplierPaymentSchema),
    defaultValues: {
      date: new Date(),
      supplier_id: "",
      amount: 0,
      method: "EFT",
      reference: "",
    },
  });

  const selectedSupplierId = form.watch("supplier_id");
  const amount = form.watch("amount");

  const selectedSupplier = useMemo(() => {
    return suppliers.find((s) => s.id === selectedSupplierId);
  }, [selectedSupplierId, suppliers]);

  // Calculate new balance after payment
  const newBalance = useMemo(() => {
    if (!selectedSupplier || amount <= 0)
      return selectedSupplier?.current_balance || 0;
    return selectedSupplier.current_balance - amount;
  }, [selectedSupplier, amount]);

  const handleSubmit = (values: SupplierPaymentFormValues) => {
    const data: SupplierPaymentInsert = {
      date: format(values.date, "yyyy-MM-dd"),
      supplier_id: values.supplier_id,
      amount: values.amount,
      method: values.method,
      reference: values.reference || null,
    };
    onSubmit(data);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && selectedSupplierId && amount > 0) {
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
              Record Supplier Payment
            </h1>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200">
              <TrendingDown className="h-3 w-3 mr-1" />
              Payment
            </Badge>
          </div>
          <p className="text-gray-600 text-sm">
            Record a payment made to a supplier
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5">
                {/* Date and Supplier */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Payment Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                            Payment Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "h-11 justify-start text-left font-normal bg-gray-50 border-gray-200",
                                    !field.value && "text-muted-foreground"
                                  )}>
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 bg-white border-gray-200"
                              align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="supplier_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Building className="h-3.5 w-3.5 mr-1.5" />
                            Supplier
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Select a supplier" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-gray-200">
                              {suppliers.map((supplier) => (
                                <SelectItem
                                  key={supplier.id}
                                  value={supplier.id}>
                                  <div className="flex items-center">
                                    <div className="p-2 bg-blue-50 rounded mr-3">
                                      <Building className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {supplier.supplier_name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Balance:{" "}
                                        {formatCurrency(
                                          supplier.current_balance
                                        )}
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
                  </div>
                </div>

                {/* Amount and Payment Method */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Payment Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Wallet className="h-3.5 w-3.5 mr-1.5" />
                            Amount Paid
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
                      name="method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                            Payment Method
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-gray-200">
                              {paymentMethods.map((method) => (
                                <SelectItem key={method} value={method}>
                                  <div className="flex items-center">
                                    <div className="p-2 bg-purple-50 rounded mr-3">
                                      <CreditCard className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{method}</p>
                                      <p className="text-xs text-gray-500">
                                        {method === "Cash"
                                          ? "Cash payment"
                                          : "Electronic Funds Transfer"}
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
                  </div>

                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                          <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                          Payment Reference
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="EFT Reference / Cheque Number (Optional)"
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

                {/* Balance Preview */}
                {selectedSupplier && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Wallet className="h-4 w-4 text-blue-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-800">
                        Balance Update Preview
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Current Balance:</span>
                        <span
                          className={`font-medium ${
                            selectedSupplier.current_balance > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}>
                          {formatCurrency(selectedSupplier.current_balance)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Payment Amount:</span>
                        <span className="font-medium text-green-600">
                          - {formatCurrency(amount || 0)}
                        </span>
                      </div>

                      <Separator className="my-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-800">
                          New Balance:
                        </span>
                        <span
                          className={`text-lg font-bold ${
                            newBalance > 0 ? "text-red-700" : "text-green-700"
                          }`}>
                          {formatCurrency(newBalance)}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {newBalance > 0
                          ? "Supplier will still be owed money"
                          : "Supplier balance will be cleared or in credit"}
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
                    disabled={
                      isSubmitting ||
                      !selectedSupplierId ||
                      !amount ||
                      amount <= 0
                    }
                    className="h-11 flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-purple-500/20 disabled:opacity-50">
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Recording Payment...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Record Payment
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

export default SupplierPaymentForm;
