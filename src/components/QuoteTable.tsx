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
import { Quote, Customer } from "@/types/quote";
import { Loader2 } from "lucide-react";

interface QuoteTableProps {
  quotes: Quote[];
  customers: Customer[];
  isLoading: boolean;
  onViewDetails: (quote: Quote) => void;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const getStatusVariant = (status: Quote['status']) => {
  switch (status) {
    case 'Accepted':
      return 'default';
    case 'Sent':
      return 'secondary';
    case 'Invoiced':
      return 'outline';
    case 'Cancelled':
      return 'destructive';
    case 'Draft':
    default:
      return 'outline';
  }
};

const QuoteTable: React.FC<QuoteTableProps> = ({
  quotes,
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

  if (quotes.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No quotes found. Start by creating one!
      </p>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quote No.</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow
              key={quote.id}
              onClick={() => onViewDetails(quote)}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">{quote.quote_no}</TableCell>
              <TableCell>{format(new Date(quote.date), "PPP")}</TableCell>
              <TableCell>{getCustomerName(quote.customer_id)}</TableCell>
              <TableCell className="text-right font-semibold text-green-600">
                {formatCurrency(quote.total_amount)}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={getStatusVariant(quote.status)}>
                  {quote.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuoteTable;