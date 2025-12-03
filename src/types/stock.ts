export interface StockItem {
  id: string;
  user_id: string;
  stock_code: string;
  stock_descr: string; // Item Name
  category: string;
  size: string | null; // Used for dimensions (meters, lengths, blocks)
  cost_price: number;
  selling_price: number; // Price C (default selling price)
  price_a: number;
  price_b: number;
  price_d: number;
  price_e: number;
  last_cost: number;
  quantity_on_hand: number;
  quantity_in_warehouse: number;
  supplier: string | null;
  vat: number;
  image_data_url: string | null;
  min_level: number;
  max_level: number;
  promotion: boolean;
  promo_start_date: string | null;
  promo_end_date: string | null;
  promo_price: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type StockItemInsert = Omit<
  StockItem,
  | 'id'
  | 'user_id'
  | 'created_at'
  | 'updated_at'
  | 'quantity_on_hand'
  | 'quantity_in_warehouse'
  | 'last_cost'
> & {
  quantity_on_hand?: number;
  quantity_in_warehouse?: number;
  last_cost?: number;
};

export type StockItemUpdate = Partial<StockItemInsert> & { id: string };