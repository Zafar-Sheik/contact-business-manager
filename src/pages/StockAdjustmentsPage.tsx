"use client";

import React from "react";
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
  Package,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart,
  Filter,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const StockAdjustmentsPage: React.FC = () => {
  // Mock data for demonstration
  const adjustmentStats = {
    totalAdjustments: 24,
    positiveAdjustments: 18,
    negativeAdjustments: 6,
    totalValueImpact: 12500,
    thisMonth: 8,
    lastUpdated: "Today, 09:15 AM",
  };

  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

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
                  <div className="p-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg">
                    <RefreshCw className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Stock Adjustments
                  </h1>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Manage inventory corrections, returns, and quantity updates
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-white">
                <AlertCircle className="h-3 w-3 mr-1" />
                Audit Trail
              </Badge>
            </div>
          </div>
        </div>

        {/* Adjustment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Adjustments
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {adjustmentStats.totalAdjustments}
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
                    Positive (+)
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {adjustmentStats.positiveAdjustments}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Negative (-)
                  </p>
                  <p className="text-2xl font-bold text-red-700">
                    {adjustmentStats.negativeAdjustments}
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
                    Value Impact
                  </p>
                  <p className="text-2xl font-bold text-amber-700">
                    {formatCurrency(adjustmentStats.totalValueImpact)}
                  </p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Package className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <RefreshCw className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Adjustment Management
                  </CardTitle>
                  <CardDescription>
                    Track and manage inventory adjustments with detailed audit
                    trails
                  </CardDescription>
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
                  Export Log
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Stock Adjustments Functionality
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                This feature is currently under development. Stock adjustments
                will allow you to:
              </p>

              <div className="max-w-2xl mx-auto space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-900">
                        Stock Increases
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Record stock additions, returns, and corrections
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border border-red-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-gray-900">
                        Stock Decreases
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Track damage, theft, or write-off adjustments
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-gray-900">
                        Audit Reports
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Generate detailed adjustment history reports
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 text-blue-600 mr-2" />
                    Coming Soon Features
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                      Automatic stock level corrections based on physical counts
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                      Detailed reason codes for all adjustments (damage, return,
                      etc.)
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                      Approval workflows for significant stock value changes
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Importance of Stock Adjustments
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                Maintain accurate inventory records for financial reporting
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                Identify and investigate stock discrepancies and shrinkage
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                Ensure compliance with inventory audit requirements
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <BarChart className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Adjustment Workflow
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                Physical stock count identifies discrepancies
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                Adjustment entries reconcile system vs physical counts
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                Audit trails document all changes for future reference
              </li>
            </ul>
          </div>
        </div>

        {/* Status Footer */}
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-amber-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <RefreshCw className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Development Progress
                </p>
                <p className="text-sm text-gray-600">
                  Last updated: {adjustmentStats.lastUpdated} • Estimated
                  completion: Q2 2024
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200">
              In Development
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAdjustmentsPage;
