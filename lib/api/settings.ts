import apiClient from './client';

export interface PublicSettings {
  site_name: string;
  site_email: string;
  address: string;
  contact_number: string;
  whatsapp_number: string;
}

export const settingsApi = {
  /**
   * Get public settings (no auth required)
   */
  getPublic: async (): Promise<PublicSettings> => {
    const response = await apiClient.get<{ success: boolean; data: PublicSettings }>('/settings/public');
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    // Fallback to default values
    return {
      site_name: 'TeleTrade Hub',
      site_email: '',
      address: '',
      contact_number: '',
      whatsapp_number: '',
    };
  },
};

