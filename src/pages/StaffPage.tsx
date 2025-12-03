"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  TrendingDown,
  Wallet,
  Users,
  Briefcase,
  CreditCard,
  Calendar,
  User,
  Phone,
  BadgeCheck,
  TrendingUp,
  Filter,
  Download,
  Menu,
  X,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStaff } from "@/hooks/use-staff";
import { Staff, StaffInsert } from "@/types/staff";
import StaffForm from "@/components/StaffForm";
import Payslip from "@/components/Payslip";

const StaffPage: React.FC = () => {
  const {
    staff,
    isLoading,
    addStaff,
    updateStaff,
    deleteStaff,
    isAdding,
    isUpdating,
    isDeleting,
  } = useStaff();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | undefined>(
    undefined
  );
  const [payslipStaff, setPayslipStaff] = useState<Staff | undefined>(
    undefined
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenForm = (staffMember?: Staff) => {
    setEditingStaff(staffMember);
    setIsFormOpen(true);
    setMobileMenuOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingStaff(undefined);
  };

  const handleOpenPayslip = (staffMember: Staff) => {
    setPayslipStaff(staffMember);
    setIsPayslipOpen(true);
  };

  const handleClosePayslip = () => {
    setIsPayslipOpen(false);
    setPayslipStaff(undefined);
  };

  const handleSubmit = (data: StaffInsert) => {
    if (editingStaff) {
      updateStaff({ id: editingStaff.id, ...data });
    } else {
      addStaff(data);
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    deleteStaff(id);
  };

  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  // Calculate summary statistics
  const totalSalary = staff.reduce(
    (sum, member) => sum + member.salary_total,
    0
  );
  const totalDeductions = staff.reduce(
    (sum, member) => sum + member.deductions,
    0
  );
  const totalLoans = staff.reduce((sum, member) => sum + member.loans, 0);
  const avgSalary = staff.length > 0 ? totalSalary / staff.length : 0;
  const totalStaff = staff.length;
  const activeStaff = staff.length; // Assuming all staff are active

  // Helper function to get pay method badge
  const getPayMethodBadge = (method: string) => {
    switch (method.toLowerCase()) {
      case "hourly":
        return {
          label: "Hourly",
          className: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "monthly":
        return {
          label: "Monthly",
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "weekly":
        return {
          label: "Weekly",
          className: "bg-purple-100 text-purple-800 border-purple-200",
        };
      default:
        return {
          label: method,
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

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
              <h1 className="text-lg font-bold text-gray-900">Staff</h1>
              <p className="text-xs text-gray-600">Manage employees</p>
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
                  <SheetTitle>Staff Actions</SheetTitle>
                </SheetHeader>
                <div className="p-2">
                  <Button
                    onClick={() => handleOpenForm()}
                    disabled={isLoading}
                    className="w-full justify-start h-11 mb-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white">
                    <Plus className="h-4 w-4 mr-3" />
                    Add Staff
                  </Button>

                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 text-sm">
                      <Filter className="h-4 w-4 mr-3" />
                      Filter Staff
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
                      View All ({staff.length})
                    </Button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 px-2 mb-2">
                      Staff Stats
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Staff
                        </span>
                        <span className="font-semibold">{totalStaff}</span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Salary
                        </span>
                        <span className="font-semibold text-green-700">
                          {formatCurrency(totalSalary)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Deductions
                        </span>
                        <span className="font-semibold text-red-700">
                          {formatCurrency(totalDeductions)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Avg. Salary
                        </span>
                        <span className="font-semibold text-purple-700">
                          {formatCurrency(avgSalary)}
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
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Staff Management
                </h1>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Manage employee information, salaries, and payroll
              </p>
            </div>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <Button
              onClick={() => handleOpenForm()}
              disabled={isLoading}
              className="h-11 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium shadow-lg shadow-indigo-500/20">
              <Plus className="h-4 w-4 mr-2" /> Add Staff
            </Button>
            <DialogContent className="sm:max-w-[500px] p-0 border-0">
              <DialogHeader className="p-6 border-b border-gray-100">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <StaffForm
                  initialData={editingStaff}
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
            className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-2xl shadow-indigo-500/30">
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Staff Summary Cards - Mobile Stacked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Staff
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {totalStaff}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Salary
                  </p>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(totalSalary)}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Deductions
                  </p>
                  <p className="text-xl font-bold text-red-700">
                    {formatCurrency(totalDeductions)}
                  </p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Avg. Salary
                  </p>
                  <p className="text-xl font-bold text-purple-700">
                    {formatCurrency(avgSalary)}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <Card className="border-0 shadow-sm lg:shadow-lg">
            <CardContent className="p-0">
              <div className="p-4 lg:p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Briefcase className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-800">
                      Staff Directory
                    </h3>
                    <Badge variant="outline" className="ml-2 bg-white text-xs">
                      {staff.length}
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
                        value="hourly"
                        className="rounded-md px-3 py-1.5 text-xs">
                        Hourly
                      </TabsTrigger>
                      <TabsTrigger
                        value="monthly"
                        className="rounded-md px-3 py-1.5 text-xs">
                        Monthly
                      </TabsTrigger>
                    </TabsList>

                    <div className="hidden lg:flex items-center space-x-2">
                      <TabsList className="bg-gray-100 p-1 rounded-lg">
                        <TabsTrigger value="all" className="rounded-md">
                          All Staff
                        </TabsTrigger>
                        <TabsTrigger value="hourly" className="rounded-md">
                          Hourly
                        </TabsTrigger>
                        <TabsTrigger value="monthly" className="rounded-md">
                          Monthly
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
                            Filter Staff
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
                  ) : staff.length === 0 ? (
                    <div className="text-center py-8 lg:py-12">
                      <div className="mx-auto w-14 h-14 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-6 lg:h-8 w-6 lg:w-8 text-gray-400" />
                      </div>
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">
                        No Staff Members Found
                      </h3>
                      <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto px-4">
                        Start building your team by adding staff members
                      </p>
                      <Button
                        onClick={() => handleOpenForm()}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-sm lg:text-base">
                        <Plus className="h-4 w-4 mr-2" /> Add First Staff Member
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {staff.map((member) => {
                        const payMethodBadge = getPayMethodBadge(
                          member.pay_method
                        );
                        return (
                          <Card
                            key={member.id}
                            className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center space-x-3 lg:space-x-4">
                                  <div className="p-2 lg:p-3 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-xl">
                                    <User className="h-5 lg:h-6 w-5 lg:w-6 text-indigo-600" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-2 gap-1 lg:gap-0">
                                      <h3 className="font-bold text-base lg:text-lg text-gray-900 truncate">
                                        {member.first_name} {member.last_name}
                                      </h3>
                                      <Badge
                                        variant="outline"
                                        className={`mt-1 lg:mt-0 ${payMethodBadge.className} text-xs`}>
                                        {payMethodBadge.label}
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs lg:text-sm text-gray-600 mt-1">
                                      <span className="flex items-center">
                                        <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">
                                          {member.cell_number || "No phone"}
                                        </span>
                                      </span>
                                      <span className="flex items-center">
                                        <BadgeCheck className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">
                                          {member.id_number || "No ID"}
                                        </span>
                                      </span>
                                      <span className="flex items-center">
                                        <CreditCard className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">
                                          Rate: {formatCurrency(member.rate)}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col md:items-end space-y-2 mt-3 md:mt-0">
                                  <div className="text-right">
                                    <div className="text-xs text-gray-500">
                                      Net Salary
                                    </div>
                                    <div className="text-lg lg:text-xl font-bold text-green-700">
                                      {formatCurrency(member.salary_total)}
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleOpenPayslip(member)}
                                      disabled={isUpdating || isDeleting}
                                      className="h-8 border-gray-300 text-xs">
                                      <FileText className="h-3 w-3 mr-1" />{" "}
                                      Payslip
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleOpenForm(member)}
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
                                            Delete Staff Member
                                          </AlertDialogTitle>
                                          <AlertDialogDescription className="text-sm">
                                            This action cannot be undone. This
                                            will permanently delete the staff
                                            member:
                                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                              <p className="font-semibold">
                                                {member.first_name}{" "}
                                                {member.last_name}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                {member.cell_number ||
                                                  "No contact"}{" "}
                                                • ID:{" "}
                                                {member.id_number || "No ID"}
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
                                              handleDelete(member.id)
                                            }
                                            disabled={isDeleting}
                                            className="bg-red-600 hover:bg-red-700 text-sm">
                                            Delete Staff Member
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

                <TabsContent value="hourly" className="m-0">
                  <div className="text-center py-8 lg:py-12 text-gray-600 text-sm lg:text-base">
                    <p>Hourly staff will appear here</p>
                  </div>
                </TabsContent>

                <TabsContent value="monthly" className="m-0">
                  <div className="text-center py-8 lg:py-12 text-gray-600 text-sm lg:text-base">
                    <p>Monthly staff will appear here</p>
                  </div>
                </TabsContent>
              </div>

              {/* Footer Summary */}
              {staff.length > 0 && !isLoading && (
                <div className="border-t border-gray-100">
                  <div className="p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-indigo-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-xs lg:text-sm font-medium text-gray-700">
                          {activeStaff} active staff •{" "}
                          {formatCurrency(totalSalary)} monthly
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs lg:text-sm font-medium text-gray-700">
                          Financial Summary:
                        </div>
                        <div className="text-base lg:text-lg font-bold text-green-700">
                          {formatCurrency(
                            totalSalary - totalDeductions - totalLoans
                          )}{" "}
                          Net
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Tabs>

        {/* Additional Financial Summary - Mobile Optimized */}
        {staff.length > 0 && (
          <Card className="border-0 shadow-sm lg:shadow-lg mb-6">
            <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100 p-4 lg:p-6">
              <CardTitle className="text-base lg:text-lg font-semibold flex items-center">
                <Wallet className="h-5 w-5 text-red-600 mr-2" />
                Deductions & Loans
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl lg:text-3xl font-bold text-red-700">
                    {formatCurrency(totalDeductions)}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600 mt-1">
                    Total Deductions
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Tax, UIF, pension, etc.
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl lg:text-3xl font-bold text-amber-700">
                    {formatCurrency(totalLoans)}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600 mt-1">
                    Total Loans Owed
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Employee advances
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl lg:text-3xl font-bold text-green-700">
                    {formatCurrency(totalSalary - totalDeductions - totalLoans)}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600 mt-1">
                    Final Payout
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    After deductions & loans
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payslip Dialog - Mobile Optimized */}
        <Dialog open={isPayslipOpen} onOpenChange={setIsPayslipOpen}>
          <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto p-0 border-0">
            <DialogHeader className="p-4 lg:p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg lg:text-xl font-bold text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                  Payslip Preview
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClosePayslip}
                  className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            {payslipStaff && (
              <div className="p-4 lg:p-6">
                <Payslip staff={payslipStaff} />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Information Section - Mobile Stacked */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Briefcase className="h-4 w-4 text-indigo-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Staff Tips
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 mt-1 flex-shrink-0"></div>
                Verify ID numbers and contact info during onboarding
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-1 flex-shrink-0"></div>
                Use pay method badges to identify employee types quickly
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2 mt-1 flex-shrink-0"></div>
                Review deductions and loans for accurate payroll
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Payroll Info
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 mt-1 flex-shrink-0"></div>
                Green amounts show net salary after deductions
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2 mt-1 flex-shrink-0"></div>
                Red amounts indicate total deductions and loans
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-1 flex-shrink-0"></div>
                Use payslip preview to verify calculations before payment
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Navigation Hint */}
        <div className="lg:hidden mt-6 text-center">
          <p className="text-xs text-gray-500">
            Tap on any staff member to view details
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
