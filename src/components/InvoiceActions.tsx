"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download, MessageCircle } from "lucide-react";
import { Invoice, Customer } from "@/types/invoice";
import { showSuccess, showError } from "@/utils/toast";

interface InvoiceActionsProps {
  invoice: Invoice;
  customer: Customer | undefined;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  invoice,
  customer,
}) => {
  const handlePrint = () => {
    // Placeholder for actual printing logic
    showSuccess(`Preparing Invoice ${invoice.invoice_no} for printing...`);
    // In a real application, you would render a print-friendly view here.
  };

  const handleSavePdf = () => {
    // Placeholder for PDF generation logic
    showSuccess(`Generating PDF for Invoice ${invoice.invoice_no}...`);
    // This would typically involve a library like jsPDF or a serverless function.
  };

  const handleWhatsApp = () => {
    if (!customer?.phone_number) {
      showError("Client phone number is missing. Cannot send via WhatsApp.");
      return;
    }

    // Clean up phone number (remove spaces, dashes, etc.) and ensure international format if necessary
    // Assuming South African numbers might need a country code if not already present,
    // but for simplicity, we just clean non-numeric characters.
    const cleanedPhoneNumber = customer.phone_number.replace(/[^0-9+]/g, "");

    // Construct the message
    const message = `Hello ${customer.customer_name}, your invoice ${
      invoice.invoice_no
    } for ${formatCurrency(
      invoice.total_amount
    )} is ready. Please find the attached PDF (or link placeholder).`;

    // Encode the message for the URL
    const encodedMessage = encodeURIComponent(message);

    // Construct the WhatsApp URL (wa.me)
    const whatsappUrl = `https://wa.me/${cleanedPhoneNumber}?text=${encodedMessage}`;

    // Open the link in a new tab
    window.open(whatsappUrl, "_blank");

    showSuccess(`Opening WhatsApp chat for ${customer.customer_name}.`);
  };

  return (
    <div className="flex flex-wrap gap-2">
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

export default InvoiceActions;
