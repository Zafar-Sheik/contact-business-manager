export type PayMethod = 'Daily' | 'Weekly' | 'Monthly';

export interface Staff {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  id_number: string | null;
  address: string | null;
  cell_number: string | null;
  pay_method: PayMethod;
  rate: number;
  deductions: number;
  advance: number;
  loans: number;
  salary_total: number;
  created_at: string;
  updated_at: string;
}

export type StaffInsert = Omit<Staff, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type StaffUpdate = Partial<StaffInsert> & { id: string };