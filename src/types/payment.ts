export type PaymentMethod = 'Cash' | 'EFT';
export type AllocationType = 'Invoice' | 'Whole';

export interface Payment {
  id: string;
  user_id: string;
  date: string; // ISO date string
  customer_id: string | null;
  amount: number;
  method: PaymentMethod;
  allocation_type: AllocationType;
  invoice_id: string | null;
  created_at: string;
}

export type PaymentInsert = Omit<Payment, 'id' | 'user_id' | 'created_at'>;
export type PaymentUpdate = Partial<PaymentInsert> & { id: string };