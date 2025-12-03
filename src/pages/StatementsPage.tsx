"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useStatements } from "@/hooks/use-statements";
import { Client } from "@/types/client";
import StatementTable from "@/components/StatementTable";
import StatementDetailView from "@/components/StatementDetailView";
import { Skeleton } from "@/components/ui/skeleton";

const StatementsPage: React.FC = () => {
  const { clients, invoices, payments, isLoading, generateStatement } = useStatements();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };

  const handleBack = () => {
    setSelectedClient(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
        <header className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/financial-hub">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-2">Statements</h1>
        </header>
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {!selectedClient ? (
          <>
            <header className="flex items-center mb-6">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/financial-hub">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold ml-2 flex items-center">
                <FileText className="h-6 w-6 mr-2" /> Client Statements
              </h1>
            </header>
            <StatementTable
              clients={clients}
              isLoading={isLoading}
              onSelectClient={handleSelectClient}
            />
          </>
        ) : (
          <StatementDetailView
            client={selectedClient}
            invoices={invoices}
            payments={payments}
            onBack={handleBack}
            generateStatement={generateStatement}
          />
        )}
      </div>
    </div>
  );
};

export default StatementsPage;