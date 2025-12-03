"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Image, X } from "lucide-react";

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
import { StockItem, StockItemInsert } from "@/types/stock";
import { Checkbox } from "@/components/ui/checkbox";

const stockItemSchema = z.object({
  stock_code: z.string().min(1, "Code is required."),
  stock_descr: z.string().min(1, "Description is required."),
  category: z.string().min(1, "Category is required."),
  size: z.string().nullable().optional(),
  cost_price: z.coerce.number().min(0, "Cost price must be non-negative."),
  selling_price: z.coerce.number().min(0, "Selling price (C) must be non-negative."),
  price_a: z.coerce.number().min(0).default(0),
  price_b: z.coerce.number().min(0).default(0),
  price_d: z.coerce.number().min(0).default(0),
  price_e: z.coerce.number().min(0).default(0),
  vat: z.coerce.number().min(0).max(100, "VAT must be between 0 and 100.").default(0),
  supplier: z.string().nullable().optional(),
  min_level: z.coerce.number().min(0).default(0),
  max_level: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
  // Image handling is simplified to a URL string for now
  image_data_url: z.string().nullable().optional(),
});

type StockItemFormValues = z.infer<typeof stockItemSchema>;

interface StockItemFormProps {
  initialData?: StockItem;
  onSubmit: (data: StockItemInsert) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const StockItemForm: React.FC<StockItemFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  const form = useForm<StockItemFormValues>({
    resolver: zodResolver(stockItemSchema),
    defaultValues: {
      stock_code: initialData?.stock_code || "",
      stock_descr: initialData?.stock_descr || "",
      category: initialData?.category || "",
      size: initialData?.size || "",
      cost_price: initialData?.cost_price || 0,
      selling_price: initialData?.selling_price || 0,
      price_a: initialData?.price_a || 0,
      price_b: initialData?.price_b || 0,
      price_d: initialData?.price_d || 0,
      price_e: initialData?.price_e || 0,
      vat: initialData?.vat || 0,
      supplier: initialData?.supplier || "",
      min_level: initialData?.min_level || 0,
      max_level: initialData?.max_level || 0,
      is_active: initialData?.is_active ?? true,
      image_data_url: initialData?.image_data_url || "",
    },
  });

  const handleSubmit = (values: StockItemFormValues) => {
    const data: StockItemInsert = {
      // Required fields from form
      stock_code: values.stock_code,
      stock_descr: values.stock_descr,
      category: values.category,
      cost_price: values.cost_price,
      selling_price: values.selling_price,
      price_a: values.price_a,
      price_b: values.price_b,
      price_d: values.price_d,
      price_e: values.price_e,
      vat: values.vat,
      min_level: values.min_level,
      max_level: values.max_level,
      is_active: values.is_active,
      
      // Nullable fields from form (handle empty string to null conversion)
      size: values.size || null,
      supplier: values.supplier || null,
      image_data_url: values.image_data_url || null,
      
      // Fields not managed by form but required by StockItemInsert (using initial data defaults)
      promotion: initialData?.promotion || false,
      promo_start_date: initialData?.promo_start_date || null,
      promo_end_date: initialData?.promo_end_date || null,
      promo_price: initialData?.promo_price || null,
      
      // Optional fields for insert (quantities/last_cost)
      quantity_on_hand: initialData?.quantity_on_hand || 0,
      quantity_in_warehouse: initialData?.quantity_in_warehouse || 0,
      last_cost: initialData?.last_cost || values.cost_price,
    };
    onSubmit(data);
  };
  
  // Placeholder for image upload logic (sets a dummy URL)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to Supabase Storage and return a URL.
      // For now, we use a placeholder URL.
      const dummyUrl = URL.createObjectURL(file);
      form.setValue("image_data_url", dummyUrl);
    }
  };
  
  const handleRemoveImage = () => {
    form.setValue("image_data_url", null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stock_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Code</FormLabel>
                <FormControl>
                  <Input placeholder="SKU101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Electrical" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="stock_descr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Description</FormLabel>
              <FormControl>
                <Input placeholder="10m Copper Cable" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dimensions (Meters/Blocks/Lengths)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 10m" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <FormControl>
                  <Input placeholder="Supplier Name (Optional)" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h3 className="text-md font-semibold pt-2">Pricing</h3>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="cost_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Price (R)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="selling_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Price (C)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VAT (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <h3 className="text-md font-semibold pt-2">Price Categories</h3>
        <div className="grid grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="price_a"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price A (R)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price_b"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price B (R)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price_d"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price D (R)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price_e"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price E (R)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h3 className="text-md font-semibold pt-2">Stock Levels</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="min_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Stock Level</FormLabel>
                <FormControl>
                  <Input type="number" step="1" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Stock Level</FormLabel>
                <FormControl>
                  <Input type="number" step="1" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={form.watch("is_active")}
              onCheckedChange={(checked) => form.setValue("is_active", !!checked)}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              Item is Active
            </FormLabel>
            <p className="text-sm text-muted-foreground">
              Inactive items will not appear in sales or workflow lists.
            </p>
          </div>
        </FormItem>

        <FormItem>
          <FormLabel>Image</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-4">
              <Input
                id="image_upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button type="button" variant="outline" asChild>
                <label htmlFor="image_upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" /> Upload Image
                </label>
              </Button>
              
              {form.watch("image_data_url") ? (
                <div className="relative h-16 w-16">
                  <img
                    src={form.watch("image_data_url")!}
                    alt="Stock Preview"
                    className="h-full w-full object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-background/80 hover:bg-background"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="h-16 w-16 flex items-center justify-center rounded-md border bg-muted">
                  <Image className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Add Stock Item"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StockItemForm;