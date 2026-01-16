'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Copy, Mail, MessageCircle, Landmark, Info, ArrowLeft } from 'lucide-react';
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

export default function PaymentInstructionsPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; data: PublicSettings }>('/settings/public');
        if (response.data.success && response.data.data) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load payment information');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const openWhatsApp = () => {
    if (settings?.whatsapp_number) {
      const phoneNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
      const message = encodeURIComponent(`Hello, I have completed payment for order ${orderNumber}. Please find the payment screenshot attached.`);
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };

  const sendEmail = () => {
    if (settings?.site_email) {
      const subject = encodeURIComponent(`Payment Confirmation - Order ${orderNumber}`);
      const body = encodeURIComponent(`Hello,\n\nI have completed the bank transfer for order ${orderNumber}.\n\nPlease find the payment screenshot attached.\n\nThank you.`);
      window.location.href = `mailto:${settings.site_email}?subject=${subject}&body=${body}`;
    }
  };

  if (isLoading) {
    return (
      <div className="container-wide py-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground">
              Order Number: <span className="font-semibold text-foreground">{orderNumber}</span>
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Your order is pending payment. Please complete the bank transfer using the details below and send us the payment confirmation.
          </AlertDescription>
        </Alert>

        {/* Bank Details */}
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
            {settings?.bank_name && (
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

            {settings?.account_holder && (
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

            {settings?.iban && (
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

            {settings?.bic && (
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

            {settings?.bank_additional_info && (
              <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100 whitespace-pre-line">
                  {settings.bank_additional_info}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Send Payment Confirmation */}
        <Card>
          <CardHeader>
            <CardTitle>Send Payment Confirmation</CardTitle>
            <CardDescription>
              After completing the payment, please send us the payment screenshot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We will process your order as soon as we receive and verify your payment.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {settings?.site_email && (
                <Button
                  onClick={sendEmail}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Screenshot
                </Button>
              )}
              
              {settings?.whatsapp_number && (
                <Button
                  onClick={openWhatsApp}
                  variant="outline"
                  className="w-full"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send via WhatsApp
                </Button>
              )}
            </div>

            {settings?.site_email && (
              <div className="text-sm text-center text-muted-foreground">
                Email: <span className="font-medium">{settings.site_email}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <Button
            onClick={() => router.push(`/orders/${orderNumber}`)}
            className="flex-1"
          >
            View Order Details
          </Button>
        </div>
      </div>
    </div>
  );
}
