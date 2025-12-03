export interface CompanyProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  licensenumber: string | null;
  vatnumber: string | null;
  regnumber: string | null;
  logodataurl: string | null;
  
  // VAT Banking Details (Existing)
  bank_name: string | null;
  account_number: string | null;
  branch_code: string | null;
  
  // NEW: Non-VAT Banking Details
  non_vat_bank_name: string | null;
  non_vat_account_number: string | null;
  non_vat_branch_code: string | null;
  
  created_at: string;
  updated_at: string;
}

export type CompanyProfileInsert = Omit<CompanyProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type CompanyProfileUpdate = Partial<CompanyProfileInsert> & { id: string };

export interface AppConfig {
  id: string;
  user_id: string;
  allowstockbelowcost: boolean | null;
  dontsellbelowcost: boolean | null;
  slipmessage1: string | null;
  slipmessage2: string | null;
  slipmessage3: string | null;
  wahabaseurl: string | null;
  wahaapikey: string | null;
  wahasessions: any; // jsonb
  replynowphonenumber: string | null;
  
  // New Layout Config
  document_layout_config: {
    show_logo_on_documents?: boolean;
    default_document_style?: 'Standard' | 'Modern';
  } | null;
  
  created_at: string;
  updated_at: string;
}

export type AppConfigInsert = Omit<AppConfig, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type AppConfigUpdate = Partial<AppConfigInsert> & { id: string };