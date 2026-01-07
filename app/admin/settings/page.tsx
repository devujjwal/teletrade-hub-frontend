'use client';

import { useEffect, useState, useCallback } from 'react';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminApi } from '@/lib/api/admin';
import { Settings, Save, Globe, DollarSign, Truck, RefreshCw, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

interface SettingsData {
  site_name: string;
  site_email: string;
  currency: string;
  tax_rate: string;
  shipping_cost: string;
  free_shipping_threshold: string;
  vendor_sync_enabled: boolean;
  vendor_sync_frequency: string;
  vendor_sales_order_time: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    site_name: 'TeleTrade Hub',
    site_email: 'info@teletrade-hub.com',
    currency: 'EUR',
    tax_rate: '19.00',
    shipping_cost: '9.99',
    free_shipping_threshold: '100.00',
    vendor_sync_enabled: true,
    vendor_sync_frequency: '86400',
    vendor_sales_order_time: '02:00',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getSettings();
      if (response?.success && response?.data) {
        // Map API response to settings state
        const apiSettings = response.data;
        setSettings({
          site_name: apiSettings.site_name || 'TeleTrade Hub',
          site_email: apiSettings.site_email || 'info@teletrade-hub.com',
          currency: apiSettings.currency || 'EUR',
          tax_rate: apiSettings.tax_rate || '19.00',
          shipping_cost: apiSettings.shipping_cost || '9.99',
          free_shipping_threshold: apiSettings.free_shipping_threshold || '100.00',
          vendor_sync_enabled: apiSettings.vendor_sync_enabled !== undefined 
            ? apiSettings.vendor_sync_enabled === true || apiSettings.vendor_sync_enabled === 'true'
            : true,
          vendor_sync_frequency: apiSettings.vendor_sync_frequency || '86400',
          vendor_sales_order_time: apiSettings.vendor_sales_order_time || '02:00',
        });
      }
    } catch (error: any) {
      // If endpoint doesn't exist yet, use default values
      if (error.response?.status !== 404) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminApi.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      if (error.response?.status === 404) {
        toast.error('Settings API endpoint not yet implemented');
      } else {
        toast.error(error.response?.data?.message || error.message || 'Failed to save settings');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof SettingsData, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your store configuration</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>Basic site information and configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="site_name">Site Name</Label>
              <Input
                id="site_name"
                value={settings.site_name}
                onChange={(e) => updateSetting('site_name', e.target.value)}
                placeholder="TeleTrade Hub"
              />
            </div>
            <div>
              <Label htmlFor="site_email">Contact Email</Label>
              <Input
                id="site_email"
                type="email"
                value={settings.site_email}
                onChange={(e) => updateSetting('site_email', e.target.value)}
                placeholder="info@teletrade-hub.com"
              />
            </div>
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={settings.currency} onValueChange={(value) => updateSetting('currency', value)}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="PLN">PLN (zł)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tax_rate">Tax Rate (%)</Label>
              <Input
                id="tax_rate"
                type="number"
                step="0.01"
                value={settings.tax_rate}
                onChange={(e) => updateSetting('tax_rate', e.target.value)}
                placeholder="19.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipping Settings
          </CardTitle>
          <CardDescription>Configure shipping costs and thresholds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipping_cost">Default Shipping Cost</Label>
              <div className="relative">
                <Input
                  id="shipping_cost"
                  type="number"
                  step="0.01"
                  value={settings.shipping_cost}
                  onChange={(e) => updateSetting('shipping_cost', e.target.value)}
                  placeholder="9.99"
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {settings.currency}
                </span>
              </div>
            </div>
            <div>
              <Label htmlFor="free_shipping_threshold">Free Shipping Threshold</Label>
              <div className="relative">
                <Input
                  id="free_shipping_threshold"
                  type="number"
                  step="0.01"
                  value={settings.free_shipping_threshold}
                  onChange={(e) => updateSetting('free_shipping_threshold', e.target.value)}
                  placeholder="100.00"
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {settings.currency}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Orders above this amount qualify for free shipping
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Vendor Sync Settings
          </CardTitle>
          <CardDescription>Configure automatic product synchronization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="vendor_sync_enabled">Enable Automatic Sync</Label>
              <p className="text-sm text-muted-foreground">
                Automatically sync products from vendor API
              </p>
            </div>
            <Switch
              id="vendor_sync_enabled"
              checked={settings.vendor_sync_enabled}
              onCheckedChange={(checked) => updateSetting('vendor_sync_enabled', checked)}
            />
          </div>

          {settings.vendor_sync_enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label htmlFor="vendor_sync_frequency">Sync Frequency</Label>
                <Select
                  value={settings.vendor_sync_frequency}
                  onValueChange={(value) => updateSetting('vendor_sync_frequency', value)}
                >
                  <SelectTrigger id="vendor_sync_frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3600">Every Hour</SelectItem>
                    <SelectItem value="21600">Every 6 Hours</SelectItem>
                    <SelectItem value="43200">Every 12 Hours</SelectItem>
                    <SelectItem value="86400">Daily (24 Hours)</SelectItem>
                    <SelectItem value="172800">Every 2 Days</SelectItem>
                    <SelectItem value="604800">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vendor_sales_order_time">Sales Order Time</Label>
                <Input
                  id="vendor_sales_order_time"
                  type="time"
                  value={settings.vendor_sales_order_time}
                  onChange={(e) => updateSetting('vendor_sales_order_time', e.target.value)}
                  placeholder="02:00"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Time to create daily vendor sales order (24-hour format)
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

