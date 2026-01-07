'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { cn } from '@/lib/utils/cn';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import toast from 'react-hot-toast';

const tabs = [
  { href: '/account', label: 'Profile', icon: User },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/settings', label: 'Settings', icon: Settings },
];

export default function AccountTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="md:col-span-1">
        <Card className="p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </Link>
              );
            })}
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </Card>
      </div>

      {/* Content */}
      <div className="md:col-span-3">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-bold mb-2">Profile Information</h2>
              <p className="text-muted-foreground">Manage your account details</p>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <p className="text-foreground">{user?.name || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <p className="text-foreground">{user?.email || 'Not set'}</p>
              </div>
              {user?.phone && (
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <p className="text-foreground">{user.phone}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

