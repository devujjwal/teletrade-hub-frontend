'use client';

import { useEffect, useState } from 'react';
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

export default function AdminPricingPage() {
  const [globalMarkup, setGlobalMarkup] = useState('');
  const [recalculate, setRecalculate] = useState(false);
  const [categoryMarkups, setCategoryMarkups] = useState<Record<number, string>>({});
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
        adminApi.getPricingConfig(),
        categoriesApi.list('en'),
      ]);
      
      // Handle different response structures
      const pricing = pricingResponse?.success ? pricingResponse.data : pricingResponse;
      
      setPricingData(pricing);
      
      // Set global markup value
      const globalMarkupValue = pricing?.global_markup?.value || pricing?.global_markup?.markup_value || 0;
      setGlobalMarkup(globalMarkupValue.toString());
      
      // Initialize category markups from saved rules
      const rules = pricing?.rules || pricing?.category_markups || [];
      const initialCategoryMarkups: Record<number, string> = {};
      rules.forEach((rule: any) => {
        if (rule.rule_type === 'category' && rule.entity_id) {
          initialCategoryMarkups[rule.entity_id] = (rule.markup_value || rule.value || 0).toString();
        }
      });
      setCategoryMarkups(initialCategoryMarkups);
      
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Error loading pricing data:', error);
      toast.error('Failed to load pricing configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlobalSave = async () => {
    const value = parseFloat(globalMarkup);
    if (isNaN(value) || value < 0) {
      toast.error('Please enter a valid positive number');
      return;
    }
    setIsSaving(true);
    try {
      const response = await adminApi.updateGlobalMarkup(value, recalculate);
      toast.success(
        recalculate && response?.data?.products_updated
          ? `Global markup updated and ${response.data.products_updated} products recalculated`
          : 'Global markup updated successfully'
      );
      // Reset recalculate flag
      setRecalculate(false);
      // Reload data to show updated values
      await loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update markup');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCategorySave = async (categoryId: number) => {
    const value = parseFloat(categoryMarkups[categoryId]);
    if (isNaN(value) || value < 0) {
      toast.error('Please enter a valid positive number');
      return;
    }
    try {
      await adminApi.updateCategoryMarkup(categoryId, value);
      toast.success('Category markup updated successfully');
      // Clear the input for this category after saving
      setCategoryMarkups((prev) => {
        const updated = { ...prev };
        delete updated[categoryId];
        return updated;
      });
      // Reload data to show updated values
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
        <p className="text-muted-foreground">Configure global and category-specific markups</p>
      </div>

      {/* Global Markup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Global Markup
          </CardTitle>
          <CardDescription>Set a default markup percentage applied to all products</CardDescription>
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
                  placeholder={pricingData?.global_markup?.value?.toString() || '0'}
                  value={globalMarkup}
                  onChange={(e) => setGlobalMarkup(e.target.value)}
                  className="pr-10"
                />
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Current: {pricingData?.global_markup?.value || 0}%
              </p>
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
            <Switch
              id="recalculate"
              checked={recalculate}
              onCheckedChange={setRecalculate}
            />
            <Label htmlFor="recalculate" className="cursor-pointer">
              Recalculate prices for all products
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Category Markups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Category-Specific Markups
          </CardTitle>
          <CardDescription>
            Override global markup for specific categories
          </CardDescription>
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
                    // Find category-specific rule from rules array
                    const categoryRule = pricingData?.rules?.find(
                      (rule: any) => rule.rule_type === 'category' && rule.entity_id === category.id
                    );
                    const currentMarkup = categoryRule
                      ? (categoryRule.markup_value || categoryRule.value || 0)
                      : (pricingData?.global_markup?.value || pricingData?.global_markup?.markup_value || 0);
                    
                    // Show input value if editing, otherwise show empty (placeholder shows current)
                    const inputValue = categoryMarkups[category.id] || '';
                    
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
                              setCategoryMarkups({
                                ...categoryMarkups,
                                [category.id]: e.target.value,
                              })
                            }
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCategorySave(category.id)}
                            disabled={!categoryMarkups[category.id] || categoryMarkups[category.id] === currentMarkup.toString()}
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
