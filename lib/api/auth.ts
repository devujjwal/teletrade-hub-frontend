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
          first_name: user.first_name,
          last_name: user.last_name,
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
    const formData = new FormData();
    formData.append('account_type', userData.account_type);
    formData.append('first_name', userData.first_name);
    formData.append('last_name', userData.last_name);
    formData.append('address', userData.address);
    formData.append('postal_code', userData.postal_code);
    formData.append('city', userData.city);
    formData.append('country', userData.country);
    formData.append('phone', userData.phone);
    formData.append('mobile', userData.mobile);
    formData.append('email', userData.email);
    formData.append('password', userData.password);

    if (userData.tax_number) formData.append('tax_number', userData.tax_number);
    if (userData.vat_number) formData.append('vat_number', userData.vat_number);
    if (userData.delivery_address) formData.append('delivery_address', userData.delivery_address);
    if (userData.delivery_postal_code) formData.append('delivery_postal_code', userData.delivery_postal_code);
    if (userData.delivery_city) formData.append('delivery_city', userData.delivery_city);
    if (userData.delivery_country) formData.append('delivery_country', userData.delivery_country);
    if (userData.account_holder) formData.append('account_holder', userData.account_holder);
    if (userData.bank_name) formData.append('bank_name', userData.bank_name);
    if (userData.iban) formData.append('iban', userData.iban);
    if (userData.bic) formData.append('bic', userData.bic);

    if (userData.id_card_file) formData.append('id_card_file', userData.id_card_file);
    if (userData.passport_file) formData.append('passport_file', userData.passport_file);
    if (userData.business_registration_certificate_file) formData.append('business_registration_certificate_file', userData.business_registration_certificate_file);
    if (userData.vat_certificate_file) formData.append('vat_certificate_file', userData.vat_certificate_file);
    if (userData.tax_number_certificate_file) formData.append('tax_number_certificate_file', userData.tax_number_certificate_file);

    const response = await apiClient.post<any>('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Backend returns: { success: true, data: { user: {...} } } but no token
    // We need to log in after registration to get a token
    if (response.data?.success && response.data?.data?.user) {
      const user = response.data.data.user;
      const fullName = user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}`.trim()
        : user.first_name || user.last_name || user.email || 'User';
      
      // Auto-login after registration
      const loginResponse = await authApi.login(userData.email, userData.password);
      // Ensure first_name and last_name are preserved
      if (loginResponse.user) {
        loginResponse.user.first_name = user.first_name;
        loginResponse.user.last_name = user.last_name;
      }
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

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<any>('/auth/me');
    if (response.data?.success && response.data?.data?.user) {
      const user = response.data.data.user;
      const fullName = user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}`.trim()
        : user.first_name || user.last_name || user.email || 'User';
      return {
        id: user.id,
        name: fullName,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: 'customer' as const,
      };
    }
    return response.data;
  },

  updateProfile: async (data: { first_name?: string; last_name?: string; phone?: string }): Promise<User> => {
    const response = await apiClient.put<any>('/auth/profile', data);
    if (response.data?.success && response.data?.data?.user) {
      const user = response.data.data.user;
      const fullName = user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}`.trim()
        : user.first_name || user.last_name || user.email || 'User';
      return {
        id: user.id,
        name: fullName,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: 'customer' as const,
      };
    }
    return response.data;
  },

  changePassword: async (data: { 
    current_password: string; 
    new_password: string; 
    confirm_password: string 
  }): Promise<void> => {
    const response = await apiClient.put('/auth/password', data);
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Failed to change password');
    }
  },
};
