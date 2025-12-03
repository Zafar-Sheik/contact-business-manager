"use client";

import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BarChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  DollarSign,
  Users,
  PieChart,
  LineChart,
  FileText,
  Download,
  Filter,
  Target,
  Activity,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MenuItemCard from "@/components/MenuItemCard";
import { Separator } from "@/components/ui/separator";

const ReportsPage: React.FC = () => {
  const reportItems = [
    {
      icon: BarChart,
      title: "Sales & Expense Analysis",
      to: "/reports/financial-analysis",
      description: "Revenue vs expenses breakdown",
      color: "from-blue-600 to-cyan-600",
      badge: "Detailed",
    },
    {
      icon: Calendar,
      title: "Daily/Weekly Summary",
      to: "/reports/daily-weekly",
      description: "Short-term performance metrics",
      color: "from-green-600 to-emerald-600",
      badge: "Quick View",
    },
    {
      icon: Clock,
      title: "Monthly Performance",
      to: "/reports/monthly-performance",
      description: "Long-term trends and insights",
      color: "from-purple-600 to-pink-600",
      badge: "Comprehensive",
    },
  ];

  // Mock data for stats
  const reportStats = {
    totalReports: 8,
    availableReports: 3,
    comingSoon: 5,
    lastGenerated: "Today, 10:30 AM",
    mostViewed: "Monthly Performance",
  };

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
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    <BarChart className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Business Intelligence & Reports
                  </h1>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Comprehensive analytics and insights for informed decision
                  making
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-white">
                <Activity className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Reports
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportStats.totalReports}
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
                    Available Now
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {reportStats.availableReports}
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
                    Coming Soon
                  </p>
                  <p className="text-2xl font-bold text-amber-700">
                    {reportStats.comingSoon}
                  </p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Most Viewed
                  </p>
                  <p className="text-lg font-bold text-purple-700 truncate">
                    {reportStats.mostViewed}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                  <p className="text-sm text-gray-600">
                    Generate and export reports instantly
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-gray-300">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Reports
                </Button>
                <Button
                  size="sm"
                  className="h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Available Reports
            </h2>
            <Badge variant="outline" className="bg-white">
              Click to explore
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportItems
              .slice(0, reportStats.availableReports)
              .map((item, index) => (
                <Card
                  key={item.title}
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white cursor-pointer group">
                  <Link to={item.to}>
                    <CardContent className="p-5">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div
                          className={`p-3 bg-gradient-to-r ${item.color} rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-200`}>
                          <item.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            item.badge === "Coming Soon"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                              : "bg-green-100 text-green-800 hover:bg-green-100"
                          }`}>
                          {item.badge}
                        </Badge>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
          </div>
        </div>

        {/* Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
              <CardTitle className="text-lg font-semibold flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                Report Features
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="p-1 bg-green-100 rounded-lg mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Real-time Data</p>
                    <p className="text-sm text-gray-600">
                      All reports update automatically with live business data
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-100 rounded-lg mt-0.5">
                    <Download className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Export Options</p>
                    <p className="text-sm text-gray-600">
                      Download reports as PDF, Excel, or CSV for offline
                      analysis
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="p-1 bg-purple-100 rounded-lg mt-0.5">
                    <Filter className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Custom Filters</p>
                    <p className="text-sm text-gray-600">
                      Filter reports by date range, customer, product, or
                      category
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Target className="h-5 w-5 text-green-600 mr-2" />
                Usage Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="p-1 bg-amber-100 rounded-lg mt-0.5">
                    <Calendar className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Regular Reviews</p>
                    <p className="text-sm text-gray-600">
                      Schedule weekly report reviews to track business
                      performance
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="p-1 bg-red-100 rounded-lg mt-0.5">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Trend Analysis</p>
                    <p className="text-sm text-gray-600">
                      Use monthly reports to identify long-term trends and
                      patterns
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="p-1 bg-indigo-100 rounded-lg mt-0.5">
                    <FileText className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Documentation</p>
                    <p className="text-sm text-gray-600">
                      Export reports for meetings, audits, or financial planning
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Last Generated Info */}
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Last Report Generated
                </p>
                <p className="text-sm text-gray-600">
                  {reportStats.lastGenerated} • Data is updated in real-time
                </p>
              </div>
            </div>
            <Button variant="outline" className="border-gray-300">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add RefreshCw icon import at the top with others
import { RefreshCw, CheckCircle } from "lucide-react";

export default ReportsPage;
