import { Metadata } from 'next';
import Card from '@/components/ui/card';
import { ShoppingCart, FileText, MessageCircle, CheckCircle, Package } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'How to Buy | TeleTrade Hub',
  description: 'Learn the TeleTrade Hub order flow: place order, receive proforma invoice with shipping, clear payment within 24 hours, and track delivery.',
};

export default function HowToBuyPage() {
  const steps = [
    {
      icon: ShoppingCart,
      title: 'Browse & Select',
      description: 'Browse our catalog, compare specifications, and add the products you need to your cart.',
    },
    {
      icon: ShoppingCart,
      title: 'Place Your Order',
      description: 'Complete checkout with your delivery and billing details. Shipping is not calculated automatically at checkout.',
    },
    {
      icon: FileText,
      title: 'Receive Proforma Invoice',
      description: 'After order placement, we send a final Proforma Invoice to your email and WhatsApp (if available), including confirmed shipping charges.',
    },
    {
      icon: MessageCircle,
      title: 'Clear Payment Within 24 Hours',
      description: 'Please clear the invoice within 24 hours and confirm payment via email or WhatsApp. If not cleared in time, reserved articles are automatically unreserved.',
    },
    {
      icon: Package,
      title: 'Processing & Delivery',
      description: 'Once payment is confirmed, your order is processed. You can track status updates from your account until delivery.',
    },
  ];

  return (
    <div className="container-wide py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">How to Buy</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          TeleTrade Hub follows a proforma-invoice workflow. Place your order first, then clear the final invoice with confirmed shipping charges.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-8 mb-12">
        {steps.map((step, index) => (
          <Card key={index} className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </span>
                  <h2 className="font-display text-2xl font-bold">{step.title}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-3">Account Benefits</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Track your orders easily</li>
            <li>• Save your shipping addresses</li>
            <li>• View order history</li>
            <li>• Access invoice links from order details</li>
            <li>• Faster repeat checkout</li>
          </ul>
          <Link href="/register" className="inline-block mt-4">
            <Button variant="outline" size="sm">Create Account</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-3">Important Policy</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Shipping is finalized manually and added to the invoice.</li>
            <li>• Invoice is shared by email and WhatsApp (if available).</li>
            <li>• Payment confirmation is required within 24 hours.</li>
            <li>• Unpaid invoices may release reserved stock automatically.</li>
          </ul>
        </Card>
      </div>

      {/* Payment Process */}
      <Card className="p-8">
        <h2 className="font-display text-2xl font-bold mb-6">Payment Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-border rounded-lg">
            <p className="font-semibold">Step 1</p>
            <p className="text-xs text-muted-foreground mt-1">Receive your Proforma Invoice</p>
          </div>
          <div className="text-center p-4 border border-border rounded-lg">
            <p className="font-semibold">Step 2</p>
            <p className="text-xs text-muted-foreground mt-1">Clear payment within 24 hours</p>
          </div>
          <div className="text-center p-4 border border-border rounded-lg">
            <p className="font-semibold">Step 3</p>
            <p className="text-xs text-muted-foreground mt-1">Confirm payment via email or WhatsApp</p>
          </div>
        </div>
      </Card>

      {/* CTA */}
      <div className="text-center mt-12">
        <h2 className="font-display text-2xl font-bold mb-4">Ready to Start Shopping?</h2>
        <p className="text-muted-foreground mb-6">Browse our collection of premium telecommunication products</p>
        <Button size="lg" asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}
