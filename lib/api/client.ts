import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import https from 'https';
import toast from 'react-hot-toast';
import { ApiError } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
      // Handle unauthorized - session expired
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        const isAdminRoute = pathname.startsWith('/admin');
        const requestUrl = error.config?.url || '';
        
        // Don't auto-logout for login/register attempts (those 401s are expected)
        const isLoginAttempt = 
          requestUrl.includes('/auth/login') || 
          requestUrl.includes('/auth/register') ||
          requestUrl.includes('/admin/login');
        
        // Only redirect if not already on a login page (prevents loops)
        const isAuthPage = pathname.includes('/login') || pathname.includes('/register');
        
        if (!isLoginAttempt && !isAuthPage) {
          // Clear all auth state from localStorage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('is_admin');
          
          // Also clear Zustand persist storage
          localStorage.removeItem('auth-storage');
          
          // Show toast notification
          toast.error('Your session has expired. Please log in again.');
          
          // Use a small delay to prevent race conditions with multiple 401s
          setTimeout(() => {
            if (isAdminRoute) {
              window.location.href = '/admin/login';
            } else {
              window.location.href = '/login?redirect=' + encodeURIComponent(pathname);
            }
          }, 100);
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
      } else if (status !== undefined && status >= 500) {
        errorMessage = 'Server error. Please try again later';
      } else if (error.response?.data && typeof (error.response.data as any).message === 'string') {
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

