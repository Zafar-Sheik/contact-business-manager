"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Upload,
  Loader2,
  FileText,
  Package,
  Truck,
  Hash,
  CalendarDays,
  MessageSquare,
} from "lucide-react";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  GrvInsert,
  GrvItemInsert,
  Supplier,
  StockItemForGrv,
} from "@/types/grv";
import GrvItemManager from "./GrvItemManager";
import { useGrvs } from "@/hooks/use-grvs";
import { showError, showSuccess } from "@/utils/toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
  const [parsedItems, setParsedItems] = useState<number>(0);

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
    if (!file || file.type !== "application/pdf") {
      showError("Please select a PDF file.");
      return;
    }

    setIsParsing(true);
    setParsedItems(0);

    try {
      const parsedData = await parseGrvPdf(file);
      setParsedItems(parsedData.items.length);

      const supplier = suppliers.find((s) =>
        s.supplier_name
          .toLowerCase()
          .includes(parsedData.supplier_name.toLowerCase())
      );

      if (!supplier) {
        showError(
          `Supplier "${parsedData.supplier_name}" not found. Please select manually.`
        );
      } else {
        form.setValue("supplier_id", supplier.id);
      }

      form.setValue("reference", parsedData.reference);
      form.setValue("date", new Date(parsedData.date));
      form.setValue("order_no", parsedData.order_no || "");

      const newGrvItems: GrvItemInsert[] = [];
      const currentStockMap = new Map(
        availableStock.map((s) => [s.stock_code, s])
      );

      for (const parsedItem of parsedData.items) {
        let stockMatch = currentStockMap.get(parsedItem.stock_code);

        if (!stockMatch) {
          const newStock = await addStockItemFromGrv({
            stock_code: parsedItem.stock_code,
            description: parsedItem.description,
            cost_price: parsedItem.cost_price,
            supplier_name: parsedData.supplier_name,
          });

          stockMatch = newStock;
        }

        if (stockMatch) {
          newGrvItems.push({
            stock_item_id: stockMatch.id,
            qty: parsedItem.qty,
            cost_price: parsedItem.cost_price,
            selling_price: stockMatch.selling_price,
          });
        }
      }

      setGrvItems(newGrvItems);
      showSuccess(`Extracted ${newGrvItems.length} items from ${file.name}`);
    } catch (error) {
      showError(
        `Extraction failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsParsing(false);
      setParsedItems(0);
      e.target.value = "";
    }
  };

  const handleSubmit = (values: GrvFormValues) => {
    if (grvItems.length === 0) {
      showError("Please add at least one item to the GRV.");
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">New GRV</h1>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200">
              <Package className="h-3 w-3 mr-1" />
              Goods Receipt
            </Badge>
          </div>
          <p className="text-gray-600 text-sm">
            Record goods received from suppliers
          </p>
        </div>

        <Card className="border-0 shadow-lg overflow-hidden mb-4">
          <CardContent className="p-4">
            {/* PDF Upload Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-dashed border-blue-200 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      Quick Import from PDF
                    </h3>
                    <p className="text-xs text-gray-600">
                      Automatically extract data from supplier invoices
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Beta
                </Badge>
              </div>

              <div className="space-y-3">
                <Input
                  id="pdf_upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                  disabled={isProcessing}
                />

                {isParsing ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Processing PDF...</span>
                      <span className="font-medium">{parsedItems} items</span>
                    </div>
                    <Progress value={parsedItems * 10} className="h-2" />
                    <div className="flex items-center justify-center text-sm text-blue-600">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extracting data...
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    disabled={isProcessing}
                    className="w-full h-11 border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50">
                    <label
                      htmlFor="pdf_upload"
                      className="cursor-pointer flex items-center justify-center">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Supplier Invoice PDF
                    </label>
                  </Button>
                )}

                <p className="text-xs text-gray-500 text-center">
                  Supports Elektra, Voltex, and other major suppliers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5">
                {/* GRV Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Hash className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      GRV Details
                    </h3>
                  </div>

                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="reference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Reference Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="GRV-001"
                                className="h-11 pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                              />
                              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="order_no"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Order No.
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="PO-123"
                                className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                value={field.value || ""}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Date
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "h-11 w-full justify-start text-left font-normal bg-gray-50 border-gray-200",
                                      !field.value && "text-muted-foreground"
                                    )}>
                                    <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
                                    {field.value ? (
                                      format(field.value, "MMM d")
                                    ) : (
                                      <span>Pick date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  className="bg-white"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="supplier_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Truck className="h-3.5 w-3.5 mr-1.5" />
                            Supplier
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Select supplier" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-gray-200 max-h-[200px]">
                              {suppliers.map((supplier) => (
                                <SelectItem
                                  key={supplier.id}
                                  value={supplier.id}>
                                  <div className="flex items-center">
                                    <div className="p-2 bg-blue-50 rounded mr-3">
                                      <Truck className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {supplier.supplier_name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {supplier.contact_person ||
                                          "No contact"}
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                            Notes (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any specific notes about this delivery..."
                              className="min-h-[80px] bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Items Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Package className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Items Received
                      </h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {grvItems.length} items
                    </Badge>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                    <GrvItemManager
                      items={grvItems}
                      setItems={setGrvItems}
                      availableStock={availableStock}
                    />
                  </div>

                  {grvItems.length === 0 && (
                    <div className="text-center py-8">
                      <div className="p-3 bg-gray-100 rounded-full inline-flex mb-3">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">
                        No items added yet
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Add items manually or upload a PDF
                      </p>
                    </div>
                  )}
                </div>

                {/* Summary */}
                {grvItems.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800">
                        Order Summary
                      </h4>
                      <Badge variant="outline" className="bg-white">
                        {grvItems.length} items
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-500">
                          Total Quantity
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {grvItems.reduce((sum, item) => sum + item.qty, 0)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Total Value</div>
                        <div className="text-lg font-bold text-green-600">
                          R
                          {grvItems
                            .reduce(
                              (sum, item) =>
                                sum + item.qty * (item.cost_price || 0),
                              0
                            )
                            .toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col space-y-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isProcessing || grvItems.length === 0}
                    className="h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg shadow-green-500/20 disabled:opacity-50">
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isSubmitting ? "Recording..." : "Processing..."}
                      </div>
                    ) : (
                      <>
                        <Package className="h-4 w-4 mr-2" />
                        Record GRV ({grvItems.length} items)
                      </>
                    )}
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="h-11 border-gray-300 text-gray-700 hover:bg-gray-50">
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setGrvItems([])}
                      disabled={grvItems.length === 0}
                      className="h-11 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                      Clear Items
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GrvForm;
