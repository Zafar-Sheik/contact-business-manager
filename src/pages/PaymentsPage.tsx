"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  DollarSign,
  MessageCircle,
  CreditCard,
  Clock,
  TrendingUp,
  Filter,
  Download,
  Calendar,
  CheckCircle,
  AlertCircle,
  Wallet,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayments } from "@/hooks/use-payments";
import { useClients } from "@/hooks/use-clients";
import { Payment, PaymentInsert } from "@/types/payment";
import { Client } from "@/types/client";
import PaymentForm from "@/components/PaymentForm";
import PaymentActions from "@/components/PaymentActions";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PaymentsPage: React.FC = () => {
  const { payments, isLoading, addPayment, isAdding } = usePayments();
  const { clients, isLoading: isClientsLoading } = useClients();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>(
    undefined
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Create proper customer objects for PaymentForm
  const customers = clients.map((c: Client) => ({
    id: c.id,
    customer_name: c.customer_name,
    phone_number: c.phone_number,
    address: c.address || "",
    email: c.email || "",
    customer_code: c.customer_code || "",
  }));

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = (data: PaymentInsert) => {
    addPayment(data);
    handleCloseForm();
  };

  const handleOpenDetail = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedPayment(undefined);
  };

  const getCustomerDetails = (customerId: string | null) => {
    return clients.find((c) => c.id === customerId);
  };

  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  // Calculate payment statistics
  const totalPayments = payments.length;
  const totalAmount = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const todayPayments = payments.filter(
    (p) =>
      format(new Date(p.date), "yyyy-MM-dd") ===
      format(new Date(), "yyyy-MM-dd")
  ).length;
  const todayAmount = payments
    .filter(
      (p) =>
        format(new Date(p.date), "yyyy-MM-dd") ===
        format(new Date(), "yyyy-MM-dd")
    )
    .reduce((sum, p) => sum + p.amount, 0);

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "cash":
        return <DollarSign className="h-4 w-4" />;
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "eft":
        return <Wallet className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  // Helper function to check allocation type
  const getAllocationBadgeClass = (allocationType: string) => {
    if (allocationType === "Invoice") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    } else if (allocationType === "Deposit") {
      return "bg-purple-50 text-purple-700 border-purple-200";
    } else if (allocationType === "Whole") {
      return "bg-green-50 text-green-700 border-green-200";
    } else {
      return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9">
              <Link to="/financial-hub">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Payments</h1>
              <p className="text-xs text-gray-600">Track customer payments</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-[320px] p-0">
                <SheetHeader className="p-4 border-b border-gray-200">
                  <SheetTitle>Payment Actions</SheetTitle>
                </SheetHeader>
                <div className="p-2">
                  <Button
                    onClick={() => setIsFormOpen(true)}
                    disabled={isLoading || isClientsLoading}
                    className="w-full justify-start h-11 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                    <Plus className="h-4 w-4 mr-3" />
                    Record Payment
                  </Button>

                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 text-sm">
                      <Filter className="h-4 w-4 mr-3" />
                      Filter Payments
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 text-sm">
                      <Download className="h-4 w-4 mr-3" />
                      Export Data
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 text-sm">
                      <Wallet className="h-4 w-4 mr-3" />
                      View Clients ({clients.length})
                    </Button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 px-2 mb-2">
                      Payment Stats
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Payments
                        </span>
                        <span className="font-semibold">{totalPayments}</span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Received
                        </span>
                        <span className="font-semibold text-green-700">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Today's Payments
                        </span>
                        <span className="font-semibold text-purple-700">
                          {todayPayments}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Today's Amount
                        </span>
                        <span className="font-semibold text-emerald-700">
                          {formatCurrency(todayAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block px-4 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="h-10 w-10 border-gray-200 hover:bg-gray-50">
              <Link to="/financial-hub">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Payment Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Track and manage all customer payments
              </p>
            </div>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <Button
              onClick={() => setIsFormOpen(true)}
              disabled={isLoading || isClientsLoading}
              className="h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg shadow-green-500/20">
              <Plus className="h-4 w-4 mr-2" /> Record Payment
            </Button>
            <DialogContent className="sm:max-w-[500px] p-0 border-0">
              <DialogHeader className="p-6 border-b border-gray-100">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Record New Payment
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <PaymentForm
                  customers={customers}
                  onSubmit={handleSubmit}
                  isSubmitting={isAdding}
                  onClose={handleCloseForm}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-4 max-w-7xl mx-auto">
        {/* Mobile Record Button - Fixed at bottom */}
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <Button
            onClick={() => setIsFormOpen(true)}
            disabled={isLoading || isClientsLoading}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-2xl shadow-green-500/30">
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Payment Summary Cards - Mobile Stacked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Payments
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {totalPayments}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Received
                  </p>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Today's Payments
                  </p>
                  <p className="text-xl font-bold text-purple-700">
                    {todayPayments}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Today's Amount
                  </p>
                  <p className="text-xl font-bold text-emerald-700">
                    {formatCurrency(todayAmount)}
                  </p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <Card className="border-0 shadow-sm lg:shadow-lg">
            <CardContent className="p-0">
              <div className="p-4 lg:p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-green-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-800">
                      All Payments
                    </h3>
                    <Badge variant="outline" className="ml-2 bg-white text-xs">
                      {payments.length}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Mobile Tabs */}
                    <TabsList className="lg:hidden bg-gray-100 p-1 rounded-lg">
                      <TabsTrigger
                        value="all"
                        className="rounded-md px-3 py-1.5 text-xs">
                        All
                      </TabsTrigger>
                      <TabsTrigger
                        value="today"
                        className="rounded-md px-3 py-1.5 text-xs">
                        Today
                      </TabsTrigger>
                      <TabsTrigger
                        value="pending"
                        className="rounded-md px-3 py-1.5 text-xs">
                        Pending
                      </TabsTrigger>
                    </TabsList>

                    <div className="hidden lg:flex items-center space-x-2">
                      <TabsList className="bg-gray-100 p-1 rounded-lg">
                        <TabsTrigger value="all" className="rounded-md">
                          All
                        </TabsTrigger>
                        <TabsTrigger value="today" className="rounded-md">
                          Today
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="rounded-md">
                          Pending
                        </TabsTrigger>
                      </TabsList>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 border-gray-300">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 border-gray-300">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>

                    <div className="lg:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-9">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="text-sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter Payments
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 lg:p-5">
                <TabsContent value="all" className="m-0">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-16 lg:h-20 w-full rounded-xl" />
                      <Skeleton className="h-16 lg:h-20 w-full rounded-xl" />
                      <Skeleton className="h-16 lg:h-20 w-full rounded-xl" />
                    </div>
                  ) : payments.length === 0 ? (
                    <div className="text-center py-8 lg:py-12">
                      <div className="mx-auto w-14 h-14 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <CreditCard className="h-6 lg:h-8 w-6 lg:w-8 text-gray-400" />
                      </div>
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">
                        No Payments Recorded
                      </h3>
                      <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto px-4">
                        Start recording payments to track your revenue
                      </p>
                      <Button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-sm lg:text-base">
                        <Plus className="h-4 w-4 mr-2" /> Record First Payment
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {payments.map((payment) => {
                        const customer = getCustomerDetails(
                          payment.customer_id
                        );
                        return (
                          <Card
                            key={payment.id}
                            className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-green-200"
                            onClick={() => handleOpenDetail(payment)}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 lg:space-x-4">
                                  <div className="p-2 bg-green-50 rounded-lg">
                                    {getPaymentMethodIcon(payment.method)}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-2">
                                      <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                                        {customer?.customer_name ||
                                          "Unknown Client"}
                                      </p>
                                      <Badge
                                        variant="outline"
                                        className={`mt-1 lg:mt-0 text-xs ${getAllocationBadgeClass(
                                          payment.allocation_type
                                        )}`}>
                                        {payment.allocation_type}
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs lg:text-sm text-gray-500 mt-1">
                                      <span className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">
                                          {format(
                                            new Date(payment.date),
                                            "dd MMM"
                                          )}
                                        </span>
                                      </span>
                                      <span className="hidden lg:inline">
                                        •
                                      </span>
                                      <span className="flex items-center">
                                        {getPaymentMethodIcon(payment.method)}
                                        <span className="ml-1 truncate">
                                          {payment.method}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right ml-2">
                                  <p className="text-lg lg:text-xl font-bold text-green-700">
                                    {formatCurrency(payment.amount)}
                                  </p>
                                  <div className="flex items-center justify-end mt-1">
                                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                                    <span className="text-xs text-gray-500 hidden lg:inline">
                                      Completed
                                    </span>
                                    <span className="text-xs text-gray-500 lg:hidden">
                                      Paid
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="today" className="m-0">
                  <div className="text-center py-8 lg:py-12 text-gray-600 text-sm lg:text-base">
                    <p>Today's payments will appear here</p>
                  </div>
                </TabsContent>

                <TabsContent value="pending" className="m-0">
                  <div className="text-center py-8 lg:py-12 text-gray-600 text-sm lg:text-base">
                    <p>Pending payments will appear here</p>
                  </div>
                </TabsContent>
              </div>

              {/* Footer Summary */}
              {payments.length > 0 && !isLoading && (
                <div className="border-t border-gray-100">
                  <div className="p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-green-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div className="flex items-center">
                        <Wallet className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-xs lg:text-sm font-medium text-gray-700">
                          {clients.length} client
                          {clients.length !== 1 ? "s" : ""} • {totalPayments}{" "}
                          payments
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs lg:text-sm font-medium text-gray-700">
                          Total Received:
                        </div>
                        <div className="text-base lg:text-lg font-bold text-green-700">
                          {formatCurrency(totalAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Tabs>

        {/* Payment Detail Dialog - Mobile Optimized */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto p-0 border-0">
            <DialogHeader className="p-4 lg:p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg lg:text-xl font-bold text-gray-900 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                  Payment Receipt
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseDetail}
                  className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            {selectedPayment && (
              <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                {/* Payment Details Card */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 p-4 lg:p-6">
                    <CardTitle className="text-base lg:text-lg font-semibold">
                      Payment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 text-sm">
                      <div className="space-y-3 lg:space-y-4">
                        <div>
                          <p className="font-medium text-gray-600 text-xs uppercase tracking-wider">
                            Client
                          </p>
                          <p className="font-bold text-gray-900 text-base lg:text-lg">
                            {getCustomerDetails(selectedPayment.customer_id)
                              ?.customer_name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600 text-xs uppercase tracking-wider">
                            Date
                          </p>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <p className="font-semibold text-gray-900">
                              {format(new Date(selectedPayment.date), "PP")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 lg:space-y-4">
                        <div>
                          <p className="font-medium text-gray-600 text-xs uppercase tracking-wider">
                            Payment Method
                          </p>
                          <div className="flex items-center space-x-2">
                            {getPaymentMethodIcon(selectedPayment.method)}
                            <p className="font-semibold text-gray-900">
                              {selectedPayment.method}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600 text-xs uppercase tracking-wider">
                            Allocation Type
                          </p>
                          <Badge
                            className={getAllocationBadgeClass(
                              selectedPayment.allocation_type
                            )}>
                            {selectedPayment.allocation_type}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4 lg:my-6" />

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 lg:p-6 border border-green-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-600 text-sm lg:text-base">
                            Amount Received
                          </p>
                          <p className="text-xs lg:text-sm text-gray-500">
                            Payment successfully processed
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl lg:text-3xl font-bold text-green-700">
                            {formatCurrency(selectedPayment.amount)}
                          </p>
                          <div className="flex items-center justify-end space-x-1 mt-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">
                              Payment Complete
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions Section */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="p-4 lg:p-6">
                    <CardTitle className="text-base lg:text-lg font-semibold">
                      Payment Actions
                    </CardTitle>
                    <CardDescription className="text-sm lg:text-base">
                      Manage this payment receipt
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6 pt-0">
                    <PaymentActions
                      payment={selectedPayment}
                      customer={getCustomerDetails(selectedPayment.customer_id)}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Information Section - Mobile Stacked */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Payment Tips
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 mt-1 flex-shrink-0"></div>
                Record payments immediately for accurate records
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-1 flex-shrink-0"></div>
                Match payments to specific invoices
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2 mt-1 flex-shrink-0"></div>
                Send payment confirmations to customers
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <AlertCircle className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Reconciliation Notes
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 mt-1 flex-shrink-0"></div>
                Green badges indicate successful payments
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2 mt-1 flex-shrink-0"></div>
                Review pending allocations regularly
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2 mt-1 flex-shrink-0"></div>
                Use export for monthly reports
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Navigation Hint */}
        <div className="lg:hidden mt-6 text-center">
          <p className="text-xs text-gray-500">
            Tap on any payment to view details
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
