'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Settings, 
  ChevronRight,
  User,
  Mail,
  Phone,
  Lock,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useLanguage } from '@/contexts/language-context';
import { Skeleton } from '@/components/ui/skeleton';
import Card from '@/components/ui/card';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, token, initialize } = useAuthStore();
  const { t } = useLanguage();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Check authentication - redirect if not logged in
    if (!token || !user) {
      router.push('/login');
    }
  }, [token, user, router]);

  // Redirect to login if not authenticated
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

  return (
    <div className="container-wide py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/account" className="hover:text-foreground">{t('account.title')}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{t('account.accountSettings')}</span>
      </nav>

      <h1 className="font-display text-3xl font-bold mb-8">{t('account.accountSettings')}</h1>

      <div className="space-y-6">
        {/* Account Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Account Information</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Security</h2>
          </div>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <p className="text-sm text-muted-foreground">
              Update your password to keep your account secure
            </p>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Notification preferences coming soon
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
