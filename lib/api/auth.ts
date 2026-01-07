import apiClient from './client';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/user';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  adminLogin: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // Backend expects username, not email for admin login
    const response = await apiClient.post<any>('/admin/login', {
      username: credentials.email, // Use email as username
      password: credentials.password,
    });
    
    // Backend returns: { success: true, data: { admin: {...}, token: "...", expires_at: "..." } }
    if (response.data?.success && response.data?.data) {
      const { admin, token } = response.data.data;
      return {
        token,
        user: {
          id: admin.id,
          name: admin.username || admin.name || admin.email || 'Admin',
          email: admin.email || admin.username || '',
          role: 'admin' as const,
        },
      };
    }
    
    // Fallback for direct response
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};

