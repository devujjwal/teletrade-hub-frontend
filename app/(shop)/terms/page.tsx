import { Metadata } from 'next';
import Card from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Terms & Conditions | TeleTrade Hub',
  description: 'Read our terms and conditions for using TeleTrade Hub',
};

export default function TermsPage() {
  return (
    <div className="container-wide py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="p-8 md:p-12">
          <div className="prose prose-sm max-w-none">
            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing and using TeleTrade Hub, you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Permission is granted to temporarily access the materials on TeleTrade Hub's website for
                personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer
                of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">3. Product Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We strive to provide accurate product descriptions, images, and pricing. However, we do not
                warrant that product descriptions or other content on this site is accurate, complete, reliable,
                current, or error-free. Prices and availability are subject to change without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">4. Orders and Payment</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you place an order, you are offering to purchase a product subject to these terms.
                All orders are subject to acceptance by us. We reserve the right to refuse or cancel any
                order for any reason, including but not limited to product availability, errors in pricing
                or product information, or suspected fraud.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Payment must be received before we ship your order. We accept major credit cards and other
                payment methods as indicated during checkout.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">5. Shipping and Delivery</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We will arrange for shipment of products to you. Shipping terms and costs are as specified
                during checkout. Risk of loss and title for products purchased pass to you upon delivery to
                the carrier.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">6. Returns and Refunds</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our return policy is detailed on our Returns page. Returns must be made within 30 days of
                delivery. Items must be unused and in original packaging. Refunds will be processed according
                to our refund policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">7. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All content on this website, including text, graphics, logos, images, and software, is the
                property of TeleTrade Hub or its content suppliers and is protected by copyright and other
                intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                TeleTrade Hub shall not be liable for any indirect, incidental, special, consequential,
                or punitive damages resulting from your use of or inability to use the service, or for any
                other claim related in any way to your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">9. Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your use of TeleTrade Hub is also governed by our Privacy Policy. Please review our Privacy
                Policy to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. Your continued use of the website
                after any changes constitutes your acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of the jurisdiction
                in which TeleTrade Hub operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">12. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us at{' '}
                <a href="mailto:legal@teletradehub.com" className="text-primary hover:underline">
                  legal@teletradehub.com
                </a>
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}

