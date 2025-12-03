"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  FileText,
  CheckCircle,
  Clock,
  Users,
  MapPin,
  DollarSign,
  TrendingUp,
  Filter,
  Download,
  ClipboardCheck,
  AlertCircle,
  Menu,
  X,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    undefined
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenForm = (workflow?: Workflow) => {
    setEditingWorkflow(workflow);
    setIsFormOpen(true);
    setMobileMenuOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingWorkflow(undefined);
  };

  const handleSubmit = (data: WorkflowSubmissionData) => {
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
    updateWorkflow({ id: workflow.id, status: "Invoiced" });
  };

  const getCustomerName = (customerId: string | null) => {
    if (!customerId) return "Walk-in Customer";
    return (
      customers.find((c) => c.id === customerId)?.customer_name ||
      "Unknown Client"
    );
  };

  const getStatusVariant = (status: Workflow["status"]) => {
    switch (status) {
      case "Completed":
        return {
          label: "Completed",
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "In Progress":
        return {
          label: "In Progress",
          className: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "Invoiced":
        return {
          label: "Invoiced",
          className: "bg-purple-100 text-purple-800 border-purple-200",
        };
      case "Pending":
      default:
        return {
          label: "Pending",
          className: "bg-amber-100 text-amber-800 border-amber-200",
        };
    }
  };

  // Calculate workflow statistics
  const totalWorkflows = workflows.length;
  const completedWorkflows = workflows.filter(
    (w) => w.status === "Completed"
  ).length;
  const inProgressWorkflows = workflows.filter(
    (w) => w.status === "In Progress"
  ).length;
  const totalEstimatedCost = workflows.reduce(
    (sum, workflow) => sum + workflow.estimated_cost,
    0
  );

  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9">
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Workflows</h1>
              <p className="text-xs text-gray-600">Manage service jobs</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-[320px] p-0">
                <SheetHeader className="p-4 border-b border-gray-200">
                  <SheetTitle>Workflow Actions</SheetTitle>
                </SheetHeader>
                <div className="p-2">
                  <Button
                    onClick={() => handleOpenForm()}
                    disabled={isLoading}
                    className="w-full justify-start h-11 mb-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
                    <Plus className="h-4 w-4 mr-3" />
                    Add Workflow
                  </Button>

                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 text-sm">
                      <Filter className="h-4 w-4 mr-3" />
                      Filter Workflows
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 text-sm">
                      <Download className="h-4 w-4 mr-3" />
                      Export Data
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 text-sm">
                      <Users className="h-4 w-4 mr-3" />
                      View Customers ({customers.length})
                    </Button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 px-2 mb-2">
                      Workflow Stats
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Workflows
                        </span>
                        <span className="font-semibold">{totalWorkflows}</span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">Completed</span>
                        <span className="font-semibold text-green-700">
                          {completedWorkflows}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          In Progress
                        </span>
                        <span className="font-semibold text-blue-700">
                          {inProgressWorkflows}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Estimated Value
                        </span>
                        <span className="font-semibold text-purple-700">
                          {formatCurrency(totalEstimatedCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block px-4 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="h-10 w-10 border-gray-200 hover:bg-gray-50">
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg">
                  <ClipboardCheck className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Workflow Management
                </h1>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Track jobs, allocate resources, and manage service workflows
              </p>
            </div>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <Button
              onClick={() => handleOpenForm()}
              disabled={isLoading}
              className="h-11 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium shadow-lg shadow-violet-500/20">
              <Plus className="h-4 w-4 mr-2" /> Add Workflow
            </Button>
            <DialogContent className="sm:max-w-[500px] p-0 border-0 max-h-[90vh] overflow-y-auto">
              <DialogHeader className="p-6 border-b border-gray-100">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {editingWorkflow ? "Edit Workflow" : "Add New Workflow"}
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <WorkflowForm
                  initialData={editingWorkflow}
                  customers={customers}
                  availableStock={stockItems}
                  onSubmit={handleSubmit}
                  isSubmitting={isAdding || isUpdating}
                  onClose={handleCloseForm}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-4 max-w-7xl mx-auto">
        {/* Mobile Add Button - Fixed at bottom */}
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <Button
            onClick={() => handleOpenForm()}
            disabled={isLoading}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-2xl shadow-violet-500/30">
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Workflow Summary Cards - Mobile Stacked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Workflows
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {totalWorkflows}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ClipboardCheck className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Completed</p>
                  <p className="text-xl font-bold text-green-700">
                    {completedWorkflows}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    In Progress
                  </p>
                  <p className="text-xl font-bold text-blue-700">
                    {inProgressWorkflows}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Estimated Value
                  </p>
                  <p className="text-xl font-bold text-purple-700">
                    {formatCurrency(totalEstimatedCost)}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <Card className="border-0 shadow-sm lg:shadow-lg">
            <CardContent className="p-0">
              <div className="p-4 lg:p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-violet-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <ClipboardCheck className="h-5 w-5 text-violet-600" />
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-800">
                      Service Workflows
                    </h3>
                    <Badge variant="outline" className="ml-2 bg-white text-xs">
                      {workflows.length}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Mobile Tabs */}
                    <TabsList className="lg:hidden bg-gray-100 p-1 rounded-lg">
                      <TabsTrigger
                        value="all"
                        className="rounded-md px-3 py-1.5 text-xs">
                        All
                      </TabsTrigger>
                      <TabsTrigger
                        value="progress"
                        className="rounded-md px-3 py-1.5 text-xs">
                        Progress
                      </TabsTrigger>
                      <TabsTrigger
                        value="completed"
                        className="rounded-md px-3 py-1.5 text-xs">
                        Completed
                      </TabsTrigger>
                    </TabsList>

                    <div className="hidden lg:flex items-center space-x-2">
                      <TabsList className="bg-gray-100 p-1 rounded-lg">
                        <TabsTrigger value="all" className="rounded-md">
                          All
                        </TabsTrigger>
                        <TabsTrigger value="progress" className="rounded-md">
                          In Progress
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="rounded-md">
                          Completed
                        </TabsTrigger>
                      </TabsList>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 border-gray-300">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 border-gray-300">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>

                    <div className="lg:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-9">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="text-sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter Workflows
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 lg:p-5">
                <TabsContent value="all" className="m-0">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 lg:h-24 w-full rounded-xl" />
                      <Skeleton className="h-20 lg:h-24 w-full rounded-xl" />
                      <Skeleton className="h-20 lg:h-24 w-full rounded-xl" />
                    </div>
                  ) : workflows.length === 0 ? (
                    <div className="text-center py-8 lg:py-12">
                      <div className="mx-auto w-14 h-14 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <ClipboardCheck className="h-6 lg:h-8 w-6 lg:w-8 text-gray-400" />
                      </div>
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">
                        No Workflows Found
                      </h3>
                      <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto px-4">
                        Start tracking your service jobs by adding workflows
                      </p>
                      <Button
                        onClick={() => handleOpenForm()}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-sm lg:text-base">
                        <Plus className="h-4 w-4 mr-2" /> Add First Workflow
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {workflows.map((workflow) => {
                        const statusBadge = getStatusVariant(workflow.status);
                        return (
                          <Card
                            key={workflow.id}
                            className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center space-x-3 lg:space-x-4">
                                  <div className="p-2 lg:p-3 bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl">
                                    <MapPin className="h-5 lg:h-6 w-5 lg:w-6 text-violet-600" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-2 gap-1 lg:gap-0">
                                      <h3 className="font-bold text-base lg:text-lg text-gray-900 truncate">
                                        {workflow.location}
                                      </h3>
                                      <Badge
                                        variant="outline"
                                        className={`mt-1 lg:mt-0 ${statusBadge.className} text-xs`}>
                                        {statusBadge.label}
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs lg:text-sm text-gray-600 mt-1">
                                      <span className="flex items-center">
                                        <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">
                                          {getCustomerName(
                                            workflow.customer_id
                                          )}
                                        </span>
                                      </span>
                                      <span className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">
                                          {format(
                                            new Date(workflow.date),
                                            "dd MMM"
                                          )}
                                        </span>
                                      </span>
                                      <span className="flex items-center">
                                        <DollarSign className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">
                                          Est:{" "}
                                          {formatCurrency(
                                            workflow.estimated_cost
                                          )}
                                        </span>
                                      </span>
                                    </div>
                                    {workflow.staff_allocated &&
                                      workflow.staff_allocated.length > 0 && (
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                          <Users className="h-3 w-3 mr-1" />
                                          Staff:{" "}
                                          {workflow.staff_allocated.join(", ")}
                                        </div>
                                      )}
                                  </div>
                                </div>

                                <div className="flex flex-col md:items-end space-y-2 mt-3 md:mt-0">
                                  <div className="flex items-center space-x-3">
                                    <div className="text-right">
                                      <div className="text-xs text-gray-500">
                                        Estimated Cost
                                      </div>
                                      <div className="text-lg font-bold text-purple-700">
                                        {formatCurrency(
                                          workflow.estimated_cost
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    {workflow.status !== "Invoiced" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleConvertToInvoice(workflow)
                                        }
                                        disabled={isUpdating || isDeleting}
                                        className="h-8 border-gray-300 text-xs">
                                        <FileText className="h-3 w-3 mr-1" />{" "}
                                        Convert
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleOpenForm(workflow)}
                                      disabled={isUpdating || isDeleting}
                                      className="h-8 border-gray-300">
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          disabled={isDeleting}
                                          className="h-8">
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="mx-4 max-w-md">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="text-base">
                                            Delete Workflow
                                          </AlertDialogTitle>
                                          <AlertDialogDescription className="text-sm">
                                            This action cannot be undone. This
                                            will permanently delete the
                                            workflow:
                                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                              <p className="font-semibold">
                                                {workflow.location}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                {getCustomerName(
                                                  workflow.customer_id
                                                )}{" "}
                                                •{" "}
                                                {format(
                                                  new Date(workflow.date),
                                                  "dd MMM yyyy"
                                                )}
                                              </p>
                                            </div>
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() =>
                                              handleDelete(workflow.id)
                                            }
                                            disabled={isDeleting}
                                            className="bg-red-600 hover:bg-red-700 text-sm">
                                            Delete Workflow
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="progress" className="m-0">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {workflows
                        .filter((w) => w.status === "In Progress")
                        .map((workflow) => {
                          const statusBadge = getStatusVariant(workflow.status);
                          return (
                            <Card
                              key={workflow.id}
                              className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 lg:space-x-4">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                      <Clock className="h-4 lg:h-5 w-4 lg:w-5 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                                        {workflow.location}
                                      </p>
                                      <p className="text-xs lg:text-sm text-gray-500 truncate">
                                        {getCustomerName(workflow.customer_id)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-blue-700">
                                      {formatCurrency(workflow.estimated_cost)}
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`${statusBadge.className} text-xs mt-1`}>
                                      {statusBadge.label}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="m-0">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {workflows
                        .filter((w) => w.status === "Completed")
                        .map((workflow) => {
                          const statusBadge = getStatusVariant(workflow.status);
                          return (
                            <Card
                              key={workflow.id}
                              className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 lg:space-x-4">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                      <CheckCircle className="h-4 lg:h-5 w-4 lg:w-5 text-green-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                                        {workflow.location}
                                      </p>
                                      <p className="text-xs lg:text-sm text-gray-500 truncate">
                                        {getCustomerName(workflow.customer_id)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-green-700">
                                      {formatCurrency(workflow.estimated_cost)}
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`${statusBadge.className} text-xs mt-1`}>
                                      {statusBadge.label}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  )}
                </TabsContent>
              </div>

              {/* Footer Summary */}
              {workflows.length > 0 && !isLoading && (
                <div className="border-t border-gray-100">
                  <div className="p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-violet-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-xs lg:text-sm font-medium text-gray-700">
                          {totalWorkflows} workflows • {completedWorkflows}{" "}
                          completed • {formatCurrency(totalEstimatedCost)} value
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs lg:text-sm font-medium text-gray-700">
                          Completion Rate:
                        </div>
                        <div className="text-base lg:text-lg font-bold text-green-700">
                          {(
                            (completedWorkflows / totalWorkflows) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Tabs>

        {/* Information Section - Mobile Stacked */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <ClipboardCheck className="h-4 w-4 text-violet-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Workflow Tips
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 mt-1 flex-shrink-0"></div>
                Update status regularly to track job progress
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-1 flex-shrink-0"></div>
                Convert completed workflows to invoices for billing
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2 mt-1 flex-shrink-0"></div>
                Use staff allocation to track resource utilization
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <AlertCircle className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Status Guide
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-2">
              <li className="flex items-center">
                <Badge
                  variant="outline"
                  className="mr-2 bg-amber-50 text-amber-700 border-amber-200 text-xs">
                  Pending
                </Badge>
                <span>Created but not started</span>
              </li>
              <li className="flex items-center">
                <Badge
                  variant="outline"
                  className="mr-2 bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  In Progress
                </Badge>
                <span>Work currently being performed</span>
              </li>
              <li className="flex items-center">
                <Badge
                  variant="outline"
                  className="mr-2 bg-green-50 text-green-700 border-green-200 text-xs">
                  Completed
                </Badge>
                <span>Work finished successfully</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Navigation Hint */}
        <div className="lg:hidden mt-6 text-center">
          <p className="text-xs text-gray-500">
            Tap on any workflow to view details
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage;
