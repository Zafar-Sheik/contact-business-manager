"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CreditCard, ClipboardList, ScrollText, PackageCheck, DollarSign } from "lucide-react";
import MenuItemCard from "@/components/MenuItemCard"; // Assuming MenuItemCard is in components

const FinancialHubPage: React.FC = () => {
  const financialHubItems = [
    { icon: FileText, title: "Invoices", to: "/financial-hub/invoices" },
    { icon: CreditCard, title: "Payments", to: "/financial-hub/payments" },
    { icon: ClipboardList, title: "Quotes", to: "/financial-hub/quotes" },
    { icon: ScrollText, title: "Statements", to: "/financial-hub/statements" },
    { icon: DollarSign, title: "Supplier Payment", to: "/financial-hub/supplier-payment" },
    { icon: PackageCheck, title: "GRVs", to: "/financial-hub/grvs" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold ml-2">Financial Hub</h1>
      </header>
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {financialHubItems.map((item, index) => (
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

export default FinancialHubPage;