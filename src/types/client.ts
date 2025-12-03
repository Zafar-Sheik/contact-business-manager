export interface Client {
  id: string;
  user_id: string;
  customer_code: string;
  customer_name: string; // Company Name
  owner: string | null;
  address: string | null;
  phone_number: string | null; // Cell No
  email: string | null;
  vat_no: string | null;
  reg_no: string | null;
  price_category: string | null;
  credit_limit: number;
  current_balance: number; // Balance Owing
  created_at: string;
  updated_at: string;
}

export type ClientInsert = Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'current_balance'> & {
  current_balance?: number;
};
export type ClientUpdate = Partial<ClientInsert> & { id: string };

// --- Statement Types ---
export interface StatementEntry {
  date: string; // ISO date string
  type: 'Invoice' | 'Payment';
  reference: string;
  amount: number; // Positive for Invoice, Negative for Payment
  balance: number;
}