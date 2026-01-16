'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
import { Search, Edit, ChevronLeft, ChevronRight, Star, Package, Store, Warehouse, Plus, Filter, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils/format';
import { getProxiedImageUrl } from '@/lib/utils/format';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { categoriesApi } from '@/lib/api/categories';
import { brandsApi } from '@/lib/api/brands';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all'); // Filter by product_source
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 50, // Increased default limit to show more products
    total: 0,
  });

  const loadOptions = useCallback(async () => {
    try {
      const [categoriesResponse, brandsResponse] = await Promise.all([
        categoriesApi.list('en'),
        brandsApi.list('en'),
      ]);
      setCategories(categoriesResponse.data || []);
      setBrands(brandsResponse.data || []);
    } catch (error) {
      console.error('Error loading options:', error);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: any = {
        page,
        limit: 50, // Increased limit to show more products per page
      };
      
      if (search) filters.search = search;
      if (sourceFilter !== 'all') filters.product_source = sourceFilter;
      if (categoryFilter !== 'all') filters.category_id = parseInt(categoryFilter);
      if (brandFilter !== 'all') filters.brand_id = parseInt(brandFilter);
      if (availabilityFilter !== 'all') filters.is_available = availabilityFilter === 'available' ? 1 : 0;
      if (featuredFilter !== 'all') filters.is_featured = featuredFilter === 'featured' ? 1 : 0;

      const response = await adminApi.getProducts(filters);
      // API returns { success: true, data: { products: [...], pagination: {...} } }
      const productsData = response.data?.products || [];
      const paginationData = response.data?.pagination || {};
      
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
  }, [page, search, sourceFilter, categoryFilter, brandFilter, availabilityFilter, featuredFilter]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

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
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
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

            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select
                value={sourceFilter}
                onValueChange={(value) => {
                  setSourceFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Product Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="vendor">Vendor Stock</SelectItem>
                  <SelectItem value="own">In-House Stock</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={brandFilter}
                onValueChange={(value) => {
                  setBrandFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={availabilityFilter}
                onValueChange={(value) => {
                  setAvailabilityFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={featuredFilter}
                onValueChange={(value) => {
                  setFeaturedFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="featured">Featured Only</SelectItem>
                  <SelectItem value="not-featured">Not Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Summary */}
            {(sourceFilter !== 'all' || categoryFilter !== 'all' || brandFilter !== 'all' || 
              availabilityFilter !== 'all' || featuredFilter !== 'all' || search) && (
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {search && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {search}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setSearch('');
                        setPage(1);
                      }}
                    />
                  </Badge>
                )}
                {sourceFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Source: {sourceFilter === 'vendor' ? 'Vendor' : 'In-House'}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setSourceFilter('all');
                        setPage(1);
                      }}
                    />
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {categories.find(c => c.id.toString() === categoryFilter)?.name || categoryFilter}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setCategoryFilter('all');
                        setPage(1);
                      }}
                    />
                  </Badge>
                )}
                {brandFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Brand: {brands.find(b => b.id.toString() === brandFilter)?.name || brandFilter}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setBrandFilter('all');
                        setPage(1);
                      }}
                    />
                  </Badge>
                )}
                {availabilityFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {availabilityFilter === 'available' ? 'Available' : 'Unavailable'}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setAvailabilityFilter('all');
                        setPage(1);
                      }}
                    />
                  </Badge>
                )}
                {featuredFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {featuredFilter === 'featured' ? 'Featured' : 'Not Featured'}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setFeaturedFilter('all');
                        setPage(1);
                      }}
                    />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setSourceFilter('all');
                    setCategoryFilter('all');
                    setBrandFilter('all');
                    setAvailabilityFilter('all');
                    setFeaturedFilter('all');
                    setPage(1);
                  }}
                  className="h-6 text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
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
                            <Link
                              href={`/products/${product.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative w-12 h-12 rounded-md overflow-hidden hover:opacity-80 transition-opacity"
                            >
                              <Image
                                src={getProxiedImageUrl(product.primary_image)}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </Link>
                            <div>
                              <Link
                                href={`/products/${product.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:text-primary hover:underline transition-colors"
                              >
                                {product.name}
                              </Link>
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
                        <TableCell>
                          {product.is_available === 0 ? (
                            <Badge variant="error" className="text-xs">
                              Unavailable
                            </Badge>
                          ) : product.stock_quantity <= 0 ? (
                            <Badge variant="error" className="text-xs">
                              Out of Stock
                            </Badge>
                          ) : (
                            <div className="space-y-1">
                              <div className="font-medium">{product.stock_quantity}</div>
                              {product.stock_quantity <= 5 ? (
                                <Badge variant="warning" className="text-xs">
                                  Low Stock
                                </Badge>
                              ) : (
                                <Badge variant="success" className="text-xs">
                                  In Stock
                                </Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
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
                          <div className="flex items-center gap-2">
                            {product.product_source === 'own' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/products/${product.id}`)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            ) : (
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
                            )}
                          </div>
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

