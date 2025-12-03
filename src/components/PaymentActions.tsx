"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download, MessageCircle } from "lucide-react";
import { Payment } from "@/types/payment";
import { Customer } from "@/types/invoice";
import { showSuccess, showError } from "@/utils/toast";
import { format } from "date-fns";

interface PaymentActionsProps {
  payment: Payment;
  customer: Customer | undefined;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const PaymentActions: React.FC<PaymentActionsProps> = ({
  payment,
  customer,
}) => {
  const handlePrint = () => {
    // Placeholder for actual printing logic
    showSuccess(`Preparing Payment Receipt for printing...`);
    // In a real application, you would render a print-friendly view here.
  };

  const handleSavePdf = () => {
    // Placeholder for PDF generation logic
    showSuccess(`Generating PDF for Payment Receipt...`);
  };

  const handleWhatsApp = () => {
    if (!customer?.phone_number) {
      showError("Client phone number is missing. Cannot send via WhatsApp.");
      return;
    }

    const message = `Hello ${
      customer.customer_name
    }, we confirm receipt of your payment of ${formatCurrency(
      payment.amount
    )} on ${format(new Date(payment.date), "PPP")}. Thank you!`;

    showSuccess(`Sending WhatsApp message to ${customer.phone_number}...`);
    console.log("WhatsApp Message:", message);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="h-4 w-4 mr-2" /> Print Receipt
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

export default PaymentActions;
