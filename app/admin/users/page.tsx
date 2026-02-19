'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/api/admin';
import Card from '@/components/ui/card';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Search } from 'lucide-react';
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

  const toggleApproval = async (user: ShopUser, isActive: boolean) => {
    try {
      await adminApi.updateUserApproval(user.id, isActive);
      toast.success(isActive ? 'User approved' : 'User moved to pending');
      loadUsers();
      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser({ ...selectedUser, is_active: isActive ? 1 : 0 });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update approval');
    }
  };

  const fullName = (user: ShopUser) => `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A';

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
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
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
                        <Badge className={user.account_type === 'merchant' ? 'bg-info/20 text-info border-info/30' : ''}>
                          {user.account_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.phone || user.mobile || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={user.is_active ? 'bg-success/20 text-success border-success/30' : 'bg-warning/20 text-warning border-warning/30'}>
                          {user.is_active ? 'Approved' : 'Pending'}
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
                            variant={user.is_active ? 'outline' : 'default'}
                            onClick={() => toggleApproval(user, !user.is_active)}
                          >
                            {user.is_active ? 'Set Pending' : 'Approve'}
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
              <div><span className="font-medium">Account type:</span> {selectedUser.account_type}</div>
              <div><span className="font-medium">Status:</span> {selectedUser.is_active ? 'Approved' : 'Pending'}</div>
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
              <div><span className="font-medium">ID card file:</span> {selectedUser.id_card_file || 'N/A'}</div>
              <div><span className="font-medium">Passport file:</span> {selectedUser.passport_file || 'N/A'}</div>
              <div><span className="font-medium">Business registration:</span> {selectedUser.business_registration_certificate_file || 'N/A'}</div>
              <div><span className="font-medium">VAT certificate:</span> {selectedUser.vat_certificate_file || 'N/A'}</div>
              <div><span className="font-medium">Tax certificate:</span> {selectedUser.tax_number_certificate_file || 'N/A'}</div>
            </div>
            <div className="pt-4">
              <Button
                onClick={() => toggleApproval(selectedUser, !selectedUser.is_active)}
                variant={selectedUser.is_active ? 'outline' : 'default'}
              >
                {selectedUser.is_active ? 'Set Pending' : 'Approve User'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
