import { Metadata } from 'next';
import Card from '@/components/ui/card';
import { Shield, Lock, Eye, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | TeleTrade Hub',
  description: 'Learn how TeleTrade Hub protects your privacy and handles your personal information',
};

export default function PrivacyPage() {
  return (
    <div className="container-wide py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="p-8 md:p-12">
          <div className="prose prose-sm max-w-none">
            <section className="mb-8">
              <div className="flex items-start gap-3 mb-4">
                <User className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-display text-2xl font-bold mb-3">1. Information We Collect</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Name, email address, phone number, and shipping address</li>
                    <li>Payment information (processed securely through our payment providers)</li>
                    <li>Account credentials and preferences</li>
                    <li>Order history and purchase information</li>
                    <li>Communications with our customer support team</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    We also automatically collect certain information when you visit our website, such as
                    IP address, browser type, device information, and usage patterns through cookies and
                    similar technologies.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-start gap-3 mb-4">
                <Eye className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-display text-2xl font-bold mb-3">2. How We Use Your Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Process and fulfill your orders</li>
                    <li>Send you order confirmations and shipping updates</li>
                    <li>Respond to your inquiries and provide customer support</li>
                    <li>Send you marketing communications (with your consent)</li>
                    <li>Improve our website and services</li>
                    <li>Detect and prevent fraud</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-start gap-3 mb-4">
                <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-display text-2xl font-bold mb-3">3. Information Sharing</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    We do not sell your personal information. We may share your information with:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Service providers who help us operate our business (payment processors, shipping companies)</li>
                    <li>Legal authorities when required by law or to protect our rights</li>
                    <li>Business partners with your explicit consent</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    All third parties are required to maintain the confidentiality of your information and
                    use it only for the purposes we specify.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. This includes
                SSL encryption, secure payment processing, and regular security audits.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                However, no method of transmission over the Internet or electronic storage is 100% secure.
                While we strive to use commercially acceptable means to protect your information, we cannot
                guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">5. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze
                site traffic, and personalize content. You can control cookies through your browser settings,
                though this may affect website functionality.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Types of cookies we use:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Essential cookies: Required for website functionality</li>
                <li>Analytics cookies: Help us understand how visitors use our site</li>
                <li>Marketing cookies: Used to deliver relevant advertisements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Right to access: Request a copy of your personal data</li>
                <li>Right to rectification: Correct inaccurate or incomplete information</li>
                <li>Right to erasure: Request deletion of your personal data</li>
                <li>Right to restrict processing: Limit how we use your data</li>
                <li>Right to data portability: Receive your data in a structured format</li>
                <li>Right to object: Object to certain types of processing</li>
                <li>Right to withdraw consent: Withdraw consent for data processing</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us at{' '}
                <a href="mailto:privacy@teletradehub.com" className="text-primary hover:underline">
                  privacy@teletradehub.com
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">7. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not intended for children under the age of 18. We do not knowingly collect
                personal information from children. If you believe we have collected information from a child,
                please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">8. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined
                in this policy, unless a longer retention period is required or permitted by law. When we
                no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">9. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of
                residence. These countries may have data protection laws that differ from those in your country.
                We ensure appropriate safeguards are in place to protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">10. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by
                posting the new policy on this page and updating the "Last updated" date. We encourage you
                to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:privacy@teletradehub.com" className="text-primary hover:underline">
                    privacy@teletradehub.com
                  </a>
                  <br />
                  <strong>Address:</strong> 123 Tech Street, Digital City, DC 12345, United States
                </p>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}

