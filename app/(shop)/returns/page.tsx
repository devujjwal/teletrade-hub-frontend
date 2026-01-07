import { Metadata } from 'next';
import Card from '@/components/ui/card';
import { RotateCcw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Returns & Refunds | TeleTrade Hub',
  description: 'Learn about our return policy, refund process, and how to return products',
};

export default function ReturnsPage() {
  return (
    <div className="container-wide py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Returns & Refunds</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We want you to be completely satisfied with your purchase. Our hassle-free return policy ensures
          you can shop with confidence.
        </p>
      </div>

      {/* Return Policy Overview */}
      <Card className="p-8 mb-12">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-8 h-8 text-success" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold mb-3">30-Day Return Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have 30 days from the date of delivery to return any item for a full refund or exchange.
              Items must be unused, in original packaging, and include all accessories and documentation.
            </p>
          </div>
        </div>
      </Card>

      {/* Return Process */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-6">How to Return an Item</h2>
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Log into your account and go to your order history, or contact our support team to initiate
                  a return. Provide your order number and reason for return.
                </p>
                <Link href="/contact">
                  <Button variant="outline" size="sm">Contact Support</Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Get Return Authorization</h3>
                <p className="text-sm text-muted-foreground">
                  We'll provide you with a Return Authorization (RA) number and return shipping label.
                  Please include the RA number with your return package.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Package Your Return</h3>
                <p className="text-sm text-muted-foreground">
                  Pack the item securely in its original packaging with all accessories, documentation,
                  and include the RA number. Use the provided return shipping label.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Ship & Receive Refund</h3>
                <p className="text-sm text-muted-foreground">
                  Ship the package using the provided label. Once we receive and inspect the item,
                  we'll process your refund within 5-7 business days.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Return Conditions */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-success/20">
            <div className="flex items-start gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Items Eligible for Return</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Unused items in original condition</li>
                  <li>• Items with original packaging</li>
                  <li>• Items with all accessories included</li>
                  <li>• Items within 30 days of delivery</li>
                  <li>• Defective or damaged items</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-destructive/20">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Non-Returnable Items</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Items used or damaged by customer</li>
                  <li>• Items without original packaging</li>
                  <li>• Items returned after 30 days</li>
                  <li>• Software or digital products (if opened)</li>
                  <li>• Personalized or custom items</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Refund Information */}
      <Card className="p-8 mb-12">
        <h2 className="font-display text-2xl font-bold mb-6">Refund Information</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Refund Processing Time</h3>
              <p className="text-sm text-muted-foreground">
                Refunds are processed within 5-7 business days after we receive and inspect your returned item.
                The refund will be issued to the original payment method used for the purchase.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Refund Amount</h3>
              <p className="text-sm text-muted-foreground">
                You'll receive a full refund of the item price. Original shipping costs are non-refundable
                unless the return is due to our error or a defective product.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <RotateCcw className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Exchanges</h3>
              <p className="text-sm text-muted-foreground">
                We're happy to exchange items for a different size, color, or model. Exchanges follow the
                same return process. If the exchange item costs more, you'll pay the difference.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* FAQ */}
      <Card className="p-8">
        <h2 className="font-display text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">How long do I have to return an item?</h3>
            <p className="text-sm text-muted-foreground">
              You have 30 days from the date of delivery to initiate a return.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Who pays for return shipping?</h3>
            <p className="text-sm text-muted-foreground">
              If the return is due to our error or a defective product, we cover return shipping costs.
              Otherwise, return shipping is the customer's responsibility, though we provide discounted
              return labels.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Can I return an item without the original packaging?</h3>
            <p className="text-sm text-muted-foreground">
              While we prefer items to be returned in original packaging, we understand this isn't always
              possible. As long as the item is unused and in good condition, we'll accept the return.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">What if I receive a damaged or wrong item?</h3>
            <p className="text-sm text-muted-foreground">
              Contact us immediately if you receive a damaged or incorrect item. We'll arrange a free
              return and send you the correct item or provide a full refund, including shipping costs.
            </p>
          </div>
        </div>
      </Card>

      {/* CTA */}
      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">Need help with a return?</p>
        <Link href="/contact">
          <Button size="lg">Contact Support</Button>
        </Link>
      </div>
    </div>
  );
}

