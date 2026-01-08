'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Settings, 
  ChevronRight,
  Lock,
  Bell,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/store/auth-store';
import { useLanguage } from '@/contexts/language-context';
import { Skeleton } from '@/components/ui/skeleton';
import Card from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';
import toast from 'react-hot-toast';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, token, initialize } = useAuthStore();
  const { t } = useLanguage();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    }
  }, [token, user, router]);

  if (!token || !user) {
    return (
      <div className="container-wide py-16 text-center">
        <div className="max-w-md mx-auto">
          <Settings className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold mb-4">{t('account.accountSettings')}</h1>
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

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('settings.passwordMismatch') || 'Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error(t('settings.passwordTooShort') || 'Password must be at least 8 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      // TODO: Implement change password API endpoint
      // await authApi.changePassword({
      //   currentPassword: passwordData.currentPassword,
      //   newPassword: passwordData.newPassword,
      // });
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('settings.passwordChanged') || 'Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('settings.passwordChanged') || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

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

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">{t('settings.title') || t('account.accountSettings')}</h1>
        <p className="text-muted-foreground mt-1">{t('settings.subtitle') || 'Manage your account preferences'}</p>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Account Information</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Password Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-display text-xl font-bold">{t('settings.changePassword') || 'Change Password'}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t('settings.changePasswordDesc') || 'Update your password to keep your account secure.'}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t('settings.currentPassword') || 'Current Password'}</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('settings.newPassword') || 'New Password'}</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('settings.confirmPassword') || 'Confirm New Password'}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
            <Button 
              className="btn-shop" 
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? t('common.loading') : (t('settings.updatePassword') || 'Update Password')}
            </Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-display text-xl font-bold">{t('settings.notifications') || 'Notifications'}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t('settings.notificationsDesc') || 'Choose what notifications you receive.'}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('settings.notificationsDesc') || 'Notification preferences coming soon'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
