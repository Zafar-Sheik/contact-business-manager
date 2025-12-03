"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  FileText,
  DollarSign,
  Users,
  TrendingUp,
  Filter,
  Download,
  CreditCard,
  CheckCircle,
  Clock,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useInvoices } from "@/hooks/use-invoices";
import { Invoice, InvoiceInsert } from "@/types/invoice";
import InvoiceForm from "@/components/InvoiceForm";
import InvoiceTable from "@/components/InvoiceTable";
import InvoiceDetailView from "@/components/InvoiceDetailView";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const InvoicePage: React.FC = () => {
  const {
    invoices,
    customers,
    stockItems,
    profile,
    config,
    isLoading,
    addInvoice,
    updateInvoice,
    isAdding,
    isUpdating,
    nextInvoiceNo,
  } = useInvoices();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>(
    undefined
  );
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>(
    undefined
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenForm = (invoice?: Invoice) => {
    setEditingInvoice(invoice);
    setIsFormOpen(true);
    setIsDetailOpen(false);
    setMobileMenuOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingInvoice(undefined);
  };

  const handleOpenDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedInvoice(undefined);
  };

  const handleSubmit = (data: InvoiceInsert & { id?: string }) => {
    if (data.id) {
      updateInvoice(data as any);
    } else {
      addInvoice(data);
    }
    handleCloseForm();
  };

  const getCustomerDetails = (customerId: string | null) => {
    return customers.find((c) => c.id === customerId);
  };

  // Helper function to safely get amount_paid with type safety
  const getInvoiceAmountPaid = (invoice: Invoice): number => {
    return (invoice as any).amount_paid || 0;
  };

  // Calculate invoice statistics
  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);

  // Determine payment status based on amounts
  const paidInvoices = invoices.filter((inv) => {
    const totalPaid = getInvoiceAmountPaid(inv);
    return totalPaid >= inv.total_amount;
  }).length;

  const pendingAmount = invoices.reduce((sum, inv) => {
    const totalPaid = getInvoiceAmountPaid(inv);
    return sum + Math.max(0, inv.total_amount - totalPaid);
  }, 0);

  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

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
              <h1 className="text-lg font-bold text-gray-900">Invoices</h1>
              <p className="text-xs text-gray-600">Manage customer invoices</p>
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
                  <SheetTitle>Invoice Actions</SheetTitle>
                </SheetHeader>
                <div className="p-2">
                  <Button
                    onClick={() => handleOpenForm()}
                    disabled={isLoading}
                    className="w-full justify-start h-11 mb-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-3" />
                    Create Invoice
                  </Button>

                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 text-sm">
                      <Filter className="h-4 w-4 mr-3" />
                      Filter Invoices
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
                      <Users className="h-4 w-4 mr-3" />
                      View Customers ({customers.length})
                    </Button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 px-2 mb-2">
                      Quick Stats
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Invoices
                        </span>
                        <span className="font-semibold">{totalInvoices}</span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Value
                        </span>
                        <span className="font-semibold text-green-700">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">Paid</span>
                        <span className="font-semibold text-purple-700">
                          {paidInvoices}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">Pending</span>
                        <span className="font-semibold text-red-700">
                          {formatCurrency(pendingAmount)}
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
                Invoice Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Create, manage, and track customer invoices
              </p>
            </div>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <Button
              onClick={() => handleOpenForm()}
              disabled={isLoading}
              className="h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-purple-500/20">
              <Plus className="h-4 w-4 mr-2" /> Create Invoice
            </Button>
            <DialogContent className="sm:max-w-[700px] p-0 border-0 max-h-[90vh] overflow-y-auto">
              <DialogHeader className="p-6 border-b border-gray-100">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <InvoiceForm
                  initialData={editingInvoice}
                  customers={customers}
                  availableStock={stockItems}
                  onSubmit={handleSubmit}
                  isSubmitting={isAdding || isUpdating}
                  onClose={handleCloseForm}
                  nextInvoiceNo={nextInvoiceNo}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-4 max-w-7xl mx-auto">
        {/* Mobile Create Button - Fixed at bottom */}
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <Button
            onClick={() => handleOpenForm()}
            disabled={isLoading}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-2xl shadow-purple-500/30">
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Invoice Summary Cards - Mobile Stacked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Invoices
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {totalInvoices}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Value
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
                    Paid Invoices
                  </p>
                  <p className="text-xl font-bold text-purple-700">
                    {paidInvoices}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Pending Amount
                  </p>
                  <p className="text-xl font-bold text-red-700">
                    {formatCurrency(pendingAmount)}
                  </p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <Clock className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Invoice Table */}
        <Card className="border-0 shadow-sm lg:shadow-lg">
          <CardContent className="p-0">
            <div className="p-4 lg:p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-800">
                    All Invoices
                  </h3>
                  <Badge variant="outline" className="ml-2 bg-white text-xs">
                    {invoices.length}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="hidden lg:flex space-x-2">
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
                          Filter Invoices
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

            <div className="p-2 lg:p-5">
              <InvoiceTable
                invoices={invoices}
                customers={customers}
                isLoading={isLoading}
                onViewDetails={handleOpenDetail}
              />
            </div>

            {/* Footer Summary */}
            {invoices.length > 0 && !isLoading && (
              <div className="border-t border-gray-100">
                <div className="p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-xs lg:text-sm font-medium text-gray-700">
                        {customers.length} customer
                        {customers.length !== 1 ? "s" : ""} • {totalInvoices}{" "}
                        invoices
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs lg:text-sm font-medium text-gray-700">
                        Total Value:
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

        {/* Invoice Detail Dialog - Mobile Optimized */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="w-[95vw] max-w-[800px] max-h-[90vh] overflow-y-auto p-0 border-0">
            <DialogHeader className="p-4 lg:p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg lg:text-xl font-bold text-gray-900">
                  Invoice Details
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
            {selectedInvoice && (
              <div className="p-4 lg:p-6">
                <InvoiceDetailView
                  invoice={selectedInvoice}
                  customer={getCustomerDetails(selectedInvoice.customer_id)}
                  companyProfile={profile}
                  appConfig={config}
                  onEdit={() => {
                    handleOpenForm(selectedInvoice);
                    handleCloseDetail();
                  }}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Information Section - Mobile Stacked */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Invoice Tips
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 mt-1 flex-shrink-0"></div>
                Create invoices immediately after completing work
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-1 flex-shrink-0"></div>
                Use invoice numbers for easy tracking
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2 mt-1 flex-shrink-0"></div>
                Update payment status regularly
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Payment Tracking
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 mt-1 flex-shrink-0"></div>
                Green: Invoice fully paid
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2 mt-1 flex-shrink-0"></div>
                Red: Outstanding payments due
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2 mt-1 flex-shrink-0"></div>
                View detail for payment history
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Navigation Hint */}
        <div className="lg:hidden mt-6 text-center">
          <p className="text-xs text-gray-500">
            Swipe horizontally on table to see more columns
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
