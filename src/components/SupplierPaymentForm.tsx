"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { SupplierPaymentInsert, SupplierPaymentMethod } from "@/types/supplier-payment";
import { Supplier } from "@/types/supplier";

const paymentMethods: SupplierPaymentMethod[] = ['Cash', 'EFT'];

// Simplified Supplier type for form context
interface SupplierForForm extends Pick<Supplier, 'id' | 'supplier_name' | 'current_balance'> {}

const supplierPaymentSchema = z.object({
  date: z.date({ required_error: "Date is required." }),
  supplier_id: z.string().min(1, "Supplier is required."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero."),
  method: z.enum(['Cash', 'EFT']),
  reference: z.string().nullable().optional(),
});

type SupplierPaymentFormValues = z.infer<typeof supplierPaymentSchema>;

interface SupplierPaymentFormProps {
  suppliers: SupplierForForm[];
  onSubmit: (data: SupplierPaymentInsert) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const SupplierPaymentForm: React.FC<SupplierPaymentFormProps> = ({
  suppliers,
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  const form = useForm<SupplierPaymentFormValues>({
    resolver: zodResolver(supplierPaymentSchema),
    defaultValues: {
      date: new Date(),
      supplier_id: "",
      amount: 0,
      method: 'EFT',
      reference: "",
    },
  });
  
  const selectedSupplierId = form.watch("supplier_id");
  
  const selectedSupplier = useMemo(() => {
    return suppliers.find(s => s.id === selectedSupplierId);
  }, [selectedSupplierId, suppliers]);

  const handleSubmit = (values: SupplierPaymentFormValues) => {
    const data: SupplierPaymentInsert = {
      date: format(values.date, "yyyy-MM-dd"),
      supplier_id: values.supplier_id,
      amount: values.amount,
      method: values.method,
      reference: values.reference || null,
    };
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                defaultValue={field.value}
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
        
        {selectedSupplier && (
          <div className="text-sm text-muted-foreground">
            Current Balance Owing: <span className={`font-semibold ${selectedSupplier.current_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(selectedSupplier.current_balance)}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Paid (R)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentMethods.map((method) => (
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
        </div>
        
        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="EFT Ref / Cheque No" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Recording...
              </>
            ) : (
              "Record Payment"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SupplierPaymentForm;