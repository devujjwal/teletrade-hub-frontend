import apiClient from './client';

export interface Address {
  id: number;
  user_id: number;
  label?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAddressRequest {
  label?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}

export const addressesApi = {
  list: async (): Promise<{ data: Address[] }> => {
    const response = await apiClient.get<any>('/auth/addresses');
    if (response.data?.success && response.data?.data?.addresses) {
      return { data: response.data.data.addresses };
    }
    return { data: [] };
  },

  create: async (address: CreateAddressRequest): Promise<{ data: Address }> => {
    const response = await apiClient.post<any>('/auth/addresses', address);
    if (response.data?.success && response.data?.data?.address) {
      return { data: response.data.data.address };
    }
    throw new Error('Failed to create address');
  },

  update: async (id: number, address: UpdateAddressRequest): Promise<{ data: Address }> => {
    const response = await apiClient.put<any>(`/auth/addresses/${id}`, address);
    if (response.data?.success && response.data?.data?.address) {
      return { data: response.data.data.address };
    }
    throw new Error('Failed to update address');
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/auth/addresses/${id}`);
  },
};

