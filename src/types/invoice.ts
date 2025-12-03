import { ReactNode } from "react";
import { StockItem } from "./stock";

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  stock_item_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  vat_rate: number; // Percentage, e.g., 15
  line_total: number; // Total including VAT
  created_at: string;
}

export type InvoiceItemInsert = Omit<
  InvoiceItem,
  "id" | "invoice_id" | "created_at" | "line_total"
> & {
  line_total?: number;
};

export interface Invoice {
  id: string;
  user_id: string;
  invoice_no: string;
  date: string; // ISO date string
  customer_id: string | null;
  work_scope: string | null;
  subtotal: number; // Total excluding VAT
  vat_amount: number;
  total_amount: number; // Total including VAT
  status: "Draft" | "Sent" | "Paid" | "Cancelled";
  is_vat_invoice: boolean; // NEW: Track if this was a VAT invoice
  created_at: string;
  updated_at: string;
}

export type InvoiceInsert = Omit<
  Invoice,
  | "id"
  | "user_id"
  | "created_at"
  | "updated_at"
  | "subtotal"
  | "vat_amount"
  | "total_amount"
  | "status"
  | "is_vat_invoice"
> & {
  status?: "Draft" | "Sent" | "Paid" | "Cancelled";
  is_vat_invoice: boolean; // Must be provided on insert
  items: InvoiceItemInsert[]; // For form submission
};

export interface Customer {
  address: any;
  email: any;
  customer_code: ReactNode;
  id: string;
  customer_name: string;
  phone_number: string | null;
}

export interface StockItemForInvoice {
  cost_price: any;
  quantity_on_hand: ReactNode;
  id: string;
  stock_code: string;
  stock_descr: string;
  selling_price: number;
  vat: number;
}
