'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Mail, MessageCircle, ArrowLeft, FileText } from 'lucide-react';
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

  const openWhatsApp = () => {
    if (settings?.whatsapp_number) {
      const phoneNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
      const message = encodeURIComponent(`Hello, I am following up on proforma invoice for order ${orderNumber}.`);
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };

  const sendEmail = () => {
    if (settings?.site_email) {
      const subject = encodeURIComponent(`Order Follow-up - ${orderNumber}`);
      const body = encodeURIComponent(`Hello,\n\nI am following up regarding the proforma invoice for order ${orderNumber}.\n\nThank you.`);
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
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary">
            <CheckCircle className="h-10 w-10" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Order Received</p>
            <h1 className="text-3xl font-bold mb-2">Thank you. Your order has been received.</h1>
            <p className="text-muted-foreground">Order Number: <span className="font-semibold text-foreground">{orderNumber}</span></p>
          </div>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.05] via-background to-background shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Next Step
            </CardTitle>
            <CardDescription>Your proforma invoice will be shared shortly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>Thank you. Your order has been received.</p>
            <p>A final Proforma Invoice including shipping charges will be sent to your email and WhatsApp (if available) shortly.</p>
            <p>Once you receive the invoice, please clear the payment within 24 hours and confirm via email or WhatsApp. After confirmation, your order will be processed.</p>
            <p>If the invoice is not cleared within 24 hours, the reserved articles will be automatically unreserved.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Reach out if you need support while waiting for the invoice.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {settings?.site_email && (
                <Button
                  onClick={sendEmail}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </Button>
              )}
              
              {settings?.whatsapp_number && (
                <Button
                  onClick={openWhatsApp}
                  variant="outline"
                  className="w-full"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp Us
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/account/orders')}
          >
            View Order History
          </Button>
          <Button
            onClick={() => router.push(`/orders/${orderNumber}`)}
          >
            View Order Details
          </Button>
        </div>
      </div>
    </div>
  );
}
