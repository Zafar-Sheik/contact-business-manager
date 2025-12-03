"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, PackageCheck } from "lucide-react";
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
import { useGrvs } from "@/hooks/use-grvs";
import { Grv, GrvInsert } from "@/types/grv";
import GrvForm from "@/components/GrvForm";
import { Separator } from "@/components/ui/separator";

const GrvsPage: React.FC = () => {
  const { grvs, suppliers, stockItems, isLoading, addGrv, isAdding } = useGrvs();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = (data: GrvInsert) => {
    addGrv(data);
    handleCloseForm();
  };
  
  const getSupplierName = (supplierId: string | null) => {
    return suppliers.find(s => s.id === supplierId)?.supplier_name || "N/A";
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
          <h1 className="text-2xl font-bold ml-2">Goods Received Vouchers (GRVs)</h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsFormOpen(true)} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" /> Record GRV
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record New GRV</DialogTitle>
            </DialogHeader>
            <GrvForm
              suppliers={suppliers}
              availableStock={stockItems as any} // Cast to match the extended type in the form
              onSubmit={handleSubmit}
              isSubmitting={isAdding}
              onClose={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </header>

      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold mb-4">Recent GRVs</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : grvs.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No GRVs recorded yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {grvs.map((grv) => (
              <Card key={grv.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-semibold text-lg flex items-center">
                        <PackageCheck className="h-5 w-5 mr-2 text-primary" />
                        GRV Ref: {grv.reference}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supplier: {getSupplierName(grv.supplier_id)}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">{format(new Date(grv.date), "PPP")}</p>
                      {grv.order_no && <p className="text-xs text-muted-foreground">Order No: {grv.order_no}</p>}
                    </div>
                  </div>
                  
                  {grv.note && (
                    <>
                      <Separator />
                      <p className="text-sm italic text-muted-foreground">Note: {grv.note}</p>
                    </>
                  )}
                  
                  {/* Placeholder for GRV Item Summary/Details */}
                  <div className="pt-2 text-sm text-right">
                    <Button variant="link" size="sm" disabled>
                      View Items (Future Feature)
                    </Button>
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

export default GrvsPage;