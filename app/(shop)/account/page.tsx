import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import AccountTabs from '@/components/account/account-tabs';

export const metadata: Metadata = {
  title: 'My Account | TeleTrade Hub',
  description: 'Manage your account and orders',
};

export default async function AccountPage() {
  // Check authentication
  try {
    await authApi.getCurrentUser();
  } catch {
    redirect('/login');
  }

  return (
    <div className="container-wide py-8">
      <h1 className="font-display text-3xl font-bold mb-8">My Account</h1>
      <AccountTabs />
    </div>
  );
}

