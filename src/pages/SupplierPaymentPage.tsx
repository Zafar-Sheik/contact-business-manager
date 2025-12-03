"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  DollarSign,
  CreditCard,
  Calendar,
  Filter,
  Download,
  TrendingDown,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
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
import { useSupplierPayments } from "@/hooks/use-supplier-payments";
import { SupplierPaymentInsert } from "@/types/supplier-payment";
import SupplierPaymentForm from "@/components/SupplierPaymentForm";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SupplierPaymentPage: React.FC = () => {
  const { payments, suppliers, isLoading, addPayment, isAdding } =
    useSupplierPayments();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = (data: SupplierPaymentInsert) => {
    addPayment(data);
    handleCloseForm();
  };

  const getSupplierName = (supplierId: string | null) => {
    return (
      suppliers.find((s) => s.id === supplierId)?.supplier_name ||
      "Unknown Supplier"
    );
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

  // Helper function to get payment method icon
  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "cash":
        return <DollarSign className="h-4 w-4" />;
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "eft":
        return <Building className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
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
              <h1 className="text-lg font-bold text-gray-900">
                Supplier Payments
              </h1>
              <p className="text-xs text-gray-600">
                Track payments to suppliers
              </p>
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
                  <SheetTitle>Supplier Actions</SheetTitle>
                </SheetHeader>
                <div className="p-2">
                  <Button
                    onClick={() => setIsFormOpen(true)}
                    disabled={isLoading}
                    className="w-full justify-start h-11 mb-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white">
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
                      <Building className="h-4 w-4 mr-3" />
                      View Suppliers ({suppliers.length})
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
                          Total Paid
                        </span>
                        <span className="font-semibold text-red-700">
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
                        <span className="font-semibold text-rose-700">
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
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-red-600 to-rose-600 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Supplier Payments
                </h1>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Record and track payments to your suppliers
              </p>
            </div>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <Button
              onClick={() => setIsFormOpen(true)}
              disabled={isLoading}
              className="h-11 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-medium shadow-lg shadow-red-500/20">
              <Plus className="h-4 w-4 mr-2" /> Record Payment
            </Button>
            <DialogContent className="sm:max-w-[500px] p-0 border-0">
              <DialogHeader className="p-6 border-b border-gray-100">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Record Payment to Supplier
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <SupplierPaymentForm
                  suppliers={suppliers}
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
            disabled={isLoading}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-2xl shadow-red-500/30">
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
                    Total Paid
                  </p>
                  <p className="text-xl font-bold text-red-700">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <DollarSign className="h-4 w-4 text-red-600" />
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
                  <p className="text-xl font-bold text-rose-700">
                    {formatCurrency(todayAmount)}
                  </p>
                </div>
                <div className="p-2 bg-rose-50 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-rose-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <Card className="border-0 shadow-sm lg:shadow-lg">
            <CardContent className="p-0">
              <div className="p-4 lg:p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-red-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-800">
                      Supplier Payments
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
                        value="thisweek"
                        className="rounded-md px-3 py-1.5 text-xs">
                        Week
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
                        <TabsTrigger value="thisweek" className="rounded-md">
                          This Week
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
                        <TrendingDown className="h-6 lg:h-8 w-6 lg:w-8 text-gray-400" />
                      </div>
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">
                        No Supplier Payments
                      </h3>
                      <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto px-4">
                        Start recording payments to track your supplier expenses
                      </p>
                      <Button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-sm lg:text-base">
                        <Plus className="h-4 w-4 mr-2" /> Record First Payment
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <Card
                          key={payment.id}
                          className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 lg:space-x-4">
                                <div className="p-2 bg-red-50 rounded-lg">
                                  {getPaymentMethodIcon(payment.method)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-2">
                                    <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                                      {getSupplierName(payment.supplier_id)}
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className="mt-1 lg:mt-0 bg-gray-50 text-gray-700 border-gray-200 text-xs">
                                      {payment.method}
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
                                    {payment.reference && (
                                      <>
                                        <span className="hidden lg:inline">
                                          •
                                        </span>
                                        <span className="truncate max-w-[120px] lg:max-w-none">
                                          Ref: {payment.reference}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right ml-2">
                                <p className="text-lg lg:text-xl font-bold text-red-700">
                                  - {formatCurrency(payment.amount)}
                                </p>
                                <div className="flex items-center justify-end mt-1">
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                                  <span className="text-xs text-gray-500 hidden lg:inline">
                                    Paid
                                  </span>
                                  <span className="text-xs text-gray-500 lg:hidden">
                                    ✓
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="today" className="m-0">
                  <div className="text-center py-8 lg:py-12 text-gray-600 text-sm lg:text-base">
                    <p>Today's payments will appear here</p>
                  </div>
                </TabsContent>

                <TabsContent value="thisweek" className="m-0">
                  <div className="text-center py-8 lg:py-12 text-gray-600 text-sm lg:text-base">
                    <p>This week's payments will appear here</p>
                  </div>
                </TabsContent>
              </div>

              {/* Footer Summary */}
              {payments.length > 0 && !isLoading && (
                <div className="border-t border-gray-100">
                  <div className="p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-red-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-xs lg:text-sm font-medium text-gray-700">
                          {suppliers.length} supplier
                          {suppliers.length !== 1 ? "s" : ""} • {totalPayments}{" "}
                          payments
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs lg:text-sm font-medium text-gray-700">
                          Total Supplier Payments:
                        </div>
                        <div className="text-base lg:text-lg font-bold text-red-700">
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

        {/* Information Section - Mobile Stacked */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Payment Tips
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 mt-1 flex-shrink-0"></div>
                Record supplier payments immediately for accurate tracking
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-1 flex-shrink-0"></div>
                Include reference numbers to match payments with invoices
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2 mt-1 flex-shrink-0"></div>
                Review payments regularly for cash flow management
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <AlertCircle className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Payment Tracking
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2 mt-1 flex-shrink-0"></div>
                Red amounts are outgoing supplier payments
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 mt-1 flex-shrink-0"></div>
                Green checkmarks confirm payment recording
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2 mt-1 flex-shrink-0"></div>
                Use filters to analyze payments by date or supplier
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

export default SupplierPaymentPage;
