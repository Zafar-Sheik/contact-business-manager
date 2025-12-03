"use client";

import React from "react";
import MenuItemCard from "./MenuItemCard";
import {
  Workflow,
  Users,
  User,
  Truck,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Zap,
  Landmark, // Icon for Financial Hub
  Fuel, // New icon for Fuel
  Settings, // Icon for Profile/Settings
  BarChart, // Icon for Reports
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStock } from "@/hooks/use-stock";
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
  id: string;
  type: "Sale" | "Expense";
  description: string;
  amount: number;
  date: string;
}

interface MobileDashboardProps {
  transactions: Transaction[];
}

const menuItems = [
  { icon: Landmark, title: "Financial Hub", to: "/financial-hub" }, // MOVED TO FIRST
  { icon: Workflow, title: "Workflow", to: "/workflow" },
  { icon: Users, title: "Staff", to: "/staff" },
  { icon: User, title: "Clients", to: "/clients" },
  { icon: Truck, title: "Suppliers", to: "/suppliers" },
  { icon: Package, title: "Stock", to: "/stock" },
  { icon: Fuel, title: "Fuel", to: "/fuel" },
  { icon: BarChart, title: "Reports", to: "/reports" },
  { icon: Settings, title: "Profile", to: "/profile" },
];

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const MobileDashboard: React.FC<MobileDashboardProps> = ({ transactions }) => {
  const { totalStockValue, isLoading: isStockLoading } = useStock();

  const totalSales = transactions
    .filter((t) => t.type === "Sale")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalSales - totalExpenses;
  
  const isSummaryLoading = isStockLoading; // Extend loading state if needed

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <div className="flex justify-start mb-4">
          <img
            src="/contact-online-solutions-logo.png"
            alt="Contact Online Solutions Logo"
            className="max-h-48 w-auto"
          />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl hidden">
          MR Power
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Your business at a glance
        </p>
      </header>

      <div className="max-w-4xl mx-auto space-y-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Financial Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total Sales Card (Green) */}
          <Card className="shadow-none border-2 bg-green-50/50 hover:border-green-500 transition-colors dark:bg-green-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">R{totalSales.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          {/* Total Expenses Card (Red) */}
          <Card className="shadow-none border-2 bg-red-50/50 hover:border-red-500 transition-colors dark:bg-red-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                R{totalExpenses.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          {/* Net Balance Card (Dynamic Color) */}
          <Card className={`shadow-none border-2 transition-colors ${
            netBalance >= 0 
              ? 'bg-blue-50/50 hover:border-blue-500 dark:bg-blue-900/20' 
              : 'bg-red-50/50 hover:border-red-500 dark:bg-red-900/20'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div
                className={`text-xl font-bold ${
                  netBalance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                R{netBalance.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          {/* Stock Valuation Card (Primary/Neutral) */}
          <Card className="shadow-none border-2 bg-muted/50 hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-sm font-medium">Stock Valuation (Cost)</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {isStockLoading ? (
                <Skeleton className="h-6 w-3/4" />
              ) : (
                <div className="text-xl font-bold text-primary">
                  {formatCurrency(totalStockValue)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {menuItems.map((item, index) => (
          <MenuItemCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            to={item.to}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileDashboard;