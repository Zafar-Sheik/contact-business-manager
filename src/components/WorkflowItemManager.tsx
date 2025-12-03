"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Package,
  Search,
  DollarSign,
  Hash,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkflowItemInsert } from "@/types/workflow";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { StockItemForInvoice } from "@/types/invoice";

interface WorkflowItemManagerProps {
  items: WorkflowItemInsert[];
  setItems: React.Dispatch<React.SetStateAction<WorkflowItemInsert[]>>;
  availableStock: StockItemForInvoice[];
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const WorkflowItemManager: React.FC<WorkflowItemManagerProps> = ({
  items,
  setItems,
  availableStock,
}) => {
  const [selectedStockId, setSelectedStockId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter stock items based on search query
  const filteredStock = useMemo(() => {
    if (!searchQuery.trim()) return availableStock;

    const query = searchQuery.toLowerCase();
    return availableStock.filter(
      (stock) =>
        stock.stock_code.toLowerCase().includes(query) ||
        stock.stock_descr.toLowerCase().includes(query)
    );
  }, [availableStock, searchQuery]);

  const selectedStock = useMemo(() => {
    return availableStock.find((s) => s.id === selectedStockId);
  }, [selectedStockId, availableStock]);

  const handleAddItem = () => {
    if (!selectedStockId || quantity <= 0) return;

    const existingItemIndex = items.findIndex(
      (item) => item.stock_item_id === selectedStockId
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      setItems((prev) =>
        prev.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: WorkflowItemInsert = {
        stock_item_id: selectedStockId,
        workflow_id: "",
        quantity: quantity,
      };
      setItems((prev) => [...prev, newItem]);
    }

    // Reset form fields
    setSelectedStockId("");
    setQuantity(1);
    setSearchQuery("");
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const getStockDetails = (stockId: string | null) => {
    return availableStock.find((s) => s.id === stockId);
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => {
    const stock = getStockDetails(item.stock_item_id);
    return sum + item.quantity * (stock?.selling_price || 0);
  }, 0);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && selectedStockId && quantity > 0) {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-amber-50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Package className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Required Stock Items
            </h3>
            <Badge variant="outline" className="ml-auto bg-white">
              {totalQuantity} items
            </Badge>
          </div>
        </div>

        <div className="p-5">
          {/* Search and Selection */}
          <div className="space-y-4 mb-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Search Stock Items
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by code or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 pl-10 bg-gray-50 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label
                  htmlFor="stock-item"
                  className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Stock Item
                </Label>
                <Select
                  value={selectedStockId}
                  onValueChange={setSelectedStockId}>
                  <SelectTrigger
                    id="stock-item"
                    className="h-11 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select stock item" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 max-h-[300px]">
                    {filteredStock.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No matching stock items found
                      </div>
                    ) : (
                      filteredStock.map((stock) => (
                        <SelectItem key={stock.id} value={stock.id}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {stock.stock_code}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {stock.stock_descr}
                              </p>
                            </div>
                            <div className="text-right ml-2">
                              <p className="text-sm font-semibold text-green-600">
                                {formatCurrency(stock.selling_price)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Stock: {stock.quantity_on_hand}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="quantity"
                  className="text-sm font-medium text-gray-700 mb-2 block">
                  Quantity
                </Label>
                <div className="relative">
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                    onKeyPress={handleKeyPress}
                  />
                  <Hash className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {selectedStock && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {selectedStock.stock_descr}
                    </h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {selectedStock.stock_code}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {formatCurrency(selectedStock.selling_price)}
                      </span>
                      <span className="flex items-center">
                        <Package className="h-3 w-3 mr-1" />
                        Available: {selectedStock.quantity_on_hand}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    Subtotal:{" "}
                    {formatCurrency(selectedStock.selling_price * quantity)}
                  </Badge>
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={handleAddItem}
              disabled={!selectedStockId || quantity <= 0}
              className="w-full h-11 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium">
              <Plus className="h-4 w-4 mr-2" /> Add to Workflow
            </Button>
          </div>

          <Separator className="my-6" />

          {/* Added Items List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-800">
                Added Items ({totalQuantity})
              </h4>
              {totalValue > 0 && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Total: {formatCurrency(totalValue)}
                </Badge>
              )}
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {items.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No items added yet
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Select stock items from above to add to this workflow
                  </p>
                </div>
              ) : (
                items.map((item, index) => {
                  const stock = getStockDetails(item.stock_item_id);
                  const itemValue = item.quantity * (stock?.selling_price || 0);

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 group">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Package className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {stock?.stock_descr || "Unknown Item"}
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Tag className="h-2.5 w-2.5 mr-1" />
                              {stock?.stock_code || "N/A"}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-2.5 w-2.5 mr-1" />
                              {formatCurrency(stock?.selling_price || 0)} each
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-blue-50">
                              <Hash className="h-3 w-3 mr-1" />
                              {item.quantity}
                            </Badge>
                            <span className="text-sm font-semibold text-green-600">
                              {formatCurrency(itemValue)}
                            </span>
                          </div>
                          {stock?.quantity_on_hand !== undefined && (
                            <p className="text-xs text-gray-500 mt-1">
                              Stock: {stock.quantity_on_hand}
                            </p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-100">
            <div className="p-4 bg-gradient-to-r from-gray-50 to-amber-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {items.length} item{items.length !== 1 ? "s" : ""} •{" "}
                    {totalQuantity} units
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">
                    Estimated Total:
                  </div>
                  <div className="text-lg font-bold text-green-700">
                    {formatCurrency(totalValue)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkflowItemManager;
