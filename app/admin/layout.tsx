'use client';

import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/layout/admin-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't wrap login page in AdminLayout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
}

