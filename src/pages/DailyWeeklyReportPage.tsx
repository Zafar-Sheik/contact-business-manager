"use client";

import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const DailyWeeklyReportPage: React.FC = () => {
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
                  Daily & Weekly Reports
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Detailed sales and expense summaries
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200">
              <Calendar className="h-3 w-3 mr-1" />
              Coming Soon
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Report Generator
                </h3>
                <div className="ml-auto flex items-center space-x-2">
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

            <div className="p-8">
              {/* Coming Soon Message */}
              <div className="text-center py-12">
                <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Daily & Weekly Reports
                </h3>
                <p className="text-gray-600 max-w-lg mx-auto mb-6">
                  This page will provide detailed daily and weekly summaries of
                  sales, expenses, and financial performance with interactive
                  charts and export capabilities.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-white rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        Daily Sales Summary
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      View daily sales trends, top-selling products, and revenue
                      analysis
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5 border border-red-100">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-white rounded-lg">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        Weekly Expense Report
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Track weekly expenses, supplier payments, and operational
                      costs
                    </p>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Features Preview */}
                <div className="text-left max-w-3xl mx-auto">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                    Planned Features
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center mb-2">
                        <div className="p-1.5 bg-blue-50 rounded mr-2">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                        </div>
                        <h5 className="font-medium text-gray-800">
                          Revenue Analysis
                        </h5>
                      </div>
                      <p className="text-xs text-gray-600">
                        Detailed breakdown of revenue sources and trends
                      </p>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center mb-2">
                        <div className="p-1.5 bg-green-50 rounded mr-2">
                          <FileText className="h-4 w-4 text-green-600" />
                        </div>
                        <h5 className="font-medium text-gray-800">
                          Export Reports
                        </h5>
                      </div>
                      <p className="text-xs text-gray-600">
                        Generate PDF, Excel, and CSV reports for sharing
                      </p>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center mb-2">
                        <div className="p-1.5 bg-purple-50 rounded mr-2">
                          <Calendar className="h-4 w-4 text-purple-600" />
                        </div>
                        <h5 className="font-medium text-gray-800">
                          Custom Date Range
                        </h5>
                      </div>
                      <p className="text-xs text-gray-600">
                        Select any date range for customized reporting
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 italic">
                    Feature development in progress. Check back soon for
                    updates!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyWeeklyReportPage;
