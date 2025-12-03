"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { QuoteInsert, QuoteItemInsert, Customer, StockItemForInvoice } from "@/types/quote";
import QuoteItemManager from "./QuoteItemManager";

const quoteSchema = z.object({
  quote_no: z.string().min(1, "Quote number is required."),
  date: z.date({ required_error: "Date is required." }),
  customer_id: z.string().min(1, "Client is required."),
  work_scope: z.string().nullable().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

interface QuoteFormProps {
  customers: Customer[];
  availableStock: StockItemForInvoice[];
  onSubmit: (data: QuoteInsert) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  customers,
  availableStock,
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  const [quoteItems, setQuoteItems] = useState<QuoteItemInsert[]>([]); 

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      quote_no: "",
      date: new Date(),
      customer_id: "",
      work_scope: "",
    },
  });

  const handleSubmit = (values: QuoteFormValues) => {
    if (quoteItems.length === 0) {
      alert("Please add at least one item to the quote.");
      return;
    }
    
    const data: QuoteInsert = {
      quote_no: values.quote_no,
      date: format(values.date, "yyyy-MM-dd"),
      customer_id: values.customer_id,
      work_scope: values.work_scope || null,
      items: quoteItems,
      status: 'Draft',
    };
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quote_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quote No.</FormLabel>
                <FormControl>
                  <Input placeholder="QTE-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>

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

        <FormField
          control={form.control}
          name="work_scope"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Scope / Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief description of work required..." {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <QuoteItemManager
          items={quoteItems}
          setItems={setQuoteItems}
          availableStock={availableStock}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Quote"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuoteForm;