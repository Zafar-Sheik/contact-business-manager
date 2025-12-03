"use client";

import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  CreditCard,
  ClipboardList,
  ScrollText,
  PackageCheck,
  DollarSign,
  BarChart3,
  Wallet,
  Receipt,
  Calculator,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FinancialHubPage: React.FC = () => {
  const financialHubItems = [
    {
      icon: FileText,
      title: "Invoices",
      to: "/financial-hub/invoices",
      description: "Create and manage customer invoices",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: CreditCard,
      title: "Payments",
      to: "/financial-hub/payments",
      description: "Record and track customer payments",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: ClipboardList,
      title: "Quotes",
      to: "/financial-hub/quotes",
      description: "Create and manage price quotations",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: ScrollText,
      title: "Statements",
      to: "/financial-hub/statements",
      description: "Generate and send client statements",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      icon: DollarSign,
      title: "Supplier Payments",
      to: "/financial-hub/supplier-payment",
      description: "Manage payments to suppliers",
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      icon: PackageCheck,
      title: "GRVs",
      to: "/financial-hub/grvs",
      description: "Goods Received Vouchers",
      color: "from-indigo-500 to-violet-500",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      icon: BarChart3,
      title: "Financial Reports",
      to: "/reports",
      description: "Analytics and financial insights",
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      icon: Wallet,
      title: "Expense Tracking",
      to: "/financial-hub/expenses",
      description: "Track business expenses",
      color: "from-lime-500 to-green-500",
      bgColor: "bg-lime-50",
      iconColor: "text-lime-600",
    },
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
                <h1 className="text-2xl font-bold text-gray-900">
                  Financial Hub
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Centralized financial management and reporting
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200">
              <DollarSign className="h-3 w-3 mr-1" />
              Financial Management
            </Badge>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Financial Modules
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {financialHubItems.length}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Features
                  </p>
                  <p className="text-2xl font-bold text-green-700">8</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Wallet className="h-5 w-5 text-green-600" />
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
                  <p className="text-2xl font-bold text-amber-700">2</p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Calculator className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Hub Grid */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Financial Management Modules
            </h3>
            <Badge variant="outline" className="ml-auto bg-white">
              Click any module to access
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {financialHubItems.map((item, index) => (
              <Card
                key={item.title}
                className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                <Link to={item.to} className="block">
                  <CardContent className="p-5">
                    <div className="flex flex-col h-full">
                      {/* Icon with gradient background */}
                      <div className="mb-4">
                        <div
                          className={`p-3 rounded-xl ${item.bgColor} inline-block group-hover:scale-110 transition-transform`}>
                          <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                        </div>
                      </div>

                      {/* Title and Description */}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {item.description}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center justify-between mt-2">
                        <Badge
                          className={`text-xs ${
                            index < 6
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                          }`}>
                          {index < 6 ? "Active" : "Coming Soon"}
                        </Badge>
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${
                            index < 6 ? "bg-green-500" : "bg-amber-500"
                          } animate-pulse`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Financial Hub Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Complete Financial Suite
              </h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              The Financial Hub provides a comprehensive set of tools for
              managing all aspects of your business finances, from invoicing and
              payments to detailed financial reporting.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                Green badges indicate fully functional modules
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2"></div>
                Amber badges indicate features in development
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Real-time Financial Insights
              </h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Access up-to-date financial data and analytics to make informed
              business decisions. Track cash flow, monitor expenses, and analyze
              profitability.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                Click any module card to access its features
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                Hover over cards for preview animations
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialHubPage;
