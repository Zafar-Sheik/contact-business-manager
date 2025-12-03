"use client";

import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Invoice, Customer } from "@/types/invoice";
import { Loader2 } from "lucide-react";

interface InvoiceTableProps {
  invoices: Invoice[];
  customers: Customer[];
  isLoading: boolean;
  onViewDetails: (invoice: Invoice) => void;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const getStatusVariant = (status: Invoice['status']) => {
  switch (status) {
    case 'Paid':
      return 'default';
    case 'Sent':
      return 'secondary';
    case 'Cancelled':
      return 'destructive';
    case 'Draft':
    default:
      return 'outline';
  }
};

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  customers,
  isLoading,
  onViewDetails,
}) => {
  const getCustomerName = (customerId: string | null) => {
    return customers.find(c => c.id === customerId)?.customer_name || 'N/A';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No invoices found. Start by creating one!
      </p>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice No.</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow
              key={invoice.id}
              onClick={() => onViewDetails(invoice)}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">{invoice.invoice_no}</TableCell>
              <TableCell>{format(new Date(invoice.date), "PPP")}</TableCell>
              <TableCell>{getCustomerName(invoice.customer_id)}</TableCell>
              <TableCell className="text-right font-semibold text-green-600">
                {formatCurrency(invoice.total_amount)}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={getStatusVariant(invoice.status)}>
                  {invoice.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceTable;