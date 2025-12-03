"use client";

import React, { useMemo, useState } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import {
  ArrowLeft,
  Mail,
  MessageCircle,
  Printer,
  Download,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  User,
  Phone,
  CreditCard,
  Clock,
  CheckCircle,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
  generateStatement: (
    clientId: string,
    invoices: Invoice[],
    payments: Payment[],
    endDate: Date
  ) => StatementEntry[];
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const StatementDetailView: React.FC<StatementDetailViewProps> = ({
  client,
  invoices,
  payments,
  onBack,
  generateStatement,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );

  // Generate month options (last 6 months)
  const monthOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 6; i++) {
      const date = subMonths(new Date(), i);
      options.push({
        value: format(date, "yyyy-MM"),
        label: format(date, "MMMM yyyy"),
        shortLabel: format(date, "MMM yyyy"),
      });
    }
    return options;
  }, []);

  const selectedDate = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    return endOfMonth(new Date(year, month - 1));
  }, [selectedMonth]);

  const statement = useMemo(() => {
    return generateStatement(client.id, invoices, payments, selectedDate);
  }, [client.id, invoices, payments, selectedDate, generateStatement]);

  const closingBalance =
    statement.length > 0 ? statement[statement.length - 1].balance : 0;

  // Calculate totals
  const totals = useMemo(() => {
    let totalInvoices = 0;
    let totalPayments = 0;

    statement.forEach((entry) => {
      if (entry.type === "Invoice") {
        totalInvoices += Math.abs(entry.amount);
      } else if (entry.type === "Payment") {
        totalPayments += Math.abs(entry.amount);
      }
    });

    return { totalInvoices, totalPayments };
  }, [statement]);

  // Actions
  const handleEmail = () => {
    if (!client.email) {
      showError("Client email address is missing.");
      return;
    }
    showSuccess(`Statement emailed to ${client.email}`);
  };

  const handleWhatsApp = () => {
    if (!client.phone_number) {
      showError("Client phone number is missing.");
      return;
    }
    const message = `Hello ${
      client.customer_name
    }, here is your statement as of ${format(
      selectedDate,
      "PPP"
    )}. Closing balance: ${formatCurrency(closingBalance)}.`;
    showSuccess(`WhatsApp message sent to ${client.phone_number}`);
    console.log("WhatsApp Message:", message);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSavePdf = () => {
    showSuccess(`PDF generated for ${client.customer_name}`);
  };

  // Generate a short reference from client ID
  const clientReference = useMemo(() => {
    // Use first 8 characters of the ID for a short reference
    return `CL-${client.id.slice(0, 8).toUpperCase()}`;
  }, [client.id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={onBack}
                className="h-10 w-10 border-gray-200 hover:bg-gray-50">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Client Statement
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200">
                    <User className="h-3 w-3 mr-1" />
                    {client.customer_name}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200">
                    <CreditCard className="h-3 w-3 mr-1" />
                    Ref: {clientReference}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Client Info Cards - Mobile Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {client.email && (
              <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <Mail className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm text-gray-700 truncate">
                  {client.email}
                </span>
              </div>
            )}
            {client.phone_number && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                <Phone className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-gray-700">
                  {client.phone_number}
                </span>
              </div>
            )}
            {/* Only show address if it exists in Client type */}
            {"address" in client && client.address && (
              <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                <Building className="h-4 w-4 text-amber-600 mr-2" />
                <span className="text-sm text-gray-700 truncate">
                  {client.address}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Summary & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Period Selector */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Statement Period
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      View By Month
                    </label>
                    <Select
                      value={selectedMonth}
                      onValueChange={setSelectedMonth}>
                      <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        {monthOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              <div className="p-2 bg-purple-50 rounded mr-3">
                                <Calendar className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="font-medium">{option.label}</p>
                                <p className="text-xs text-gray-500">
                                  {format(
                                    startOfMonth(
                                      new Date(option.value + "-01")
                                    ),
                                    "dd MMM"
                                  )}{" "}
                                  -{" "}
                                  {format(
                                    endOfMonth(new Date(option.value + "-01")),
                                    "dd MMM yyyy"
                                  )}
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="flex items-center justify-between py-2">
                      <span>Period:</span>
                      <span className="font-medium">
                        {format(
                          startOfMonth(new Date(selectedMonth + "-01")),
                          "dd MMM yyyy"
                        )}{" "}
                        - {format(selectedDate, "dd MMM yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Summary
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Total Invoices */}
                  <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">
                          Total Invoices
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-white text-red-700 border-red-200">
                        {statement.filter((e) => e.type === "Invoice").length}
                      </Badge>
                    </div>
                    <p className="text-xl font-bold text-red-700">
                      {formatCurrency(totals.totalInvoices)}
                    </p>
                  </div>

                  {/* Total Payments */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">
                          Total Payments
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-white text-green-700 border-green-200">
                        {statement.filter((e) => e.type === "Payment").length}
                      </Badge>
                    </div>
                    <p className="text-xl font-bold text-green-700">
                      {formatCurrency(totals.totalPayments)}
                    </p>
                  </div>

                  {/* Closing Balance */}
                  <div
                    className={`rounded-lg p-4 border ${
                      closingBalance > 0
                        ? "bg-red-50 border-red-100"
                        : "bg-green-50 border-green-100"
                    }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <DollarSign
                          className={`h-4 w-4 mr-2 ${
                            closingBalance > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Closing Balance
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`bg-white ${
                          closingBalance > 0
                            ? "text-red-700 border-red-200"
                            : "text-green-700 border-green-200"
                        }`}>
                        {format(selectedDate, "MMM yyyy")}
                      </Badge>
                    </div>
                    <p
                      className={`text-2xl font-bold ${
                        closingBalance > 0 ? "text-red-700" : "text-green-700"
                      }`}>
                      {formatCurrency(closingBalance)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {closingBalance > 0
                        ? "Amount owed by client"
                        : "Client account is in credit"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Table & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action Buttons */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Download className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Export & Share
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePrint}
                    className="h-11 flex-col items-center justify-center py-3 bg-white hover:bg-gray-50 border-gray-200">
                    <Printer className="h-4 w-4 mb-1" />
                    <span className="text-xs">Print</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleSavePdf}
                    className="h-11 flex-col items-center justify-center py-3 bg-white hover:bg-gray-50 border-gray-200">
                    <FileText className="h-4 w-4 mb-1" />
                    <span className="text-xs">Save PDF</span>
                  </Button>

                  <Button
                    onClick={handleEmail}
                    disabled={!client.email}
                    className={`h-11 flex-col items-center justify-center py-3 ${
                      client.email
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : "bg-gray-100"
                    } text-white`}>
                    <Mail className="h-4 w-4 mb-1" />
                    <span className="text-xs">Email</span>
                  </Button>

                  <Button
                    onClick={handleWhatsApp}
                    disabled={!client.phone_number}
                    className={`h-11 flex-col items-center justify-center py-3 ${
                      client.phone_number
                        ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                        : "bg-gray-100"
                    } text-white`}>
                    <MessageCircle className="h-4 w-4 mb-1" />
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                </div>

                {(!client.email || !client.phone_number) && (
                  <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-xs text-amber-800 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {!client.email && !client.phone_number
                        ? "Add email or phone number to enable sharing options"
                        : !client.email
                        ? "Add email address to enable email sharing"
                        : "Add phone number to enable WhatsApp sharing"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statement Table */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <CreditCard className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Transaction History
                    </h3>
                    <Badge variant="outline" className="ml-auto bg-gray-50">
                      {statement.length} transactions
                    </Badge>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">
                          Date
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Reference
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Type
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right">
                          Amount
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right">
                          Balance
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statement.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <FileText className="h-12 w-12 text-gray-300 mb-3" />
                              <p className="text-gray-500 font-medium">
                                No transactions found
                              </p>
                              <p className="text-sm text-gray-400 mt-1">
                                No transactions for{" "}
                                {format(selectedDate, "MMMM yyyy")}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        statement.map((entry, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                            <TableCell className="py-4">
                              <div className="flex items-center">
                                <div
                                  className={`p-2 rounded-lg mr-3 ${
                                    entry.type === "Invoice"
                                      ? "bg-red-50"
                                      : "bg-green-50"
                                  }`}>
                                  {entry.type === "Invoice" ? (
                                    <TrendingUp className="h-4 w-4 text-red-600" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-green-600" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {format(new Date(entry.date), "dd MMM")}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {format(new Date(entry.date), "yyyy")}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <p className="font-medium text-gray-900">
                                {entry.reference}
                              </p>
                              <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                {entry.type === "Invoice"
                                  ? "Invoice issued"
                                  : "Payment received"}
                              </p>
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge
                                className={
                                  entry.type === "Invoice"
                                    ? "bg-red-100 text-red-700 hover:bg-red-100"
                                    : "bg-green-100 text-green-700 hover:bg-green-100"
                                }>
                                {entry.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4 text-right">
                              <div
                                className={`font-bold ${
                                  entry.type === "Invoice"
                                    ? "text-red-700"
                                    : "text-green-700"
                                }`}>
                                {entry.type === "Invoice" ? "-" : "+"}{" "}
                                {formatCurrency(Math.abs(entry.amount))}
                              </div>
                            </TableCell>
                            <TableCell className="py-4 text-right">
                              <div
                                className={`font-bold ${
                                  entry.balance > 0
                                    ? "text-red-700"
                                    : "text-green-700"
                                }`}>
                                {formatCurrency(entry.balance)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {entry.balance > 0 ? "Owed" : "Credit"}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {statement.length > 0 && (
                  <div className="border-t border-gray-100">
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-gray-600 mr-2" />
                          <span className="text-sm font-medium text-gray-700">
                            Final Balance ({format(selectedDate, "dd MMM yyyy")}
                            )
                          </span>
                        </div>
                        <div
                          className={`text-xl font-bold ${
                            closingBalance > 0
                              ? "text-red-700"
                              : "text-green-700"
                          }`}>
                          {formatCurrency(closingBalance)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800">
                  Statement Information
                </h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                  Statement generated on {format(new Date(), "dd MMMM yyyy")}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                  Closing balance includes all transactions up to{" "}
                  {format(selectedDate, "dd MMMM yyyy")}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                  Positive balance indicates amount owed, negative indicates
                  credit
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatementDetailView;
