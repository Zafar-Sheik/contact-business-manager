"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const StockAdjustmentsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold ml-2">Stock Adjustments</h1>
      </header>
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-muted-foreground">
          This is the Stock Adjustments page. Functionality to be added here.
        </p>
      </div>
    </div>
  );
};

export default StockAdjustmentsPage;