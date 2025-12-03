"use client";

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BarChart, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useClients } from "@/hooks/use-clients";
import { usePayments } from "@/hooks/use-payments";
import { useSupplierPayments } from "@/hooks/use-supplier-payments";
import { useStaff } from "@/hooks/use-staff";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton"; // Added import

// Mock data structure from App.tsx (will be replaced by real data later)
interface Transaction {
  id: string;
  type: "Sale" | "Expense";
  description: string;
  amount: number;
  date: string;
}

interface FinancialAnalysisReportProps {
  // In a real app, we would fetch this data via hooks, but since the Index page uses this prop, we keep it for consistency.
  transactions: Transaction[]; 
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const FinancialAnalysisReport: React.FC<FinancialAnalysisReportProps> = ({ transactions }) => {
  // Fetch real financial data from hooks
  const { totalBalanceOwing, isLoading: isClientsLoading } = useClients();
  const { totalPayments, isLoading: isCustomerPaymentsLoading } = usePayments();
  const { payments: supplierPayments, isLoading: isSupplierPaymentsLoading } = useSupplierPayments();
  const { staff, isLoading: isStaffLoading } = useStaff();
  
  const isLoading = isClientsLoading || isCustomerPaymentsLoading || isSupplierPaymentsLoading || isStaffLoading;

  // Calculate totals from mock data (for the dashboard context)
  const totalSales = transactions
    .filter((t) => t.type === "Sale")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalMockExpenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  // Calculate real expenses (Staff salaries + Supplier Payments)
  const totalSalaries = staff.reduce((sum, member) => sum + member.salary_total, 0);
  const totalSupplierPayments = supplierPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalRealExpenses = totalSalaries + totalSupplierPayments;
  
  const netProfitLoss = totalSales - totalRealExpenses;

  // Group transactions by month (using mock data for demonstration)
  const monthlySummary = useMemo(() => {
    const summary: { [key: string]: { sales: number, expenses: number } } = {};
    
    transactions.forEach(t => {
      const monthKey = format(new Date(t.date), 'yyyy-MM');
      if (!summary[monthKey]) {
        summary[monthKey] = { sales: 0, expenses: 0 };
      }
      if (t.type === 'Sale') {
        summary[monthKey].sales += t.amount;
      } else {
        summary[monthKey].expenses += t.amount;
      }
    });
    
    return Object.entries(summary).sort(([a], [b]) => b.localeCompare(a));
  }, [transactions]);


  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/reports">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold ml-2 flex items-center">
          <BarChart className="h-6 w-6 mr-2" /> Sales & Expense Analysis
        </h1>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-semibold">Overall Financial Snapshot (Mock Data)</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            <Card><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
            <Card><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
            <Card><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="p-3 pb-1"><CardTitle className="text-sm font-medium">Total Sales (Mock)</CardTitle></CardHeader>
              <CardContent className="p-3 pt-0"><div className="text-2xl font-bold text-green-600">{formatCurrency(totalSales)}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="p-3 pb-1"><CardTitle className="text-sm font-medium">Total Expenses (Real)</CardTitle></CardHeader>
              <CardContent className="p-3 pt-0"><div className="text-2xl font-bold text-red-600">{formatCurrency(totalRealExpenses)}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="p-3 pb-1"><CardTitle className="text-sm font-medium">Net P/L (Mock Sales - Real Exp)</CardTitle></CardHeader>
              <CardContent className="p-3 pt-0">
                <div className={`text-2xl font-bold ${netProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netProfitLoss)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <Separator />
        
        <h2 className="text-xl font-semibold">Monthly Sales & Expense Breakdown (Mock Data)</h2>
        
        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium">Month</th>
                <th className="p-3 text-right font-medium">Sales</th>
                <th className="p-3 text-right font-medium">Expenses</th>
                <th className="p-3 text-right font-medium">Net</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.map(([monthKey, data]) => (
                <tr key={monthKey} className="border-b last:border-b-0">
                  <td className="p-3">{format(new Date(monthKey + '-01'), 'MMM yyyy')}</td>
                  <td className="p-3 text-right text-green-600 font-medium">{formatCurrency(data.sales)}</td>
                  <td className="p-3 text-right text-red-600 font-medium">{formatCurrency(data.expenses)}</td>
                  <td className="p-3 text-right font-bold">
                    {formatCurrency(data.sales - data.expenses)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <p className="text-sm text-muted-foreground pt-4">
          Note: This report currently uses the local mock transaction data from the dashboard. Full integration with database transactions (Invoices, Payments, Staff Salaries) is required for accurate reporting.
        </p>
      </div>
    </div>
  );
};

export default FinancialAnalysisReport;