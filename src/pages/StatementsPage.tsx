"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  FileText,
  DollarSign,
  Users,
  Calendar,
  Download,
  Filter,
  TrendingUp,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { useStatements } from "@/hooks/use-statements";
import { Client } from "@/types/client";
import StatementTable from "@/components/StatementTable";
import StatementDetailView from "@/components/StatementDetailView";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const StatementsPage: React.FC = () => {
  const { clients, invoices, payments, isLoading, generateStatement } =
    useStatements();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };

  const handleBack = () => {
    setSelectedClient(null);
  };

  // Calculate statement statistics
  const totalClients = clients.length;
  const totalInvoices = invoices.length;
  const totalPayments = payments.length;
  const totalOutstanding = invoices.reduce((sum, inv) => {
    const totalPaid = payments
      .filter((p) => p.invoice_id === inv.id)
      .reduce((sum, p) => sum + p.amount, 0);
    return sum + Math.max(0, inv.total_amount - totalPaid);
  }, 0);

  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="h-10 w-10 border-gray-200 hover:bg-gray-50">
                <Link to="/financial-hub">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Skeleton className="h-8 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedClient) {
    return (
      <StatementDetailView
        client={selectedClient}
        invoices={invoices}
        payments={payments}
        onBack={handleBack}
        generateStatement={generateStatement}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="h-10 w-10 border-gray-200 hover:bg-gray-50">
                <Link to="/financial-hub">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Client Statements
                  </h1>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Generate and view customer account statements
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Badge variant="outline" className="bg-white">
                {clients.length} clients
              </Badge>
            </div>
          </div>
        </div>

        {/* Statement Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Clients
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalClients}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Invoices
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {totalInvoices}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Payments
                  </p>
                  <p className="text-2xl font-bold text-purple-700">
                    {totalPayments}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Outstanding
                  </p>
                  <p className="text-2xl font-bold text-red-700">
                    {formatCurrency(totalOutstanding)}
                  </p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-0">
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Client Statements
                </h3>
                <div className="ml-auto flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 border-gray-300">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-5">
              <StatementTable
                clients={clients}
                isLoading={isLoading}
                onSelectClient={handleSelectClient}
              />
            </div>

            {/* Footer Summary */}
            {clients.length > 0 && !isLoading && (
              <div className="border-t border-gray-100">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-3 md:mb-0">
                      <Calendar className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {clients.length} clients • {totalInvoices} invoices •{" "}
                        {totalPayments} payments
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">
                        Total Outstanding Balance:
                      </div>
                      <div className="text-lg font-bold text-red-700">
                        {formatCurrency(totalOutstanding)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Statement Features
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                Generate comprehensive statements showing all invoices and
                payments
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                View detailed transaction history for each client
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                Export statements as PDF for client distribution
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Statement Best Practices
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                Send statements monthly to keep clients informed of their
                account status
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></div>
                Highlight outstanding amounts to encourage timely payments
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                Include payment terms and methods on all statements
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatementsPage;
