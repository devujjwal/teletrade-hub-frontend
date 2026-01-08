'use client';

import { useState, useEffect } from 'react';
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
  Edit2,
  Save
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
  const { user, token, initialize, _hasHydrated } = useAuthStore();
  const login = useAuthStore((state) => state.login);
  const { t } = useLanguage();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || user?.name?.split(' ')[0] || '',
    lastName: user?.last_name || user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Only redirect if hydrated and user is not logged in
    if (_hasHydrated && (!token || !user)) {
      router.push('/login');
    }
  }, [_hasHydrated, token, user, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || user.name?.split(' ')[0] || '',
        lastName: user.last_name || user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

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
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone || undefined,
      });
      
      // Update auth store with new user data
      login(useAuthStore.getState().token || '', updatedUser, false);
      
      toast.success(t('account.saveChanges'));
      setIsEditing(false);
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
                variant={isEditing ? 'default' : 'outline'} 
                size="sm"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={isSaving}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t('account.saveChanges')}
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" />
                    {t('account.editProfile')}
                  </>
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
                {isEditing ? (
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{user.first_name || user.name?.split(' ')[0] || t('account.notProvided')}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t('account.lastName')}</Label>
                {isEditing ? (
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{user.last_name || user.name?.split(' ').slice(1).join(' ') || t('account.notProvided')}</span>
                  </div>
                )}
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
                {isEditing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+49 123 456 7890"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{user.phone || t('account.notProvided')}</span>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
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
