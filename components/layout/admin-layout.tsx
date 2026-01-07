'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  RefreshCw,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  Tags,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Button from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Categories', icon: Tags, path: '/admin/categories' },
  { label: 'Brands', icon: Award, path: '/admin/brands' },
  { label: 'Pricing', icon: DollarSign, path: '/admin/pricing' },
  { label: 'Sync', icon: RefreshCw, path: '/admin/sync' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isAdmin, user, token } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Wait for hydration before checking auth
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Don't check auth until component is mounted (hydration complete)
    if (!isMounted) {
      return;
    }

    // Don't redirect if already on login page
    if (pathname === '/admin/login') {
      return;
    }
    
    // Check if admin is logged in (check both isAdmin flag and token)
    if (!isAdmin || !token) {
      router.push('/admin/login');
    }
  }, [isMounted, isAdmin, token, router, pathname]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  // Don't render layout if on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // Show loading state while checking auth (waiting for hydration)
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Don't render if not admin (will redirect in useEffect)
  if (!isAdmin || !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground h-16 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary/80"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2 ml-4">
          <Store className="h-6 w-6" />
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-primary text-primary-foreground transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-foreground/10">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6" />
            <span className="font-bold text-lg">TeleTrade Hub</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-primary-foreground hover:bg-primary/80"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.path || (item.path !== '/admin/dashboard' && pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-secondary text-secondary-foreground font-semibold'
                    : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-foreground/10">
          <div className="mb-4 px-4">
            <p className="text-sm text-primary-foreground/60">Logged in as</p>
            <p className="font-medium truncate">{user?.name || user?.email || 'Admin'}</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen p-6">{children}</main>
    </div>
  );
}
