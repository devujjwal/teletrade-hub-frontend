import { Metadata } from 'next';
import Card from '@/components/ui/card';
import { ShoppingCart, CreditCard, Truck, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'How to Buy | TeleTrade Hub',
  description: 'Learn how to purchase products from TeleTrade Hub - Simple steps to get your favorite products',
};

export default function HowToBuyPage() {
  const steps = [
    {
      icon: ShoppingCart,
      title: 'Browse & Select',
      description: 'Browse our extensive catalog of products. Use filters to find exactly what you need, read product descriptions, check specifications, and compare prices.',
    },
    {
      icon: ShoppingCart,
      title: 'Add to Cart',
      description: 'Click "Add to Cart" on any product you want to purchase. You can add multiple items and adjust quantities before checkout.',
    },
    {
      icon: CreditCard,
      title: 'Checkout',
      description: 'Review your cart, enter your shipping and billing information, and choose your preferred payment method. We accept all major credit cards and secure payment methods.',
    },
    {
      icon: Truck,
      title: 'Order Confirmation',
      description: 'After placing your order, you\'ll receive an email confirmation with your order number and tracking information. You can track your order status in your account.',
    },
    {
      icon: CheckCircle,
      title: 'Receive Your Order',
      description: 'Your order will be carefully packaged and shipped to your address. You\'ll receive updates via email as your order is processed and shipped.',
    },
  ];

  return (
    <div className="container-wide py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">How to Buy</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Shopping at TeleTrade Hub is simple and secure. Follow these easy steps to get your favorite products.
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
            <li>• Faster checkout process</li>
            <li>• Exclusive member discounts</li>
          </ul>
          <Link href="/register" className="inline-block mt-4">
            <Button variant="outline" size="sm">Create Account</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-3">Guest Checkout</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You can also checkout as a guest without creating an account. However, creating an account
            provides additional benefits like order tracking and faster checkout.
          </p>
          <Link href="/products" className="inline-block">
            <Button variant="outline" size="sm">Start Shopping</Button>
          </Link>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card className="p-8">
        <h2 className="font-display text-2xl font-bold mb-6">Accepted Payment Methods</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-border rounded-lg">
            <p className="font-semibold">Credit Cards</p>
            <p className="text-xs text-muted-foreground mt-1">Visa, Mastercard, Amex</p>
          </div>
          <div className="text-center p-4 border border-border rounded-lg">
            <p className="font-semibold">Debit Cards</p>
            <p className="text-xs text-muted-foreground mt-1">All major banks</p>
          </div>
          <div className="text-center p-4 border border-border rounded-lg">
            <p className="font-semibold">PayPal</p>
            <p className="text-xs text-muted-foreground mt-1">Secure payments</p>
          </div>
          <div className="text-center p-4 border border-border rounded-lg">
            <p className="font-semibold">Bank Transfer</p>
            <p className="text-xs text-muted-foreground mt-1">Direct transfer</p>
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

