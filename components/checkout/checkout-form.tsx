'use client';

import { useState, useEffect, useCallback } from 'react';
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
import SearchableSelect from '@/components/ui/searchable-select';
import { useLanguage } from '@/contexts/language-context';
import { addressesApi, Address } from '@/lib/api/addresses';
import { MapPin, Plus, Star } from 'lucide-react';
import {
  getCountries,
  getStates,
  getCities,
  Country as LocationCountry,
  State as LocationState,
  City as LocationCity,
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

  const fillAddressFromSaved = useCallback((address: Address, type: 'shipping' | 'billing') => {
    const prefix = type === 'shipping' ? 'shipping_address' : 'billing_address';
    setValue(`${prefix}.address_line_1`, address.street);
    setValue(`${prefix}.address_line_2`, address.street2 || '');
    setValue(`${prefix}.city`, address.city);
    setValue(`${prefix}.state`, address.state || '');
    setValue(`${prefix}.postal_code`, address.postal_code);
    setValue(`${prefix}.country`, address.country);
  }, [setValue]);

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
  }, [setValue, fillAddressFromSaved]);

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
  }, [shippingAddressId, addresses, sameAsShipping, fillAddressFromSaved]);

  useEffect(() => {
    if (billingAddressId && !sameAsShipping) {
      const address = addresses.find(a => a.id.toString() === billingAddressId);
      if (address) {
        fillAddressFromSaved(address, 'billing');
      }
    }
  }, [billingAddressId, addresses, sameAsShipping, fillAddressFromSaved]);

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

  const [countries, setCountries] = useState<LocationCountry[]>([]);
  const [availableStates, setAvailableStates] = useState<LocationState[]>([]);
  const [availableCities, setAvailableCities] = useState<LocationCity[]>([]);
  const [showStateSelect, setShowStateSelect] = useState(false);
  const [isCountriesLoading, setIsCountriesLoading] = useState(true);
  const [isStatesLoading, setIsStatesLoading] = useState(false);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [useManualStateInput, setUseManualStateInput] = useState(false);
  const [useManualCityInput, setUseManualCityInput] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadCountries = async () => {
      try {
        const countryList = await getCountries();
        if (!isActive) {
          return;
        }

        setCountries(countryList);
        const defaultCountry = countryList.find((country) => country.code === DEFAULT_COUNTRY_CODE);

        setFormData((current) => ({
          ...current,
          country: current.country || defaultCountry?.name || 'Germany',
        }));
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading countries:', error);
        }
      } finally {
        if (isActive) {
          setIsCountriesLoading(false);
        }
      }
    };

    loadCountries();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!formData.countryCode) {
      return undefined;
    }

    let isActive = true;

    const loadCountryData = async () => {
      setIsStatesLoading(true);
      setUseManualStateInput(false);
      setAvailableStates([]);
      setAvailableCities([]);

      try {
        const states = await getStates(formData.countryCode);
        if (!isActive) {
          return;
        }

        setAvailableStates(states);
        setShowStateSelect(states.length > 0);

        if (states.length === 0) {
          setIsCitiesLoading(true);
          const cities = await getCities(formData.countryCode);
          if (!isActive) {
            return;
          }

          setAvailableCities(cities);
          setUseManualCityInput(cities.length === 0);
        } else {
          setUseManualCityInput(false);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading states/cities:', error);
        }
        if (isActive) {
          setShowStateSelect(false);
          setAvailableStates([]);
          setAvailableCities([]);
          setUseManualCityInput(true);
        }
      } finally {
        if (isActive) {
          setIsStatesLoading(false);
          setIsCitiesLoading(false);
        }
      }
    };

    loadCountryData();

    return () => {
      isActive = false;
    };
  }, [formData.countryCode]);

  useEffect(() => {
    if (!formData.countryCode || !showStateSelect) {
      return undefined;
    }

    if (!formData.stateCode) {
      setAvailableCities([]);
      setIsCitiesLoading(false);
      return undefined;
    }

    let isActive = true;

    const loadCities = async () => {
      setIsCitiesLoading(true);

      try {
        const cities = await getCities(formData.countryCode, formData.stateCode);
        if (!isActive) {
          return;
        }

        setAvailableCities(cities);
        setUseManualCityInput(cities.length === 0);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading cities:', error);
        }
        if (isActive) {
          setAvailableCities([]);
          setUseManualCityInput(true);
        }
      } finally {
        if (isActive) {
          setIsCitiesLoading(false);
        }
      }
    };

    loadCities();

    return () => {
      isActive = false;
    };
  }, [formData.stateCode, formData.countryCode, showStateSelect]);

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    setUseManualStateInput(false);
    setUseManualCityInput(false);
    setFormData((current) => ({
      ...current,
      countryCode,
      country: country?.name || '',
      stateCode: '',
      state: '',
      city: '',
    }));
  };

  const handleStateChange = (stateCode: string) => {
    const state = availableStates.find(s => s.code === stateCode);
    setUseManualCityInput(false);
    setFormData((current) => ({
      ...current,
      stateCode,
      state: state?.name || '',
      city: '',
    }));
  };

  const handleCityChange = (city: string) => {
    setFormData((current) => ({
      ...current,
      city,
    }));
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
    setUseManualStateInput(false);
    setUseManualCityInput(false);
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
                  <SearchableSelect
                    value={formData.countryCode}
                    options={countries.map((country) => ({
                      value: country.code,
                      label: country.name,
                      keywords: [country.code],
                    }))}
                    placeholder="Select country"
                    searchPlaceholder="Search country"
                    loading={isCountriesLoading}
                    onValueChange={handleCountryChange}
                  />
                </div>

                {showStateSelect && (
                  <div className="space-y-2">
                    <Label>State/Region</Label>
                    {useManualStateInput ? (
                      <div className="space-y-2">
                        <Input
                          value={formData.state}
                          placeholder="Enter state/region"
                          onChange={(event) =>
                            setFormData((current) => ({
                              ...current,
                              state: event.target.value,
                              stateCode: '',
                              city: '',
                            }))
                          }
                        />
                        {availableStates.length > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-auto px-0 text-sm"
                            onClick={() => setUseManualStateInput(false)}
                          >
                            Choose from list instead
                          </Button>
                        )}
                      </div>
                    ) : (
                      <SearchableSelect
                        value={formData.stateCode}
                        options={availableStates.map((state) => ({
                          value: state.code,
                          label: state.name,
                          keywords: [state.code],
                        }))}
                        placeholder="Select state/region"
                        searchPlaceholder="Search state/region"
                        emptyMessage="No states/regions available for this country."
                        noResultsMessage="State/region not found in our list."
                        disabled={!formData.countryCode}
                        loading={isStatesLoading}
                        onValueChange={handleStateChange}
                        onManualEntry={() => setUseManualStateInput(true)}
                      />
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>City</Label>
                  {useManualCityInput ? (
                    <div className="space-y-2">
                      <Input
                        value={formData.city}
                        placeholder="Enter city"
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            city: event.target.value,
                          }))
                        }
                      />
                      {availableCities.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-auto px-0 text-sm"
                          onClick={() => setUseManualCityInput(false)}
                        >
                          Choose from list instead
                        </Button>
                      )}
                    </div>
                  ) : (
                    <SearchableSelect
                      value={formData.city}
                      options={availableCities.map((city) => ({
                        value: city.name,
                        label: city.name,
                      }))}
                      placeholder="Select city"
                      searchPlaceholder="Search city"
                      emptyMessage="No cities available for this selection."
                      noResultsMessage="City not found in our list."
                      typeToSearchMessage="Type to search the city list."
                      disabled={showStateSelect ? !formData.stateCode : !formData.countryCode}
                      loading={isCitiesLoading}
                      onValueChange={handleCityChange}
                      onManualEntry={() => setUseManualCityInput(true)}
                    />
                  )}
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
