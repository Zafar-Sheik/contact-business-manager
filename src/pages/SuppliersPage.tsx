"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, FileText, Truck } from "lucide-react";
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
import { useSuppliers } from "@/hooks/use-suppliers";
import { Supplier, SupplierInsert } from "@/types/supplier";
import SupplierForm from "@/components/SupplierForm";
import { Separator } from "@/components/ui/separator";

const SuppliersPage: React.FC = () => {
  const { suppliers, isLoading, addSupplier, updateSupplier, deleteSupplier, isAdding, isUpdating, isDeleting } = useSuppliers();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(undefined);

  const handleOpenForm = (supplier?: Supplier) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSupplier(undefined);
  };

  const handleSubmit = (data: SupplierInsert) => {
    if (editingSupplier) {
      updateSupplier({ id: editingSupplier.id, ...data });
    } else {
      addSupplier(data);
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    deleteSupplier(id);
  };
  
  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-2">Suppliers</h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()}>
              <Plus className="h-4 w-4 mr-2" /> Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
              </DialogTitle>
            </DialogHeader>
            <SupplierForm
              initialData={editingSupplier}
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
        ) : suppliers.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No suppliers found. Start by adding one!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {suppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                  <CardTitle className="text-lg font-semibold">
                    {supplier.supplier_name} ({supplier.supplier_code})
                  </CardTitle>
                  <div className={`text-lg font-bold ${supplier.current_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(supplier.current_balance)}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                    <p>
                      <span className="font-medium">Cell No:</span>{" "}
                      {supplier.cell_number || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Ageing Balance:</span>{" "}
                      {formatCurrency(supplier.ageing_balance || 0)}
                    </p>
                    <p className="col-span-2">
                      <span className="font-medium">Address:</span>{" "}
                      {supplier.address || 'N/A'}
                    </p>
                  </div>
                  
                  <Separator className="my-3" />

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      {/* Link to GRVs page in Financial Hub */}
                      <Link to="/financial-hub/grvs">
                        <Truck className="h-4 w-4 mr-1" /> GRVs
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenForm(supplier)}
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
                            This action cannot be undone. This will permanently delete the supplier: {supplier.supplier_name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(supplier.id)}
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

export default SuppliersPage;