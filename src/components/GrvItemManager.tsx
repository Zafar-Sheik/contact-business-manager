"use client";

import React, { useState, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { GrvItemInsert, StockItemForGrv } from "@/types/grv"; // Updated import

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
    if (!selectedStock || quantity <= 0 || costPrice < 0 || sellingPrice < 0) return;

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
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totals = useMemo(() => {
    let totalCost = 0;
    let totalQty = 0;

    items.forEach(item => {
      totalCost += item.qty * item.cost_price;
      totalQty += item.qty;
    });

    return { totalCost, totalQty };
  }, [items]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">Items Received ({totals.totalQty} total)</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4 items-end">
        <div className="col-span-2">
          <Label htmlFor="stock-item">Stock Item</Label>
          <Select
            value={selectedStockId}
            onValueChange={setSelectedStockId}
          >
            <SelectTrigger id="stock-item">
              <SelectValue placeholder="Select stock item" />
            </SelectTrigger>
            <SelectContent>
              {availableStock.map((stock) => (
                <SelectItem key={stock.id} value={stock.id}>
                  {stock.stock_code} - {stock.stock_descr} (Qty: {stock.quantity_on_hand})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="quantity">Qty Received</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          />
        </div>
        <div>
          <Label htmlFor="cost-price">Cost Price</Label>
          <Input
            id="cost-price"
            type="number"
            step="0.01"
            value={costPrice}
            onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4 items-end">
        <div>
          <Label htmlFor="selling-price">Selling Price (C)</Label>
          <Input
            id="selling-price"
            type="number"
            step="0.01"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
          />
        </div>
        <Button
          type="button"
          onClick={handleAddItem}
          disabled={!selectedStockId || quantity <= 0 || costPrice < 0 || sellingPrice < 0}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>

      <Separator className="my-4" />

      <CardContent className="p-0 max-h-60 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No items added yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, index) => {
              const stock = availableStock.find(s => s.id === item.stock_item_id);
              return (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 border rounded-md text-sm"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-medium truncate">
                      {stock?.stock_descr || "Unknown Item"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.qty} | Cost: {formatCurrency(item.cost_price)} | Sell: {formatCurrency(item.selling_price)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-right min-w-[80px]">
                      {formatCurrency(item.qty * item.cost_price)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="h-6 w-6 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
      
      <Separator className="my-4" />
      
      {/* Totals Summary */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between font-medium">
          <span>Total Items Received:</span>
          <span>{totals.totalQty}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
          <span>TOTAL GRV VALUE:</span>
          <span>{formatCurrency(totals.totalCost)}</span>
        </div>
      </div>
    </Card>
  );
};

export default GrvItemManager;