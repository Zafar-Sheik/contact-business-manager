"use client";

import React, { useMemo, useState } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ArrowLeft, Mail, MessageCircle, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client, StatementEntry } from "@/types/client";
import { Payment } from "@/types/payment";
import { Invoice } from "@/types/invoice";
import { generateStatement } from "@/hooks/use-statements";
import { showError, showSuccess } from "@/utils/toast";

interface StatementDetailViewProps {
  client: Client;
  invoices: Invoice[];
  payments: Payment[];
  onBack: () => void;
  generateStatement: (clientId: string, invoices: Invoice[], payments: Payment[], endDate: Date) => StatementEntry[];
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const StatementDetailView: React.FC<StatementDetailViewProps> = ({
  client,
  invoices,
  payments,
  onBack,
  generateStatement,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));

  // Generate month options (last 6 months)
  const monthOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 6; i++) {
      const date = subMonths(new Date(), i);
      options.push({
        value: format(date, 'yyyy-MM'),
        label: format(date, 'MMM yyyy'),
      });
    }
    return options;
  }, []);
  
  const selectedDate = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    // Use the end of the selected month for the statement date
    return endOfMonth(new Date(year, month - 1));
  }, [selectedMonth]);

  const statement = useMemo(() => {
    return generateStatement(client.id, invoices, payments, selectedDate);
  }, [client.id, invoices, payments, selectedDate, generateStatement]);
  
  const closingBalance = statement.length > 0 ? statement[statement.length - 1].balance : 0;
  
  // Actions
  const handleEmail = () => {
    if (!client.email) {
      showError("Client email address is missing.");
      return;
    }
    showSuccess(`Statement for ${client.customer_name} emailed to ${client.email}. (Placeholder)`);
  };

  const handleWhatsApp = () => {
    if (!client.phone_number) {
      showError("Client phone number is missing.");
      return;
    }
    const message = `Hello ${client.customer_name}, here is your statement as of ${format(selectedDate, 'PPP')}. Closing balance: ${formatCurrency(closingBalance)}. (Link placeholder)`;
    showSuccess(`Sending WhatsApp message to ${client.phone_number}. (Placeholder)`);
    console.log("WhatsApp Message:", message);
  };
  
  const handlePrint = () => {
    showSuccess(`Preparing statement for ${client.customer_name} for printing...`);
  };
  
  const handleSavePdf = () => {
    showSuccess(`Generating PDF statement for ${client.customer_name}...`);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between border-b pb-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold flex-1 text-center">
          Statement for {client.customer_name}
        </h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Filter and Summary */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <div>
          <p className="text-sm font-medium mb-1">Statement Date (View By Month)</p>
          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Card className="p-3 text-right">
          <p className="text-sm font-medium text-muted-foreground">Closing Balance ({format(selectedDate, 'MMM yyyy')})</p>
          <p className={`text-2xl font-bold ${closingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(closingBalance)}
          </p>
        </Card>
      </div>
      
      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" /> Print
        </Button>
        <Button variant="outline" onClick={handleSavePdf}>
          <Download className="h-4 w-4 mr-2" /> Save PDF
        </Button>
        <Button onClick={handleEmail} disabled={!client.email}>
          <Mail className="h-4 w-4 mr-2" /> Email
        </Button>
        <Button onClick={handleWhatsApp} disabled={!client.phone_number}>
          <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
        </Button>
      </div>

      <Separator />

      {/* Statement Table */}
      <Card>
        <CardContent className="p-0">
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statement.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No transactions found for this period.
                    </TableCell>
                  </TableRow>
                ) : (
                  statement.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{format(new Date(entry.date), 'dd MMM yy')}</TableCell>
                      <TableCell>{entry.reference}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${entry.type === 'Invoice' ? 'text-red-600' : 'text-green-600'}`}>
                          {entry.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(Math.abs(entry.amount))}
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${entry.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(entry.balance)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatementDetailView;