"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Upload, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { GrvInsert, GrvItemInsert, Supplier, StockItemForGrv } from "@/types/grv";
import GrvItemManager from "./GrvItemManager";
import { useGrvs } from "@/hooks/use-grvs";
import { showError, showSuccess } from "@/utils/toast";

const grvSchema = z.object({
  reference: z.string().min(1, "Reference number is required."),
  order_no: z.string().nullable().optional(),
  date: z.date({ required_error: "Date is required." }),
  supplier_id: z.string().min(1, "Supplier is required."),
  note: z.string().nullable().optional(),
});

type GrvFormValues = z.infer<typeof grvSchema>;

interface GrvFormProps {
  suppliers: Supplier[];
  availableStock: StockItemForGrv[];
  onSubmit: (data: GrvInsert) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const GrvForm: React.FC<GrvFormProps> = ({
  suppliers,
  availableStock,
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  const { parseGrvPdf, addStockItemFromGrv, isCreatingStock } = useGrvs();
  const [grvItems, setGrvItems] = useState<GrvItemInsert[]>([]); 
  const [isParsing, setIsParsing] = useState(false);

  const form = useForm<GrvFormValues>({
    resolver: zodResolver(grvSchema),
    defaultValues: {
      reference: "",
      order_no: "",
      date: new Date(),
      supplier_id: "",
      note: "",
    },
  });

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      showError("Please select a PDF file.");
      return;
    }
    
    setIsParsing(true);
    
    try {
      const parsedData = await parseGrvPdf(file);
      
      // 1. Find matching supplier
      const supplier = suppliers.find(s => s.supplier_name.toLowerCase().includes(parsedData.supplier_name.toLowerCase()));
      
      if (!supplier) {
        showError(`Supplier "${parsedData.supplier_name}" not found in your list. Please select manually.`);
      } else {
        form.setValue("supplier_id", supplier.id);
      }
      
      // 2. Set header fields
      form.setValue("reference", parsedData.reference);
      form.setValue("date", new Date(parsedData.date));
      form.setValue("order_no", parsedData.order_no || ""); // Map order_no
      
      // 3. Map parsed items to GRV items, creating new stock items if necessary
      const newGrvItems: GrvItemInsert[] = [];
      const currentStockMap = new Map(availableStock.map(s => [s.stock_code, s]));
      
      for (const parsedItem of parsedData.items) {
        let stockMatch = currentStockMap.get(parsedItem.stock_code);
        
        if (!stockMatch) {
          // Item not found, create it
          const newStock = await addStockItemFromGrv({
            stock_code: parsedItem.stock_code,
            description: parsedItem.description,
            cost_price: parsedItem.cost_price,
            supplier_name: parsedData.supplier_name,
          });
          
          // Use the newly created stock item for the GRV entry
          stockMatch = newStock;
        }
        
        if (stockMatch) {
          newGrvItems.push({
            stock_item_id: stockMatch.id,
            qty: parsedItem.qty,
            cost_price: parsedItem.cost_price,
            selling_price: stockMatch.selling_price, // Use existing/new selling price from stock item
          });
        }
      }
      
      setGrvItems(newGrvItems);
      showSuccess(`Successfully extracted data from ${file.name}. ${newGrvItems.length} items processed.`);

    } catch (error) {
      showError(`Extraction failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsParsing(false);
      // Clear file input after processing
      e.target.value = '';
    }
  };

  const handleSubmit = (values: GrvFormValues) => {
    if (grvItems.length === 0) {
      alert("Please add at least one item to the GRV.");
      return;
    }
    
    const data: GrvInsert = {
      reference: values.reference,
      date: format(values.date, "yyyy-MM-dd"),
      supplier_id: values.supplier_id,
      order_no: values.order_no || null,
      note: values.note || null,
      items: grvItems,
    };
    onSubmit(data);
  };

  const isProcessing = isSubmitting || isParsing || isCreatingStock;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        
        {/* PDF Upload Section */}
        <FormItem>
          <FormLabel>Upload GRV PDF for Auto-Fill</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Input
                id="pdf_upload"
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="hidden"
                disabled={isProcessing}
              />
              <Button 
                type="button" 
                variant="outline" 
                asChild
                disabled={isProcessing}
              >
                <label htmlFor="pdf_upload" className="cursor-pointer flex items-center">
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {isProcessing ? "Processing..." : "Upload PDF"}
                </label>
              </Button>
              <span className="text-xs text-muted-foreground">
                (Supports extraction for known suppliers like Elektra)
              </span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GRV Reference</FormLabel>
                <FormControl>
                  <Input placeholder="GRV-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order No. (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="PO-123" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supplier_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value} // Use value instead of defaultValue for controlled behavior
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.supplier_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any specific notes about this delivery..." {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <GrvItemManager
          items={grvItems}
          setItems={setGrvItems}
          availableStock={availableStock}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Record GRV"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GrvForm;