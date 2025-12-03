export interface Supplier {
  contact_person: string;
  id: string;
  user_id: string;
  supplier_code: string;
  supplier_name: string;
  address: string | null;
  cell_number: string | null;
  current_balance: number;
  ageing_balance: number | null;
  contra: string | null;
  created_at: string;
  updated_at: string;
}

export type SupplierInsert = Omit<
  Supplier,
  | "id"
  | "user_id"
  | "created_at"
  | "updated_at"
  | "current_balance"
  | "ageing_balance"
  | "contra"
> & {
  current_balance?: number;
  ageing_balance?: number | null;
  contra?: string | null;
};
export type SupplierUpdate = Partial<SupplierInsert> & { id: string };
