"use client";

import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BarChart, TrendingUp, TrendingDown, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import MenuItemCard from "@/components/MenuItemCard";

const ReportsPage: React.FC = () => {
  const reportItems = [
    { icon: TrendingUp, title: "Sales & Expense Analysis", to: "/reports/financial-analysis" },
    { icon: Calendar, title: "Daily/Weekly Summary", to: "/reports/daily-weekly" },
    { icon: Clock, title: "Monthly Performance", to: "/reports/monthly-performance" },
    // Future reports: Stock Valuation, Supplier Ageing, etc.
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold ml-2 flex items-center">
          <BarChart className="h-6 w-6 mr-2" /> Business Reports
        </h1>
      </header>
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {reportItems.map((item, index) => (
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

export default ReportsPage;