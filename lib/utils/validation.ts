import { z } from 'zod';

export const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  customer_email: z.string().email('Invalid email address'),
  customer_phone: z.string().optional(),
  shipping_address: z.object({
    address_line_1: z.string().min(5, 'Address must be at least 5 characters'),
    address_line_2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().optional(),
    postal_code: z.string().min(3, 'Postal code is required'),
    country: z.string().min(2, 'Country is required'),
  }),
  billing_address: z.object({
    address_line_1: z.string().min(5, 'Address must be at least 5 characters'),
    address_line_2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().optional(),
    postal_code: z.string().min(3, 'Postal code is required'),
    country: z.string().min(2, 'Country is required'),
  }).optional(),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Username or email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'), // Length validated server-side
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'), // Length validated server-side
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

