'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api/admin';
import { Order } from '@/types/order';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice, formatDateTime } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, FileText, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shippingCost, setShippingCost] = useState('0.00');
  const [finalOrderPrice, setFinalOrderPrice] = useState('0.00');
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [isSavingFinancials, setIsSavingFinancials] = useState(false);
  const [isUploadingInvoice, setIsUploadingInvoice] = useState(false);

  const loadOrder = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getOrder(parseInt(orderId, 10));
      const nextOrder = data.order || data;
      setOrder(nextOrder);
      setShippingCost(Number(nextOrder.shipping_cost || 0).toFixed(2));
      setFinalOrderPrice(Number(nextOrder.final_order_price ?? nextOrder.total ?? 0).toFixed(2));
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Failed to load order');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const updateStatus = async (status: string) => {
    try {
      await adminApi.updateOrderStatus(parseInt(orderId, 10), status);
      toast.success('Order status updated');
      loadOrder();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const saveFinancials = async () => {
    if (!order) return;

    const shipping = Number(shippingCost);
    const finalPrice = Number(finalOrderPrice);

    if (Number.isNaN(shipping) || shipping < 0) {
      toast.error('Shipping charges cannot be negative');
      return;
    }

    if (Number.isNaN(finalPrice) || finalPrice < Number(order.total || 0)) {
      toast.error('Final order price must be at least the base price');
      return;
    }

    setIsSavingFinancials(true);
    try {
      await adminApi.updateOrderFinancials(order.id, {
        shipping_cost: shipping,
        final_order_price: finalPrice,
      });
      toast.success('Order pricing updated');
      loadOrder();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update pricing');
    } finally {
      setIsSavingFinancials(false);
    }
  };

  const uploadInvoice = async () => {
    if (!invoiceFile) {
      toast.error('Select a PDF invoice first');
      return;
    }

    if (invoiceFile.type !== 'application/pdf') {
      toast.error('Only PDF invoices are allowed');
      return;
    }

    setIsUploadingInvoice(true);
    try {
      await adminApi.uploadOrderInvoice(parseInt(orderId, 10), invoiceFile);
      toast.success('Invoice uploaded successfully');
      setInvoiceFile(null);
      loadOrder();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload invoice');
    } finally {
      setIsUploadingInvoice(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
          <p className="text-muted-foreground">Placed on {formatDateTime(order.created_at)}</p>
        </div>
        <select
          value={order.status}
          onChange={(e) => updateStatus(e.target.value)}
          className="rounded-lg border border-secondary-300 px-3 py-2"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-6 xl:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>
          <dl className="space-y-3">
            <div className="flex justify-between gap-4">
              <dt className="text-secondary-600">Status</dt>
              <dd>
                <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : 'info'}>
                  {order.status}
                </Badge>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-secondary-600">Payment</dt>
              <dd>
                <Badge variant={order.payment_status === 'paid' ? 'success' : order.payment_status === 'failed' ? 'error' : 'warning'}>
                  {order.payment_status}
                </Badge>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-secondary-600">Base Price</dt>
              <dd className="font-semibold">{formatPrice(order.total)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-secondary-600">Shipping</dt>
              <dd className="font-semibold">{formatPrice(order.shipping_cost || 0)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-secondary-600">Final Price</dt>
              <dd className="font-semibold">{order.final_order_price !== null && order.final_order_price !== undefined ? formatPrice(order.final_order_price) : 'Pending'}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6 xl:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-secondary-600">Name</dt>
              <dd className="font-medium">{order.customer_name || `${order.shipping_address?.first_name || ''} ${order.shipping_address?.last_name || ''}`.trim() || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-secondary-600">Email</dt>
              <dd>{order.customer_email || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-secondary-600">Phone</dt>
              <dd>{order.customer_phone || order.shipping_address?.phone || 'N/A'}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6 xl:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Upload Invoice</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              PDF only. Maximum size 10MB. Stored privately in Supabase Storage and exposed through signed links.
            </div>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setInvoiceFile(e.target.files?.[0] || null)}
            />
            <Button onClick={uploadInvoice} disabled={!invoiceFile || isUploadingInvoice} className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              {isUploadingInvoice ? 'Uploading...' : 'Upload Invoice'}
            </Button>
            {order.invoice?.signed_url ? (
              <a
                href={order.invoice.signed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <FileText className="w-4 h-4" />
                Open latest invoice
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">No invoice uploaded yet.</p>
            )}
          </div>
        </Card>

        <Card className="p-6 xl:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Order Pricing</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="shipping_cost">Shipping Charges</Label>
              <Input
                id="shipping_cost"
                type="number"
                min="0"
                step="0.01"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="final_order_price">Final Order Price</Label>
              <Input
                id="final_order_price"
                type="number"
                min={Number(order.total || 0)}
                step="0.01"
                value={finalOrderPrice}
                onChange={(e) => setFinalOrderPrice(e.target.value)}
              />
              <p className="mt-2 text-xs text-muted-foreground">Final order price must be greater than or equal to the base price.</p>
            </div>
          </div>
          <Button onClick={saveFinancials} disabled={isSavingFinancials} className="mt-4">
            {isSavingFinancials ? 'Saving...' : 'Save Pricing'}
          </Button>
        </Card>

        <Card className="p-6 xl:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          {order.shipping_address ? (
            <address className="not-italic text-muted-foreground space-y-1">
              <div>{order.shipping_address.first_name} {order.shipping_address.last_name}</div>
              <div>{order.shipping_address.address_line1}</div>
              {order.shipping_address.address_line2 ? <div>{order.shipping_address.address_line2}</div> : null}
              <div>{order.shipping_address.city}{order.shipping_address.state ? `, ${order.shipping_address.state}` : ''} {order.shipping_address.postal_code}</div>
              <div>{order.shipping_address.country}</div>
              {order.shipping_address.phone ? <div>Tel: {order.shipping_address.phone}</div> : null}
            </address>
          ) : (
            <p className="text-muted-foreground">No shipping address provided</p>
          )}
        </Card>

        <Card className="p-6 xl:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items?.map((item: any, index) => {
              const productUrl = item.product_slug ? `/products/${item.product_slug}` : `/products/${item.product_id}`;

              return (
                <div key={index} className="flex items-start justify-between border-b border-secondary-200 pb-3 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {item.product_name}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      <Badge variant={item.product_source === 'own' ? 'success' : 'default'} className="text-xs">
                        {item.product_source === 'own' ? 'In-House' : 'Vendor'}
                      </Badge>
                    </div>
                    <p className="text-sm text-secondary-600 mt-1">
                      SKU: {item.product_sku || item.sku} × {item.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{formatPrice(item.price)} each</p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                </div>
              );
            }) || []}
          </div>
        </Card>
      </div>
    </div>
  );
}
