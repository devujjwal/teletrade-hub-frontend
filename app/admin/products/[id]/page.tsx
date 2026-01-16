'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '@/lib/api/admin';
import { categoriesApi } from '@/lib/api/categories';
import { brandsApi } from '@/lib/api/brands';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2, Upload, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { getProxiedImageUrl } from '@/lib/utils/format';

// Language options
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'sk', name: 'Slovak (Slovenčina)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'tr', name: 'Turkish (Türkçe)' },
  { code: 'ro', name: 'Romanian (Română)' },
  { code: 'pl', name: 'Polish (Polski)' },
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    ean: '',
    description: '',
    category_id: '',
    brand_id: '',
    warranty_id: '',
    base_price: '',
    price: '',
    stock_quantity: '',
    reorder_point: '',
    warehouse_location: '',
    weight: '',
    dimensions: '',
    color: '',
    storage: '',
    ram: '',
    is_featured: false,
    is_available: true,
    name_en: '',
    name_de: '',
    name_sk: '',
    name_fr: '',
    name_es: '',
    name_ru: '',
    name_it: '',
    name_tr: '',
    name_ro: '',
    name_pl: '',
    description_en: '',
    description_de: '',
    description_sk: '',
    description_fr: '',
    description_es: '',
    description_ru: '',
    description_it: '',
    description_tr: '',
    description_ro: '',
    description_pl: '',
  });

  const loadProduct = useCallback(async () => {
    try {
      const response = await adminApi.getProducts({ page: 1, limit: 1000 });
      const products = response.products || [];
      const product = products.find((p: any) => p.id === productId);
      
      if (!product) {
        toast.error('Product not found');
        router.push('/admin/products');
        return;
      }

      // Check if it's an in-house product
      if (product.product_source !== 'own') {
        toast.error('Can only edit in-house products');
        router.push('/admin/products');
        return;
      }

      // Populate form data
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        ean: product.ean || '',
        description: product.description || '',
        category_id: product.category_id?.toString() || '',
        brand_id: product.brand_id?.toString() || '',
        warranty_id: product.warranty_id?.toString() || '',
        base_price: product.base_price?.toString() || '',
        price: product.price?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || '',
        reorder_point: product.reorder_point?.toString() || '',
        warehouse_location: product.warehouse_location || '',
        weight: product.weight?.toString() || '',
        dimensions: product.dimensions || '',
        color: product.color || '',
        storage: product.storage || '',
        ram: product.ram || '',
        is_featured: product.is_featured === 1,
        is_available: product.is_available === 1,
        name_en: product.name_en || '',
        name_de: product.name_de || '',
        name_sk: product.name_sk || '',
        name_fr: product.name_fr || '',
        name_es: product.name_es || '',
        name_ru: product.name_ru || '',
        name_it: product.name_it || '',
        name_tr: product.name_tr || '',
        name_ro: product.name_ro || '',
        name_pl: product.name_pl || '',
        description_en: product.description_en || '',
        description_de: product.description_de || '',
        description_sk: product.description_sk || '',
        description_fr: product.description_fr || '',
        description_es: product.description_es || '',
        description_ru: product.description_ru || '',
        description_it: product.description_it || '',
        description_tr: product.description_tr || '',
        description_ro: product.description_ro || '',
        description_pl: product.description_pl || '',
      });

      // Get product images
      if (product.images && Array.isArray(product.images)) {
        setUploadedImages(product.images.map((img: any) => img.image_url || img));
      }

    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  }, [productId, router]);

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

  useEffect(() => {
    loadOptions();
    loadProduct();
  }, [loadOptions, loadProduct]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    setIsUploading(true);
    try {
      const result = await adminApi.uploadImage(file);
      setUploadedImages([...uploadedImages, result.url]);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload: any = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description || null,
        ean: formData.ean || null,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        brand_id: formData.brand_id ? parseInt(formData.brand_id) : null,
        warranty_id: formData.warranty_id ? parseInt(formData.warranty_id) : null,
        base_price: parseFloat(formData.base_price) || 0,
        price: parseFloat(formData.price) || 0,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        reorder_point: parseInt(formData.reorder_point) || 0,
        warehouse_location: formData.warehouse_location || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions || null,
        color: formData.color || null,
        storage: formData.storage || null,
        ram: formData.ram || null,
        is_featured: formData.is_featured ? 1 : 0,
        is_available: formData.is_available ? 1 : 0,
        images: uploadedImages,
      };

      // Add language-specific fields
      LANGUAGES.forEach(lang => {
        const nameKey = `name_${lang.code}` as keyof typeof formData;
        const descKey = `description_${lang.code}` as keyof typeof formData;
        if (formData[nameKey]) {
          payload[nameKey] = formData[nameKey];
        }
        if (formData[descKey]) {
          payload[descKey] = formData[descKey];
        }
      });

      await adminApi.updateProduct(productId, payload);
      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Update product error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit In-House Product</h1>
          <p className="text-muted-foreground">Update product information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name (Default) *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                  placeholder="Enter SKU"
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">SKU cannot be changed</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ean">EAN / Barcode</Label>
                <Input
                  id="ean"
                  value={formData.ean}
                  onChange={(e) => setFormData({ ...formData, ean: e.target.value })}
                  placeholder="Enter EAN or barcode"
                />
              </div>
              <div>
                <Label htmlFor="category_id">Category</Label>
                <Select
                  value={formData.category_id || undefined}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand_id">Brand</Label>
                <Select
                  value={formData.brand_id || undefined}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, brand_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="warranty_id">Warranty</Label>
                <Input
                  id="warranty_id"
                  type="number"
                  value={formData.warranty_id}
                  onChange={(e) => setFormData({ ...formData, warranty_id: e.target.value })}
                  placeholder="Warranty ID (optional)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (Default)</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full min-h-[100px] px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Enter product description"
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="image-upload">Upload Images</Label>
              <div className="mt-2">
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition"
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload image (JPEG, PNG, WebP - Max 5MB)
                      </span>
                    </div>
                  )}
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-32 rounded-lg border border-border overflow-hidden">
                      <Image
                        src={getProxiedImageUrl(url)}
                        alt={`Product ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="base_price">Cost Price (EUR) *</Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  required
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground mt-1">Your purchase or cost price</p>
              </div>
              <div>
                <Label htmlFor="price">Selling Price (EUR) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground mt-1">Customer-facing price</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  required
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="reorder_point">Reorder Point</Label>
                <Input
                  id="reorder_point"
                  type="number"
                  min="0"
                  value={formData.reorder_point}
                  onChange={(e) => setFormData({ ...formData, reorder_point: e.target.value })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">Min stock level for alerts</p>
              </div>
              <div>
                <Label htmlFor="warehouse_location">Warehouse Location</Label>
                <Input
                  id="warehouse_location"
                  value={formData.warehouse_location}
                  onChange={(e) => setFormData({ ...formData, warehouse_location: e.target.value })}
                  placeholder="e.g., Shelf A-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical Properties & Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Physical Properties & Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="dimensions">Dimensions (L x W x H cm)</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  placeholder="e.g., 15 x 10 x 5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="e.g., Black"
                />
              </div>
              <div>
                <Label htmlFor="storage">Storage</Label>
                <Input
                  id="storage"
                  value={formData.storage}
                  onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  placeholder="e.g., 256GB"
                />
              </div>
              <div>
                <Label htmlFor="ram">RAM</Label>
                <Input
                  id="ram"
                  value={formData.ram}
                  onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                  placeholder="e.g., 8GB"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Language Support */}
        <Card>
          <CardHeader>
            <CardTitle>Multi-Language Support (Optional)</CardTitle>
            <p className="text-sm text-muted-foreground">
              Provide translations for product name and description in different languages
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {LANGUAGES.map(lang => (
              <div key={lang.code} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                <h3 className="font-medium mb-3">{lang.name}</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`name_${lang.code}`}>Product Name ({lang.name})</Label>
                    <Input
                      id={`name_${lang.code}`}
                      value={formData[`name_${lang.code}` as keyof typeof formData] as string}
                      onChange={(e) => setFormData({ ...formData, [`name_${lang.code}`]: e.target.value })}
                      placeholder={`Product name in ${lang.name}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`description_${lang.code}`}>Description ({lang.name})</Label>
                    <textarea
                      id={`description_${lang.code}`}
                      value={formData[`description_${lang.code}` as keyof typeof formData] as string}
                      onChange={(e) => setFormData({ ...formData, [`description_${lang.code}`]: e.target.value })}
                      className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md bg-background"
                      placeholder={`Description in ${lang.name}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Status & Visibility */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
                <Label htmlFor="is_available" className="cursor-pointer">
                  Available for Sale
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Featured Product
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
