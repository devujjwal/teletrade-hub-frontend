'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/layout/admin-layout';
import { useAuthStore } from '@/lib/store/auth-store';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { initialize } = useAuthStore();
  
  // Initialize auth state from localStorage on mount
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  // Don't wrap login page in AdminLayout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
}

