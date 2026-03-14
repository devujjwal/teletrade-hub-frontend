'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Package, 
  Settings, 
  LogOut, 
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Save,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/store/auth-store';
import { useLanguage } from '@/contexts/language-context';
import { authApi } from '@/lib/api/auth';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const router = useRouter();
  const { user, token, _hasHydrated } = useAuthStore();
  const login = useAuthStore((state) => state.login);
  const { t } = useLanguage();
  const profileHydratedRef = useRef(false);
  
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Only redirect if hydrated and user is not logged in
    if (_hasHydrated && (!token || !user)) {
      router.push('/login');
    }
  }, [_hasHydrated, token, user, router]);

  useEffect(() => {
    if (user) {
      setPhoneValue(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (!_hasHydrated || !token || !user) {
      profileHydratedRef.current = false;
      return;
    }

    if (profileHydratedRef.current) {
      return;
    }

    profileHydratedRef.current = true;

    (async () => {
      try {
        const latestUser = await authApi.getCurrentUser();
        login(token, latestUser, false);
      } catch (error) {
        profileHydratedRef.current = false;
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to refresh account profile:', error);
        }
      }
    })();
  }, [_hasHydrated, token, user, login]);

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

  // Show sign-in prompt only if hydrated and user is not logged in
  if (!token || !user) {
    return (
      <div className="container-wide py-16 text-center">
        <div className="max-w-md mx-auto">
          <User className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold mb-4">{t('account.signInToAccount')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('account.accessAccount')}
          </p>
          <div className="flex flex-col gap-3">
            <Button size="lg" asChild>
              <Link href="/login">{t('auth.login')}</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/register">{t('account.createAccount')}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await authApi.logout();
      useAuthStore.getState().logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Logout error:', error);
      }
      useAuthStore.getState().logout();
      router.push('/');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await authApi.updateProfile({
        phone: phoneValue || undefined,
      });
      
      // Update auth store with new user data
      login(useAuthStore.getState().token || '', updatedUser, false);
      
      toast.success(t('account.saveChanges'));
      setIsEditingPhone(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating profile:', error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const menuItems = [
    {
      icon: Package,
      label: t('account.myOrders'),
      description: t('account.trackOrders'),
      href: '/account/orders',
    },
    {
      icon: MapPin,
      label: t('account.addresses'),
      description: t('account.manageAddresses'),
      href: '/account/addresses',
    },
    {
      icon: Settings,
      label: t('account.accountSettings'),
      description: t('account.preferences'),
      href: '/account/settings',
    },
  ];

  const displayName = user.first_name && user.last_name
    ? `${user.first_name} ${user.last_name}`
    : user.name || user.email || 'User';
  const initials = user.first_name && user.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`
    : user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
    : user.email?.[0]?.toUpperCase() || 'U';

  const showValue = (value?: string | number | null) => {
    if (value === null || value === undefined) return t('account.notProvided');
    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : t('account.notProvided');
  };

  const renderDocumentLink = (url?: string, label = 'View Document') => {
    if (!url) {
      return <span>{t('account.notProvided')}</span>;
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary underline underline-offset-2 hover:text-primary/80"
      >
        <FileText className="h-4 w-4" />
        {label}
      </a>
    );
  };

  return (
    <div className="container-wide py-8">
      <h1 className="font-display text-3xl font-bold mb-8">{t('account.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">{t('account.profileInformation')}</h2>
              <Button 
                variant={isEditingPhone ? 'default' : 'outline'} 
                size="sm"
                onClick={() => isEditingPhone ? handleSave() : setIsEditingPhone(true)}
                disabled={isSaving}
              >
                {isEditingPhone ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t('account.saveChanges')}
                  </>
                ) : (
                  <>Edit Phone</>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {initials}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {displayName}
                </h3>
                <p className="text-muted-foreground">{user.email}</p>
                <span className="badge-success mt-2 inline-block">{t('account.verifiedAccount')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{t('account.firstName')}</Label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{showValue(user.first_name || user.name?.split(' ')[0])}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('account.lastName')}</Label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{showValue(user.last_name || user.name?.split(' ').slice(1).join(' '))}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('account.email')}</Label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('account.phone')}</Label>
                {isEditingPhone ? (
                  <Input
                    value={phoneValue}
                    onChange={(e) => setPhoneValue(e.target.value)}
                    placeholder="+49 123 456 7890"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{showValue(user.phone)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Mobile</Label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{showValue(user.mobile)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <span className="capitalize">{showValue(user.account_type)}</span>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <span>{showValue(user.address)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <span>{showValue(user.postal_code)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <span>{showValue(user.city)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <span>{showValue(user.country)}</span>
                </div>
              </div>

              {user.account_type === 'merchant' && (
                <>
                  <div className="space-y-2">
                    <Label>Tax Number</Label>
                    <div className="p-3 bg-muted rounded-lg">{showValue(user.tax_number)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>VAT Number</Label>
                    <div className="p-3 bg-muted rounded-lg">{showValue(user.vat_number)}</div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Delivery Address</Label>
                    <div className="p-3 bg-muted rounded-lg">{showValue(user.delivery_address)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Postal Code</Label>
                    <div className="p-3 bg-muted rounded-lg">{showValue(user.delivery_postal_code)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery City</Label>
                    <div className="p-3 bg-muted rounded-lg">{showValue(user.delivery_city)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Country</Label>
                    <div className="p-3 bg-muted rounded-lg">{showValue(user.delivery_country)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Account Holder</Label>
                    <div className="p-3 bg-muted rounded-lg">{showValue(user.account_holder)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <div className="p-3 bg-muted rounded-lg">{showValue(user.bank_name)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>IBAN</Label>
                    <div className="p-3 bg-muted rounded-lg">{showValue(user.iban)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>BIC</Label>
                    <div className="p-3 bg-muted rounded-lg">{showValue(user.bic)}</div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8">
              <h3 className="font-display text-lg font-semibold mb-4">Uploaded Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">{renderDocumentLink(user.id_card_file, 'View ID Card')}</div>
                <div className="p-3 bg-muted rounded-lg">{renderDocumentLink(user.passport_file, 'View Passport')}</div>
                {user.account_type === 'merchant' && (
                  <>
                    <div className="p-3 bg-muted rounded-lg">
                      {renderDocumentLink(user.business_registration_certificate_file, 'View Business Registration')}
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      {renderDocumentLink(user.vat_certificate_file, 'View VAT Certificate')}
                    </div>
                    <div className="p-3 bg-muted rounded-lg md:col-span-2">
                      {renderDocumentLink(user.tax_number_certificate_file, 'View Tax Certificate')}
                    </div>
                  </>
                )}
              </div>
            </div>

            {isEditingPhone && (
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPhoneValue(user.phone || '');
                    setIsEditingPhone(false);
                  }}
                >
                  {t('account.cancel')}
                </Button>
                <Button className="btn-shop" onClick={handleSave} disabled={isSaving}>
                  {t('account.saveChanges')}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <item.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 w-full bg-card border border-border rounded-xl hover:border-destructive hover:bg-destructive/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:bg-destructive/10 transition-colors">
              <LogOut className="w-6 h-6 text-muted-foreground group-hover:text-destructive" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold group-hover:text-destructive">{t('account.signOut')}</h3>
              <p className="text-sm text-muted-foreground">{t('account.logoutDescription')}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
