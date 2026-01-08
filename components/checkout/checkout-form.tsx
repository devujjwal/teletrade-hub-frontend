'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { CheckoutFormData } from '@/lib/utils/validation';
import { User } from '@/types/user';
import Input from '@/components/ui/input';
import Card from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/language-context';
import { addressesApi, Address } from '@/lib/api/addresses';
import { MapPin, Plus, Star } from 'lucide-react';
import {
  getCountries,
  getStates,
  getCities,
  hasStates,
} from '@/lib/locationData';
import toast from 'react-hot-toast';

const DEFAULT_COUNTRY_CODE = "DE";

interface CheckoutFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  watch: UseFormWatch<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  user: User;
}

export default function CheckoutForm({ register, errors, watch, setValue, user }: CheckoutFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  
  const shippingAddressId = watch('shipping_address_id');
  const billingAddressId = watch('billing_address_id');

  // Auto-fill user data
  useEffect(() => {
    if (user) {
      const fullName = user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.name || '';
      
      setValue('customer_name', fullName);
      setValue('customer_email', user.email || '');
      if (user.phone) {
        setValue('customer_phone', user.phone);
      }
    }
  }, [user, setValue]);

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await addressesApi.list();
        const fetchedAddresses = response.data || [];
        setAddresses(fetchedAddresses);
        
        // Set default address if available
        if (fetchedAddresses.length > 0) {
          const defaultAddress = fetchedAddresses.find(a => a.is_default) || fetchedAddresses[0];
          if (defaultAddress) {
            setValue('shipping_address_id', defaultAddress.id.toString());
            fillAddressFromSaved(defaultAddress, 'shipping');
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching addresses:', error);
        }
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [setValue]);

  // Update form when address selection changes
  useEffect(() => {
    if (shippingAddressId) {
      const address = addresses.find(a => a.id.toString() === shippingAddressId);
      if (address) {
        fillAddressFromSaved(address, 'shipping');
        if (sameAsShipping) {
          fillAddressFromSaved(address, 'billing');
        }
      }
    }
  }, [shippingAddressId, addresses, sameAsShipping, setValue]);

  useEffect(() => {
    if (billingAddressId && !sameAsShipping) {
      const address = addresses.find(a => a.id.toString() === billingAddressId);
      if (address) {
        fillAddressFromSaved(address, 'billing');
      }
    }
  }, [billingAddressId, addresses, sameAsShipping, setValue]);

  const fillAddressFromSaved = (address: Address, type: 'shipping' | 'billing') => {
    const prefix = type === 'shipping' ? 'shipping_address' : 'billing_address';
    setValue(`${prefix}.address_line_1`, address.street);
    setValue(`${prefix}.address_line_2`, address.street2 || '');
    setValue(`${prefix}.city`, address.city);
    setValue(`${prefix}.state`, address.state || '');
    setValue(`${prefix}.postal_code`, address.postal_code);
    setValue(`${prefix}.country`, address.country);
  };

  const handleSameAsShippingChange = (checked: boolean) => {
    setSameAsShipping(checked);
    if (checked) {
      setValue('billing_address_id', undefined);
      if (shippingAddressId) {
        const address = addresses.find(a => a.id.toString() === shippingAddressId);
        if (address) {
          fillAddressFromSaved(address, 'billing');
        }
      }
    } else {
      // Set billing to default address if different from shipping
      const defaultAddress = addresses.find(a => a.is_default) || addresses[0];
      if (defaultAddress && defaultAddress.id.toString() !== shippingAddressId) {
        setValue('billing_address_id', defaultAddress.id.toString());
      }
    }
  };

  const handleAddressAdded = async () => {
    try {
      const response = await addressesApi.list();
      const fetchedAddresses = response.data || [];
      setAddresses(fetchedAddresses);
      
      // Select the newly added address
      const newAddress = fetchedAddresses[fetchedAddresses.length - 1];
      if (newAddress) {
        setValue('shipping_address_id', newAddress.id.toString());
        fillAddressFromSaved(newAddress, 'shipping');
        if (sameAsShipping) {
          fillAddressFromSaved(newAddress, 'billing');
        }
      }
      setIsDialogOpen(false);
      toast.success('Address added successfully');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error refreshing addresses:', error);
      }
    }
  };

  // Address form state for dialog
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    street2: '',
    city: '',
    state: '',
    stateCode: '',
    postal_code: '',
    country: '',
    countryCode: DEFAULT_COUNTRY_CODE,
    is_default: false,
  });

  const countries = getCountries();
  const [availableStates, setAvailableStates] = useState(getStates(DEFAULT_COUNTRY_CODE));
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [showStateSelect, setShowStateSelect] = useState(hasStates(DEFAULT_COUNTRY_CODE));

  useEffect(() => {
    if (formData.countryCode) {
      const states = getStates(formData.countryCode);
      setAvailableStates(states);
      setShowStateSelect(hasStates(formData.countryCode));
      
      if (!hasStates(formData.countryCode)) {
        setAvailableCities(getCities(formData.countryCode));
      } else {
        setAvailableCities([]);
      }
    }
  }, [formData.countryCode]);

  useEffect(() => {
    if (formData.countryCode && formData.stateCode && hasStates(formData.countryCode)) {
      setAvailableCities(getCities(formData.countryCode, formData.stateCode));
    }
  }, [formData.stateCode, formData.countryCode]);

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    setFormData({
      ...formData,
      countryCode,
      country: country?.name || '',
      stateCode: '',
      state: '',
      city: '',
    });
  };

  const handleStateChange = (stateCode: string) => {
    const state = availableStates.find(s => s.code === stateCode);
    setFormData({
      ...formData,
      stateCode,
      state: state?.name || '',
      city: '',
    });
  };

  const handleCityChange = (city: string) => {
    setFormData({
      ...formData,
      city,
    });
  };

  const handleSaveAddress = async () => {
    try {
      const addressData: any = {
        label: formData.label || undefined,
        street: formData.street,
        street2: formData.street2 || undefined,
        city: formData.city,
        state: formData.state || '',
        postal_code: formData.postal_code,
        country: formData.country,
        is_default: formData.is_default || addresses.length === 0,
      };

      await addressesApi.create(addressData);
      await handleAddressAdded();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save address');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error saving address:', error);
      }
    }
  };

  const handleOpenDialog = () => {
    const defaultCountry = countries.find(c => c.code === DEFAULT_COUNTRY_CODE);
    setFormData({
      label: '',
      street: '',
      street2: '',
      city: '',
      state: '',
      stateCode: '',
      postal_code: '',
      country: defaultCountry?.name || 'Germany',
      countryCode: DEFAULT_COUNTRY_CODE,
      is_default: addresses.length === 0,
    });
    setAvailableStates(getStates(DEFAULT_COUNTRY_CODE));
    setShowStateSelect(hasStates(DEFAULT_COUNTRY_CODE));
    setAvailableCities([]);
    setIsDialogOpen(true);
  };

  if (isLoadingAddresses) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No addresses saved</h2>
            <p className="text-muted-foreground text-center mb-6">
              Please add a delivery address to continue with checkout.
            </p>
            <Button className="btn-shop" onClick={() => router.push('/account/addresses')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t('checkout.contactInformation')}</h2>
        <div className="space-y-4">
          <Input
            label={t('auth.fullName')}
            {...register('customer_name')}
            error={errors.customer_name?.message}
          />
          <Input
            label={t('checkout.email')}
            type="email"
            {...register('customer_email')}
            error={errors.customer_email?.message}
          />
          <Input
            label={t('checkout.phoneOptional')}
            type="tel"
            {...register('customer_phone')}
            error={errors.customer_phone?.message}
          />
        </div>
      </Card>

      {/* Shipping Address */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t('checkout.shippingAddress')}</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleOpenDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Address Name</Label>
                  <Input
                    id="label"
                    placeholder="e.g., Home, Office"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    placeholder="Enter street address"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street2">Address Line 2 (Optional)</Label>
                  <Input
                    id="street2"
                    placeholder="Apartment, suite, etc."
                    value={formData.street2}
                    onChange={(e) => setFormData({ ...formData, street2: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select value={formData.countryCode} onValueChange={handleCountryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {showStateSelect && (
                  <div className="space-y-2">
                    <Label>State/Region</Label>
                    <Select 
                      value={formData.stateCode} 
                      onValueChange={handleStateChange}
                      disabled={!formData.countryCode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state/region" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStates.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>City</Label>
                  <Select 
                    value={formData.city} 
                    onValueChange={handleCityChange}
                    disabled={showStateSelect ? !formData.stateCode : !formData.countryCode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="Enter postal code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_default" className="cursor-pointer">
                    Set as default address
                  </Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="btn-shop" onClick={handleSaveAddress}>
                  Save Address
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Shipping Address</Label>
            <Select
              value={shippingAddressId || ''}
              onValueChange={(value) => {
                setValue('shipping_address_id', value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an address" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map((address) => (
                  <SelectItem key={address.id} value={address.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{address.label || 'Home'}</span>
                      {address.is_default && (
                        <Star className="h-3 w-3 text-primary" />
                      )}
                      <span className="text-muted-foreground text-xs">
                        ({address.street}, {address.city})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {shippingAddressId && (
            <div className="p-4 bg-muted rounded-lg">
              {(() => {
                const selectedAddress = addresses.find(a => a.id.toString() === shippingAddressId);
                if (!selectedAddress) return null;
                return (
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">{selectedAddress.label || 'Home'}</p>
                    <p>{selectedAddress.street}</p>
                    {selectedAddress.street2 && <p>{selectedAddress.street2}</p>}
                    <p>{selectedAddress.postal_code} {selectedAddress.city}</p>
                    {selectedAddress.state && <p>{selectedAddress.state}</p>}
                    <p>{selectedAddress.country}</p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Hidden fields for form submission */}
          <input type="hidden" {...register('shipping_address_id')} />
          <input type="hidden" {...register('shipping_address.address_line_1')} />
          <input type="hidden" {...register('shipping_address.address_line_2')} />
          <input type="hidden" {...register('shipping_address.city')} />
          <input type="hidden" {...register('shipping_address.state')} />
          <input type="hidden" {...register('shipping_address.postal_code')} />
          <input type="hidden" {...register('shipping_address.country')} />
        </div>
      </Card>

      {/* Billing Address */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t('checkout.billingAddress')}</h2>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sameAsShipping}
              onChange={(e) => handleSameAsShippingChange(e.target.checked)}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">{t('checkout.sameAsShipping')}</span>
          </label>
        </div>
        {!sameAsShipping && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Billing Address</Label>
              <Select
                value={billingAddressId || ''}
                onValueChange={(value) => {
                  setValue('billing_address_id', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an address" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((address) => (
                    <SelectItem key={address.id} value={address.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{address.label || 'Home'}</span>
                        {address.is_default && (
                          <Star className="h-3 w-3 text-primary" />
                        )}
                        <span className="text-muted-foreground text-xs">
                          ({address.street}, {address.city})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {billingAddressId && (
              <div className="p-4 bg-muted rounded-lg">
                {(() => {
                  const selectedAddress = addresses.find(a => a.id.toString() === billingAddressId);
                  if (!selectedAddress) return null;
                  return (
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold">{selectedAddress.label || 'Home'}</p>
                      <p>{selectedAddress.street}</p>
                      {selectedAddress.street2 && <p>{selectedAddress.street2}</p>}
                      <p>{selectedAddress.postal_code} {selectedAddress.city}</p>
                      {selectedAddress.state && <p>{selectedAddress.state}</p>}
                      <p>{selectedAddress.country}</p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Hidden fields for form submission */}
            <input type="hidden" {...register('billing_address_id')} />
            <input type="hidden" {...register('billing_address.address_line_1')} />
            <input type="hidden" {...register('billing_address.address_line_2')} />
            <input type="hidden" {...register('billing_address.city')} />
            <input type="hidden" {...register('billing_address.state')} />
            <input type="hidden" {...register('billing_address.postal_code')} />
            <input type="hidden" {...register('billing_address.country')} />
          </div>
        )}
        {sameAsShipping && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Billing address same as shipping address</p>
          </div>
        )}
      </Card>
    </div>
  );
}
