import { Metadata } from 'next';
import Card from '@/components/ui/card';
import { Truck, Clock, Shield, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping Information | TeleTrade Hub',
  description: 'Learn about our shipping policies, delivery times, and shipping costs',
};

export default function ShippingPage() {
  return (
    <div className="container-wide py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Shipping Information</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Fast, secure, and reliable shipping to get your products to you quickly
        </p>
      </div>

      {/* Shipping Options */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-6">Shipping Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Standard Shipping</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Free shipping on orders over $50. Delivery within 5-7 business days.
            </p>
            <p className="text-sm font-semibold">Cost: Free (orders $50+)</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Express Shipping</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Get your order faster with express shipping. Delivery within 2-3 business days.
            </p>
            <p className="text-sm font-semibold">Cost: $15.99</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Overnight Shipping</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Need it urgently? Overnight shipping delivers next business day.
            </p>
            <p className="text-sm font-semibold">Cost: $29.99</p>
          </Card>
        </div>
      </section>

      {/* Shipping Process */}
      <section className="mb-12">
        <Card className="p-8">
          <h2 className="font-display text-2xl font-bold mb-6">Shipping Process</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Order Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Once your order is placed and payment is confirmed, we begin processing your order immediately.
                  Most orders are processed within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Packaging</h3>
                <p className="text-sm text-muted-foreground">
                  Your items are carefully packaged to ensure they arrive in perfect condition. We use
                  protective packaging materials for fragile items.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  Your order is shipped via our trusted shipping partners. You'll receive a tracking number
                  via email to monitor your shipment.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Your order will be delivered to the address you provided. For security, someone must be
                  present to receive the package, or you can authorize delivery to a safe location.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Important Information */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-6">Important Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-3">
              <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <p className="text-sm text-muted-foreground">
                  Please ensure your delivery address is correct. We cannot be held responsible for orders
                  delivered to incorrect addresses provided by customers.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3 mb-3">
              <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Delivery Times</h3>
                <p className="text-sm text-muted-foreground">
                  Delivery times are estimates and may vary based on your location, weather conditions,
                  and carrier delays. We'll keep you updated if there are any delays.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3 mb-3">
              <Package className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">International Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  We currently ship to select countries. International shipping costs and delivery times
                  vary by destination. Please check during checkout for available options.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3 mb-3">
              <Truck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Tracking Your Order</h3>
                <p className="text-sm text-muted-foreground">
                  Once your order ships, you'll receive a tracking number via email. You can also track
                  your order in your account dashboard.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <Card className="p-8">
        <h2 className="font-display text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">How long does shipping take?</h3>
            <p className="text-sm text-muted-foreground">
              Standard shipping takes 5-7 business days, express shipping takes 2-3 business days,
              and overnight shipping delivers the next business day.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Do you ship internationally?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, we ship to select countries. International shipping options and costs are displayed
              during checkout based on your delivery address.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Can I change my shipping address after ordering?</h3>
            <p className="text-sm text-muted-foreground">
              If your order hasn't shipped yet, you can contact our support team to update your shipping
              address. Once shipped, address changes may not be possible.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">What if my package is damaged?</h3>
            <p className="text-sm text-muted-foreground">
              If your package arrives damaged, please contact us immediately with photos. We'll arrange
              a replacement or refund as per our returns policy.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

