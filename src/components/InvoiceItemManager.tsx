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
import { InvoiceItemInsert, StockItemForInvoice } from "@/types/invoice";
import { cn } from "@/lib/utils";

interface InvoiceItemManagerProps {
  items: InvoiceItemInsert[];
  setItems: React.Dispatch<React.SetStateAction<InvoiceItemInsert[]>>;
  availableStock: StockItemForInvoice[];
  isVatInvoice: boolean; // New prop
}

const InvoiceItemManager: React.FC<InvoiceItemManagerProps> = ({
  items,
  setItems,
  availableStock,
  isVatInvoice,
}) => {
  const [selectedStockId, setSelectedStockId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [vatRate, setVatRate] = useState<number>(0);

  const selectedStock = useMemo(() => {
    return availableStock.find((s) => s.id === selectedStockId);
  }, [selectedStockId, availableStock]);

  // Update price and VAT when stock selection changes
  React.useEffect(() => {
    if (selectedStock) {
      // If it's a VAT invoice, use the stock item's VAT rate. Otherwise, force 0.
      setUnitPrice(selectedStock.selling_price);
      setVatRate(isVatInvoice ? selectedStock.vat : 0);
    } else {
      setUnitPrice(0);
      setVatRate(isVatInvoice ? 0 : 0);
    }
  }, [selectedStock, isVatInvoice]);
  
  // Ensure VAT rate is 0 if it's a non-VAT invoice, even if manually changed
  React.useEffect(() => {
    if (!isVatInvoice) {
      setVatRate(0);
    }
  }, [isVatInvoice]);


  const handleAddItem = () => {
    if (!selectedStock || quantity <= 0 || unitPrice < 0) return;

    const newItem: InvoiceItemInsert = {
      stock_item_id: selectedStock.id,
      description: selectedStock.stock_descr,
      quantity: quantity,
      unit_price: unitPrice,
      vat_rate: isVatInvoice ? vatRate : 0, // Ensure VAT is 0 if non-VAT invoice
    };
    
    setItems((prev) => [...prev, newItem]);

    // Reset form fields
    setSelectedStockId("");
    setQuantity(1);
    setUnitPrice(0);
    setVatRate(0);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateLineTotal = (item: InvoiceItemInsert) => {
    const subtotal = item.quantity * item.unit_price;
    const vat = subtotal * (item.vat_rate / 100);
    return subtotal + vat;
  };

  const totals = useMemo(() => {
    let subtotal = 0;
    let vat_amount = 0;
    let total_amount = 0;

    items.forEach(item => {
      const itemSubtotal = item.quantity * item.unit_price;
      const itemVat = itemSubtotal * (item.vat_rate / 100);
      
      subtotal += itemSubtotal;
      vat_amount += itemVat;
      total_amount += itemSubtotal + itemVat;
    });

    return { subtotal, vat_amount, total_amount, total_qty: items.reduce((sum, item) => sum + item.quantity, 0) };
  }, [items]);
  
  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">Invoice Items</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4 items-end">
        <div className={cn("col-span-2", !isVatInvoice && "sm:col-span-3")}>
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
        <div>
          <Label htmlFor="unit-price">Price (Excl. VAT)</Label>
          <Input
            id="unit-price"
            type="number"
            step="0.01"
            value={unitPrice}
            onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4 items-end">
        {isVatInvoice ? (
          <div>
            <Label htmlFor="vat-rate">VAT Rate (%)</Label>
            <Input
              id="vat-rate"
              type="number"
              step="0.01"
              value={vatRate}
              onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
            />
          </div>
        ) : (
          <div className="col-span-1">
            <Label className="text-muted-foreground">VAT Rate</Label>
            <Input disabled value="0%" className="bg-muted/50" />
          </div>
        )}
        <Button
          type="button"
          onClick={handleAddItem}
          disabled={!selectedStockId || quantity <= 0 || unitPrice < 0}
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
            {items.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border rounded-md text-sm"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-medium truncate">{item.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} @ {formatCurrency(item.unit_price)} 
                    {isVatInvoice && ` (VAT: ${item.vat_rate}%)`}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-right min-w-[80px]">
                    {formatCurrency(calculateLineTotal(item))}
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
            ))}
          </ul>
        )}
      </CardContent>
      
      <Separator className="my-4" />
      
      {/* Totals Summary */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between font-medium">
          <span>Total Quantity:</span>
          <span>{totals.total_qty}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal (Excl. VAT):</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>
        {isVatInvoice && (
          <div className="flex justify-between">
            <span>VAT Amount:</span>
            <span>{formatCurrency(totals.vat_amount)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
          <span>TOTAL DUE ({isVatInvoice ? 'Incl. VAT' : 'No VAT'}):</span>
          <span>{formatCurrency(totals.total_amount)}</span>
        </div>
      </div>
    </Card>
  );
};

export default InvoiceItemManager;