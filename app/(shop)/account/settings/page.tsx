import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import AccountTabs from '@/components/account/account-tabs';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const metadata: Metadata = {
  title: 'Account Settings | TeleTrade Hub',
  description: 'Manage your account settings',
};

export default async function AccountSettingsPage() {
  // Check authentication
  let user;
  try {
    user = await authApi.getCurrentUser();
  } catch {
    redirect('/login');
  }

  return (
    <div className="container-wide py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Account Settings</h1>
      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <AccountTabs />
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold mb-2">Settings</h2>
                <p className="text-muted-foreground">Manage your account preferences</p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    defaultValue={user?.name || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">Name cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">Email cannot be changed</p>
                </div>

                {user?.phone && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue={user.phone}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">Phone cannot be changed</p>
                  </div>
                )}

                <div className="pt-4">
                  <Button variant="outline" disabled>
                    Save Changes
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Account settings management coming soon
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

