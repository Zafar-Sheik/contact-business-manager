"use client";

import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  BarChart,
  Calendar,
  Download,
  Filter,
  TrendingDown,
  Target,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const MonthlyPerformanceReportPage: React.FC = () => {
  // Mock data for demonstration
  const performanceData = {
    currentMonth: "December 2024",
    revenue: 124850,
    revenueGrowth: 12.5,
    customers: 342,
    customerGrowth: 8.2,
    invoices: 156,
    invoiceGrowth: 15.3,
    pendingPayments: 28450,
    efficiencyScore: 87,
    topServices: [
      { name: "Hardware Repair", revenue: 45600, growth: 18.2 },
      { name: "Software Support", revenue: 38900, growth: 9.5 },
      { name: "Network Setup", revenue: 25300, growth: 22.1 },
      { name: "Consultation", revenue: 15050, growth: 5.7 },
    ],
    monthlyTrend: [
      { month: "Aug", revenue: 98000, customers: 280 },
      { month: "Sep", revenue: 105000, customers: 295 },
      { month: "Oct", revenue: 112500, customers: 310 },
      { month: "Nov", revenue: 118700, customers: 325 },
      { month: "Dec", revenue: 124850, customers: 342 },
    ],
  };

  const formatCurrency = (amount: number) =>
    `R${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
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
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Monthly Performance Report
                  </h1>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Comprehensive business metrics and growth analysis
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
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-gray-300">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Badge variant="outline" className="bg-white px-3 py-1">
                <Calendar className="h-3 w-3 mr-1" />
                {performanceData.currentMonth}
              </Badge>
            </div>
          </div>

          {/* Month Selector */}
          <div className="flex items-center space-x-2 mb-6">
            <Button variant="outline" size="sm" className="h-8">
              Previous
            </Button>
            <div className="flex-1 text-center">
              <span className="text-lg font-semibold text-gray-900">
                {performanceData.currentMonth}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                Performance Dashboard
              </span>
            </div>
            <Button variant="outline" size="sm" className="h-8">
              Next
            </Button>
          </div>
        </div>

        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(performanceData.revenue)}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs font-medium text-green-600">
                      +{performanceData.revenueGrowth}% from last month
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {performanceData.customers}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-xs font-medium text-blue-600">
                      +{performanceData.customerGrowth}% growth
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Invoices Generated
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {performanceData.invoices}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-xs font-medium text-purple-600">
                      +{performanceData.invoiceGrowth}% increase
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <BarChart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Payments
                  </p>
                  <p className="text-2xl font-bold text-red-700">
                    {formatCurrency(performanceData.pendingPayments)}
                  </p>
                  <div className="flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                    <span className="text-xs font-medium text-amber-600">
                      Requires follow-up
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="rounded-lg data-[state=active]:bg-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="rounded-lg data-[state=active]:bg-white">
              <Target className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger
              value="trends"
              className="rounded-lg data-[state=active]:bg-white">
              <BarChart className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Performance Score */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Business Efficiency Score
                </CardTitle>
                <CardDescription>
                  Overall performance rating based on key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-gray-900">
                      {performanceData.efficiencyScore}/100
                    </div>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      Excellent
                    </Badge>
                  </div>
                  <Progress
                    value={performanceData.efficiencyScore}
                    className="h-3"
                  />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-gray-900">
                        Customer Satisfaction
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        92%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">
                        Revenue Target
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        98%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">
                        Efficiency
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        85%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceData.topServices.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-lg mr-3 ${
                              index === 0
                                ? "bg-green-100"
                                : index === 1
                                ? "bg-blue-100"
                                : index === 2
                                ? "bg-purple-100"
                                : "bg-amber-100"
                            }`}>
                            <DollarSign
                              className={`h-4 w-4 ${
                                index === 0
                                  ? "text-green-600"
                                  : index === 1
                                  ? "text-blue-600"
                                  : index === 2
                                  ? "text-purple-600"
                                  : "text-amber-600"
                              }`}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {service.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatCurrency(service.revenue)}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            service.growth > 15
                              ? "bg-green-50 text-green-700 border-green-200"
                              : service.growth > 10
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }>
                          {service.growth > 0 ? "+" : ""}
                          {service.growth}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Monthly Trends
                  </CardTitle>
                  <CardDescription>
                    6-month performance overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceData.monthlyTrend.map((monthData, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900">
                            {monthData.month}
                          </div>
                          <div className="font-bold text-gray-900">
                            {formatCurrency(monthData.revenue)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                              style={{
                                width: `${(monthData.revenue / 130000) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="text-sm text-gray-500">
                            {monthData.customers} customers
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            {/* Services Content - Similar structure */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="text-center text-gray-600">
                  Detailed services analysis coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Trends Content - Similar structure */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="text-center text-gray-600">
                  Advanced trend analytics coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Insights & Recommendations */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <CardTitle className="text-lg font-semibold flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Performance Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-green-100 rounded-lg mt-0.5">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Strong Revenue Growth
                    </p>
                    <p className="text-sm text-gray-600">
                      Revenue increased by {performanceData.revenueGrowth}% this
                      month. Consider expanding your most profitable services.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-100 rounded-lg mt-0.5">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Customer Base Growing
                    </p>
                    <p className="text-sm text-gray-600">
                      Added{" "}
                      {Math.round(
                        performanceData.customers *
                          (performanceData.customerGrowth / 100)
                      )}
                      new customers this month. Focus on retention strategies.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-amber-100 rounded-lg mt-0.5">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Payment Follow-up Needed
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(performanceData.pendingPayments)} in
                      pending payments. Schedule payment reminders for overdue
                      invoices.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-purple-100 rounded-lg mt-0.5">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Network Services Booming
                    </p>
                    <p className="text-sm text-gray-600">
                      Network setup services grew by 22.1%. Consider allocating
                      more resources to this high-growth area.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                More Analytics Coming Soon
              </h3>
              <p className="text-sm text-gray-600 max-w-md">
                We're continuously enhancing our analytics dashboard with
                advanced reporting features, predictive insights, and custom
                metric tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPerformanceReportPage;
