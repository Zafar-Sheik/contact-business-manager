"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, DollarSign, MessageCircle } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { usePayments } from "@/hooks/use-payments";
import { useClients } from "@/hooks/use-clients";
import { Payment, PaymentInsert } from "@/types/payment";
import PaymentForm from "@/components/PaymentForm";
import PaymentActions from "@/components/PaymentActions";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const PaymentsPage: React.FC = () => {
  const { payments, isLoading, addPayment, isAdding } = usePayments();
  const { clients, isLoading: isClientsLoading } = useClients();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>(undefined);

  const customers = clients.map(c => ({
    id: c.id,
    customer_name: c.customer_name,
    phone_number: c.phone_number,
  }));

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = (data: PaymentInsert) => {
    addPayment(data);
    handleCloseForm();
  };
  
  const handleOpenDetail = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailOpen(true);
  };
  
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedPayment(undefined);
  };

  const getCustomerDetails = (customerId: string | null) => {
    return clients.find(c => c.id === customerId);
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
          <h1 className="text-2xl font-bold ml-2">Payments</h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsFormOpen(true)} disabled={isLoading || isClientsLoading}>
              <Plus className="h-4 w-4 mr-2" /> Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <PaymentForm
              customers={customers}
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
              No payments recorded yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => {
              const customer = getCustomerDetails(payment.customer_id);
              return (
                <Card 
                  key={payment.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleOpenDetail(payment)}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="font-semibold text-lg">
                        {customer?.customer_name || "Unknown Client"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(payment.date), "PPP")} | {payment.method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(payment.amount)}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        {payment.allocation_type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Payment Detail Dialog (for actions) */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-bold mb-2">Payment Details</h3>
                <Separator className="mb-3" />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="font-medium">Client:</p>
                  <p className="text-right">{getCustomerDetails(selectedPayment.customer_id)?.customer_name || 'N/A'}</p>
                  
                  <p className="font-medium">Date:</p>
                  <p className="text-right">{format(new Date(selectedPayment.date), 'PPP')}</p>
                  
                  <p className="font-medium">Method:</p>
                  <p className="text-right">{selectedPayment.method}</p>
                  
                  <p className="font-medium">Allocation:</p>
                  <p className="text-right">{selectedPayment.allocation_type}</p>
                  
                  <div className="col-span-2 border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                    <span>Amount Received:</span>
                    <span className="text-green-600">{formatCurrency(selectedPayment.amount)}</span>
                  </div>
                </div>
              </Card>
              <PaymentActions 
                payment={selectedPayment} 
                customer={getCustomerDetails(selectedPayment.customer_id)} 
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsPage;