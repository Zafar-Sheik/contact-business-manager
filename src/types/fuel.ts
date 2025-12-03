export interface FuelLog {
  id: string;
  user_id: string;
  date: string; // ISO date string
  vehicle: string;
  mileage: number;
  km_used: number;
  litres_filled: number;
  rand_value: number;
  garage_name: string | null;
  created_at: string;
}

export type FuelLogInsert = Omit<FuelLog, 'id' | 'user_id' | 'created_at'>;