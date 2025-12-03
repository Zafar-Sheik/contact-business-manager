"use client";

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  Filter,
  PieChart,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useClients } from "@/hooks/use-clients";
import { usePayments } from "@/hooks/use-payments";
import { useSupplierPayments } from "@/hooks/use-supplier-payments";
import { useStaff } from "@/hooks/use-staff";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  type: "Sale" | "Expense";
  description: string;
  amount: number;
  date: string;
}

interface FinancialAnalysisReportProps {
  transactions: Transaction[];
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const FinancialAnalysisReport: React.FC<FinancialAnalysisReportProps> = ({
  transactions,
}) => {
  const { totalBalanceOwing } = useClients();
  const { totalPayments } = usePayments();
  const { payments: supplierPayments } = useSupplierPayments();
  const { staff } = useStaff();

  // Calculate totals from mock data
  const totalSales = transactions
    .filter((t) => t.type === "Sale")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalMockExpenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate real expenses
  const totalSalaries = staff.reduce(
    (sum, member) => sum + member.salary_total,
    0
  );
  const totalSupplierPayments = supplierPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const totalRealExpenses = totalSalaries + totalSupplierPayments;
  const netProfitLoss = totalSales - totalRealExpenses;

  // Group transactions by month
  const monthlySummary = useMemo(() => {
    const summary: { [key: string]: { sales: number; expenses: number } } = {};

    transactions.forEach((t) => {
      const monthKey = format(new Date(t.date), "yyyy-MM");
      if (!summary[monthKey]) {
        summary[monthKey] = { sales: 0, expenses: 0 };
      }
      if (t.type === "Sale") {
        summary[monthKey].sales += t.amount;
      } else {
        summary[monthKey].expenses += t.amount;
      }
    });

    return Object.entries(summary).sort(([a], [b]) => b.localeCompare(a));
  }, [transactions]);

  // Calculate profit margins
  const profitMargin =
    totalSales > 0 ? ((totalSales - totalRealExpenses) / totalSales) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="h-10 w-10 border-gray-200 hover:bg-gray-50">
                <Link to="/reports">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Financial Analysis Report
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Sales, expenses, and profitability analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="h-10 border-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                Filter Period
              </Button>
              <Button variant="outline" className="h-10 border-gray-300">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Sales
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(totalSales)}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Mock transaction data
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Expenses
                  </p>
                  <p className="text-2xl font-bold text-red-700">
                    {formatCurrency(totalRealExpenses)}
                  </p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Salaries: {formatCurrency(totalSalaries)} + Suppliers:{" "}
                {formatCurrency(totalSupplierPayments)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Net Profit/Loss
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      netProfitLoss >= 0 ? "text-green-700" : "text-red-700"
                    }`}>
                    {formatCurrency(netProfitLoss)}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-lg ${
                    netProfitLoss >= 0 ? "bg-green-50" : "bg-red-50"
                  }`}>
                  <BarChart3
                    className={`h-5 w-5 ${
                      netProfitLoss >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  />
                </div>
              </div>
              <p
                className={`text-xs ${
                  profitMargin >= 0 ? "text-green-600" : "text-red-600"
                } mt-2`}>
                Margin: {profitMargin.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Client Balance
                  </p>
                  <p className="text-2xl font-bold text-purple-700">
                    {formatCurrency(totalBalanceOwing)}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total amount owed by clients
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Report */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <LineChart className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Monthly Financial Breakdown
                </h3>
                <Badge variant="outline" className="ml-auto bg-white">
                  {monthlySummary.length} months
                </Badge>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-left font-semibold text-gray-700">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Month
                      </div>
                    </th>
                    <th className="p-4 text-right font-semibold text-gray-700">
                      <div className="flex items-center justify-end">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Sales
                      </div>
                    </th>
                    <th className="p-4 text-right font-semibold text-gray-700">
                      <div className="flex items-center justify-end">
                        <TrendingDown className="h-4 w-4 mr-2" />
                        Expenses
                      </div>
                    </th>
                    <th className="p-4 text-right font-semibold text-gray-700">
                      <div className="flex items-center justify-end">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Net Profit
                      </div>
                    </th>
                    <th className="p-4 text-right font-semibold text-gray-700">
                      <div className="flex items-center justify-end">
                        <PieChart className="h-4 w-4 mr-2" />
                        Margin
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlySummary.map(([monthKey, data]) => {
                    const net = data.sales - data.expenses;
                    const margin =
                      data.sales > 0 ? (net / data.sales) * 100 : 0;

                    return (
                      <tr
                        key={monthKey}
                        className="border-b border-gray-100 hover:bg-gray-50 last:border-0">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">
                            {format(new Date(monthKey + "-01"), "MMMM yyyy")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(monthKey + "-01"), "MM/yyyy")}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="font-bold text-green-700">
                            {formatCurrency(data.sales)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Sales revenue
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="font-bold text-red-700">
                            {formatCurrency(data.expenses)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Operating costs
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div
                            className={`font-bold ${
                              net >= 0 ? "text-green-700" : "text-red-700"
                            }`}>
                            {formatCurrency(net)}
                          </div>
                          <div
                            className={`text-xs ${
                              net >= 0 ? "text-green-600" : "text-red-600"
                            }`}>
                            {net >= 0 ? "Profit" : "Loss"}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div
                            className={`font-bold ${
                              margin >= 0 ? "text-green-700" : "text-red-700"
                            }`}>
                            {margin.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500">
                            Profit margin
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            {monthlySummary.length > 0 && (
              <div className="border-t border-gray-100">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-3 md:mb-0">
                      <BarChart3 className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Analysis based on {transactions.length} transactions
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">
                        Overall Performance:
                      </div>
                      <div
                        className={`text-lg font-bold ${
                          profitMargin >= 0 ? "text-green-700" : "text-red-700"
                        }`}>
                        {profitMargin >= 0 ? "Profitable" : "Loss Making"} •{" "}
                        {profitMargin.toFixed(1)}% margin
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information Note */}
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <DollarSign className="h-4 w-4 text-amber-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-800">
              Report Information
            </h4>
          </div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
              Sales data is based on mock transaction data for demonstration
            </li>
            <li className="flex items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
              Expense data includes real staff salaries and supplier payments
            </li>
            <li className="flex items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
              Full integration with database transactions is required for
              accurate reporting
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysisReport;
