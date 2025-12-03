"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@/types/client";
import { Loader2 } from "lucide-react";

interface StatementTableProps {
  clients: Client[];
  isLoading: boolean;
  onSelectClient: (client: Client) => void;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const StatementTable: React.FC<StatementTableProps> = ({
  clients,
  isLoading,
  onSelectClient,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No clients found.
      </p>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead className="text-right">Balance Owing</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              onClick={() => onSelectClient(client)}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">{client.customer_name}</TableCell>
              <TableCell>{client.customer_code}</TableCell>
              <TableCell className={`text-right font-semibold ${client.current_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(client.current_balance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StatementTable;