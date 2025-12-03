"use client";

import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StockItem } from "@/types/stock";
import { Loader2, Edit, Trash2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface StockTableProps {
  stockItems: StockItem[];
  isLoading: boolean;
  onEdit: (item: StockItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

const StockTable: React.FC<StockTableProps> = ({
  stockItems,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (stockItems.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No stock items found matching your criteria.
      </p>
    );
  }
  
  const getQuantityBadgeVariant = (qty: number, minLevel: number) => {
    if (qty <= minLevel) {
      return 'destructive';
    }
    if (qty < minLevel * 2) {
      return 'secondary';
    }
    return 'default';
  };

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Cost</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Sell (C)</TableHead>
            <TableHead className="text-center w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.stock_code}</TableCell>
              <TableCell>
                <div className="font-medium">{item.stock_descr}</div>
                <div className="text-xs text-muted-foreground">{item.category} | VAT: {item.vat}%</div>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant={getQuantityBadgeVariant(item.quantity_on_hand, item.min_level)}>
                  {item.quantity_on_hand}
                </Badge>
              </TableCell>
              <TableCell className="text-right hidden sm:table-cell">
                {formatCurrency(item.cost_price)}
              </TableCell>
              <TableCell className="text-right hidden sm:table-cell font-semibold">
                {formatCurrency(item.selling_price)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(item)}
                    disabled={isDeleting}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" disabled={isDeleting}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the stock item: {item.stock_descr}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(item.id)}
                          disabled={isDeleting}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockTable;