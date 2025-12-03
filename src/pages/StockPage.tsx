"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Package,
  TrendingUp,
  TrendingDown,
  Search,
  DollarSign,
  Filter,
  Download,
  BarChart,
  Warehouse,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStock } from "@/hooks/use-stock";
import { StockItem, StockItemInsert } from "@/types/stock";
import StockItemForm from "@/components/StockItemForm";
import StockTable from "@/components/StockTable";

const StockPage: React.FC = () => {
  const {
    stockItems,
    totalStockValue,
    totalQuantity,
    isLoading,
    addStockItem,
    updateStockItem,
    deleteStockItem,
    isAdding,
    isUpdating,
    isDeleting,
  } = useStock();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenForm = (item?: StockItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
    setMobileMenuOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(undefined);
  };

  const handleSubmit = (data: StockItemInsert) => {
    if (editingItem) {
      updateStockItem({ id: editingItem.id, ...data });
    } else {
      addStockItem(data);
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    deleteStockItem(id);
  };

  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  // Helper functions to safely access stock properties
  const getItemQuantity = (item: StockItem): number => {
    return (item as any).qty_on_hand || 0;
  };

  const getReorderLevel = (item: StockItem): number => {
    return (item as any).reorder_level || 0;
  };

  const getStockStatus = (item: StockItem) => {
    const quantity = getItemQuantity(item);
    const reorderLevel = getReorderLevel(item);

    if (quantity === 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-100 text-red-800 border-red-200",
      };
    } else if (quantity <= reorderLevel) {
      return {
        label: "Low Stock",
        className: "bg-amber-100 text-amber-800 border-amber-200",
      };
    } else {
      return {
        label: "In Stock",
        className: "bg-green-100 text-green-800 border-green-200",
      };
    }
  };

  // Filter stock items based on search term
  const filteredStockItems = stockItems.filter((item) => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return (
      item.stock_descr.toLowerCase().includes(lowerCaseSearch) ||
      item.stock_code.toLowerCase().includes(lowerCaseSearch) ||
      item.category.toLowerCase().includes(lowerCaseSearch) ||
      item.supplier?.toLowerCase().includes(lowerCaseSearch)
    );
  });

  // Calculate additional statistics using helper functions
  const lowStockItems = stockItems.filter((item) => {
    const quantity = getItemQuantity(item);
    const reorderLevel = getReorderLevel(item);
    return quantity <= reorderLevel && quantity > 0;
  }).length;

  const outOfStockItems = stockItems.filter(
    (item) => getItemQuantity(item) === 0
  ).length;
  const avgItemValue =
    stockItems.length > 0 ? totalStockValue / stockItems.length : 0;

  // Filter functions for tabs
  const getLowStockItems = () => {
    return stockItems.filter((item) => {
      const quantity = getItemQuantity(item);
      const reorderLevel = getReorderLevel(item);
      return quantity <= reorderLevel && quantity > 0;
    });
  };

  const getOutOfStockItems = () => {
    return stockItems.filter((item) => getItemQuantity(item) === 0);
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
              <h1 className="text-lg font-bold text-gray-900">Stock</h1>
              <p className="text-xs text-gray-600">Manage inventory</p>
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
                  <SheetTitle>Stock Actions</SheetTitle>
                </SheetHeader>
                <div className="p-2">
                  <Button
                    onClick={() => handleOpenForm()}
                    disabled={isLoading}
                    className="w-full justify-start h-11 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                    <Plus className="h-4 w-4 mr-3" />
                    Add Item
                  </Button>

                  <div className="space-y-1">
                    <div className="relative px-2">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search stock..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 bg-white border-gray-200"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 text-sm">
                      <Filter className="h-4 w-4 mr-3" />
                      Filter Items
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 text-sm">
                      <Download className="h-4 w-4 mr-3" />
                      Export Data
                    </Button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 px-2 mb-2">
                      Stock Stats
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Items
                        </span>
                        <span className="font-semibold">
                          {stockItems.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Quantity
                        </span>
                        <span className="font-semibold text-green-700">
                          {totalQuantity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Value
                        </span>
                        <span className="font-semibold text-red-700">
                          {formatCurrency(totalStockValue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">Low Stock</span>
                        <span className="font-semibold text-amber-700">
                          {lowStockItems}
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
                <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Stock Management
                </h1>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Manage inventory, track stock levels, and monitor inventory
                value
              </p>
            </div>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <Button
              onClick={() => handleOpenForm()}
              disabled={isLoading}
              className="h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg shadow-green-500/20">
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
            <DialogContent className="sm:max-w-[700px] p-0 border-0 max-h-[90vh] overflow-y-auto">
              <DialogHeader className="p-6 border-b border-gray-100">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {editingItem ? "Edit Stock Item" : "Add New Stock Item"}
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <StockItemForm
                  initialData={editingItem}
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
            className="h-14 w-14 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-2xl shadow-green-500/30">
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Stock Summary Cards - Mobile Stacked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Items
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {stockItems.length}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Quantity
                  </p>
                  <p className="text-xl font-bold text-green-700">
                    {totalQuantity}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
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
                  <p className="text-xl font-bold text-red-700">
                    {formatCurrency(totalStockValue)}
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
                  <p className="text-xs font-medium text-gray-600">Low Stock</p>
                  <p className="text-xl font-bold text-amber-700">
                    {lowStockItems}
                  </p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
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
                      <Warehouse className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-800">
                      Stock Inventory
                    </h3>
                    <Badge variant="outline" className="ml-2 bg-white text-xs">
                      {filteredStockItems.length}
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
                        value="low"
                        className="rounded-md px-3 py-1.5 text-xs">
                        Low
                      </TabsTrigger>
                      <TabsTrigger
                        value="out"
                        className="rounded-md px-3 py-1.5 text-xs">
                        Out
                      </TabsTrigger>
                    </TabsList>

                    <div className="hidden lg:flex items-center space-x-2">
                      <TabsList className="bg-gray-100 p-1 rounded-lg">
                        <TabsTrigger value="all" className="rounded-md">
                          All
                        </TabsTrigger>
                        <TabsTrigger value="low" className="rounded-md">
                          Low Stock
                        </TabsTrigger>
                        <TabsTrigger value="out" className="rounded-md">
                          Out of Stock
                        </TabsTrigger>
                      </TabsList>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search stock..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 h-9 w-48 border-gray-300"
                        />
                      </div>
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

                    <div className="lg:hidden flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 h-9 w-32 border-gray-300"
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-9">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="text-sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter Items
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
                  <StockTable
                    stockItems={filteredStockItems}
                    isLoading={isLoading}
                    onEdit={handleOpenForm}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                  />
                </TabsContent>

                <TabsContent value="low" className="m-0">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <StockTable
                      stockItems={getLowStockItems()}
                      isLoading={false}
                      onEdit={handleOpenForm}
                      onDelete={handleDelete}
                      isDeleting={isDeleting}
                    />
                  )}
                </TabsContent>

                <TabsContent value="out" className="m-0">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <StockTable
                      stockItems={getOutOfStockItems()}
                      isLoading={false}
                      onEdit={handleOpenForm}
                      onDelete={handleDelete}
                      isDeleting={isDeleting}
                    />
                  )}
                </TabsContent>
              </div>

              {/* Footer Summary */}
              {stockItems.length > 0 && !isLoading && (
                <div className="border-t border-gray-100">
                  <div className="p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-green-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div className="flex items-center">
                        <BarChart className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-xs lg:text-sm font-medium text-gray-700">
                          {stockItems.length} items • {totalQuantity} units •{" "}
                          {lowStockItems} low stock
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs lg:text-sm font-medium text-gray-700">
                          Total Inventory Value:
                        </div>
                        <div className="text-base lg:text-lg font-bold text-red-700">
                          {formatCurrency(totalStockValue)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Tabs>

        {/* Stock Health Overview - Mobile Optimized */}
        {stockItems.length > 0 && (
          <Card className="border-0 shadow-sm lg:shadow-lg mb-6">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100 p-4 lg:p-6">
              <CardTitle className="text-base lg:text-lg font-semibold flex items-center">
                <BarChart className="h-5 w-5 text-blue-600 mr-2" />
                Stock Health
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl lg:text-3xl font-bold text-green-700">
                    {stockItems.length - lowStockItems - outOfStockItems}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600 mt-1">
                    Adequate Stock
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Above reorder level
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl lg:text-3xl font-bold text-amber-700">
                    {lowStockItems}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600 mt-1">
                    Low Stock Items
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    At or below reorder level
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl lg:text-3xl font-bold text-red-700">
                    {outOfStockItems}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600 mt-1">
                    Out of Stock
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Zero quantity on hand
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-lg lg:text-3xl font-bold text-purple-700">
                    {formatCurrency(avgItemValue)}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600 mt-1">
                    Avg. Item Value
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Average cost per item
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Section - Mobile Stacked */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Package className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Stock Tips
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 mt-1 flex-shrink-0"></div>
                Set appropriate reorder levels to avoid stockouts
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-1 flex-shrink-0"></div>
                Regularly update costs for accurate inventory valuation
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2 mt-1 flex-shrink-0"></div>
                Use categories and suppliers to organize inventory
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Stock Status
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <Badge
                  variant="outline"
                  className="mr-2 bg-green-50 text-green-700 border-green-200 text-xs">
                  In Stock
                </Badge>
                <span>Above reorder level</span>
              </li>
              <li className="flex items-center">
                <Badge
                  variant="outline"
                  className="mr-2 bg-amber-50 text-amber-700 border-amber-200 text-xs">
                  Low Stock
                </Badge>
                <span>At or below reorder level</span>
              </li>
              <li className="flex items-center">
                <Badge
                  variant="outline"
                  className="mr-2 bg-red-50 text-red-700 border-red-200 text-xs">
                  Out of Stock
                </Badge>
                <span>Zero quantity available</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Navigation Hint */}
        <div className="lg:hidden mt-6 text-center">
          <p className="text-xs text-gray-500">
            Swipe on table to see all stock details
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockPage;
