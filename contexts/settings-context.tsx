'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/api/client';

interface Settings {
  site_name: string;
  site_email: string;
  address: string;
  contact_number: string;
  whatsapp_number: string;
  currency: string;
  tax_rate: number;
  shipping_cost: number;
  free_shipping_threshold: number;
}

interface SettingsContextType {
  settings: Settings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  site_name: 'TeleTrade Hub',
  site_email: 'info@teletrade-hub.com',
  address: '',
  contact_number: '',
  whatsapp_number: '',
  currency: 'EUR',
  tax_rate: 0.19, // 19%
  shipping_cost: 9.99,
  free_shipping_threshold: 100,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get('/settings/public');
      
      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        setSettings({
          site_name: data.site_name || defaultSettings.site_name,
          site_email: data.site_email || defaultSettings.site_email,
          address: data.address || defaultSettings.address,
          contact_number: data.contact_number || defaultSettings.contact_number,
          whatsapp_number: data.whatsapp_number || defaultSettings.whatsapp_number,
          currency: data.currency || defaultSettings.currency,
          tax_rate: parseFloat(data.tax_rate) / 100 || defaultSettings.tax_rate,
          shipping_cost: parseFloat(data.shipping_cost) || defaultSettings.shipping_cost,
          free_shipping_threshold: parseFloat(data.free_shipping_threshold) || defaultSettings.free_shipping_threshold,
        });
      }
    } catch (error) {
      console.error('Failed to load settings, using defaults:', error);
      // Keep default settings if fetch fails
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
