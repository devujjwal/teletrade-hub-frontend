import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import https from 'https';
import { ApiError } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.vs-mjrinfotech.com';

// Configure SSL certificate handling for server-side requests
// In development, allow self-signed certificates to avoid SSL errors
// In production, use strict SSL verification
const httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === 'production',
});

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Only apply httpsAgent for server-side requests
  ...(typeof window === 'undefined' && {
    httpsAgent,
  }),
});

// Request interceptor for auth token and language
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get auth token from localStorage or cookie
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Get language preference - sync with language context key
      const lang = localStorage.getItem('teletrade_language') || 'en';
      config.params = { ...config.params, lang };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        const isAdminRoute = pathname.startsWith('/admin');
        
        // Clear auth state from localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('is_admin');
        
        // Redirect to appropriate login page
        if (!pathname.includes('/login')) {
          if (isAdminRoute) {
            window.location.href = '/admin/login';
          } else {
            window.location.href = '/login';
          }
        }
      }
    }

    // SECURITY: Sanitize error messages to prevent information disclosure
    const isProduction = process.env.NODE_ENV === 'production';
    let errorMessage = 'An error occurred';
    
    if (!isProduction) {
      // In development, show detailed errors
      errorMessage = (error.response?.data as any)?.message || error.message || 'An error occurred';
    } else {
      // In production, use generic messages based on status code
      const status = error.response?.status;
      if (status === 401) {
        errorMessage = 'Authentication required';
      } else if (status === 403) {
        errorMessage = 'Access denied';
      } else if (status === 404) {
        errorMessage = 'Resource not found';
      } else if (status === 429) {
        errorMessage = 'Too many requests. Please try again later';
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later';
      } else if (error.response?.data?.message) {
        // Use backend message if it's user-friendly (already sanitized)
        errorMessage = (error.response.data as any).message;
      }
    }

    const apiError: ApiError = {
      message: errorMessage,
      status: error.response?.status || 500,
      errors: isProduction ? undefined : (error.response?.data as any)?.errors, // Hide detailed errors in production
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;

