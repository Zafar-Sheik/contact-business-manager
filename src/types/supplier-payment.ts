export type SupplierPaymentMethod = 'Cash' | 'EFT';

export interface SupplierPayment {
  id: string;
  user_id: string;
  date: string; // ISO date string
  supplier_id: string | null;
  amount: number;
  method: SupplierPaymentMethod;
  reference: string | null;
  created_at: string;
}

export type SupplierPaymentInsert = Omit<SupplierPayment, 'id' | 'user_id' | 'created_at'>;