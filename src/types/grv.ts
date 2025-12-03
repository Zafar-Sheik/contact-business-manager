import { Supplier } from "./supplier";
import { StockItemForInvoice } from "./invoice";

export interface GrvItem {
  id: string;
  grv_id: string | null;
  stock_item_id: string | null;
  qty: number;
  cost_price: number;
  selling_price: number;
  created_at: string;
}

export type GrvItemInsert = Omit<GrvItem, 'id' | 'grv_id' | 'created_at'>;

export interface Grv {
  id: string;
  user_id: string;
  date: string; // ISO date string
  supplier_id: string | null;
  reference: string;
  order_no: string | null; // New field
  note: string | null;
  created_at: string;
  updated_at: string;
}

export type GrvInsert = Omit<Grv, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'note' | 'order_no'> & {
  note?: string | null;
  order_no?: string | null;
  items: GrvItemInsert[]; // For form submission
};

// Extended Stock Item type specifically for GRV processing
export interface StockItemForGrv extends StockItemForInvoice {
  quantity_on_hand: number;
  cost_price: number;
}

// Re-export shared types for convenience
export type { Supplier, StockItemForInvoice };