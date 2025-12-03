"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download, MessageCircle, FileText } from "lucide-react";
import { Quote, Customer } from "@/types/quote";
import { showSuccess, showError } from "@/utils/toast";

interface QuoteActionsProps {
  quote: Quote;
  customer: Customer | undefined;
  onConvertToInvoice: (quoteId: string) => void;
  isConverting: boolean;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const QuoteActions: React.FC<QuoteActionsProps> = ({ quote, customer, onConvertToInvoice, isConverting }) => {
  
  const handlePrint = () => {
    showSuccess(`Preparing Quote ${quote.quote_no} for printing...`);
  };

  const handleSavePdf = () => {
    showSuccess(`Generating PDF for Quote ${quote.quote_no}...`);
  };

  const handleWhatsApp = () => {
    if (!customer?.phone_number) {
      showError("Client phone number is missing. Cannot send via WhatsApp.");
      return;
    }
    
    const message = `Hello ${customer.customer_name}, your quote ${quote.quote_no} for R${quote.total_amount.toFixed(2)} is ready. Please check your email or click the link (link placeholder).`;
    
    showSuccess(`Sending WhatsApp message to ${customer.phone_number}...`);
    console.log("WhatsApp Message:", message);
  };
  
  const handleConvert = () => {
    if (quote.status !== 'Invoiced') {
      onConvertToInvoice(quote.id);
    }
  };

  const isQuoteInvoiced = quote.status === 'Invoiced';

  return (
    <div className="flex flex-wrap gap-2">
      {!isQuoteInvoiced && (
        <Button onClick={handleConvert} disabled={isConverting}>
          <FileText className="h-4 w-4 mr-2" /> {isConverting ? "Converting..." : "Convert to Invoice"}
        </Button>
      )}
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="h-4 w-4 mr-2" /> Print
      </Button>
      <Button variant="outline" onClick={handleSavePdf}>
        <Download className="h-4 w-4 mr-2" /> Save PDF
      </Button>
      <Button onClick={handleWhatsApp} disabled={!customer?.phone_number}>
        <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
      </Button>
    </div>
  );
};

export default QuoteActions;