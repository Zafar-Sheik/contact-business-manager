"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Package,
  Search,
  DollarSign,
  Hash,
  TrendingUp,
  BarChart3,
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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GrvItemInsert, StockItemForGrv } from "@/types/grv";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GrvItemManagerProps {
  items: GrvItemInsert[];
  setItems: React.Dispatch<React.SetStateAction<GrvItemInsert[]>>;
  availableStock: StockItemForGrv[];
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const GrvItemManager: React.FC<GrvItemManagerProps> = ({
  items,
  setItems,
  availableStock,
}) => {
  const [selectedStockId, setSelectedStockId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter stock items based on search
  const filteredStock = useMemo(() => {
    if (!searchQuery.trim()) return availableStock;

    const query = searchQuery.toLowerCase();
    return availableStock.filter(
      (stock) =>
        stock.stock_code.toLowerCase().includes(query) ||
        stock.stock_descr.toLowerCase().includes(query) ||
        stock.supplier_name?.toLowerCase().includes(query)
    );
  }, [availableStock, searchQuery]);

  const selectedStock = useMemo(() => {
    return availableStock.find((s) => s.id === selectedStockId);
  }, [selectedStockId, availableStock]);

  // Update prices when stock selection changes
  React.useEffect(() => {
    if (selectedStock) {
      setCostPrice(selectedStock.cost_price);
      setSellingPrice(selectedStock.selling_price);
    } else {
      setCostPrice(0);
      setSellingPrice(0);
    }
  }, [selectedStock]);

  const handleAddItem = () => {
    if (!selectedStock || quantity <= 0 || costPrice < 0 || sellingPrice < 0)
      return;

    const newItem: GrvItemInsert = {
      stock_item_id: selectedStock.id,
      qty: quantity,
      cost_price: costPrice,
      selling_price: sellingPrice,
    };

    setItems((prev) => [...prev, newItem]);

    // Reset form fields
    setSelectedStockId("");
    setQuantity(1);
    setCostPrice(0);
    setSellingPrice(0);
    setSearchQuery("");
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totals = useMemo(() => {
    let totalCost = 0;
    let totalQty = 0;
    let totalItems = items.length;

    items.forEach((item) => {
      totalCost += item.qty * item.cost_price;
      totalQty += item.qty;
    });

    return { totalCost, totalQty, totalItems };
  }, [items]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && selectedStockId && quantity > 0) {
      handleAddItem();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Items Received
            </h3>
            <p className="text-sm text-gray-600">Add stock items to this GRV</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200">
          {totals.totalItems} items
        </Badge>
      </div>

      {/* Add Item Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-white">
        <CardContent className="p-4">
          <div className="grid gap-4">
            {/* Search and Select */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center">
                <Search className="h-3.5 w-3.5 mr-1.5" />
                Select Stock Item
              </Label>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    placeholder="Search by code, description, or supplier..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                <Select
                  value={selectedStockId}
                  onValueChange={setSelectedStockId}>
                  <SelectTrigger className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select item or search above" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64 bg-white border-gray-200">
                    {filteredStock.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No items found matching "{searchQuery}"
                      </div>
                    ) : (
                      filteredStock.map((stock) => (
                        <SelectItem
                          key={stock.id}
                          value={stock.id}
                          className="py-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="p-1.5 bg-blue-50 rounded">
                                  <Hash className="h-3 w-3 text-blue-600" />
                                </div>
                                <span className="font-medium text-gray-900 truncate">
                                  {stock.stock_code}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate">
                                {stock.stock_descr}
                              </p>
                              <div className="flex items-center space-x-3 mt-1">
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-green-50 text-green-700 border-green-200">
                                  Qty: {stock.quantity_on_hand}
                                </Badge>
                                {stock.supplier_name && (
                                  <span className="text-xs text-gray-500 truncate">
                                    {stock.supplier_name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="ml-3 text-right">
                              <div className="text-sm font-medium text-green-600">
                                R{stock.cost_price.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">Cost</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quantity and Prices */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="quantity"
                  className="text-xs font-medium text-gray-700">
                  Quantity
                </Label>
                <div className="relative">
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    onKeyPress={handleKeyPress}
                    className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      units
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="cost-price"
                  className="text-xs font-medium text-gray-700 flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Cost Price
                </Label>
                <div className="relative">
                  <Input
                    id="cost-price"
                    type="number"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) =>
                      setCostPrice(Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    onKeyPress={handleKeyPress}
                    className="h-11 pl-8 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    R
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="selling-price"
                  className="text-xs font-medium text-gray-700 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Selling Price
                </Label>
                <div className="relative">
                  <Input
                    id="selling-price"
                    type="number"
                    step="0.01"
                    value={sellingPrice}
                    onChange={(e) =>
                      setSellingPrice(
                        Math.max(0, parseFloat(e.target.value) || 0)
                      )
                    }
                    onKeyPress={handleKeyPress}
                    className="h-11 pl-8 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    R
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700 opacity-0">
                  Add Button
                </Label>
                <Button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!selectedStockId || quantity <= 0}
                  className="h-11 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>

            {/* Selected Item Preview */}
            {selectedStock && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="secondary" className="bg-white">
                        {selectedStock.stock_code}
                      </Badge>
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {selectedStock.stock_descr}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span>
                        Current Stock: {selectedStock.quantity_on_hand}
                      </span>
                      <span>•</span>
                      <span>Cost: R{selectedStock.cost_price.toFixed(2)}</span>
                      <span>•</span>
                      <span>
                        Sell: R{selectedStock.selling_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 text-right">
                    <div className="text-sm font-bold text-blue-600">
                      R{(quantity * costPrice).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {quantity} × R{costPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      {items.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-800 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Added Items ({items.length})
            </h4>
            <Badge variant="outline" className="text-xs">
              {totals.totalQty} total units
            </Badge>
          </div>

          <ScrollArea className="h-[280px]">
            <div className="space-y-2 pr-4">
              {items.map((item, index) => {
                const stock = availableStock.find(
                  (s) => s.id === item.stock_item_id
                );
                const itemTotal = item.qty * item.cost_price;
                const margin =
                  ((item.selling_price - item.cost_price) / item.cost_price) *
                  100;

                return (
                  <Card
                    key={index}
                    className="border border-gray-200 hover:border-blue-200 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start space-x-2 mb-2">
                            <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                              <Package className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900 truncate">
                                  {stock?.stock_descr || "Unknown Item"}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {stock?.stock_code}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <span className="font-medium">Qty:</span>
                                  <Badge
                                    variant="secondary"
                                    className="h-5 px-2">
                                    {item.qty}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span>Cost:</span>
                                  <span className="font-medium text-green-600">
                                    {formatCurrency(item.cost_price)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span>Sell:</span>
                                  <span className="font-medium text-blue-600">
                                    {formatCurrency(item.selling_price)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar for Margin */}
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-gray-600">
                                Profit Margin
                              </span>
                              <span
                                className={`font-medium ${
                                  margin > 0 ? "text-green-600" : "text-red-600"
                                }`}>
                                {margin.toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  margin > 0 ? "bg-green-500" : "bg-red-500"
                                }`}
                                style={{
                                  width: `${Math.min(Math.abs(margin), 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="ml-4 flex flex-col items-end space-y-2">
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {formatCurrency(itemTotal)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Total value
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-8 border-2 border-dashed border-gray-200 text-center">
          <div className="p-3 bg-gray-100 rounded-full inline-flex mb-4">
            <Package className="h-6 w-6 text-gray-400" />
          </div>
          <h4 className="text-sm font-semibold text-gray-800 mb-1">
            No Items Added Yet
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Start by selecting items from your stock list
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <div className="p-1.5 bg-white rounded border">
              <Search className="h-3 w-3" />
            </div>
            <span>Search items</span>
            <span className="text-gray-300">•</span>
            <div className="p-1.5 bg-white rounded border">
              <Plus className="h-3 w-3" />
            </div>
            <span>Add items</span>
          </div>
        </div>
      )}

      {/* Totals Summary */}
      {items.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <BarChart3 className="h-4 w-4 text-green-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-800">
              Order Summary
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3 border shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Total Items</div>
              <div className="text-2xl font-bold text-gray-900">
                {totals.totalItems}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {totals.totalQty} total units
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Total Value</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totals.totalCost)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Average: R{(totals.totalCost / totals.totalQty).toFixed(2)}/unit
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">
                Grand Total
              </span>
              <span className="text-xl font-bold text-green-700">
                {formatCurrency(totals.totalCost)}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              This amount will be added to your inventory value
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrvItemManager;
