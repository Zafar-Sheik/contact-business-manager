"use client";

import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Invoice, InvoiceInsert, InvoiceItemInsert, Customer, StockItemForInvoice } from "@/types/invoice";
import InvoiceItemManager from "./InvoiceItemManager";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useInvoices } from "@/hooks/use-invoices"; // Import hook to access fetchInvoiceItems

const invoiceSchema = z.object({
  invoice_no: z.string().min(1, "Invoice number is required."),
  date: z.date({ required_error: "Date is required." }),
  customer_id: z.string().min(1, "Client is required."),
  work_scope: z.string().nullable().optional(),
  is_vat_invoice: z.enum(["true", "false"], { required_error: "VAT status is required." }),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  initialData?: Invoice; // Added for editing
  customers: Customer[];
  availableStock: StockItemForInvoice[];
  onSubmit: (data: InvoiceInsert & { id?: string }) => void; // Updated onSubmit signature
  isSubmitting: boolean;
  onClose: () => void;
  nextInvoiceNo: string;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialData,
  customers,
  availableStock,
  onSubmit,
  isSubmitting,
  onClose,
  nextInvoiceNo,
}) => {
  const { fetchInvoiceItems } = useInvoices();
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemInsert[]>([]); 
  const [isConfirmingUpdate, setIsConfirmingUpdate] = useState(false);
  const [pendingData, setPendingData] = useState<InvoiceInsert | null>(null);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoice_no: initialData?.invoice_no || nextInvoiceNo,
      date: initialData ? new Date(initialData.date) : new Date(),
      customer_id: initialData?.customer_id || "",
      work_scope: initialData?.work_scope || "",
      is_vat_invoice: initialData?.is_vat_invoice ? "true" : "false",
    },
  });
  
  const isVatInvoice = form.watch("is_vat_invoice") === "true";
  
  // Effect to load items if editing
  useEffect(() => {
    if (initialData) {
      // Load items for editing
      fetchInvoiceItems(initialData.id).then(items => {
        const inserts: InvoiceItemInsert[] = items.map(item => ({
          stock_item_id: item.stock_item_id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          vat_rate: item.vat_rate,
        }));
        setInvoiceItems(inserts);
      }).catch(error => {
        console.error("Failed to load invoice items:", error);
      });
    } else {
      setInvoiceItems([]);
    }
  }, [initialData, fetchInvoiceItems]);

  const handleFinalSubmit = (data: InvoiceInsert) => {
    // This function is called after confirmation (if updating) or directly (if creating)
    if (initialData) {
      onSubmit({ id: initialData.id, ...data });
    } else {
      onSubmit(data);
    }
  };

  const handleFormSubmit = (values: InvoiceFormValues) => {
    if (invoiceItems.length === 0) {
      alert("Please add at least one item to the invoice.");
      return;
    }
    
    const data: InvoiceInsert = {
      invoice_no: values.invoice_no,
      date: format(values.date, "yyyy-MM-dd"),
      customer_id: values.customer_id,
      work_scope: values.work_scope || null,
      items: invoiceItems,
      status: initialData?.status || 'Draft', // Preserve status if editing
      is_vat_invoice: values.is_vat_invoice === "true",
    };
    
    if (initialData) {
      // Editing existing invoice: trigger confirmation
      setPendingData(data);
      setIsConfirmingUpdate(true);
    } else {
      // Creating new invoice: submit directly
      handleFinalSubmit(data);
    }
  };
  
  const handleConfirmUpdate = (toolsReturned: boolean) => {
    if (pendingData) {
      // If tools returned is No, we might want to adjust the status or add a note, 
      // but for now, we proceed with the update regardless of the answer, 
      // as the user only requested the question.
      
      // If we wanted to enforce 'No' prevents update, we would stop here.
      
      handleFinalSubmit(pendingData);
      setPendingData(null);
    }
    setIsConfirmingUpdate(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="invoice_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice No. {initialData ? "" : "(Auto-Generated)"}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!!initialData} className={cn(!!initialData && "bg-muted/50")} />
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
            name="is_vat_invoice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select invoice type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">VAT Invoice</SelectItem>
                    <SelectItem value="false">Non-VAT Invoice</SelectItem>
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
                  <Textarea placeholder="Brief description of work done..." {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <InvoiceItemManager
            items={invoiceItems}
            setItems={setInvoiceItems}
            availableStock={availableStock}
            isVatInvoice={isVatInvoice}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : initialData ? (
                "Save Changes"
              ) : (
                "Create Invoice"
              )}
            </Button>
          </div>
        </form>
      </Form>
      
      {/* Confirmation Dialog for Updates */}
      <AlertDialog open={isConfirmingUpdate} onOpenChange={setIsConfirmingUpdate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Invoice Update</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-bold text-lg text-red-600">IS ALL TOOLS RETURNED BACK?</span>
              <p className="mt-2">Confirming this action will save the invoice changes.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleConfirmUpdate(false)}>No</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleConfirmUpdate(true)}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InvoiceForm;