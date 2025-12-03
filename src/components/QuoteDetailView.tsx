"use client";

import React from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
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
import { Quote, Customer, QuoteItem } from "@/types/quote";
import QuoteActions from "./QuoteActions";
import { useQuery } from "@tanstack/react-query";
import { useQuotes } from "@/hooks/use-quotes";
import { CompanyProfile, AppConfig } from "@/types/profile";

interface QuoteDetailViewProps {
  quote: Quote;
  customer: Customer | undefined;
  companyProfile: CompanyProfile | null | undefined;
  appConfig: AppConfig | null | undefined;
  onClose: () => void;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const QuoteDetailView: React.FC<QuoteDetailViewProps> = ({
  quote,
  customer,
  companyProfile,
  appConfig,
  onClose,
}) => {
  const { fetchQuoteItems, convertToInvoice, isConverting } = useQuotes();

  const { data: items, isLoading: isItemsLoading } = useQuery<QuoteItem[]>({
    queryKey: ["quoteItems", quote.id],
    queryFn: () => fetchQuoteItems(quote.id),
  });
  
  const handleConvert = (quoteId: string) => {
    convertToInvoice(quoteId, {
      onSuccess: () => {
        // Optionally close the detail view after conversion
        onClose();
      }
    });
  };
  
  const showLogo = appConfig?.document_layout_config?.show_logo_on_documents && companyProfile?.logodataurl;
  const companyName = companyProfile?.name || "Company Name Missing";

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
          <h2 className="text-xl font-bold">QUOTE</h2>
          <p className="text-sm text-muted-foreground">#{quote.quote_no}</p>
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-1">Quoted To:</h3>
          <p className="font-medium">{customer?.customer_name || "N/A"}</p>
          <p className="text-sm text-muted-foreground">{customer?.phone_number || "N/A"}</p>
        </div>
        <div className="text-right text-sm">
          <p>Date: <span className="font-medium">{format(new Date(quote.date), "PPP")}</span></p>
          <Badge variant={quote.status === 'Accepted' ? 'default' : quote.status === 'Invoiced' ? 'secondary' : 'outline'} className="mt-2">
            {quote.status}
          </Badge>
        </div>
      </div>

      <div className="text-sm">
        <p className="font-semibold">Work Scope:</p>
        <p className="text-muted-foreground">{quote.work_scope || "N/A"}</p>
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
            <span className="font-medium">{formatCurrency(quote.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT Amount:</span>
            <span className="font-medium">{formatCurrency(quote.vat_amount)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold pt-1">
            <span>TOTAL:</span>
            <span>{formatCurrency(quote.total_amount)}</span>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Document Messages */}
      {(companyProfile?.bank_name || appConfig?.slipmessage1) && (
        <div className="text-xs text-muted-foreground space-y-1 pt-2">
          {companyProfile?.bank_name && (
            <p className="font-semibold">
              Bank: {companyProfile.bank_name} | Acc: {companyProfile.account_number} | Branch: {companyProfile.branch_code}
            </p>
          )}
          {appConfig?.slipmessage1 && <p>{appConfig.slipmessage1}</p>}
          {appConfig?.slipmessage2 && <p>{appConfig.slipmessage2}</p>}
          {appConfig?.slipmessage3 && <p>{appConfig.slipmessage3}</p>}
        </div>
      )}

      <Separator />

      <div className="pt-2">
        <h3 className="text-lg font-semibold mb-2">Actions</h3>
        <QuoteActions 
          quote={quote} 
          customer={customer} 
          onConvertToInvoice={handleConvert}
          isConverting={isConverting}
        />
      </div>
    </div>
  );
};

export default QuoteDetailView;