'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/lib/api/admin';
import { Product } from '@/types/product';
import Card from '@/components/ui/card';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Edit, ChevronLeft, ChevronRight, Star, Package, Store, Warehouse, Plus } from 'lucide-react';
import { formatPrice } from '@/lib/utils/format';
import { getProxiedImageUrl } from '@/lib/utils/format';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all'); // Filter by product_source
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 50, // Increased default limit to show more products
    total: 0,
  });

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getProducts({
        page,
        limit: 50, // Increased limit to show more products per page
        search: search || undefined,
        // Removed is_available filter as it's not useful - show all products regardless of availability
        product_source: sourceFilter !== 'all' ? sourceFilter : undefined,
      });
      // API now returns { products: [...], pagination: {...} } directly
      const productsData = response.products || [];
      const paginationData = response.pagination || {};
      
      setProducts(productsData);
      setPagination({
        current_page: paginationData.page || page,
        last_page: paginationData.pages || 1,
        per_page: paginationData.limit || 50,
        total: paginationData.total || productsData.length,
      });
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, sourceFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleToggleFeatured = async (product: Product) => {
    try {
      await adminApi.updateProduct(product.id, {
        is_featured: product.is_featured ? 0 : 1,
      });
      toast.success('Product featured status updated');
      loadProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
    }
  };

  const handleSavePrice = async () => {
    if (!selectedProduct || !editPrice) return;

    try {
      await adminApi.updateProduct(selectedProduct.id, {
        price: parseFloat(editPrice),
      });
      toast.success('Product price updated');
      loadProducts();
      setSelectedProduct(null);
      setEditPrice('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update price');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={() => window.location.href = '/admin/products/new'} className="gap-2">
          <Plus className="h-4 w-4" />
          Add In-House Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={sourceFilter}
              onValueChange={(value) => {
                setSourceFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Product Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="vendor">Vendor Stock</SelectItem>
                <SelectItem value="own">In-House Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No products found</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Vendor Price</TableHead>
                      <TableHead>Customer Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden">
                              <Image
                                src={getProxiedImageUrl(product.primary_image)}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {product.category_name}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={product.product_source === 'vendor' ? 'default' : 'secondary'}
                            className="flex items-center gap-1 w-fit"
                          >
                            {product.product_source === 'vendor' ? (
                              <>
                                <Store className="h-3 w-3" />
                                Vendor
                              </>
                            ) : (
                              <>
                                <Warehouse className="h-3 w-3" />
                                In-House
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {product.sku}
                          {product.vendor_article_id && (
                            <div className="text-xs text-muted-foreground">
                              Vendor: {product.vendor_article_id}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {product.base_price ? formatPrice(product.base_price) : '-'}
                            {product.base_price && product.price && (
                              <div className="text-xs text-muted-foreground">
                                Base/Cost
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatPrice(product.price)}
                          {product.base_price && product.price && (
                            <div className="text-xs text-success">
                              +{((product.price - product.base_price) / product.base_price * 100).toFixed(1)}%
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{product.stock_quantity}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={product.is_featured === 1}
                              onCheckedChange={() => handleToggleFeatured(product)}
                            />
                            {product.is_featured === 1 && (
                              <Star className="h-4 w-4 text-warning fill-warning" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setEditPrice(product.price.toString());
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Price
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {((pagination.current_page - 1) * pagination.per_page + 1).toLocaleString()} to{' '}
                  {Math.min(pagination.current_page * pagination.per_page, pagination.total).toLocaleString()} of{' '}
                  {pagination.total.toLocaleString()} products
                </p>
                {pagination.last_page > 1 && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pagination.current_page === 1 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Page {pagination.current_page} of {pagination.last_page}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
                      disabled={pagination.current_page === pagination.last_page || isLoading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Price Dialog */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Price - {selectedProduct.name}</DialogTitle>
              <DialogDescription>Update the product price</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedProduct.base_price && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">Vendor/Base Price</div>
                  <div className="text-lg font-semibold">{formatPrice(selectedProduct.base_price)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    This is the cost price from vendor or purchase cost
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="price">Customer Price (with markup)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="Enter new price"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Current customer price: {formatPrice(selectedProduct.price)}
                  {selectedProduct.base_price && (
                    <span className="ml-2">
                      (Markup: {((selectedProduct.price - selectedProduct.base_price) / selectedProduct.base_price * 100).toFixed(1)}%)
                    </span>
                  )}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                Cancel
              </Button>
              <Button onClick={handleSavePrice}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

