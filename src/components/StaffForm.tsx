"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Staff, StaffInsert, PayMethod } from "@/types/staff";

const payMethods: PayMethod[] = ['Daily', 'Weekly', 'Monthly'];

const staffSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  id_number: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  cell_number: z.string().nullable().optional(),
  pay_method: z.enum(['Daily', 'Weekly', 'Monthly']),
  rate: z.coerce.number().min(0, "Rate must be non-negative."),
  deductions: z.coerce.number().min(0, "Deductions must be non-negative.").default(0),
  advance: z.coerce.number().min(0, "Advance must be non-negative.").default(0),
  loans: z.coerce.number().min(0, "Loans must be non-negative.").default(0),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface StaffFormProps {
  initialData?: Staff;
  onSubmit: (data: StaffInsert) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      id_number: initialData?.id_number || "",
      address: initialData?.address || "",
      cell_number: initialData?.cell_number || "",
      pay_method: initialData?.pay_method || 'Daily',
      rate: initialData?.rate || 0,
      deductions: initialData?.deductions || 0,
      advance: initialData?.advance || 0,
      loans: initialData?.loans || 0,
    },
  });

  const handleSubmit = (values: StaffFormValues) => {
    // Calculate salary_total (simplified calculation for now)
    const salary_total = values.rate - values.deductions - values.loans + values.advance;

    const data: StaffInsert = {
      first_name: values.first_name,
      last_name: values.last_name,
      pay_method: values.pay_method,
      rate: values.rate,
      deductions: values.deductions,
      advance: values.advance,
      loans: values.loans,
      
      // Handle nullable fields
      id_number: values.id_number || null,
      address: values.address || null,
      cell_number: values.cell_number || null,
      
      salary_total: salary_total,
    };
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="id_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Number</FormLabel>
              <FormControl>
                <Input placeholder="ID Number" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cell_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cell Number</FormLabel>
              <FormControl>
                <Input placeholder="082 123 4567" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pay_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pay Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pay method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {payMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate (R)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h3 className="text-md font-semibold pt-2">Financial Adjustments</h3>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="deductions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deductions (R)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="advance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Advance (R)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loans"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loans (R)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Add Staff"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StaffForm;