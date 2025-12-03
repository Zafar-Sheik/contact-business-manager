"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";

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
import { Workflow, WorkflowInsert, WorkflowItemInsert } from "@/types/workflow";
import WorkflowItemManager from "./WorkflowItemManager";
import { StockItemForInvoice } from "@/types/invoice"; // Use the consistent type

// Define StockItem type locally for component use
interface StockItem extends StockItemForInvoice {}

const workflowSchema = z.object({
  date: z.date({ required_error: "Date is required." }),
  customer_id: z.string().nullable().optional(),
  location: z.string().min(1, "Location is required."),
  estimated_cost: z.coerce.number().min(0, "Cost must be non-negative."),
  staff_allocated: z.array(z.string()).optional().nullable(),
  status: z.enum(['Pending', 'In Progress', 'Completed', 'Invoiced']).default('Pending'),
});

type WorkflowFormValues = z.infer<typeof workflowSchema>;

interface Customer {
  id: string;
  customer_name: string;
}

interface WorkflowFormProps {
  initialData?: Workflow;
  customers: Customer[];
  availableStock: StockItem[];
  onSubmit: (data: WorkflowInsert) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const WorkflowForm: React.FC<WorkflowFormProps> = ({
  initialData,
  customers,
  availableStock,
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  // NOTE: Since we don't have a way to fetch initial WorkflowItems yet, 
  // we initialize items as empty for editing existing workflows too.
  const [workflowItems, setWorkflowItems] = useState<WorkflowItemInsert[]>([]); 

  const form = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      date: initialData ? new Date(initialData.date) : new Date(),
      customer_id: initialData?.customer_id || "",
      location: initialData?.location || "",
      estimated_cost: initialData?.estimated_cost || 0,
      staff_allocated: initialData?.staff_allocated || [],
      status: initialData?.status || 'Pending',
    },
  });

  const [staffInput, setStaffInput] = useState("");
  const staffAllocated = form.watch("staff_allocated") || [];

  const handleAddStaff = () => {
    if (staffInput.trim() && !staffAllocated.includes(staffInput.trim())) {
      form.setValue("staff_allocated", [...staffAllocated, staffInput.trim()]);
      setStaffInput("");
    }
  };

  const handleRemoveStaff = (staffName: string) => {
    form.setValue(
      "staff_allocated",
      staffAllocated.filter((name) => name !== staffName),
    );
  };

  const handleSubmit = (values: WorkflowFormValues) => {
    const data: WorkflowInsert = {
      ...values,
      date: format(values.date, "yyyy-MM-dd"),
      customer_id: values.customer_id || null,
      location: values.location, // Explicitly ensure location is treated as string
      staff_allocated: values.staff_allocated?.filter(Boolean) || null,
      items: workflowItems, // Include items in the submission data
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
                defaultValue={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client (Optional)" />
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Job location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimated_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Cost (R)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Invoiced">Invoiced</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Staff Allocated</FormLabel>
          <div className="flex space-x-2">
            <Input
              placeholder="Staff name"
              value={staffInput}
              onChange={(e) => setStaffInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddStaff();
                }
              }}
            />
            <Button type="button" onClick={handleAddStaff} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {staffAllocated.map((staff) => (
              <div
                key={staff}
                className="flex items-center bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full"
              >
                {staff}
                <button
                  type="button"
                  onClick={() => handleRemoveStaff(staff)}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </FormItem>
        
        <WorkflowItemManager
          items={workflowItems}
          setItems={setWorkflowItems}
          availableStock={availableStock}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Add Workflow"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WorkflowForm;