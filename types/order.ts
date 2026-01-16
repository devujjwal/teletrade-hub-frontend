export interface OrderItem {
  product_id: number;
  product_name: string;
  product_image?: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  user_id?: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
  billing_address?: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping_cost?: number;
  tax?: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
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
  billing_address: {
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
  user_id?: number;
  guest_email?: string;
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

