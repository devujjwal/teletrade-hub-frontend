'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Star,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import SearchableSelect from '@/components/ui/searchable-select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuthStore } from '@/lib/store/auth-store';
import { useLanguage } from '@/contexts/language-context';
import { Skeleton } from '@/components/ui/skeleton';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { addressesApi, Address } from '@/lib/api/addresses';
import {
  getCountries,
  getStates,
  getCities,
  findCountry,
  findState,
  findCity,
  Country as LocationCountry,
  State as LocationState,
  City as LocationCity,
} from '@/lib/locationData';
import toast from 'react-hot-toast';

const DEFAULT_COUNTRY_CODE = "DE";

export default function AddressesPage() {
  const router = useRouter();
  const { user, token, _hasHydrated } = useAuthStore();
  const { t } = useLanguage();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
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

  // Update available states and cities when country changes
  useEffect(() => {
    if (!formData.countryCode) {
      return undefined;
    }

    let isActive = true;

    const loadCountryData = async () => {
      setIsStatesLoading(true);

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
          if (cities.length === 0) {
            setUseManualCityInput(true);
          }
        } else if (!formData.stateCode) {
          setAvailableCities([]);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading states/cities:', error);
        }
        if (isActive) {
          setAvailableStates([]);
          setAvailableCities([]);
          setShowStateSelect(false);
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
  }, [formData.countryCode, formData.stateCode]);

  // Update available cities when state changes
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
        if (cities.length === 0) {
          setUseManualCityInput(true);
        }
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

  useEffect(() => {
    // Only redirect if hydrated and user is not logged in
    if (_hasHydrated && (!token || !user)) {
      router.push('/login');
      return;
    }

    // Fetch addresses only if authenticated
    if (_hasHydrated && token && user && isLoading) {
      const fetchAddresses = async () => {
        try {
          const response = await addressesApi.list();
          setAddresses(response.data || []);
        } catch (error: any) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching addresses:', error);
          }
          // 401 errors are handled automatically by API client interceptor
          // For other errors, just show empty addresses
          if (error?.status !== 401) {
            toast.error('Failed to load addresses. Please try again.');
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchAddresses();
    }
  }, [_hasHydrated, token, user, router, isLoading]);

  // Show loading while hydrating
  if (!_hasHydrated) {
    return (
      <div className="container-wide py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('common.loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="container-wide py-16 text-center">
        <div className="max-w-md mx-auto">
          <MapPin className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold mb-4">{t('account.addresses')}</h1>
          <p className="text-muted-foreground mb-8">{t('account.signInToView')}</p>
          <Button size="lg" asChild>
            <Link href="/login">{t('auth.login')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleOpenDialog = async (address?: Address) => {
    setUseManualStateInput(false);
    setUseManualCityInput(false);

    if (address) {
      setEditingAddress(address);
      setIsStatesLoading(true);
      setIsCitiesLoading(true);

      try {
        const country = await findCountry(address.country);
        const countryCode = country?.code || DEFAULT_COUNTRY_CODE;
        const [states, rootCities] = await Promise.all([
          getStates(countryCode),
          getCities(countryCode),
        ]);
        const matchedState = address.state
          ? await findState(countryCode, address.state)
          : null;

        let matchedCity = null;
        let cityOptions = rootCities;

        if (matchedState) {
          cityOptions = await getCities(countryCode, matchedState.code);
          matchedCity = address.city
            ? await findCity(countryCode, address.city, matchedState.code)
            : null;
        } else if (!states.length && address.city) {
          matchedCity = await findCity(countryCode, address.city);
        }

        setAvailableStates(states);
        setShowStateSelect(states.length > 0);
        setAvailableCities(matchedState ? cityOptions : states.length ? [] : rootCities);
        setUseManualStateInput(Boolean(states.length > 0 && address.state && !matchedState));
        setUseManualCityInput(
          Boolean(
            address.city &&
              ((matchedState && !matchedCity) ||
                (!states.length && !matchedCity) ||
                (states.length > 0 && address.state && !matchedState))
          )
        );

        setFormData({
          label: address.label || '',
          street: address.street,
          street2: address.street2 || '',
          city: address.city,
          state: address.state,
          stateCode: matchedState?.code || '',
          postal_code: address.postal_code,
          country: country?.name || address.country,
          countryCode,
          is_default: address.is_default,
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error preparing address dialog:', error);
        }

        setAvailableStates([]);
        setAvailableCities([]);
        setShowStateSelect(false);
        setUseManualCityInput(true);
        setFormData({
          label: address.label || '',
          street: address.street,
          street2: address.street2 || '',
          city: address.city,
          state: address.state,
          stateCode: '',
          postal_code: address.postal_code,
          country: address.country,
          countryCode: DEFAULT_COUNTRY_CODE,
          is_default: address.is_default,
        });
      } finally {
        setIsStatesLoading(false);
        setIsCitiesLoading(false);
      }
    } else {
      const defaultCountry = countries.find(c => c.code === DEFAULT_COUNTRY_CODE);
      setEditingAddress(null);
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
      setIsStatesLoading(true);
      setIsCitiesLoading(false);
      setAvailableStates([]);
      setAvailableCities([]);
      setShowStateSelect(false);

      try {
        const states = await getStates(DEFAULT_COUNTRY_CODE);
        setAvailableStates(states);
        setShowStateSelect(states.length > 0);

        if (states.length === 0) {
          setIsCitiesLoading(true);
          const cities = await getCities(DEFAULT_COUNTRY_CODE);
          setAvailableCities(cities);
          setUseManualCityInput(cities.length === 0);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading default country data:', error);
        }
        setUseManualCityInput(true);
      } finally {
        setIsStatesLoading(false);
        setIsCitiesLoading(false);
      }
    }

    setIsDialogOpen(true);
  };

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

  const handleSave = async () => {
    try {
      const addressData: any = {
        label: formData.label || undefined,
        street: formData.street,
        street2: formData.street2 || undefined,
        city: formData.city,
        state: formData.state || '',
        postal_code: formData.postal_code,
        country: formData.country,
        is_default: formData.is_default,
      };

      if (editingAddress) {
        await addressesApi.update(editingAddress.id, addressData);
        toast.success(t('addresses.updated') || 'Address updated');
      } else {
        await addressesApi.create(addressData);
        toast.success(t('addresses.added') || 'Address added');
      }

      // Refresh addresses list
      const response = await addressesApi.list();
      setAddresses(response.data || []);
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save address');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error saving address:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await addressesApi.delete(id);
      toast.success(t('addresses.deleted') || 'Address deleted');
      const response = await addressesApi.list();
      setAddresses(response.data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const address = addresses.find(a => a.id === id);
      if (address) {
        await addressesApi.update(id, { is_default: true });
        toast.success(t('addresses.defaultSet') || 'Default address set');
        const response = await addressesApi.list();
        setAddresses(response.data || []);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to set default address');
    }
  };

  if (isLoading) {
    return (
      <div className="container-wide py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container-wide py-8">
      <Button
        variant="ghost"
        onClick={() => router.push('/account')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('common.back')}
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">{t('addresses.title') || t('account.addresses')}</h1>
          <p className="text-muted-foreground mt-1">{t('addresses.subtitle') || 'Manage your delivery addresses'}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-shop" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              {t('addresses.addNew') || 'Add Address'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? (t('addresses.edit') || 'Edit Address') : (t('addresses.addNew') || 'Add Address')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="label">{t('addresses.name') || 'Address Name'}</Label>
                <Input
                  id="label"
                  placeholder={t('addresses.namePlaceholder') || 'e.g., Home, Office'}
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">{t('addresses.street') || 'Street Address'}</Label>
                <Input
                  id="street"
                  placeholder={t('addresses.streetPlaceholder') || 'Enter street address'}
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
              
              {/* Country Dropdown */}
              <div className="space-y-2">
                <Label>{t('addresses.country') || 'Country'}</Label>
                <SearchableSelect
                  value={formData.countryCode}
                  options={countries.map((country) => ({
                    value: country.code,
                    label: country.name,
                    keywords: [country.code],
                  }))}
                  placeholder={t('addresses.selectCountry') || 'Select country'}
                  searchPlaceholder={t('addresses.selectCountry') || 'Search country'}
                  loading={isCountriesLoading}
                  onValueChange={handleCountryChange}
                />
              </div>

              {/* State Dropdown - only show if country has states */}
              {showStateSelect && (
                <div className="space-y-2">
                  <Label>{t('addresses.state') || 'State/Region'}</Label>
                  {useManualStateInput ? (
                    <div className="space-y-2">
                      <Input
                        value={formData.state}
                        placeholder={t('addresses.selectState') || 'Enter state/region'}
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
                      placeholder={t('addresses.selectState') || 'Select state/region'}
                      searchPlaceholder={t('addresses.selectState') || 'Search state/region'}
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

              {/* City Dropdown */}
              <div className="space-y-2">
                <Label>{t('addresses.city') || 'City'}</Label>
                {useManualCityInput ? (
                  <div className="space-y-2">
                    <Input
                      value={formData.city}
                      placeholder={t('addresses.selectCity') || 'Enter city'}
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
                    placeholder={t('addresses.selectCity') || 'Select city'}
                    searchPlaceholder={t('addresses.selectCity') || 'Search city'}
                    emptyMessage="No cities available for this selection."
                    noResultsMessage="City not found in our list."
                    disabled={showStateSelect ? !formData.stateCode : !formData.countryCode}
                    loading={isCitiesLoading}
                    onValueChange={handleCityChange}
                    onManualEntry={() => setUseManualCityInput(true)}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">{t('addresses.postalCode') || 'Postal Code'}</Label>
                <Input
                  id="postalCode"
                  placeholder={t('addresses.postalCodePlaceholder') || 'Enter postal code'}
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
                  {t('addresses.setDefault') || 'Set as default address'}
                </Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button className="btn-shop" onClick={handleSave}>
                {t('common.save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-16">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('addresses.noAddresses') || 'No addresses saved'}</h2>
            <p className="text-muted-foreground text-center mb-6">
              {t('addresses.noAddressesDesc') || 'Add your first delivery address to make checkout faster.'}
            </p>
            <Button className="btn-shop" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              {t('addresses.addFirst') || 'Add your first address'}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">{address.label || 'Home'}</h3>
                  {address.is_default && (
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1" />
                      {t('addresses.default') || 'Default'}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  {!address.is_default && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      {t('addresses.setDefault') || 'Set as default'}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(address)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('addresses.deleteConfirm') || 'Delete this address?'}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('addresses.deleteConfirmDesc') || 'This action cannot be undone.'}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(address.id)}>
                          {t('common.delete')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p>{address.street}</p>
                  {address.street2 && <p>{address.street2}</p>}
                  <p>{address.postal_code} {address.city}</p>
                  {address.state && <p>{address.state}</p>}
                  <p>{address.country}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
