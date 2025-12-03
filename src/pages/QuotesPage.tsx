"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuotes } from "@/hooks/use-quotes";
import { Quote, QuoteInsert } from "@/types/quote";
import QuoteForm from "@/components/QuoteForm";
import QuoteTable from "@/components/QuoteTable";
import QuoteDetailView from "@/components/QuoteDetailView";

const QuotesPage: React.FC = () => {
  const {
    quotes,
    customers,
    stockItems,
    profile,
    config,
    isLoading,
    addQuote,
    isAdding,
  } = useQuotes();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | undefined>(
    undefined
  );

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleOpenDetail = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedQuote(undefined);
  };

  const handleSubmit = (data: QuoteInsert) => {
    addQuote(data);
    handleCloseForm();
  };

  const getCustomerDetails = (customerId: string | null) => {
    return customers.find((c) => c.id === customerId);
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
          <h1 className="text-2xl font-bold ml-2">Quotes</h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsFormOpen(true)} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" /> Create Quote
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Quote</DialogTitle>
            </DialogHeader>
            <QuoteForm
              customers={customers}
              availableStock={stockItems}
              onSubmit={handleSubmit}
              isSubmitting={isAdding}
              onClose={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </header>

      <div className="max-w-4xl mx-auto space-y-4">
        <QuoteTable
          quotes={quotes}
          customers={customers}
          isLoading={isLoading}
          onViewDetails={handleOpenDetail}
        />
      </div>

      {/* Quote Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quote Details</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <QuoteDetailView
              quote={selectedQuote}
              customer={getCustomerDetails(selectedQuote.customer_id)}
              companyProfile={profile} // Pass profile
              appConfig={config} // Pass config
              onClose={handleCloseDetail}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotesPage;
