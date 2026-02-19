export interface OrderItem {
  product_id: number;
  product_name: string;
  product_image?: string;
  product_sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Address {
  first_name: string;
  last_name: string;
  company?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id?: number;
  customer_name?: string;
  customer_email?: string;
  customer_type?: 'customer' | 'merchant';
  customer_phone?: string;
  shipping_address: Address;
  billing_address: Address;
  items: OrderItem[];
  subtotal: number;
  shipping_cost?: number;
  tax?: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'unpaid';
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  cart_items: Array<{
    product_id: number;
    quantity: number;
  }>;
  // Use either billing_address_id (for saved addresses) OR billing_address (for new addresses)
  billing_address_id?: number;
  billing_address?: {
    first_name: string;
    last_name: string;
    company?: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  // Use either shipping_address_id (for saved addresses) OR shipping_address (for new addresses)
  shipping_address_id?: number;
  shipping_address?: {
    first_name: string;
    last_name: string;
    company?: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  payment_method: string;
  notes?: string;
  user_id: number;
}

export interface OrderListResponse {
  data: Order[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
