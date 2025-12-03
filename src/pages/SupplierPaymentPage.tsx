"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, DollarSign } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSupplierPayments } from "@/hooks/use-supplier-payments";
import { SupplierPaymentInsert } from "@/types/supplier-payment";
import SupplierPaymentForm from "@/components/SupplierPaymentForm";
import { Separator } from "@/components/ui/separator";

const SupplierPaymentPage: React.FC = () => {
  const { payments, suppliers, isLoading, addPayment, isAdding } = useSupplierPayments();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = (data: SupplierPaymentInsert) => {
    addPayment(data);
    handleCloseForm();
  };
  
  const getSupplierName = (supplierId: string | null) => {
    return suppliers.find(s => s.id === supplierId)?.supplier_name || "Unknown Supplier";
  };
  
  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/financial-hub">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-2">Supplier Payments</h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsFormOpen(true)} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" /> Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Record Payment to Supplier</DialogTitle>
            </DialogHeader>
            <SupplierPaymentForm
              suppliers={suppliers}
              onSubmit={handleSubmit}
              isSubmitting={isAdding}
              onClose={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </header>

      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : payments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No supplier payments recorded yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">
                      {getSupplierName(payment.supplier_id)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(payment.date), "PPP")} | {payment.method}
                    </p>
                    {payment.reference && (
                      <p className="text-xs text-muted-foreground">Ref: {payment.reference}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-red-600">
                      - {formatCurrency(payment.amount)}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <DollarSign className="h-4 w-4 mr-1" /> Paid
                    </div>
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

export default SupplierPaymentPage;