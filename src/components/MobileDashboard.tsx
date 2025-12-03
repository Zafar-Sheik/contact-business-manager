"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuItemCard from "./MenuItemCard";
import {
  Workflow,
  Plus,
  Users,
  User,
  Truck,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Zap,
  Landmark,
  Fuel,
  Settings,
  BarChart,
  Home,
  Bell,
  Menu,
  ChevronRight,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useStock } from "@/hooks/use-stock";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface Transaction {
  id: string;
  type: "Sale" | "Expense" | "Payment" | "Credit";
  description: string;
  amount: number;
  date: string;
  status?: "Completed" | "Pending" | "Overdue";
}

interface MobileDashboardProps {
  transactions: Transaction[];
  onRefresh?: () => void;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;
const formatDate = (date: string) => format(new Date(date), "MMM dd");

const menuItems = [
  {
    icon: Landmark,
    title: "Financial Hub",
    to: "/financial-hub",
    variant: "success" as const,
    count: 12,
    isNew: true,
  },
  {
    icon: Workflow,
    title: "Workflow",
    to: "/workflow",
    variant: "primary" as const,
    count: 3,
  },
  {
    icon: Users,
    title: "Staff",
    to: "/staff",
    variant: "warning" as const,
    count: 8,
  },
  {
    icon: User,
    title: "Clients",
    to: "/clients",
    variant: "default" as const,
    count: 45,
  },
  {
    icon: Truck,
    title: "Suppliers",
    to: "/suppliers",
    variant: "danger" as const,
    count: 15,
  },
  {
    icon: Package,
    title: "Stock",
    to: "/stock",
    variant: "success" as const,
    count: 156,
  },
  {
    icon: Fuel,
    title: "Fuel",
    to: "/fuel",
    variant: "warning" as const,
    count: 7,
  },
  {
    icon: BarChart,
    title: "Reports",
    to: "/reports",
    variant: "primary" as const,
  },
  {
    icon: Settings,
    title: "Settings",
    to: "/profile",
    variant: "default" as const,
  },
];

const MobileDashboard: React.FC<MobileDashboardProps> = ({
  transactions = [],
  onRefresh,
}) => {
  const { totalStockValue, isLoading: isStockLoading } = useStock();
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(3);

  const totalSales = transactions
    .filter((t) => t.type === "Sale")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayments = transactions
    .filter((t) => t.type === "Payment")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCredits = transactions
    .filter((t) => t.type === "Credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalSales + totalPayments - totalExpenses - totalCredits;
  const cashFlow = totalSales - totalExpenses;
  const isPositiveCashFlow = cashFlow >= 0;

  // Recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 pt-3 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Home className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold">MR Power Dashboard</h1>
              <p className="text-xs text-blue-100">Welcome back</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
            <div className="text-[10px] text-blue-200">Today's Sales</div>
            <div className="text-base font-bold">R1,245.80</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
            <div className="text-[10px] text-blue-200">Pending Invoices</div>
            <div className="text-base font-bold">7</div>
          </div>
        </div>
      </div>

      <div className="px-3 py-2">
        {/* Financial Overview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">
              Financial Overview
            </h2>
            <Link
              to="/financial-hub"
              className="text-xs text-blue-600 flex items-center">
              Details <ChevronRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Income Card */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
              <CardHeader className="p-2.5 pb-1.5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold text-gray-800">
                    Income
                  </CardTitle>
                  <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="p-2.5 pt-1">
                <div className="text-xl font-bold text-green-700 mb-0.5">
                  {formatCurrency(totalSales + totalPayments)}
                </div>
                <div className="text-[10px] text-gray-600 leading-tight">
                  Sales: {formatCurrency(totalSales)}
                  <br />
                  Payments: {formatCurrency(totalPayments)}
                </div>
              </CardContent>
            </Card>

            {/* Expenses Card */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-pink-100 border-red-200">
              <CardHeader className="p-2.5 pb-1.5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold text-gray-800">
                    Expenses
                  </CardTitle>
                  <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                </div>
              </CardHeader>
              <CardContent className="p-2.5 pt-1">
                <div className="text-xl font-bold text-red-700 mb-0.5">
                  {formatCurrency(totalExpenses + totalCredits)}
                </div>
                <div className="text-[10px] text-gray-600 leading-tight">
                  Expenses: {formatCurrency(totalExpenses)}
                  <br />
                  Credit: {formatCurrency(totalCredits)}
                </div>
              </CardContent>
            </Card>

            {/* Net Balance Card */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 col-span-2 mt-2">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold text-gray-800">
                    Net Balance
                  </CardTitle>
                  <div className="flex items-center">
                    {isPositiveCashFlow ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 text-red-600 mr-1" />
                    )}
                    <Badge
                      variant={isPositiveCashFlow ? "default" : "destructive"}
                      className="text-[10px] h-5">
                      {isPositiveCashFlow ? "Positive" : "Negative"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-1">
                <div
                  className={`text-2xl font-bold ${
                    isPositiveCashFlow ? "text-green-700" : "text-red-700"
                  }`}>
                  {formatCurrency(netBalance)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Cash Flow: {isPositiveCashFlow ? "+" : "-"}
                  {formatCurrency(Math.abs(cashFlow))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-3 mb-3 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="overview"
              className="rounded-md text-xs py-1.5 data-[state=active]:bg-white">
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="stock"
              className="rounded-md text-xs py-1.5 data-[state=active]:bg-white">
              Stock
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className="rounded-md text-xs py-1.5 data-[state=active]:bg-white">
              Recent
            </TabsTrigger>
          </TabsList>

          {/* Stock Tab */}
          <TabsContent value="stock" className="space-y-3">
            <Card className="border-0 shadow-md">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-green-50 rounded-lg">
                      <Package className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-gray-800">
                        Stock Valuation
                      </h3>
                      <p className="text-[10px] text-gray-600">
                        Current inventory value
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {isStockLoading ? (
                    <div className="space-y-1.5">
                      <Skeleton className="h-7 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-700">
                          {formatCurrency(totalStockValue)}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          Total Cost Value
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-[10px] text-gray-500">
                            Low Stock
                          </div>
                          <div className="text-base font-bold text-red-600">
                            8
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-[10px] text-gray-500">
                            Categories
                          </div>
                          <div className="text-base font-bold text-blue-600">
                            12
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Tab */}
          <TabsContent value="recent" className="space-y-3">
            <Card className="border-0 shadow-md">
              <CardContent className="p-0">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-blue-50 rounded-lg">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-800">
                          Recent Activity
                        </h3>
                        <p className="text-[10px] text-gray-600">
                          Latest transactions
                        </p>
                      </div>
                    </div>
                    <Link to="/transactions" className="text-xs text-blue-600">
                      View All
                    </Link>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto">
                  {recentTransactions.length > 0 ? (
                    <div className="divide-y">
                      {recentTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="p-2.5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-1.5 mb-0.5">
                                <Badge
                                  variant={
                                    transaction.type === "Sale" ||
                                    transaction.type === "Payment"
                                      ? "default"
                                      : "destructive"
                                  }
                                  className="text-[10px] h-4">
                                  {transaction.type}
                                </Badge>
                                <span className="text-[10px] text-gray-500">
                                  {formatDate(transaction.date)}
                                </span>
                              </div>
                              <p className="text-xs font-medium text-gray-800 truncate">
                                {transaction.description}
                              </p>
                            </div>
                            <div className="text-right ml-2">
                              <div
                                className={`font-bold text-sm ${
                                  transaction.type === "Sale" ||
                                  transaction.type === "Payment"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}>
                                {transaction.type === "Sale" ||
                                transaction.type === "Payment"
                                  ? "+"
                                  : "-"}
                                {formatCurrency(transaction.amount)}
                              </div>
                              {transaction.status && (
                                <Badge
                                  variant={
                                    transaction.status === "Completed"
                                      ? "default"
                                      : transaction.status === "Pending"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                  className="text-[10px] h-4 mt-0.5">
                                  {transaction.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="p-2 bg-gray-100 rounded-full inline-flex mb-2">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-600">
                        No recent transactions
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Access Menu */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Quick Access</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 h-7 text-xs">
              <Eye className="h-3 w-3 mr-1" />
              View All
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {menuItems.map((item) => (
              <div key={item.title} className="min-h-[80px]">
                <MenuItemCard
                  icon={item.icon}
                  title={item.title}
                  to={item.to}
                  variant={item.variant}
                  count={item.count}
                  isNew={item.isNew}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
