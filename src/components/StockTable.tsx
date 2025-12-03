"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StockItem } from "@/types/stock";
import {
  Loader2,
  Edit,
  Trash2,
  Image as ImageIcon,
  Package,
  DollarSign,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StockTableProps {
  stockItems: StockItem[];
  isLoading: boolean;
  onEdit: (item: StockItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  categoryFilter?: string;
  onCategoryFilterChange?: (category: string) => void;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const StockTable: React.FC<StockTableProps> = ({
  stockItems,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
  searchQuery = "",
  onSearchChange,
  categoryFilter = "all",
  onCategoryFilterChange,
}) => {
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  // Calculate summary statistics
  const summary = React.useMemo(() => {
    const totalValue = stockItems.reduce(
      (sum, item) => sum + item.quantity_on_hand * item.cost_price,
      0
    );
    const lowStockItems = stockItems.filter(
      (item) => item.quantity_on_hand <= item.min_level && item.min_level > 0
    ).length;
    const activeItems = stockItems.filter((item) => item.is_active).length;
    const categories = [...new Set(stockItems.map((item) => item.category))];

    return { totalValue, lowStockItems, activeItems, categories };
  }, [stockItems]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Inventory Management
            </h1>
            <p className="text-gray-600 text-sm">
              Managing {stockItems.length} stock items
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
                <p className="text-gray-600 font-medium">
                  Loading inventory data...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Please wait while we fetch stock information
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (stockItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Inventory Management
            </h1>
            <p className="text-gray-600 text-sm">
              Manage your stock items and inventory
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-64">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Stock Items Found
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  No inventory items are available. Add stock items to start
                  managing your inventory.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getQuantityBadgeVariant = (qty: number, minLevel: number) => {
    if (qty <= minLevel && minLevel > 0) {
      return "destructive";
    }
    if (qty < minLevel * 2 && minLevel > 0) {
      return "secondary";
    }
    return qty > 0 ? "default" : "outline";
  };

  const getQuantityText = (qty: number, minLevel: number) => {
    if (qty <= minLevel && minLevel > 0) {
      return "Low Stock";
    }
    if (qty === 0) {
      return "Out of Stock";
    }
    return "In Stock";
  };

  const handleDeleteClick = (item: StockItem) => {
    setSelectedItem(item);
  };

  const handleDeleteConfirm = () => {
    if (selectedItem) {
      onDelete(selectedItem.id);
      setSelectedItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Inventory Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Managing {stockItems.length} stock items
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200">
              <Package className="h-3 w-3 mr-1" />
              {stockItems.length} Items
            </Badge>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Items
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stockItems.length}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Value
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {formatCurrency(summary.totalValue)}
                    </p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Low Stock
                    </p>
                    <p className="text-2xl font-bold text-red-700">
                      {summary.lowStockItems}
                    </p>
                  </div>
                  <div className="p-2 bg-red-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Items
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {summary.activeItems}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {onSearchChange && (
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by code, description, or supplier..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-11 pl-10 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500 shadow-sm"
                  />
                </div>
              </div>
            )}

            {onCategoryFilterChange && summary.categories.length > 0 && (
              <div>
                <Select
                  value={categoryFilter}
                  onValueChange={onCategoryFilterChange}>
                  <SelectTrigger className="h-11 bg-white border-gray-200">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Filter by category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {summary.categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Stock Table */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Stock Items
                </h3>
                <div className="ml-auto flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 border-gray-300">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Badge variant="outline" className="bg-white">
                    {stockItems.length} items
                  </Badge>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 py-4">
                      Item Information
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">
                      Category
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 text-center">
                      Stock Level
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 text-right">
                      Pricing
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 text-right">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 border-b border-gray-100 last:border-0 group">
                      <TableCell className="py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            {item.image_data_url ? (
                              <img
                                src={item.image_data_url}
                                alt={item.stock_descr}
                                className="h-10 w-10 rounded-lg object-cover border"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-100 border flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium text-gray-900 group-hover:text-purple-700">
                                {item.stock_code}
                              </p>
                              {!item.is_active && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-gray-100 text-gray-600 text-xs">
                                  Inactive
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate max-w-[200px]">
                              {item.stock_descr}
                            </p>
                            {item.size && (
                              <p className="text-xs text-gray-500">
                                Size: {item.size}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-700 border-gray-200">
                          {item.category}
                        </Badge>
                        {item.supplier && (
                          <p className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">
                            {item.supplier}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <div className="flex flex-col items-center">
                          <Badge
                            variant={getQuantityBadgeVariant(
                              item.quantity_on_hand,
                              item.min_level
                            )}
                            className="mb-1">
                            {item.quantity_on_hand} units
                          </Badge>
                          <p
                            className={`text-xs ${
                              item.quantity_on_hand <= item.min_level &&
                              item.min_level > 0
                                ? "text-red-600"
                                : "text-gray-500"
                            }`}>
                            {getQuantityText(
                              item.quantity_on_hand,
                              item.min_level
                            )}
                          </p>
                          {item.min_level > 0 && (
                            <p className="text-xs text-gray-400">
                              Min: {item.min_level} | Max: {item.max_level}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500 line-through">
                            Cost: {formatCurrency(item.cost_price)}
                          </div>
                          <div className="text-lg font-bold text-green-700">
                            {formatCurrency(item.selling_price)}
                          </div>
                          <div className="text-xs text-gray-500">
                            VAT: {item.vat}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex flex-col items-end">
                          <Badge
                            className={
                              item.is_active
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                            }>
                            {item.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <div className="flex items-center mt-1">
                            <BarChart3 className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">
                              Margin:{" "}
                              {(
                                ((item.selling_price - item.cost_price) /
                                  item.cost_price) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => onEdit(item)}
                            disabled={isDeleting}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive border-destructive/20 hover:bg-destructive/10"
                                onClick={() => handleDeleteClick(item)}
                                disabled={isDeleting}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center">
                                  <Trash2 className="h-5 w-5 text-red-600 mr-2" />
                                  Delete Stock Item
                                </AlertDialogTitle>
                                <AlertDialogDescription className="pt-4">
                                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                                    <div className="flex items-center mb-2">
                                      <div className="p-2 bg-white rounded-lg mr-3">
                                        <Package className="h-4 w-4 text-red-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-red-800">
                                          {selectedItem?.stock_descr}
                                        </p>
                                        <p className="text-sm text-red-600">
                                          Code: {selectedItem?.stock_code}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-sm text-red-700">
                                      This action cannot be undone. This will
                                      permanently delete the stock item and all
                                      associated data.
                                    </p>
                                  </div>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-300">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteConfirm}
                                  disabled={isDeleting}
                                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                                  {isDeleting ? (
                                    <div className="flex items-center">
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      Deleting...
                                    </div>
                                  ) : (
                                    "Delete Item"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Footer Summary */}
            <div className="border-t border-gray-100">
              <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center mb-3 md:mb-0">
                    <Package className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Showing {stockItems.length} item
                      {stockItems.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">
                      Total Inventory Value:
                    </div>
                    <div className="text-lg font-bold text-green-700">
                      {formatCurrency(summary.totalValue)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Notes */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Low Stock Alert
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></div>
                {summary.lowStockItems} items are below minimum stock levels
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2"></div>
                Red badge indicates critically low stock
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-500 mr-2"></div>
                Consider reordering these items soon
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <BarChart3 className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Pricing Information
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                Green price is the current selling price
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-500 mr-2"></div>
                Gray price shows the cost price
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                Margin percentage shows profit percentage
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTable;
