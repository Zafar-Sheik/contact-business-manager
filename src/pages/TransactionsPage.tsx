"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  BarChart,
  Calendar,
  CreditCard,
  Wallet,
  PieChart,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: "Sale" | "Expense";
  description: string;
  amount: number;
  date: string;
  category?: string;
}

interface TransactionsPageProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({
  transactions,
  setTransactions,
}) => {
  const [type, setType] = useState<"Sale" | "Expense">("Sale");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("General");

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) {
      toast.error("Please fill in all fields.");
      return;
    }

    const newAmount = parseFloat(amount);
    if (isNaN(newAmount) || newAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      description,
      amount: newAmount,
      date: new Date().toLocaleDateString(),
      category,
    };

    setTransactions((prev) => [...prev, newTransaction]);
    setType("Sale");
    setDescription("");
    setAmount("");
    setCategory("General");
    toast.success("Transaction added successfully!");
  };

  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  // Calculate transaction statistics
  const totalTransactions = transactions.length;
  const totalIncome = transactions
    .filter((t) => t.type === "Sale")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const todayTransactions = transactions.filter(
    (t) => t.date === new Date().toLocaleDateString()
  ).length;

  const transactionCategories = [
    "General",
    "Materials",
    "Services",
    "Salaries",
    "Utilities",
    "Marketing",
  ];

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
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg">
                    <BarChart className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Transactions
                  </h1>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Track income, expenses, and financial transactions
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-white">
                <Calendar className="h-3 w-3 mr-1" />
                Real-time
              </Badge>
            </div>
          </div>
        </div>

        {/* Transaction Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Transactions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalTransactions}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BarChart className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Income
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(totalIncome)}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUpIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
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
                    {formatCurrency(totalExpenses)}
                  </p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Net Profit
                  </p>
                  <p className="text-2xl font-bold text-teal-700">
                    {formatCurrency(netProfit)}
                  </p>
                </div>
                <div className="p-2 bg-teal-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="add" className="mb-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-teal-50">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Wallet className="h-5 w-5 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Transaction Management
                  </h3>
                  <div className="ml-auto flex items-center space-x-2">
                    <TabsList className="bg-gray-100 p-1 rounded-lg">
                      <TabsTrigger value="add" className="rounded-md">
                        Add New
                      </TabsTrigger>
                      <TabsTrigger value="view" className="rounded-md">
                        View All
                      </TabsTrigger>
                      <TabsTrigger value="reports" className="rounded-md">
                        Reports
                      </TabsTrigger>
                    </TabsList>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 border-gray-300">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 border-gray-300">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <TabsContent value="add" className="m-0">
                  <Card className="border-0 shadow-sm bg-white">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
                      <CardTitle className="text-lg font-semibold">
                        Add New Transaction
                      </CardTitle>
                      <CardDescription>
                        Record income or expense transactions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form
                        onSubmit={handleAddTransaction}
                        className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="type">Transaction Type</Label>
                            <Select
                              value={type}
                              onValueChange={(value: "Sale" | "Expense") =>
                                setType(value)
                              }>
                              <SelectTrigger id="type" className="h-11">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  value="Sale"
                                  className="flex items-center">
                                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                                  <span>Income / Sale</span>
                                </SelectItem>
                                <SelectItem
                                  value="Expense"
                                  className="flex items-center">
                                  <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                                  <span>Expense</span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                              value={category}
                              onValueChange={setCategory}>
                              <SelectTrigger id="category" className="h-11">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {transactionCategories.map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            placeholder="e.g., Website development project, Office supplies, etc."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-11"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Amount (R)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="e.g., 1500.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="h-11"
                          />
                        </div>
                        <Button
                          type="submit"
                          className="h-11 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                          <Plus className="h-4 w-4 mr-2" /> Add Transaction
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="view" className="m-0">
                  <Card className="border-0 shadow-sm bg-white">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            All Transactions
                          </CardTitle>
                          <CardDescription>
                            {transactions.length} transactions recorded
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-white">
                          {todayTransactions} today
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {transactions.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Wallet className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Transactions Added
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Start tracking your income and expenses by adding
                            transactions
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {transactions.map((transaction) => (
                            <div
                              key={transaction.id}
                              className="flex justify-between items-center p-4 border rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center space-x-4">
                                <div
                                  className={`p-2 rounded-lg ${
                                    transaction.type === "Sale"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-red-100 text-red-600"
                                  }`}>
                                  {transaction.type === "Sale" ? (
                                    <TrendingUp className="h-5 w-5" />
                                  ) : (
                                    <TrendingDown className="h-5 w-5" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {transaction.description}
                                  </p>
                                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                                    <span>{transaction.date}</span>
                                    <Badge
                                      variant="outline"
                                      className="bg-gray-100 text-gray-700 border-gray-200">
                                      {transaction.category || "General"}
                                    </Badge>
                                    <span>{transaction.type}</span>
                                  </div>
                                </div>
                              </div>
                              <p
                                className={`font-semibold text-lg ${
                                  transaction.type === "Sale"
                                    ? "text-green-700"
                                    : "text-red-700"
                                }`}>
                                {transaction.type === "Expense" && "-"}
                                {formatCurrency(transaction.amount)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reports" className="m-0">
                  <Card className="border-0 shadow-sm bg-white">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
                      <CardTitle className="text-lg font-semibold">
                        Transaction Reports
                      </CardTitle>
                      <CardDescription>
                        Financial analysis and insights
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                          <PieChart className="h-8 w-8 text-teal-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Reports Coming Soon
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          Advanced transaction reporting features including
                          charts, trends analysis, and category breakdowns will
                          be available soon.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                            <div className="font-medium text-gray-900">
                              Income Breakdown
                            </div>
                            <div className="text-sm text-gray-600">
                              Category analysis
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                            <div className="font-medium text-gray-900">
                              Expense Trends
                            </div>
                            <div className="text-sm text-gray-600">
                              Monthly patterns
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100">
                            <div className="font-medium text-gray-900">
                              Profit Analysis
                            </div>
                            <div className="text-sm text-gray-600">
                              Net margin reports
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

              {/* Footer Summary */}
              {transactions.length > 0 && (
                <div className="border-t border-gray-100">
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-teal-50">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="flex items-center mb-3 md:mb-0">
                        <CreditCard className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">
                          {transactions.length} transactions •{" "}
                          {formatCurrency(totalIncome)} income •{" "}
                          {formatCurrency(totalExpenses)} expenses
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">
                          Net Profit/Loss:
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            netProfit >= 0 ? "text-green-700" : "text-red-700"
                          }`}>
                          {formatCurrency(netProfit)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Tabs>

        {/* Financial Overview */}
        {transactions.length > 0 && (
          <Card className="border-0 shadow-lg mb-6">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
              <CardTitle className="text-lg font-semibold flex items-center">
                <PieChart className="h-5 w-5 text-blue-600 mr-2" />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {formatCurrency(totalIncome)}
                  </div>
                  <div className="text-sm text-gray-600">Total Income</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {transactions.filter((t) => t.type === "Sale").length}{" "}
                    income transactions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-700">
                    {formatCurrency(totalExpenses)}
                  </div>
                  <div className="text-sm text-gray-600">Total Expenses</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {transactions.filter((t) => t.type === "Expense").length}{" "}
                    expense transactions
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${
                      netProfit >= 0 ? "text-teal-700" : "text-red-700"
                    }`}>
                    {formatCurrency(netProfit)}
                  </div>
                  <div className="text-sm text-gray-600">Net Result</div>
                  <div
                    className={`text-xs ${
                      netProfit >= 0 ? "text-teal-600" : "text-red-600"
                    } mt-1 font-medium`}>
                    {netProfit >= 0 ? "Profit" : "Loss"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Wallet className="h-5 w-5 text-teal-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Transaction Management Tips
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                Record transactions immediately to maintain accurate financial
                records
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                Use categories to organize and analyze your income and expenses
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                Regularly review net profit to monitor business financial health
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <BarChart className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Financial Analysis
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                Green amounts show income and profits
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></div>
                Red amounts indicate expenses and losses
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                Monitor the net profit margin to assess business performance
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
