'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '@/lib/api/admin';
import { categoriesApi } from '@/lib/api/categories';
import Card from '@/components/ui/card';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, Percent, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

type AccountType = 'customer' | 'merchant';

export default function AdminPricingPage() {
  const [activeAccountType, setActiveAccountType] = useState<AccountType>('customer');
  const [globalMarkup, setGlobalMarkup] = useState<Record<AccountType, string>>({
    customer: '',
    merchant: '',
  });
  const [recalculate, setRecalculate] = useState(false);
  const [categoryMarkups, setCategoryMarkups] = useState<Record<AccountType, Record<number, string>>>({
    customer: {},
    merchant: {},
  });
  const [pricingData, setPricingData] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pricingResponse, categoriesResponse] = await Promise.all([
        adminApi.getPricing(),
        categoriesApi.list('en'),
      ]);

      setPricingData(pricingResponse);

      const customerGlobal = pricingResponse?.global_markup?.customer?.markup_value ?? 0;
      const merchantGlobal = pricingResponse?.global_markup?.merchant?.markup_value ?? 0;
      setGlobalMarkup({
        customer: customerGlobal.toString(),
        merchant: merchantGlobal.toString(),
      });

      const initialCategoryMarkups: Record<AccountType, Record<number, string>> = {
        customer: {},
        merchant: {},
      };

      const rules = pricingResponse?.rules || [];
      rules.forEach((rule: any) => {
        if (rule.rule_type === 'category' && rule.entity_id && (rule.account_type === 'customer' || rule.account_type === 'merchant')) {
          const accountType = rule.account_type as AccountType;
          initialCategoryMarkups[accountType][rule.entity_id] = (rule.markup_value || 0).toString();
        }
      });
      setCategoryMarkups(initialCategoryMarkups);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      toast.error('Failed to load pricing configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const currentGlobalMarkup = useMemo(() => globalMarkup[activeAccountType], [globalMarkup, activeAccountType]);

  const handleGlobalSave = async () => {
    const value = parseFloat(currentGlobalMarkup);
    if (isNaN(value) || value < 0) {
      toast.error('Please enter a valid positive number');
      return;
    }

    setIsSaving(true);
    try {
      const response = await adminApi.updateGlobalMarkup(value, activeAccountType, recalculate);
      toast.success(
        recalculate && response?.data?.products_updated
          ? `${activeAccountType} markup updated and ${response.data.products_updated} products recalculated`
          : `${activeAccountType} global markup updated successfully`
      );
      setRecalculate(false);
      await loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update markup');
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryCurrentMarkup = (categoryId: number, accountType: AccountType) => {
    const categoryRule = pricingData?.rules?.find(
      (rule: any) => rule.rule_type === 'category' && rule.entity_id === categoryId && rule.account_type === accountType
    );
    if (categoryRule) {
      return Number(categoryRule.markup_value || 0);
    }
    return Number(pricingData?.global_markup?.[accountType]?.markup_value || 0);
  };

  const handleCategorySave = async (categoryId: number) => {
    const value = parseFloat(categoryMarkups[activeAccountType][categoryId]);
    if (isNaN(value) || value < 0) {
      toast.error('Please enter a valid positive number');
      return;
    }

    try {
      await adminApi.updateCategoryMarkup(categoryId, value, activeAccountType);
      toast.success(`${activeAccountType} category markup updated successfully`);
      await loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update category markup');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pricing Management</h1>
        <p className="text-muted-foreground">Configure separate markups for customers and merchants</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price Group</CardTitle>
          <CardDescription>Choose which account type pricing to configure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant={activeAccountType === 'customer' ? 'default' : 'outline'} onClick={() => setActiveAccountType('customer')}>
              Customer
            </Button>
            <Button variant={activeAccountType === 'merchant' ? 'default' : 'outline'} onClick={() => setActiveAccountType('merchant')}>
              Merchant
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            {activeAccountType === 'customer' ? 'Customer' : 'Merchant'} Global Markup
          </CardTitle>
          <CardDescription>Set the default markup for this account type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="globalMarkup">Markup Percentage (%)</Label>
              <div className="relative">
                <Input
                  id="globalMarkup"
                  type="number"
                  step="0.1"
                  min="0"
                  value={currentGlobalMarkup}
                  onChange={(e) => setGlobalMarkup((prev) => ({ ...prev, [activeAccountType]: e.target.value }))}
                  className="pr-10"
                />
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={handleGlobalSave} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Global Markup
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="recalculate" checked={recalculate} onCheckedChange={setRecalculate} />
            <Label htmlFor="recalculate" className="cursor-pointer">
              Recalculate stored customer prices (optional legacy cache refresh)
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {activeAccountType === 'customer' ? 'Customer' : 'Merchant'} Category Markups
          </CardTitle>
          <CardDescription>Override global markup for specific categories</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No categories found</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Markup</TableHead>
                    <TableHead>New Markup (%)</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => {
                    const currentMarkup = getCategoryCurrentMarkup(category.id, activeAccountType);
                    const inputValue = categoryMarkups[activeAccountType][category.id] || '';

                    return (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{currentMarkup}%</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder={currentMarkup.toString()}
                            value={inputValue}
                            onChange={(e) =>
                              setCategoryMarkups((prev) => ({
                                ...prev,
                                [activeAccountType]: {
                                  ...prev[activeAccountType],
                                  [category.id]: e.target.value,
                                },
                              }))
                            }
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCategorySave(category.id)}
                            disabled={!categoryMarkups[activeAccountType][category.id] || categoryMarkups[activeAccountType][category.id] === currentMarkup.toString()}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
