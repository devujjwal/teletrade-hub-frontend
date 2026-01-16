'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ordersApi } from '@/lib/api/orders';
import { formatPrice } from '@/lib/utils/format';
import { formatDateTime } from '@/lib/utils/format';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, ArrowRight, Package, Printer, Copy, Mail, MessageCircle, Landmark, Info, ShoppingBag } from 'lucide-react';
import { Order } from '@/types/order';
import { getProxiedImageUrl } from '@/lib/utils/format';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api/client';

interface PublicSettings {
  site_name: string;
  site_email: string;
  contact_number: string;
  whatsapp_number: string;
  bank_name: string;
  account_holder: string;
  iban: string;
  bic: string;
  bank_additional_info: string;
}

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await ordersApi.getById(orderNumber);
        setOrder(orderData);
      } catch (error: any) {
        console.error('Error fetching order:', error);
        toast.error('Order not found');
        router.push('/account/orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber, router]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; data: PublicSettings }>('/settings/public');
        if (response.data.success && response.data.data) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadSettings();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const openWhatsApp = () => {
    if (settings?.whatsapp_number) {
      const phoneNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
      const message = encodeURIComponent(`Hello, I have a question about my order ${orderNumber}.`);
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };

  const sendEmail = () => {
    if (settings?.site_email) {
      const subject = encodeURIComponent(`Order Inquiry - ${orderNumber}`);
      const body = encodeURIComponent(`Hello,\n\nI have a question about my order ${orderNumber}.\n\nThank you.`);
      window.location.href = `mailto:${settings.site_email}?subject=${subject}&body=${body}`;
    }
  };

  if (isLoading) {
    return (
      <div className="container-wide py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-wide py-16 text-center">
        <Package className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
        <h1 className="font-display text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The order you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild>
          <Link href="/account/orders">View All Orders</Link>
        </Button>
      </div>
    );
  }

  const isPending = order?.payment_status === 'unpaid' || order?.payment_status === 'pending';

  return (
    <div className="container-wide py-8">
      {/* Success Message */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. We've sent a confirmation email to {order.customer_email}
        </p>
      </div>

      {/* Payment Pending Notice */}
      {isPending && (
        <div className="max-w-4xl mx-auto mb-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Payment Required:</strong> Your order is pending payment. Please complete the bank transfer to process your order.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Order Details */}
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-semibold mb-1">Order #{order.order_number}</h2>
              <p className="text-sm text-muted-foreground">
                Placed on {formatDateTime(order.created_at)}
              </p>
            </div>
            <div className="text-right">
              <Badge
                variant={
                  order.status === 'delivered'
                    ? 'success'
                    : order.status === 'cancelled'
                    ? 'error'
                    : 'info'
                }
                className="mb-2"
              >
                {order.status}
              </Badge>
              <Badge
                variant={
                  order.payment_status === 'paid'
                    ? 'success'
                    : order.payment_status === 'failed'
                    ? 'error'
                    : 'warning'
                }
              >
                {order.payment_status}
              </Badge>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold mb-3">Order Items</h3>
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 pb-4 border-b border-border last:border-0">
                {/* Product Image */}
                <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  <Image 
                    src={getProxiedImageUrl(item.product_image)} 
                    alt={item.product_name || 'Product'}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Product Details */}
                <div className="flex-1">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">
                    SKU: {item.product_sku} × {item.quantity}
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {formatPrice(item.price)} each
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(item.subtotal)}</p>
              </div>
            )) || []}
          </div>

          {/* Order Summary */}
          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            {order.shipping_cost && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{formatPrice(order.shipping_cost)}</span>
              </div>
            )}
            {order.tax && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (VAT)</span>
                <span className="font-medium">{formatPrice(order.tax)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </Card>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Shipping Address</h3>
            <address className="not-italic text-muted-foreground">
              {order.shipping_address?.first_name} {order.shipping_address?.last_name}
              <br />
              {order.shipping_address?.address_line1}
              {order.shipping_address?.address_line2 && (
                <>
                  <br />
                  {order.shipping_address.address_line2}
                </>
              )}
              <br />
              {order.shipping_address?.city}
              {order.shipping_address?.state && `, ${order.shipping_address.state}`} {order.shipping_address?.postal_code}
              <br />
              {order.shipping_address?.country}
              {order.shipping_address?.phone && (
                <>
                  <br />
                  Tel: {order.shipping_address.phone}
                </>
              )}
            </address>
          </Card>

          {/* Billing Address */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Billing Address</h3>
            <address className="not-italic text-muted-foreground">
              {order.billing_address?.first_name} {order.billing_address?.last_name}
              <br />
              {order.billing_address?.address_line1}
              {order.billing_address?.address_line2 && (
                <>
                  <br />
                  {order.billing_address.address_line2}
                </>
              )}
              <br />
              {order.billing_address?.city}
              {order.billing_address?.state && `, ${order.billing_address.state}`} {order.billing_address?.postal_code}
              <br />
              {order.billing_address?.country}
              {order.billing_address?.phone && (
                <>
                  <br />
                  Tel: {order.billing_address.phone}
                </>
              )}
            </address>
          </Card>
        </div>

        {/* Bank Details - Only show if payment is pending */}
        {isPending && !isLoadingSettings && settings && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="h-5 w-5" />
                Bank Transfer Details
              </CardTitle>
              <CardDescription>
                Please use the following information to complete your payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.bank_name && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Bank Name</label>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <span className="font-medium">{settings.bank_name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(settings.bank_name, 'Bank name')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {settings.account_holder && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Account Holder</label>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <span className="font-medium">{settings.account_holder}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(settings.account_holder, 'Account holder')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {settings.iban && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">IBAN</label>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <span className="font-mono font-medium">{settings.iban}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(settings.iban, 'IBAN')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {settings.bic && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">BIC/SWIFT Code</label>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <span className="font-mono font-medium">{settings.bic}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(settings.bic, 'BIC')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Payment Reference</label>
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                  <span className="font-medium">Order #{orderNumber}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`Order #${orderNumber}`, 'Reference')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Please include this reference in your bank transfer
                </p>
              </div>

              {settings.bank_additional_info && (
                <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-100 whitespace-pre-line">
                    {settings.bank_additional_info}
                  </p>
                </div>
              )}

              {/* Contact Options */}
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-3">Send Payment Confirmation</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {settings.site_email && (
                    <Button
                      onClick={sendEmail}
                      variant="outline"
                      size="sm"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email Screenshot
                    </Button>
                  )}
                  
                  {settings.whatsapp_number && (
                    <Button
                      onClick={openWhatsApp}
                      variant="outline"
                      size="sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button variant="outline" asChild>
            <Link href="/products">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/account/orders">
              <Package className="w-4 h-4 mr-2" />
              View All Orders
            </Link>
          </Button>
          {isPending && (
            <Button variant="default" asChild>
              <Link href={`/checkout/payment-instructions/${orderNumber}`}>
                <Landmark className="w-4 w-4 mr-2" />
                Payment Instructions
              </Link>
            </Button>
          )}
          <Button variant="outline" onClick={handlePrint} className="print:hidden">
            <Printer className="w-4 h-4 mr-2" />
            Print Order
          </Button>
        </div>
      </div>
    </div>
  );
}

