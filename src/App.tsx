"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Index from "./pages/Index";
import WorkflowPage from "./pages/WorkflowPage";
import StaffPage from "./pages/StaffPage";
import ClientsPage from "./pages/ClientsPage";
import SuppliersPage from "./pages/SuppliersPage";
import StockPage from "./pages/StockPage";
import FinancialHubPage from "./pages/FinancialHubPage";
import InvoicePage from "./pages/InvoicePage";
import PaymentsPage from "./pages/PaymentsPage";
import QuotesPage from "./pages/QuotesPage";
import StatementsPage from "./pages/StatementsPage";
import SupplierPaymentPage from "./pages/SupplierPaymentPage";
import GrvsPage from "./pages/GrvsPage";
import FuelPage from "./pages/FuelPage";
import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage"; // Import new page
import FinancialAnalysisReport from "./pages/FinancialAnalysisReport"; // Import new report page
import DailyWeeklyReportPage from "./pages/DailyWeeklyReportPage"; // Import new report page
import MonthlyPerformanceReportPage from "./pages/MonthlyPerformanceReportPage"; // Import new report page
import { SessionContextProvider } from "./integrations/supabase/session-context";

interface Transaction {
  id: string;
  type: "Sale" | "Expense";
  description: string;
  amount: number;
  date: string;
}

const defaultTransactions: Transaction[] = [
  { id: "t1", type: "Sale", description: "Project Alpha", amount: 15000.00, date: "2024-09-15" },
  { id: "t2", type: "Expense", description: "Office Rent", amount: 5000.00, date: "2024-09-01" },
  { id: "t3", type: "Sale", description: "Service Call", amount: 2500.00, date: "2024-09-18" },
  { id: "t4", type: "Expense", description: "Fuel", amount: 1100.00, date: "2024-09-19" },
];

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : defaultTransactions;
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  return (
    <Router>
      <SessionContextProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Index transactions={transactions} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/workflow" element={<WorkflowPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/financial-hub" element={<FinancialHubPage />} />
          <Route path="/financial-hub/invoices" element={<InvoicePage />} />
          <Route path="/financial-hub/payments" element={<PaymentsPage />} />
          <Route path="/financial-hub/quotes" element={<QuotesPage />} />
          <Route path="/financial-hub/statements" element={<StatementsPage />} />
          <Route path="/financial-hub/supplier-payment" element={<SupplierPaymentPage />} />
          <Route path="/financial-hub/grvs" element={<GrvsPage />} />
          <Route path="/fuel" element={<FuelPage />} />
          {/* Reports Routes */}
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/financial-analysis" element={<FinancialAnalysisReport transactions={transactions} />} />
          <Route path="/reports/daily-weekly" element={<DailyWeeklyReportPage />} />
          <Route path="/reports/monthly-performance" element={<MonthlyPerformanceReportPage />} />
        </Routes>
      </SessionContextProvider>
    </Router>
  );
}

export default App;