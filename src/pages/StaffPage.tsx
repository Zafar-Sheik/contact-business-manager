"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, FileText, DollarSign, TrendingDown, Wallet } from "lucide-react";
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
import { useStaff } from "@/hooks/use-staff";
import { Staff, StaffInsert } from "@/types/staff";
import StaffForm from "@/components/StaffForm";
import Payslip from "@/components/Payslip";

const StaffPage: React.FC = () => {
  const { staff, isLoading, addStaff, updateStaff, deleteStaff, isAdding, isUpdating, isDeleting } = useStaff();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | undefined>(undefined);
  const [payslipStaff, setPayslipStaff] = useState<Staff | undefined>(undefined);

  const handleOpenForm = (staffMember?: Staff) => {
    setEditingStaff(staffMember);
    setIsFormOpen(true);
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
  const totalSalary = staff.reduce((sum, member) => sum + member.salary_total, 0);
  const totalDeductions = staff.reduce((sum, member) => sum + member.deductions, 0);
  const totalLoans = staff.reduce((sum, member) => sum + member.loans, 0);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-2">Staff Management</h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()}>
              <Plus className="h-4 w-4 mr-2" /> Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
              </DialogTitle>
            </DialogHeader>
            <StaffForm
              initialData={editingStaff}
              onSubmit={handleSubmit}
              isSubmitting={isAdding || isUpdating}
              onClose={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </header>
      
      {/* Summary Cards */}
      <div className="max-w-4xl mx-auto space-y-4 mb-6">
        <h2 className="text-xl font-semibold">Financial Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-sm font-medium">Total Net Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {isLoading ? (
                <Skeleton className="h-6 w-3/4" />
              ) : (
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(totalSalary)}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {isLoading ? (
                <Skeleton className="h-6 w-3/4" />
              ) : (
                <div className="text-xl font-bold text-red-600">
                  {formatCurrency(totalDeductions)}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {isLoading ? (
                <Skeleton className="h-6 w-3/4" />
              ) : (
                <div className="text-xl font-bold text-red-600">
                  {formatCurrency(totalLoans)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold">Staff List</h2>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : staff.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No staff members found. Start by adding one!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {staff.map((member) => (
              <Card key={member.id}>
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                  <CardTitle className="text-lg font-semibold">
                    {member.first_name} {member.last_name}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {member.pay_method} Rate: R{member.rate.toFixed(2)}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <p>
                      <span className="font-medium">Cell:</span>{" "}
                      {member.cell_number || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">ID No:</span>{" "}
                      {member.id_number || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Net Salary:</span>{" "}
                      <span className="font-bold text-green-600">R{member.salary_total.toFixed(2)}</span>
                    </p>
                    <p>
                      <span className="font-medium">Last Updated:</span>{" "}
                      {format(new Date(member.updated_at), "PPP")}
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenPayslip(member)}
                      disabled={isUpdating || isDeleting}
                    >
                      <FileText className="h-4 w-4 mr-1" /> Payslip
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenForm(member)}
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
                            This action cannot be undone. This will permanently delete the staff member: {member.first_name} {member.last_name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(member.id)}
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
      
      {/* Payslip Dialog */}
      <Dialog open={isPayslipOpen} onOpenChange={setIsPayslipOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Payslip Preview</DialogTitle>
          </DialogHeader>
          {payslipStaff && <Payslip staff={payslipStaff} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffPage;