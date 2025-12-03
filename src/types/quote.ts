import { StockItemForInvoice, Customer } from "./invoice";

export interface QuoteItem {
  id: string;
  quote_id: string;
  stock_item_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  vat_rate: number; // Percentage, e.g., 15
  line_total: number; // Total including VAT
  created_at: string;
}

export type QuoteItemInsert = Omit<QuoteItem, 'id' | 'quote_id' | 'created_at' | 'line_total'> & {
  line_total?: number;
};

export interface Quote {
  id: string;
  user_id: string;
  quote_no: string;
  date: string; // ISO date string
  customer_id: string | null;
  work_scope: string | null;
  subtotal: number; // Total excluding VAT
  vat_amount: number;
  total_amount: number; // Total including VAT
  status: 'Draft' | 'Sent' | 'Accepted' | 'Invoiced' | 'Cancelled';
  created_at: string;
  updated_at: string;
}

export type QuoteInsert = Omit<Quote, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'subtotal' | 'vat_amount' | 'total_amount' | 'status'> & {
  status?: 'Draft' | 'Sent' | 'Accepted' | 'Invoiced' | 'Cancelled';
  items: QuoteItemInsert[]; // For form submission
};

// Re-export shared types for convenience
export type { Customer, StockItemForInvoice };