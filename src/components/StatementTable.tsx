"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@/types/client";
import {
  Loader2,
  User,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface StatementTableProps {
  clients: Client[];
  isLoading: boolean;
  onSelectClient: (client: Client) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const StatementTable: React.FC<StatementTableProps> = ({
  clients,
  isLoading,
  onSelectClient,
  searchQuery = "",
  onSearchChange,
}) => {
  // Calculate summary statistics
  const summary = React.useMemo(() => {
    const totalClients = clients.length;
    const totalOwed = clients.reduce(
      (sum, client) => sum + Math.max(client.current_balance, 0),
      0
    );
    const clientsOwing = clients.filter(
      (client) => client.current_balance > 0
    ).length;
    const clientsInCredit = clients.filter(
      (client) => client.current_balance < 0
    ).length;

    return { totalClients, totalOwed, clientsOwing, clientsInCredit };
  }, [clients]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Client Statements
            </h1>
            <p className="text-gray-600 text-sm">
              View and manage client account statements
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
                <p className="text-gray-600 font-medium">
                  Loading client data...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Please wait while we fetch client information
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Client Statements
            </h1>
            <p className="text-gray-600 text-sm">
              View and manage client account statements
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-64">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Clients Found
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  No client records are available. Add clients to start managing
                  their statements.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Client Statements
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                View and manage client account statements
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200">
              <User className="h-3 w-3 mr-1" />
              {clients.length} Clients
            </Badge>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Clients
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {summary.totalClients}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Owed
                    </p>
                    <p className="text-2xl font-bold text-red-700">
                      {formatCurrency(summary.totalOwed)}
                    </p>
                  </div>
                  <div className="p-2 bg-red-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Clients Owing
                    </p>
                    <p className="text-2xl font-bold text-red-700">
                      {summary.clientsOwing}
                    </p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <CreditCard className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      In Credit
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {summary.clientsInCredit}
                    </p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          {onSearchChange && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search clients by name or code..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="h-11 pl-10 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500 shadow-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Client Table */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Client Statements
                </h3>
                <Badge variant="outline" className="ml-auto bg-white">
                  Click to view statement
                </Badge>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 py-4">
                      Client Information
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">
                      Client Code
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 text-right">
                      Current Balance
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 text-right">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow
                      key={client.id}
                      onClick={() => onSelectClient(client)}
                      className="cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0 group">
                      <TableCell className="py-4">
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-lg mr-3 ${
                              client.current_balance > 0
                                ? "bg-red-50"
                                : "bg-green-50"
                            }`}>
                            {client.current_balance > 0 ? (
                              <TrendingUp className="h-4 w-4 text-red-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-purple-700">
                              {client.customer_name}
                            </p>
                            {client.email && (
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                {client.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-700 border-gray-200 font-mono">
                          {client.customer_code}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <div
                          className={`text-lg font-bold ${
                            client.current_balance > 0
                              ? "text-red-700"
                              : "text-green-700"
                          }`}>
                          {formatCurrency(client.current_balance)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {client.current_balance > 0
                            ? "Amount due"
                            : "Credit available"}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <Badge
                          className={
                            client.current_balance > 0
                              ? "bg-red-100 text-red-700 hover:bg-red-100"
                              : "bg-green-100 text-green-700 hover:bg-green-100"
                          }>
                          {client.current_balance > 0 ? "Owing" : "In Credit"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Footer Summary */}
            <div className="border-t border-gray-100">
              <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Showing {clients.length} client
                      {clients.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">
                      Total Amount Due:
                    </div>
                    <div className="text-lg font-bold text-red-700">
                      {formatCurrency(summary.totalOwed)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <CreditCard className="h-4 w-4 text-purple-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-800">
              How to view statements
            </h4>
          </div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
              Click on any client row to view their detailed statement
            </li>
            <li className="flex items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
              Red balances indicate amounts owed by the client
            </li>
            <li className="flex items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
              Green balances indicate the client has credit available
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatementTable;
