"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, FileText } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWorkflows } from "@/hooks/use-workflows";
import { Workflow, WorkflowInsert, WorkflowItemInsert } from "@/types/workflow";
import WorkflowForm from "@/components/WorkflowForm";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

// Define the combined type for submission
type WorkflowSubmissionData = WorkflowInsert & { items: WorkflowItemInsert[] };

const WorkflowPage: React.FC = () => {
  const {
    workflows,
    customers,
    stockItems,
    isLoading,
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
    isAdding,
    isUpdating,
    isDeleting,
  } = useWorkflows();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | undefined>(
    undefined,
  );

  const handleOpenForm = (workflow?: Workflow) => {
    setEditingWorkflow(workflow);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingWorkflow(undefined);
  };

  const handleSubmit = (data: WorkflowSubmissionData) => {
    // NOTE: We are currently ignoring data.items in the mutation functions 
    // (see useWorkflows.ts) because we haven't implemented the API logic 
    // to insert/update workflow_items yet.
    if (editingWorkflow) {
      updateWorkflow({ id: editingWorkflow.id, ...data });
    } else {
      addWorkflow(data);
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    deleteWorkflow(id);
  };
  
  const handleConvertToInvoice = (workflow: Workflow) => {
    updateWorkflow({ id: workflow.id, status: 'Invoiced' });
  };

  const getCustomerName = (customerId: string | null) => {
    if (!customerId) return "N/A";
    return customers.find(c => c.id === customerId)?.customer_name || "Unknown Client";
  };
  
  const getStatusVariant = (status: Workflow['status']) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Invoiced':
        return 'outline';
      case 'Pending':
      default:
        return 'destructive';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-2">Workflow Management</h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()}>
              <Plus className="h-4 w-4 mr-2" /> Add Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingWorkflow ? "Edit Workflow" : "Add New Workflow"}
              </DialogTitle>
            </DialogHeader>
            <WorkflowForm
              initialData={editingWorkflow}
              customers={customers}
              availableStock={stockItems}
              onSubmit={handleSubmit}
              isSubmitting={isAdding || isUpdating}
              onClose={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </header>

      <div className="max-w-4xl mx-auto space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : workflows.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No workflows found. Start by adding one!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                  <CardTitle className="text-lg font-semibold">
                    {workflow.location}
                  </CardTitle>
                  <Badge variant={getStatusVariant(workflow.status)}>
                    {workflow.status}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {format(new Date(workflow.date), "PPP")}
                    </p>
                    <p>
                      <span className="font-medium">Client:</span>{" "}
                      {getCustomerName(workflow.customer_id)}
                    </p>
                    <p>
                      <span className="font-medium">Estimated Cost:</span> R
                      {workflow.estimated_cost.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Staff:</span>{" "}
                      {workflow.staff_allocated?.join(", ") || "None"}
                    </p>
                    {/* Placeholder for Stock Qty Total - still 0 as we don't fetch items yet */}
                    <p className="col-span-2">
                      <span className="font-medium">Stock Qty Total:</span> 0 (Requires Item Management)
                    </p>
                  </div>
                  
                  <Separator className="my-2" />

                  <div className="flex justify-end space-x-2">
                    {workflow.status !== 'Invoiced' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConvertToInvoice(workflow)}
                        disabled={isUpdating || isDeleting}
                      >
                        <FileText className="h-4 w-4 mr-1" /> Convert to Invoice
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenForm(workflow)}
                      disabled={isUpdating || isDeleting}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isDeleting}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the workflow.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(workflow.id)}
                            disabled={isDeleting}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowPage;