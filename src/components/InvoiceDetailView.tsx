"use client";

import React from "react";
import { format } from "date-fns";
import { Loader2, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Invoice, Customer, InvoiceItem } from "@/types/invoice";
import InvoiceActions from "./InvoiceActions";
import { useQuery } from "@tanstack/react-query";
import { useInvoices } from "@/hooks/use-invoices";
import { CompanyProfile, AppConfig } from "@/types/profile";
import { Button } from "@/components/ui/button"; // Ensure Button is imported

interface InvoiceDetailViewProps {
  invoice: Invoice;
  customer: Customer | undefined;
  companyProfile: CompanyProfile | null | undefined;
  appConfig: AppConfig | null | undefined;
  onEdit: () => void; // New prop
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const InvoiceDetailView: React.FC<InvoiceDetailViewProps> = ({
  invoice,
  customer,
  companyProfile,
  appConfig,
  onEdit,
}) => {
  const { fetchInvoiceItems } = useInvoices();

  const { data: items, isLoading: isItemsLoading } = useQuery<InvoiceItem[]>({
    queryKey: ["invoiceItems", invoice.id],
    queryFn: () => fetchInvoiceItems(invoice.id),
  });
  
  // Conditional logic for logo display: Hide if it's a non-VAT invoice, regardless of config setting.
  const showLogo = invoice.is_vat_invoice && appConfig?.document_layout_config?.show_logo_on_documents && companyProfile?.logodataurl;
  const companyName = companyProfile?.name || "Company Name Missing";
  
  // Select banking details based on invoice type
  const bankingDetails = invoice.is_vat_invoice ? {
    bank_name: companyProfile?.bank_name,
    account_number: companyProfile?.account_number,
    branch_code: companyProfile?.branch_code,
  } : {
    bank_name: companyProfile?.non_vat_bank_name,
    account_number: companyProfile?.non_vat_account_number,
    branch_code: companyProfile?.non_vat_branch_code,
  };
  
  const showBanking = bankingDetails.bank_name && bankingDetails.account_number;

  if (isItemsLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2">
      {/* Document Header (Company Info) */}
      <div className="flex justify-between items-start border-b pb-4">
        {showLogo ? (
          <img 
            src={companyProfile.logodataurl!} 
            alt={companyName} 
            className="max-h-16 w-auto object-contain"
          />
        ) : (
          <h1 className="text-2xl font-extrabold">{companyName}</h1>
        )}
        <div className="text-right">
          <h2 className="text-xl font-bold">INVOICE</h2>
          <p className="text-sm text-muted-foreground">#{invoice.invoice_no}</p>
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-1">Bill To:</h3>
          <p className="font-medium">{customer?.customer_name || "N/A"}</p>
          <p className="text-sm text-muted-foreground">{customer?.phone_number || "N/A"}</p>
        </div>
        <div className="text-right text-sm">
          <p>Date: <span className="font-medium">{format(new Date(invoice.date), "PPP")}</span></p>
          <Badge variant={invoice.status === 'Paid' ? 'default' : invoice.status === 'Cancelled' ? 'destructive' : 'secondary'} className="mt-2">
            {invoice.status}
          </Badge>
        </div>
      </div>

      <div className="text-sm">
        <p className="font-semibold">Work Scope:</p>
        <p className="text-muted-foreground">{invoice.work_scope || "N/A"}</p>
      </div>

      <Separator />

      <h3 className="text-lg font-semibold">Items</h3>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Price (Excl)</TableHead>
              <TableHead className="text-right">VAT (%)</TableHead>
              <TableHead className="text-right">Total (Incl)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.unit_price)}
                </TableCell>
                <TableCell className="text-right">{item.vat_rate}%</TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(item.line_total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT Amount:</span>
            <span className="font-medium">{formatCurrency(invoice.vat_amount)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold pt-1">
            <span>TOTAL:</span>
            <span>{formatCurrency(invoice.total_amount)}</span>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Document Messages & Banking */}
      {(showBanking || appConfig?.slipmessage1) && (
        <div className="text-xs text-muted-foreground space-y-1 pt-2">
          {showBanking && (
            <p className="font-semibold">
              {invoice.is_vat_invoice ? "VAT Account: " : "Non-VAT Account: "}
              {bankingDetails.bank_name} | Acc: {bankingDetails.account_number} | Branch: {bankingDetails.branch_code}
            </p>
          )}
          {appConfig?.slipmessage1 && <p>{appConfig.slipmessage1}</p>}
          {appConfig?.slipmessage2 && <p>{appConfig.slipmessage2}</p>}
          {appConfig?.slipmessage3 && <p>{appConfig.slipmessage3}</p>}
        </div>
      )}

      <Separator />

      <div className="pt-2 space-y-2">
        <h3 className="text-lg font-semibold">Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" /> Edit Invoice
          </Button>
          <InvoiceActions invoice={invoice} customer={customer} />
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailView;