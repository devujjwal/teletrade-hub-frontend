'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  ChevronRight,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useLanguage } from '@/contexts/language-context';
import { Skeleton } from '@/components/ui/skeleton';
import Card from '@/components/ui/card';
import { addressesApi, Address } from '@/lib/api/addresses';

export default function AddressesPage() {
  const router = useRouter();
  const { user, token, initialize } = useAuthStore();
  const { t } = useLanguage();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Check authentication - redirect if not logged in
    if (!token || !user) {
      router.push('/login');
      return;
    }

    // Fetch addresses from API
    const fetchAddresses = async () => {
      try {
        const response = await addressesApi.list();
        setAddresses(response.data || []);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [token, user, router]);

  // Redirect to login if not authenticated
  if (!token || !user) {
    return (
      <div className="container-wide py-16 text-center">
        <div className="max-w-md mx-auto">
          <MapPin className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold mb-4">{t('account.addresses')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('account.signInToView')}
          </p>
          <Button size="lg" asChild>
            <Link href="/login">{t('auth.login')}</Link>
          </Button>
        </div>
      </div>
    );
  }

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
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/account" className="hover:text-foreground">{t('account.title')}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{t('account.addresses')}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl font-bold">{t('account.addresses')}</h1>
        <Button className="btn-shop" asChild>
          <Link href="/account/addresses/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Link>
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <MapPin className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h2 className="font-display text-xl font-bold mb-2">No addresses found</h2>
          <p className="text-muted-foreground mb-6">
            Add your first delivery address to get started
          </p>
          <Button className="btn-shop" asChild>
            <Link href="/account/addresses/new">
              <Plus className="w-4 h-4 mr-2" />
              Add New Address
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{address.label || 'Home'}</h3>
                  {address.is_default && (
                    <span className="badge-success text-xs">Default</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{address.street}</p>
                {address.street2 && <p>{address.street2}</p>}
                <p>{address.city}, {address.state} {address.postal_code}</p>
                <p>{address.country}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

