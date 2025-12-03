"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Package, TrendingUp, TrendingDown, Search, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useStock } from "@/hooks/use-stock";
import { StockItem, StockItemInsert } from "@/types/stock";
import StockItemForm from "@/components/StockItemForm";
import StockTable from "@/components/StockTable"; // Import the new table component

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
    isDeleting 
  } = useStock();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenForm = (item?: StockItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
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
  
  // Filter stock items based on search term
  const filteredStockItems = stockItems.filter(item => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return (
      item.stock_descr.toLowerCase().includes(lowerCaseSearch) ||
      item.stock_code.toLowerCase().includes(lowerCaseSearch) ||
      item.category.toLowerCase().includes(lowerCaseSearch) ||
      item.supplier?.toLowerCase().includes(lowerCaseSearch)
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-2">Stock Management</h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()}>
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Stock Item" : "Add New Stock Item"}
              </DialogTitle>
            </DialogHeader>
            <StockItemForm
              initialData={editingItem}
              onSubmit={handleSubmit}
              isSubmitting={isAdding || isUpdating}
              onClose={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </header>
      
      {/* Summary Cards */}
      <div className="max-w-4xl mx-auto space-y-4 mb-6">
        <h2 className="text-xl font-semibold">Stock Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-6 w-3/4" />
              ) : (
                <div className="text-2xl font-bold">
                  {stockItems.length}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quantity On Hand</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-6 w-3/4" />
              ) : (
                <div className="text-2xl font-bold">
                  {totalQuantity}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock Value (Cost)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-6 w-3/4" />
              ) : (
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalStockValue)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold">Stock List</h2>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stock by code, description, category, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <StockTable
          stockItems={filteredStockItems}
          isLoading={isLoading}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default StockPage;