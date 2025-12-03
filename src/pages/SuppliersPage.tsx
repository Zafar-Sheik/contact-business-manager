"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  FileText,
  Truck,
  Building,
  Phone,
  MapPin,
  DollarSign,
  Users,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuppliers } from "@/hooks/use-suppliers";
import { Supplier, SupplierInsert } from "@/types/supplier";
import SupplierForm from "@/components/SupplierForm";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SuppliersPage: React.FC = () => {
  const {
    suppliers,
    isLoading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    isAdding,
    isUpdating,
    isDeleting,
  } = useSuppliers();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(
    undefined
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenForm = (supplier?: Supplier) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
    setMobileMenuOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSupplier(undefined);
  };

  const handleSubmit = (data: SupplierInsert) => {
    if (editingSupplier) {
      updateSupplier({ id: editingSupplier.id, ...data });
    } else {
      addSupplier(data);
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    deleteSupplier(id);
  };

  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  // Calculate supplier statistics
  const totalSuppliers = suppliers.length;
  const totalBalance = suppliers.reduce(
    (sum, supplier) => sum + supplier.current_balance,
    0
  );
  const totalAgeing = suppliers.reduce(
    (sum, supplier) => sum + (supplier.ageing_balance || 0),
    0
  );
  const suppliersWithBalance = suppliers.filter(
    (s) => s.current_balance > 0
  ).length;

  // Helper function to get balance status
  const getBalanceStatus = (balance: number) => {
    if (balance > 10000) {
      return {
        label: "High Balance",
        className: "bg-red-100 text-red-800 border-red-200",
      };
    } else if (balance > 0) {
      return {
        label: "Active Balance",
        className: "bg-amber-100 text-amber-800 border-amber-200",
      };
    } else {
      return {
        label: "Paid Up",
        className: "bg-green-100 text-green-800 border-green-200",
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9">
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Suppliers</h1>
              <p className="text-xs text-gray-600">Manage supplier info</p>
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
                    onClick={() => handleOpenForm()}
                    disabled={isLoading}
                    className="w-full justify-start h-11 mb-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white">
                    <Plus className="h-4 w-4 mr-3" />
                    Add Supplier
                  </Button>

                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 text-sm">
                      <Filter className="h-4 w-4 mr-3" />
                      Filter Suppliers
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
                      View All ({suppliers.length})
                    </Button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 px-2 mb-2">
                      Supplier Stats
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Suppliers
                        </span>
                        <span className="font-semibold">{totalSuppliers}</span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Balance
                        </span>
                        <span className="font-semibold text-red-700">
                          {formatCurrency(totalBalance)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Ageing Balance
                        </span>
                        <span className="font-semibold text-amber-700">
                          {formatCurrency(totalAgeing)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          With Balance
                        </span>
                        <span className="font-semibold text-purple-700">
                          {suppliersWithBalance}
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
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Supplier Management
                </h1>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Manage your supplier information, balances, and payments
              </p>
            </div>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <Button
              onClick={() => handleOpenForm()}
              disabled={isLoading}
              className="h-11 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-medium shadow-lg shadow-orange-500/20">
              <Plus className="h-4 w-4 mr-2" /> Add Supplier
            </Button>
            <DialogContent className="sm:max-w-[500px] p-0 border-0">
              <DialogHeader className="p-6 border-b border-gray-100">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <SupplierForm
                  initialData={editingSupplier}
                  onSubmit={handleSubmit}
                  isSubmitting={isAdding || isUpdating}
                  onClose={handleCloseForm}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-4 max-w-7xl mx-auto">
        {/* Mobile Add Button - Fixed at bottom */}
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <Button
            onClick={() => handleOpenForm()}
            disabled={isLoading}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-2xl shadow-orange-500/30">
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Supplier Summary Cards - Mobile Stacked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Suppliers
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {totalSuppliers}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Balance
                  </p>
                  <p className="text-xl font-bold text-red-700">
                    {formatCurrency(totalBalance)}
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
                    Ageing Balance
                  </p>
                  <p className="text-xl font-bold text-amber-700">
                    {formatCurrency(totalAgeing)}
                  </p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    With Balance
                  </p>
                  <p className="text-xl font-bold text-purple-700">
                    {suppliersWithBalance}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Building className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <Card className="border-0 shadow-sm lg:shadow-lg">
            <CardContent className="p-0">
              <div className="p-4 lg:p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-orange-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Building className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-800">
                      Supplier Directory
                    </h3>
                    <Badge variant="outline" className="ml-2 bg-white text-xs">
                      {suppliers.length}
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
                        value="balance"
                        className="rounded-md px-3 py-1.5 text-xs">
                        Balance
                      </TabsTrigger>
                      <TabsTrigger
                        value="ageing"
                        className="rounded-md px-3 py-1.5 text-xs">
                        Ageing
                      </TabsTrigger>
                    </TabsList>

                    <div className="hidden lg:flex items-center space-x-2">
                      <TabsList className="bg-gray-100 p-1 rounded-lg">
                        <TabsTrigger value="all" className="rounded-md">
                          All
                        </TabsTrigger>
                        <TabsTrigger value="balance" className="rounded-md">
                          With Balance
                        </TabsTrigger>
                        <TabsTrigger value="ageing" className="rounded-md">
                          Ageing
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
                            Filter Suppliers
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
                      <Skeleton className="h-20 lg:h-24 w-full rounded-xl" />
                      <Skeleton className="h-20 lg:h-24 w-full rounded-xl" />
                      <Skeleton className="h-20 lg:h-24 w-full rounded-xl" />
                    </div>
                  ) : suppliers.length === 0 ? (
                    <div className="text-center py-8 lg:py-12">
                      <div className="mx-auto w-14 h-14 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Building className="h-6 lg:h-8 w-6 lg:w-8 text-gray-400" />
                      </div>
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">
                        No Suppliers Found
                      </h3>
                      <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto px-4">
                        Start building your supplier network by adding suppliers
                      </p>
                      <Button
                        onClick={() => handleOpenForm()}
                        className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-sm lg:text-base">
                        <Plus className="h-4 w-4 mr-2" /> Add First Supplier
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {suppliers.map((supplier) => {
                        const balanceStatus = getBalanceStatus(
                          supplier.current_balance
                        );
                        return (
                          <Card
                            key={supplier.id}
                            className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center space-x-3 lg:space-x-4">
                                  <div className="p-2 lg:p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl">
                                    <Building className="h-5 lg:h-6 w-5 lg:w-6 text-orange-600" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-2 gap-1 lg:gap-0">
                                      <h3 className="font-bold text-base lg:text-lg text-gray-900 truncate">
                                        {supplier.supplier_name}
                                      </h3>
                                      <div className="flex items-center space-x-2">
                                        <Badge
                                          variant="outline"
                                          className="bg-gray-50 text-gray-700 border-gray-200 text-xs">
                                          {supplier.supplier_code}
                                        </Badge>
                                        <Badge
                                          variant="outline"
                                          className={`${balanceStatus.className} text-xs`}>
                                          {balanceStatus.label}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs lg:text-sm text-gray-600 mt-1">
                                      <span className="flex items-center">
                                        <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">
                                          {supplier.cell_number || "No phone"}
                                        </span>
                                      </span>
                                      <span className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">
                                          {supplier.address || "No address"}
                                        </span>
                                      </span>
                                      <span className="flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">
                                          Ageing:{" "}
                                          {formatCurrency(
                                            supplier.ageing_balance || 0
                                          )}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col md:items-end space-y-2 mt-3 md:mt-0">
                                  <div className="text-right">
                                    <div className="text-xs text-gray-500">
                                      Current Balance
                                    </div>
                                    <div
                                      className={`text-lg lg:text-xl font-bold ${
                                        supplier.current_balance > 0
                                          ? "text-red-700"
                                          : "text-green-700"
                                      }`}>
                                      {formatCurrency(supplier.current_balance)}
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      asChild
                                      className="h-8 border-gray-300 text-xs">
                                      <Link to="/financial-hub/grvs">
                                        <Truck className="h-3 w-3 mr-1" /> GRVs
                                      </Link>
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleOpenForm(supplier)}
                                      disabled={isUpdating || isDeleting}
                                      className="h-8 border-gray-300">
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          disabled={isDeleting}
                                          className="h-8">
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="mx-4 max-w-md">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="text-base">
                                            Delete Supplier
                                          </AlertDialogTitle>
                                          <AlertDialogDescription className="text-sm">
                                            This action cannot be undone. This
                                            will permanently delete the
                                            supplier:
                                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                              <p className="font-semibold">
                                                {supplier.supplier_name}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                {supplier.cell_number ||
                                                  "No contact"}{" "}
                                                • Code: {supplier.supplier_code}
                                              </p>
                                            </div>
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() =>
                                              handleDelete(supplier.id)
                                            }
                                            disabled={isDeleting}
                                            className="bg-red-600 hover:bg-red-700 text-sm">
                                            Delete Supplier
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
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

                <TabsContent value="balance" className="m-0">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {suppliers
                        .filter((s) => s.current_balance > 0)
                        .map((supplier) => {
                          const balanceStatus = getBalanceStatus(
                            supplier.current_balance
                          );
                          return (
                            <Card
                              key={supplier.id}
                              className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 lg:space-x-4">
                                    <div className="p-2 bg-red-50 rounded-lg">
                                      <AlertCircle className="h-4 lg:h-5 w-4 lg:w-5 text-red-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                                        {supplier.supplier_name}
                                      </p>
                                      <p className="text-xs lg:text-sm text-gray-500 truncate">
                                        {supplier.cell_number || "No contact"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-red-700">
                                      {formatCurrency(supplier.current_balance)}
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`${balanceStatus.className} text-xs mt-1`}>
                                      Outstanding
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="ageing" className="m-0">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {suppliers
                        .filter((s) => (s.ageing_balance || 0) > 0)
                        .map((supplier) => (
                          <Card
                            key={supplier.id}
                            className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 lg:space-x-4">
                                  <div className="p-2 bg-amber-50 rounded-lg">
                                    <AlertCircle className="h-4 lg:h-5 w-4 lg:w-5 text-amber-600" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                                      {supplier.supplier_name}
                                    </p>
                                    <p className="text-xs lg:text-sm text-gray-500 truncate">
                                      Code: {supplier.supplier_code}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-amber-700">
                                    {formatCurrency(
                                      supplier.ageing_balance || 0
                                    )}
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="bg-amber-50 text-amber-700 border-amber-200 text-xs mt-1">
                                    Ageing Balance
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </TabsContent>
              </div>

              {/* Footer Summary */}
              {suppliers.length > 0 && !isLoading && (
                <div className="border-t border-gray-100">
                  <div className="p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-orange-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-xs lg:text-sm font-medium text-gray-700">
                          {suppliers.length} suppliers • {suppliersWithBalance}{" "}
                          with balance • {formatCurrency(totalBalance)} total
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs lg:text-sm font-medium text-gray-700">
                          Total Ageing Balance:
                        </div>
                        <div className="text-base lg:text-lg font-bold text-amber-700">
                          {formatCurrency(totalAgeing)}
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
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Building className="h-4 w-4 text-orange-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Supplier Tips
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 mt-1 flex-shrink-0"></div>
                Keep supplier contact information updated for communication
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-1 flex-shrink-0"></div>
                Monitor ageing balances to manage cash flow effectively
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2 mt-1 flex-shrink-0"></div>
                Use supplier codes to identify and categorize suppliers easily
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Balance Status
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-2">
              <li className="flex items-center">
                <Badge
                  variant="outline"
                  className="mr-2 bg-green-50 text-green-700 border-green-200 text-xs">
                  Paid Up
                </Badge>
                <span>No outstanding balance</span>
              </li>
              <li className="flex items-center">
                <Badge
                  variant="outline"
                  className="mr-2 bg-amber-50 text-amber-700 border-amber-200 text-xs">
                  Active Balance
                </Badge>
                <span>Balance under R10,000</span>
              </li>
              <li className="flex items-center">
                <Badge
                  variant="outline"
                  className="mr-2 bg-red-50 text-red-700 border-red-200 text-xs">
                  High Balance
                </Badge>
                <span>Balance over R10,000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Navigation Hint */}
        <div className="lg:hidden mt-6 text-center">
          <p className="text-xs text-gray-500">
            Tap on any supplier to view details
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage;
