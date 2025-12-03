"use client";

import React from "react";
import { format } from "date-fns";
import {
  FileText,
  User,
  Calendar,
  DollarSign,
  Eye,
  Filter,
  Download,
} from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceTableProps {
  invoices: Invoice[];
  customers: Customer[];
  isLoading: boolean;
  onViewDetails: (invoice: Invoice) => void;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const getStatusVariant = (status: Invoice["status"]) => {
  switch (status) {
    case "Paid":
      return "default";
    case "Sent":
      return "secondary";
    case "Cancelled":
      return "destructive";
    case "Draft":
      return "outline";
    default:
      return "outline";
  }
};

const getStatusIcon = (status: Invoice["status"]) => {
  switch (status) {
    case "Paid":
      return "✅";
    case "Sent":
      return "📤";
    case "Cancelled":
      return "❌";
    case "Draft":
      return "📝";
    default:
      return "📄";
  }
};

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  customers,
  isLoading,
  onViewDetails,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");

  const getCustomerName = (customerId: string | null) => {
    return customers.find((c) => c.id === customerId)?.customer_name || "N/A";
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCustomerName(invoice.customer_id)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "vat" && invoice.is_vat_invoice) ||
      (typeFilter === "non-vat" && !invoice.is_vat_invoice);

    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Loading Invoices
            </h3>
            <p className="text-sm text-gray-600">Fetching your invoices...</p>
          </div>
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="p-4 bg-blue-50 rounded-full inline-flex mb-4">
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Invoices Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start by creating your first invoice
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white">
              Create First Invoice
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
              <p className="text-gray-600 text-sm">
                Manage and track all your invoices in one place
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {filteredInvoices.length} invoices
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 mb-1">Total Invoices</div>
                <div className="text-2xl font-bold text-gray-900">
                  {invoices.length}
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 mb-1">Total Value</div>
                <div className="text-2xl font-bold text-green-600">
                  R
                  {invoices
                    .reduce((sum, inv) => sum + inv.total_amount, 0)
                    .toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 mb-1">Pending</div>
                <div className="text-2xl font-bold text-orange-600">
                  {
                    invoices.filter(
                      (i) => i.status === "Draft" || i.status === "Sent"
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 mb-1">Paid</div>
                <div className="text-2xl font-bold text-green-600">
                  {invoices.filter((i) => i.status === "Paid").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="relative">
                  <Input
                    placeholder="Search invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 pl-10 bg-gray-50 border-gray-200"
                  />
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Sent">Sent</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="vat">VAT Invoices</SelectItem>
                    <SelectItem value="non-vat">Non-VAT Invoices</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="h-11 border-gray-200">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Table */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700">
                      Invoice #
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Date
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Client
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Type
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">
                      Amount
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => onViewDetails(invoice)}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {invoice.invoice_no}
                            </div>
                            <div className="text-xs text-gray-500">
                              #{invoice.id.slice(0, 8)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {format(new Date(invoice.date), "MMM d, yyyy")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {getCustomerName(invoice.customer_id)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            invoice.is_vat_invoice
                              ? "bg-green-50 text-green-700"
                              : "bg-blue-50 text-blue-700"
                          }>
                          {invoice.is_vat_invoice ? "VAT" : "Non-VAT"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-bold text-gray-900">
                              {formatCurrency(invoice.total_amount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              excl. VAT: R{invoice.subtotal.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={getStatusVariant(invoice.status)}
                          className="gap-1">
                          {getStatusIcon(invoice.status)}
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(invoice);
                          }}
                          className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredInvoices.length === 0 && (
              <div className="text-center py-8">
                <div className="p-3 bg-gray-100 rounded-full inline-flex mb-3">
                  <Filter className="h-6 w-6 text-gray-400" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">
                  No invoices found
                </h4>
                <p className="text-sm text-gray-600">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {/* Pagination/Info */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Showing {filteredInvoices.length} of {invoices.length}{" "}
                  invoices
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="h-8">
                    ← Previous
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    Next →
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile View (Cards) */}
        <div className="md:hidden space-y-3 mt-4">
          {filteredInvoices.map((invoice) => (
            <Card
              key={invoice.id}
              className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onViewDetails(invoice)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {invoice.invoice_no}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getCustomerName(invoice.customer_id)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-sm">
                    <div className="text-gray-500">Date</div>
                    <div className="font-medium">
                      {format(new Date(invoice.date), "MMM d")}
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-500">Type</div>
                    <Badge
                      variant="outline"
                      className={
                        invoice.is_vat_invoice
                          ? "bg-green-50 text-green-700"
                          : "bg-blue-50 text-blue-700"
                      }>
                      {invoice.is_vat_invoice ? "VAT" : "Non-VAT"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(invoice.total_amount)}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
