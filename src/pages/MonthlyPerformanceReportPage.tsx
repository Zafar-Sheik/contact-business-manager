"use client";

import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const MonthlyPerformanceReportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/reports">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold ml-2 flex items-center">
          <Clock className="h-6 w-6 mr-2" /> Monthly Performance
        </h1>
      </header>
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <p className="text-muted-foreground">
          This page will display comprehensive monthly performance metrics and trends.
        </p>
        <p className="text-sm text-muted-foreground italic">
          (Functionality coming soon)
        </p>
      </div>
    </div>
  );
};

export default MonthlyPerformanceReportPage;