"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  DollarSign,
  User,
  CreditCard,
  FileText,
  Wallet,
  TrendingDown,
  Receipt,
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
import { Customer } from "@/types/invoice";
import { PaymentInsert, PaymentMethod, AllocationType } from "@/types/payment";
import { useClients } from "@/hooks/use-clients";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Client } from "@/types/client"; // Import Client type for balance

const paymentMethods: PaymentMethod[] = ["Cash", "EFT"];
const allocationTypes: AllocationType[] = ["Whole", "Invoice"];

const paymentSchema = z.object({
  date: z.date({ required_error: "Date is required." }),
  customer_id: z.string().min(1, "Client is required."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero."),
  method: z.enum(["Cash", "EFT"]),
  allocation_type: z.enum(["Whole", "Invoice"]),
  invoice_id: z.string().nullable().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  customers: Customer[];
  onSubmit: (data: PaymentInsert) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

// Extended interface that includes balance
interface CustomerWithBalance extends Customer {
  current_balance?: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  customers,
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  const { clients } = useClients();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      date: new Date(),
      customer_id: "",
      amount: 0,
      method: "EFT",
      allocation_type: "Whole",
      invoice_id: null,
    },
  });

  const selectedCustomerId = form.watch("customer_id");
  const selectedAmount = form.watch("amount") || 0;
  const selectedAllocationType = form.watch("allocation_type");
  const selectedMethod = form.watch("method");

  // Find client balance from clients hook data
  const selectedClientFromHook = useMemo(() => {
    return clients.find((c) => c.id === selectedCustomerId);
  }, [selectedCustomerId, clients]);

  // Find customer details from customers prop
  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId);
  }, [selectedCustomerId, customers]);

  const currentBalance = selectedClientFromHook?.current_balance || 0;
  const newBalance = currentBalance - selectedAmount;
  const isOverPayment = selectedAmount > currentBalance;
  const isPartialPayment =
    selectedAmount > 0 && selectedAmount < currentBalance;
  const isFullSettlement =
    currentBalance > 0 && Math.abs(currentBalance - selectedAmount) < 0.01;

  const handleSubmit = (values: PaymentFormValues) => {
    const data: PaymentInsert = {
      date: format(values.date, "yyyy-MM-dd"),
      customer_id: values.customer_id,
      amount: values.amount,
      method: values.method,
      allocation_type: values.allocation_type,
      invoice_id: values.invoice_id || null,
    };
    onSubmit(data);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && selectedCustomerId && selectedAmount > 0) {
      e.preventDefault();
      form.handleSubmit(handleSubmit)();
    }
  };

  // Helper function to get customer display name
  const getCustomerDisplayName = () => {
    return (
      selectedCustomer?.customer_name ||
      selectedClientFromHook?.customer_name ||
      "Unknown Client"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Record Payment</h1>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200">
              <Receipt className="h-3 w-3 mr-1" />
              Payment
            </Badge>
          </div>
          <p className="text-gray-600 text-sm">
            Record a payment received from a client
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5">
                {/* Date & Client Selection */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Payment Details
                    </h3>
                  </div>

                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Payment Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "h-11 w-full justify-start text-left font-normal bg-gray-50 border-gray-200",
                                    !field.value && "text-muted-foreground"
                                  )}>
                                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="bg-white"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customer_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <User className="h-3.5 w-3.5 mr-1.5" />
                            Select Client
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Choose a client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-gray-200 max-h-[200px]">
                              {customers.map((customer) => {
                                // Find client balance for each customer
                                const clientBalance =
                                  clients.find((c) => c.id === customer.id)
                                    ?.current_balance || 0;
                                return (
                                  <SelectItem
                                    key={customer.id}
                                    value={customer.id}>
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center space-x-2">
                                        <div className="p-2 bg-blue-50 rounded">
                                          <User className="h-3 w-3 text-blue-600" />
                                        </div>
                                        <div>
                                          <p className="font-medium">
                                            {customer.customer_name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {customer.customer_code}
                                          </p>
                                        </div>
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                          clientBalance > 0
                                            ? "bg-red-50 text-red-700 border-red-200"
                                            : clientBalance < 0
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-gray-50 text-gray-700 border-gray-200"
                                        }`}>
                                        R{clientBalance.toFixed(2)}
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Client Balance Summary */}
                {(selectedCustomer || selectedClientFromHook) && (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Wallet className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800">
                            {getCustomerDisplayName()}
                          </h4>
                          <p className="text-xs text-gray-600">
                            Balance Summary
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          currentBalance > 0
                            ? "destructive"
                            : currentBalance < 0
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs">
                        {currentBalance > 0
                          ? "Owing"
                          : currentBalance < 0
                          ? "Credit"
                          : "Paid Up"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-white rounded-lg p-3 border shadow-sm">
                        <div className="text-xs text-gray-500 mb-1">
                          Current Balance
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            currentBalance > 0
                              ? "text-red-600"
                              : currentBalance < 0
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}>
                          R{currentBalance.toFixed(2)}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 border shadow-sm">
                        <div className="text-xs text-gray-500 mb-1">
                          Payment Amount
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          R{selectedAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {selectedAmount > 0 && currentBalance !== 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            New Balance
                          </span>
                          <span
                            className={`text-lg font-bold ${
                              newBalance > 0
                                ? "text-red-600"
                                : newBalance < 0
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}>
                            R{newBalance.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {isOverPayment ? (
                            <span className="text-yellow-600">
                              Note: Overpayment by R
                              {(selectedAmount - currentBalance).toFixed(2)}
                            </span>
                          ) : isPartialPayment ? (
                            <span className="text-blue-600">
                              Partial payment -{" "}
                              {(
                                (selectedAmount / currentBalance) *
                                100
                              ).toFixed(0)}
                              % paid
                            </span>
                          ) : isFullSettlement ? (
                            <span className="text-green-600">
                              ✓ Full settlement
                            </span>
                          ) : currentBalance < 0 && selectedAmount > 0 ? (
                            <span className="text-purple-600">
                              Adding to client credit
                            </span>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Payment Amount & Method */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Payment Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Amount (R)
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
                          <FormLabel className="text-sm font-medium text-gray-700">
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
                                    <div className="p-2 bg-green-50 rounded mr-3">
                                      {method === "Cash" ? (
                                        <Wallet className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <CreditCard className="h-4 w-4 text-green-600" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium">{method}</p>
                                      <p className="text-xs text-gray-500">
                                        {method === "Cash"
                                          ? "Physical cash payment"
                                          : "Electronic transfer"}
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

                {/* Allocation Type */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Allocation
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="allocation_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Allocation Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                              <SelectValue placeholder="Select allocation type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-gray-200">
                            {allocationTypes.map((type) => (
                              <SelectItem
                                key={type}
                                value={type}
                                className="py-3">
                                <div className="flex items-start">
                                  <div className="p-2 bg-purple-50 rounded mr-3 mt-1">
                                    <TrendingDown className="h-4 w-4 text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{type}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {type === "Whole"
                                        ? "Apply payment to overall client balance"
                                        : "Allocate to specific invoice (Coming Soon)"}
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

                  {selectedAllocationType === "Invoice" && (
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-3 border border-yellow-100">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-white rounded">
                          <span className="text-xs font-medium text-yellow-600">
                            ⚠️
                          </span>
                        </div>
                        <p className="text-xs text-gray-700">
                          Invoice allocation feature coming soon. Currently
                          applies to overall balance.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary Card */}
                {selectedAmount > 0 &&
                  (selectedCustomer || selectedClientFromHook) && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Receipt className="h-4 w-4 text-green-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800">
                          Payment Summary
                        </h4>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Client</span>
                          <span className="font-medium">
                            {getCustomerDisplayName()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Payment Method</span>
                          <Badge variant="outline" className="bg-white">
                            {selectedMethod}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Amount</span>
                          <span className="text-lg font-bold text-green-700">
                            R{selectedAmount.toFixed(2)}
                          </span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">
                            Balance Change
                          </span>
                          <span
                            className={`font-bold ${
                              newBalance < currentBalance
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}>
                            R{currentBalance.toFixed(2)} → R
                            {newBalance.toFixed(2)}
                          </span>
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
                      isSubmitting || !selectedCustomerId || selectedAmount <= 0
                    }
                    className="h-11 flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg shadow-green-500/20 disabled:opacity-50">
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Recording...
                      </div>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4 mr-2" />
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

export default PaymentForm;
