"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Upload,
  ImageIcon,
  X,
  Package,
  Tag,
  DollarSign,
  BarChart3,
  Layers,
  Truck,
  Shield,
  CheckCircle,
  AlertCircle,
  Percent,
  PackagePlus,
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
import { StockItem, StockItemInsert } from "@/types/stock";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const stockItemSchema = z.object({
  stock_code: z.string().min(1, "Code is required."),
  stock_descr: z.string().min(1, "Description is required."),
  category: z.string().min(1, "Category is required."),
  size: z.string().nullable().optional(),
  cost_price: z.coerce.number().min(0, "Cost price must be non-negative."),
  selling_price: z.coerce
    .number()
    .min(0, "Selling price (C) must be non-negative."),
  price_a: z.coerce.number().min(0).default(0),
  price_b: z.coerce.number().min(0).default(0),
  price_d: z.coerce.number().min(0).default(0),
  price_e: z.coerce.number().min(0).default(0),
  vat: z.coerce
    .number()
    .min(0)
    .max(100, "VAT must be between 0 and 100.")
    .default(15),
  supplier: z.string().nullable().optional(),
  min_level: z.coerce.number().min(0).default(0),
  max_level: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
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
      vat: initialData?.vat || 15,
      supplier: initialData?.supplier || "",
      min_level: initialData?.min_level || 0,
      max_level: initialData?.max_level || 0,
      is_active: initialData?.is_active ?? true,
      image_data_url: initialData?.image_data_url || "",
    },
  });

  const formValues = form.watch();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Calculate margin
  const margin =
    formValues.selling_price > 0
      ? ((formValues.selling_price - formValues.cost_price) /
          formValues.cost_price) *
        100
      : 0;

  const handleSubmit = (values: StockItemFormValues) => {
    const data: StockItemInsert = {
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

      size: values.size || null,
      supplier: values.supplier || null,
      image_data_url: values.image_data_url || null,

      promotion: initialData?.promotion || false,
      promo_start_date: initialData?.promo_start_date || null,
      promo_end_date: initialData?.promo_end_date || null,
      promo_price: initialData?.promo_price || null,

      quantity_on_hand: initialData?.quantity_on_hand || 0,
      quantity_in_warehouse: initialData?.quantity_in_warehouse || 0,
      last_cost: initialData?.last_cost || values.cost_price,
    };
    onSubmit(data);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue("image_data_url", result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    form.setValue("image_data_url", null);
    setImagePreview(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && formValues.stock_code && formValues.stock_descr) {
      e.preventDefault();
      form.handleSubmit(handleSubmit)();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {initialData ? "Edit Stock Item" : "Add New Stock Item"}
            </h1>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200">
              <Package className="h-3 w-3 mr-1" />
              Stock Item
            </Badge>
          </div>
          <p className="text-gray-600 text-sm">
            {initialData
              ? "Update product information and pricing"
              : "Add a new product to your inventory system"}
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Basic Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="stock_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Tag className="h-3.5 w-3.5 mr-1.5" />
                            Stock Code
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="SKU-001"
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              onKeyPress={handleKeyPress}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Tag className="h-3.5 w-3.5 mr-1.5" />
                            Category
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Electrical / Plumbing"
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              onKeyPress={handleKeyPress}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="stock_descr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                          <Package className="h-3.5 w-3.5 mr-1.5" />
                          Item Description
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="10m Copper Cable - 2.5mm"
                            className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            onKeyPress={handleKeyPress}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Dimensions / Size
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 10m, 50x50cm, 100ml"
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              onKeyPress={handleKeyPress}
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
                      name="supplier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Truck className="h-3.5 w-3.5 mr-1.5" />
                            Supplier
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Supplier Name (Optional)"
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              onKeyPress={handleKeyPress}
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

                {/* Pricing Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Pricing Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="cost_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                            Cost Price
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="h-11 pl-8 bg-gray-50 border-gray-200 focus:border-red-500 focus:ring-red-500"
                                onKeyPress={handleKeyPress}
                                {...field}
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                R
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="selling_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                            Selling Price (C)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="h-11 pl-8 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                onKeyPress={handleKeyPress}
                                {...field}
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                R
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Percent className="h-3.5 w-3.5 mr-1.5" />
                            VAT (%)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="15.00"
                                className="h-11 pr-8 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                onKeyPress={handleKeyPress}
                                {...field}
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                %
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Price Preview */}
                  {(formValues.cost_price > 0 ||
                    formValues.selling_price > 0) && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <BarChart3 className="h-4 w-4 text-green-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800">
                          Price Analysis
                        </h4>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Cost Price:</span>
                          <span className="font-medium text-red-600">
                            R{formValues.cost_price.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Selling Price:</span>
                          <span className="font-medium text-green-600">
                            R{formValues.selling_price.toFixed(2)}
                          </span>
                        </div>

                        <Separator className="my-2" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-800">
                            Gross Margin:
                          </span>
                          <span
                            className={`text-lg font-bold ${
                              margin >= 0 ? "text-green-700" : "text-red-700"
                            }`}>
                            {margin.toFixed(2)}%
                          </span>
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          {margin >= 0
                            ? `Profit: R${(
                                formValues.selling_price - formValues.cost_price
                              ).toFixed(2)}`
                            : "Selling below cost"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Categories */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Tag className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Price Categories
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="price_a"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Price A
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="h-11 pl-8 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                onKeyPress={handleKeyPress}
                                {...field}
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                R
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price_b"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Price B
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="h-11 pl-8 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                onKeyPress={handleKeyPress}
                                {...field}
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                R
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price_d"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Price D
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="h-11 pl-8 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                onKeyPress={handleKeyPress}
                                {...field}
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                R
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price_e"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Price E
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="h-11 pl-8 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                onKeyPress={handleKeyPress}
                                {...field}
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                R
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Stock Levels */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Layers className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Stock Levels
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="min_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Minimum Stock Level
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="1"
                              placeholder="0"
                              className="h-11 bg-gray-50 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                              onKeyPress={handleKeyPress}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="max_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Maximum Stock Level
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="1"
                              placeholder="0"
                              className="h-11 bg-gray-50 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                              onKeyPress={handleKeyPress}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <ImageIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Product Image
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <Input
                        id="image_upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-full sm:w-auto border-dashed border-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                        asChild>
                        <label
                          htmlFor="image_upload"
                          className="cursor-pointer flex items-center justify-center">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Product Image
                        </label>
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Supports JPG, PNG up to 5MB
                      </p>
                    </div>

                    <div className="relative">
                      {formValues.image_data_url || imagePreview ? (
                        <div className="relative h-32 w-32 rounded-lg overflow-hidden border-2 border-indigo-200">
                          <img
                            src={
                              formValues.image_data_url || imagePreview || ""
                            }
                            alt="Product Preview"
                            className="h-full w-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/80 hover:bg-white"
                            onClick={handleRemoveImage}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="h-32 w-32 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                          <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500 text-center px-2">
                            No image
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Shield className="h-5 w-5 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Item Status
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-gray-200 p-4 bg-white">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 data-[state=checked]:bg-green-600"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium text-gray-800">
                            Active Status
                          </FormLabel>
                          <p className="text-sm text-gray-600">
                            Active items appear in sales and search results
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="h-11 flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-purple-500/20">
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {initialData ? "Saving..." : "Adding..."}
                      </div>
                    ) : initialData ? (
                      "Save Changes"
                    ) : (
                      <>
                        <PackagePlus className="h-4 w-4 mr-2" />
                        Add Stock Item
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockItemForm;
