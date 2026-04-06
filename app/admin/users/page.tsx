'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/api/admin';
import Card from '@/components/ui/card';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Copy, KeyRound, Loader2, RefreshCw, Search } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface ShopUser {
  id: number;
  account_type: 'customer' | 'merchant';
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  mobile?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  tax_number?: string;
  vat_number?: string;
  delivery_address?: string;
  delivery_postal_code?: string;
  delivery_city?: string;
  delivery_country?: string;
  account_holder?: string;
  bank_name?: string;
  iban?: string;
  bic?: string;
  id_card_file?: string;
  passport_file?: string;
  business_registration_certificate_file?: string;
  vat_certificate_file?: string;
  tax_number_certificate_file?: string;
  is_active: number;
  approval_status?: 'approved' | 'pending' | 'rejected';
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ShopUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('all');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<ShopUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<ShopUser | null>(null);
  const [passwordData, setPasswordData] = useState({
    new_password: '',
    confirm_password: '',
  });
  const [sendResetNotificationEmail, setSendResetNotificationEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    limit: 20,
    total: 0,
  });

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getUsers({
        page,
        limit: 20,
        search: search || undefined,
        account_type: accountTypeFilter !== 'all' ? accountTypeFilter : undefined,
        approval_status: approvalFilter !== 'all' ? approvalFilter : undefined,
      });
      setUsers(response.users || []);
      setPagination((prev) => response.pagination || prev);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, accountTypeFilter, approvalFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const updateApproval = async (user: ShopUser, approvalStatus: 'approved' | 'pending' | 'rejected') => {
    try {
      await adminApi.updateUserApproval(user.id, approvalStatus);
      toast.success(
        approvalStatus === 'approved'
          ? 'User approved'
          : approvalStatus === 'rejected'
          ? 'User rejected'
          : 'User moved to pending'
      );
      loadUsers();
      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser({
          ...selectedUser,
          approval_status: approvalStatus,
          is_active: approvalStatus === 'approved' ? 1 : 0,
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update approval');
    }
  };

  const getApprovalStatus = (user: ShopUser) => user.approval_status || (user.is_active ? 'approved' : 'pending');
  const getAccountTypeLabel = (accountType: ShopUser['account_type']) =>
    accountType === 'merchant' ? 'Merchant' : 'Customer';
  const getAccountTypeBadgeClass = (accountType: ShopUser['account_type']) =>
    accountType === 'merchant'
      ? 'border border-amber-200 bg-amber-100 text-amber-900'
      : 'border border-sky-200 bg-sky-100 text-sky-800';

  const fullName = (user: ShopUser) => `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A';
  const openPasswordDialog = (user: ShopUser) => {
    setPasswordUser(user);
    setPasswordData({ new_password: '', confirm_password: '' });
    setSendResetNotificationEmail(false);
  };

  const closePasswordDialog = () => {
    setPasswordUser(null);
    setPasswordData({ new_password: '', confirm_password: '' });
    setSendResetNotificationEmail(false);
  };

  const generateStrongPassword = () => {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnopqrstuvwxyz';
    const digits = '23456789';
    const special = '!@#$%^&*()-_=+';
    const all = upper + lower + digits + special;
    const length = 14;

    const picks = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      digits[Math.floor(Math.random() * digits.length)],
      special[Math.floor(Math.random() * special.length)],
    ];

    for (let i = picks.length; i < length; i += 1) {
      picks.push(all[Math.floor(Math.random() * all.length)]);
    }

    const generated = picks.sort(() => Math.random() - 0.5).join('');
    setPasswordData({
      new_password: generated,
      confirm_password: generated,
    });
  };

  const copyPasswordToClipboard = async () => {
    if (!passwordData.new_password) {
      toast.error('Enter or generate a password first');
      return;
    }

    try {
      await navigator.clipboard.writeText(passwordData.new_password);
      toast.success('Password copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy password');
    }
  };

  const handleUpdateUserPassword = async () => {
    if (!passwordUser) return;

    if (!passwordData.new_password || !passwordData.confirm_password) {
      toast.error('Please fill both password fields');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await adminApi.updateUserPassword(passwordUser.id, {
        ...passwordData,
        send_notification_email: sendResetNotificationEmail,
      });
      if (sendResetNotificationEmail && response?.data?.notification_email_sent === false) {
        toast.success('Password updated, but notification email could not be sent.');
      } else {
        toast.success('User password updated. Share it securely with the user.');
      }
      closePasswordDialog();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update user password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const renderDocumentLink = (url?: string, label = 'View Document') => {
    if (!url) return 'N/A';

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:text-primary/80"
      >
        {label}
      </a>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage customer and merchant registrations</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={accountTypeFilter} onValueChange={(value) => { setAccountTypeFilter(value); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="merchant">Merchant</SelectItem>
              </SelectContent>
            </Select>
            <Select value={approvalFilter} onValueChange={(value) => { setApprovalFilter(value); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Approval status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 rounded-lg border border-border/80 bg-muted/40 px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Loading users...</p>
                  <p className="text-xs text-muted-foreground">Fetching customer and merchant registrations.</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-md border">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.6fr] gap-4 border-b bg-muted/30 px-5 py-3">
                  {['User', 'Type', 'Phone', 'Status', 'Registered', 'Actions'].map((label) => (
                    <Skeleton key={label} className="h-5 w-20" />
                  ))}
                </div>
                <div className="space-y-0">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.6fr] gap-4 border-b px-5 py-4 last:border-b-0">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-7 w-24 rounded-full" />
                      <Skeleton className="h-7 w-28" />
                      <Skeleton className="h-7 w-24 rounded-full" />
                      <Skeleton className="h-7 w-24" />
                      <Skeleton className="h-9 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No users found</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{fullName(user)}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAccountTypeBadgeClass(user.account_type)}>
                          {getAccountTypeLabel(user.account_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.phone || user.mobile || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={
                          getApprovalStatus(user) === 'approved'
                            ? 'bg-success/20 text-success border-success/30'
                            : getApprovalStatus(user) === 'rejected'
                            ? 'bg-destructive/20 text-destructive border-destructive/30'
                            : 'bg-warning/20 text-warning border-warning/30'
                        }>
                          {getApprovalStatus(user).charAt(0).toUpperCase() + getApprovalStatus(user).slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(user.created_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedUser(user)}>
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant={getApprovalStatus(user) === 'approved' ? 'outline' : 'default'}
                            onClick={() => updateApproval(user, getApprovalStatus(user) === 'approved' ? 'pending' : 'approved')}
                          >
                            {getApprovalStatus(user) === 'approved' ? 'Set Pending' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateApproval(user, 'rejected')}
                          >
                            Reject
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openPasswordDialog(user)}>
                            <KeyRound className="h-4 w-4 mr-1" />
                            Set Password
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Name:</span> {fullName(selectedUser)}</div>
              <div><span className="font-medium">Email:</span> {selectedUser.email}</div>
              <div><span className="font-medium">Account type:</span> {getAccountTypeLabel(selectedUser.account_type)}</div>
              <div><span className="font-medium">Status:</span> {getApprovalStatus(selectedUser)}</div>
              <div><span className="font-medium">Phone:</span> {selectedUser.phone || 'N/A'}</div>
              <div><span className="font-medium">Mobile:</span> {selectedUser.mobile || 'N/A'}</div>
              <div><span className="font-medium">Address:</span> {selectedUser.address || 'N/A'}</div>
              <div><span className="font-medium">Postal code:</span> {selectedUser.postal_code || 'N/A'}</div>
              <div><span className="font-medium">City:</span> {selectedUser.city || 'N/A'}</div>
              <div><span className="font-medium">Country:</span> {selectedUser.country || 'N/A'}</div>
              <div><span className="font-medium">Tax number:</span> {selectedUser.tax_number || 'N/A'}</div>
              <div><span className="font-medium">VAT number:</span> {selectedUser.vat_number || 'N/A'}</div>
              <div><span className="font-medium">Delivery address:</span> {selectedUser.delivery_address || 'N/A'}</div>
              <div><span className="font-medium">Delivery postal code:</span> {selectedUser.delivery_postal_code || 'N/A'}</div>
              <div><span className="font-medium">Delivery city:</span> {selectedUser.delivery_city || 'N/A'}</div>
              <div><span className="font-medium">Delivery country:</span> {selectedUser.delivery_country || 'N/A'}</div>
              <div><span className="font-medium">Account holder:</span> {selectedUser.account_holder || 'N/A'}</div>
              <div><span className="font-medium">Bank:</span> {selectedUser.bank_name || 'N/A'}</div>
              <div><span className="font-medium">IBAN:</span> {selectedUser.iban || 'N/A'}</div>
              <div><span className="font-medium">BIC:</span> {selectedUser.bic || 'N/A'}</div>
              <div><span className="font-medium">ID card file:</span> {renderDocumentLink(selectedUser.id_card_file, 'View ID Card')}</div>
              <div><span className="font-medium">Passport file:</span> {renderDocumentLink(selectedUser.passport_file, 'View Passport')}</div>
              <div><span className="font-medium">Business registration:</span> {renderDocumentLink(selectedUser.business_registration_certificate_file, 'View Business Registration')}</div>
              <div><span className="font-medium">VAT certificate:</span> {renderDocumentLink(selectedUser.vat_certificate_file, 'View VAT Certificate')}</div>
              <div><span className="font-medium">Tax certificate:</span> {renderDocumentLink(selectedUser.tax_number_certificate_file, 'View Tax Certificate')}</div>
            </div>
            <div className="pt-4">
              <Button
                onClick={() => updateApproval(selectedUser, getApprovalStatus(selectedUser) === 'approved' ? 'pending' : 'approved')}
                variant={getApprovalStatus(selectedUser) === 'approved' ? 'outline' : 'default'}
              >
                {getApprovalStatus(selectedUser) === 'approved' ? 'Set Pending' : 'Approve User'}
              </Button>
              <Button
                onClick={() => updateApproval(selectedUser, 'rejected')}
                variant="outline"
                className="ml-2"
              >
                Reject User
              </Button>
              <Button onClick={() => openPasswordDialog(selectedUser)} variant="outline" className="ml-2">
                <KeyRound className="h-4 w-4 mr-2" />
                Set Password
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {passwordUser && (
        <Dialog open={!!passwordUser} onOpenChange={closePasswordDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Set User Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Set a new login password for <span className="font-medium text-foreground">{fullName(passwordUser)}</span> ({passwordUser.email}).
              </p>
              <div className="grid gap-2">
                <label className="text-sm font-medium">New Password</label>
                <Input
                  type="text"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, new_password: e.target.value }))}
                  placeholder="Enter strong password"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="text"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, confirm_password: e.target.value }))}
                  placeholder="Re-enter password"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Use at least 8 characters with uppercase, lowercase, number, and special character.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={generateStrongPassword}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Strong Password
                </Button>
                <Button type="button" variant="outline" onClick={copyPasswordToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Password
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Send password reset notification email</p>
                  <p className="text-xs text-muted-foreground">
                    If enabled, the same password will be emailed to this user.
                  </p>
                </div>
                <Switch
                  checked={sendResetNotificationEmail}
                  onCheckedChange={setSendResetNotificationEmail}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={closePasswordDialog}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleUpdateUserPassword} disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
