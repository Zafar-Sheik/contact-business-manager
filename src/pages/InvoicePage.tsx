"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useInvoices } from "@/hooks/use-invoices";
import { Invoice, InvoiceInsert } from "@/types/invoice";
import InvoiceForm from "@/components/InvoiceForm";
import InvoiceTable from "@/components/InvoiceTable";
import InvoiceDetailView from "@/components/InvoiceDetailView";

const InvoicePage: React.FC = () => {
  const { invoices, customers, stockItems, profile, config, isLoading, addInvoice, updateInvoice, isAdding, isUpdating, nextInvoiceNo } = useInvoices();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>(undefined);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>(undefined); // State for editing

  const handleOpenForm = (invoice?: Invoice) => {
    setEditingInvoice(invoice);
    setIsFormOpen(true);
    setIsDetailOpen(false); // Close detail view if open
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingInvoice(undefined);
  };
  
  const handleOpenDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailOpen(true);
  };
  
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedInvoice(undefined);
  };

  const handleSubmit = (data: InvoiceInsert & { id?: string }) => {
    if (data.id) {
      // Update flow
      updateInvoice(data as any); // Cast needed because InvoiceUpdateData expects id: string
    } else {
      // Creation flow
      addInvoice(data);
    }
    handleCloseForm();
  };
  
  const getCustomerDetails = (customerId: string | null) => {
    return customers.find(c => c.id === customerId);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/financial-hub">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-2">Invoices</h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" /> Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
              </DialogTitle>
            </DialogHeader>
            <InvoiceForm
              initialData={editingInvoice} // Pass initial data for editing
              customers={customers}
              availableStock={stockItems}
              onSubmit={handleSubmit}
              isSubmitting={isAdding || isUpdating}
              onClose={handleCloseForm}
              nextInvoiceNo={nextInvoiceNo}
            />
          </DialogContent>
        </Dialog>
      </header>

      <div className="max-w-4xl mx-auto space-y-4">
        <InvoiceTable
          invoices={invoices}
          customers={customers}
          isLoading={isLoading}
          onViewDetails={handleOpenDetail}
        />
      </div>
      
      {/* Invoice Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="w-[95vw] max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <InvoiceDetailView
              invoice={selectedInvoice}
              customer={getCustomerDetails(selectedInvoice.customer_id)}
              companyProfile={profile} // Pass profile
              appConfig={config} // Pass config
              onEdit={() => handleOpenForm(selectedInvoice)} // Pass edit handler
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoicePage;