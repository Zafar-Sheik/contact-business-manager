"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Supplier, SupplierInsert } from "@/types/supplier";

const supplierSchema = z.object({
  supplier_name: z.string().min(1, "Supplier Name is required."),
  supplier_code: z.string().min(1, "Supplier Code is required."),
  address: z.string().nullable().optional(),
  cell_number: z.string().nullable().optional(),
  contra: z.string().nullable().optional(),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  initialData?: Supplier;
  onSubmit: (data: SupplierInsert) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      supplier_name: initialData?.supplier_name || "",
      supplier_code: initialData?.supplier_code || "",
      address: initialData?.address || "",
      cell_number: initialData?.cell_number || "",
      contra: initialData?.contra || "",
    },
  });

  const handleSubmit = (values: SupplierFormValues) => {
    const data: SupplierInsert = {
      supplier_name: values.supplier_name,
      supplier_code: values.supplier_code,
      
      // Handle nullable fields
      address: values.address || null,
      cell_number: values.cell_number || null,
      contra: values.contra || null,
      
      // Preserve existing balances or default to 0
      current_balance: initialData?.current_balance || 0,
      ageing_balance: initialData?.ageing_balance || 0,
    };
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="supplier_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier Code</FormLabel>
                <FormControl>
                  <Input placeholder="SUP001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supplier_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier Name</FormLabel>
                <FormControl>
                  <Input placeholder="Supplier Corp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Industrial Area" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cell_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cell No</FormLabel>
                <FormControl>
                  <Input placeholder="082 123 4567" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contra Account</FormLabel>
                <FormControl>
                  <Input placeholder="Optional Contra Account" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {initialData && (
          <div className="pt-2 text-sm text-muted-foreground border-t pt-4">
            <p>Current Balance Owing: R{initialData.current_balance.toFixed(2)}</p>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Add Supplier"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SupplierForm;