import { Metadata } from 'next';
import { Shield, Truck, Headphones, Award } from 'lucide-react';
import Card from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'About Us | TeleTrade Hub',
  description: 'Learn about TeleTrade Hub - Your trusted partner for premium telecommunication products',
};

export default function AboutPage() {
  return (
    <div className="container-wide py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">About TeleTrade Hub</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your trusted partner for premium telecommunication products and exceptional service
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-16">
        <Card className="p-8 md:p-12">
          <h2 className="font-display text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            At TeleTrade Hub, we are dedicated to providing our customers with the latest and greatest
            telecommunication products from the world's leading brands. Our mission is to make cutting-edge
            technology accessible to everyone while maintaining the highest standards of quality and service.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We believe that everyone deserves access to premium technology that enhances their daily lives,
            whether it's staying connected with loved ones, boosting productivity, or enjoying entertainment
            on the go.
          </p>
        </Card>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <h2 className="font-display text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Trust & Reliability</h3>
            <p className="text-sm text-muted-foreground">
              We build lasting relationships with our customers through transparency and reliability
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Quality First</h3>
            <p className="text-sm text-muted-foreground">
              We only offer products from trusted brands that meet our high quality standards
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Customer Support</h3>
            <p className="text-sm text-muted-foreground">
              Our dedicated support team is here to help you every step of the way
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">
              We ensure quick and secure delivery of your orders to your doorstep
            </p>
          </Card>
        </div>
      </section>

      {/* Story Section */}
      <section className="mb-16">
        <Card className="p-8 md:p-12">
          <h2 className="font-display text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              TeleTrade Hub was founded with a simple vision: to bridge the gap between cutting-edge
              telecommunication technology and consumers who need reliable, high-quality products.
            </p>
            <p>
              Starting as a small team of technology enthusiasts, we've grown into a trusted e-commerce
              platform serving customers across the region. Our commitment to excellence and customer
              satisfaction has been the driving force behind our success.
            </p>
            <p>
              Today, we partner with leading brands to bring you the latest smartphones, tablets, accessories,
              and telecommunication equipment. We're proud to offer competitive prices, comprehensive
              warranties, and exceptional customer service.
            </p>
          </div>
        </Card>
      </section>

      {/* Why Choose Us */}
      <section>
        <h2 className="font-display text-3xl font-bold mb-8 text-center">Why Choose TeleTrade Hub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">Wide Selection</h3>
            <p className="text-sm text-muted-foreground">
              Browse thousands of products from top brands, all in one convenient place
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">Best Prices</h3>
            <p className="text-sm text-muted-foreground">
              We offer competitive pricing and regular promotions to give you the best value
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">Secure Shopping</h3>
            <p className="text-sm text-muted-foreground">
              Your data and payments are protected with industry-leading security measures
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}

