import apiClient from './client';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/user';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<any>('/auth/login', { email, password });
    
    // Backend returns: { success: true, data: { user: {...}, token: "..." } }
    if (response.data?.success && response.data?.data) {
      const { user, token } = response.data.data;
      const fullName = user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}`.trim()
        : user.first_name || user.last_name || user.email || 'User';
      
      return {
        token,
        user: {
          id: user.id,
          name: fullName,
          email: user.email,
          phone: user.phone,
          role: 'customer' as const,
        },
      };
    }
    
    // Fallback for direct response
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<any>('/auth/register', userData);
    
    // Backend returns: { success: true, data: { user: {...} } } but no token
    // We need to log in after registration to get a token
    if (response.data?.success && response.data?.data?.user) {
      const user = response.data.data.user;
      const fullName = user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}`.trim()
        : user.first_name || user.last_name || user.email || 'User';
      
      // Auto-login after registration
      const loginResponse = await authApi.login(userData.email, userData.password);
      return loginResponse;
    }
    
    // Fallback for direct response
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
          name: admin.full_name || admin.name || admin.username || admin.email || 'Admin',
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

