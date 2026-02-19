export interface User {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  account_type?: 'customer' | 'merchant';
  role?: 'customer' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  account_type: 'customer' | 'merchant';
  first_name: string;
  last_name: string;
  address: string;
  postal_code: string;
  city: string;
  country: string;
  phone: string;
  mobile: string;
  email: string;
  password: string;
  tax_number?: string;
  vat_number?: string;
  delivery_address?: string;
  delivery_postal_code?: string;
  delivery_city?: string;
  delivery_country?: string;
  account_holder?: string;
  bank_name?: string;
  iban?: string;
  bic?: string;
  id_card_file?: File | null;
  passport_file?: File | null;
  business_registration_certificate_file?: File | null;
  vat_certificate_file?: File | null;
  tax_number_certificate_file?: File | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}
