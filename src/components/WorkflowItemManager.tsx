"use client";

import React, { useState } from "react";
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
import { WorkflowItemInsert } from "@/types/workflow";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StockItemForInvoice } from "@/types/invoice"; // Use the consistent type

interface WorkflowItemManagerProps {
  items: WorkflowItemInsert[];
  setItems: React.Dispatch<React.SetStateAction<WorkflowItemInsert[]>>;
  availableStock: StockItemForInvoice[];
}

const WorkflowItemManager: React.FC<WorkflowItemManagerProps> = ({
  items,
  setItems,
  availableStock,
}) => {
  const [selectedStockId, setSelectedStockId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddItem = () => {
    if (!selectedStockId || quantity <= 0) return;

    const existingItemIndex = items.findIndex(
      (item) => item.stock_item_id === selectedStockId,
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      setItems((prev) =>
        prev.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      );
    } else {
      // Add new item
      const newItem: WorkflowItemInsert = {
        stock_item_id: selectedStockId,
        workflow_id: "", // Placeholder, will be set on submission
        quantity: quantity,
      };
      setItems((prev) => [...prev, newItem]);
    }

    // Reset form fields
    setSelectedStockId("");
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const getStockDetails = (stockId: string | null) => {
    return availableStock.find((s) => s.id === stockId);
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">Stock Items ({totalQuantity} total)</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 items-end">
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
                  {stock.stock_code} - {stock.stock_descr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="quantity">Qty</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          />
        </div>
      </div>
      <Button
        type="button"
        onClick={handleAddItem}
        disabled={!selectedStockId || quantity <= 0}
        className="w-full mb-4"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Item
      </Button>

      <Separator className="my-4" />

      <CardContent className="p-0 max-h-60 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No items added yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, index) => {
              const stock = getStockDetails(item.stock_item_id);
              return (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 border rounded-md text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {stock?.stock_descr || "Unknown Item"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Code: {stock?.stock_code || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">Qty: {item.quantity}</span>
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
    </Card>
  );
};

export default WorkflowItemManager;