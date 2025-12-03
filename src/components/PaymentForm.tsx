"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import { Customer } from "@/types/invoice";
import { PaymentInsert, PaymentMethod, AllocationType } from "@/types/payment";
import { useClients } from "@/hooks/use-clients";

const paymentMethods: PaymentMethod[] = ['Cash', 'EFT'];
const allocationTypes: AllocationType[] = ['Whole', 'Invoice'];

const paymentSchema = z.object({
  date: z.date({ required_error: "Date is required." }),
  customer_id: z.string().min(1, "Client is required."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero."),
  method: z.enum(['Cash', 'EFT']),
  allocation_type: z.enum(['Whole', 'Invoice']),
  // invoice_id is optional and currently unused for simplicity, but kept for future expansion
  invoice_id: z.string().nullable().optional(), 
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  customers: Customer[];
  onSubmit: (data: PaymentInsert) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  customers,
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  const { clients } = useClients(); // To get current balance for display

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      date: new Date(),
      customer_id: "",
      amount: 0,
      method: 'EFT',
      allocation_type: 'Whole',
      invoice_id: null,
    },
  });
  
  const selectedCustomerId = form.watch("customer_id");
  
  const selectedClient = useMemo(() => {
    return clients.find(c => c.id === selectedCustomerId);
  }, [selectedCustomerId, clients]);

  const handleSubmit = (values: PaymentFormValues) => {
    const data: PaymentInsert = {
      date: format(values.date, "yyyy-MM-dd"),
      customer_id: values.customer_id,
      amount: values.amount,
      method: values.method,
      allocation_type: values.allocation_type,
      invoice_id: values.invoice_id || null,
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
          name="customer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.customer_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {selectedClient && (
          <div className="text-sm text-muted-foreground">
            Current Balance Owing: <span className={`font-semibold ${selectedClient.current_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
              R{selectedClient.current_balance.toFixed(2)}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (R)</FormLabel>
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
          name="allocation_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allocation Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select allocation type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allocationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === 'Whole' ? 'Payment as a Whole (Updates Balance)' : 'Allocate to Specific Invoice (Future Feature)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Recording..." : "Record Payment"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;