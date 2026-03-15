import { Metadata } from 'next';
import Link from 'next/link';
import Card from '@/components/ui/card';
import { FileCheck2, Building2, ReceiptText, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | TeleTrade Hub',
  description: 'General business terms for using TeleTrade Hub, account access, merchant approval, and trade purchases.',
};

const termsSections = [
  {
    icon: FileCheck2,
    title: '1. Scope of these terms',
    paragraphs: [
      'These Terms & Conditions govern access to the TeleTrade Hub website, account registration, login, product information, and purchase-related communication.',
      'Use of the platform is intended for legitimate retail and trade customers. Merchant accounts remain subject to review and activation by our admin team before trading access is granted.',
    ],
  },
  {
    icon: Building2,
    title: '2. Accounts and merchant approval',
    paragraphs: [
      'You are responsible for providing accurate information during account registration. If your registration is submitted as a merchant or business account, TeleTrade Hub may request supporting documents and keep the account in pending status until verification is complete.',
      'Access may be limited, suspended, or declined where information is incomplete, inconsistent, or legally insufficient for onboarding, risk review, or fraud prevention.',
    ],
  },
  {
    icon: ReceiptText,
    title: '3. Offers, prices, taxes, and order acceptance',
    paragraphs: [
      'Product listings, availability, and prices displayed on the site do not constitute a binding offer until an order is reviewed and accepted by TeleTrade Hub. Errors in supplier feeds, availability, tax handling, or exchange-rate dependent price components may be corrected before acceptance.',
      'Where account-specific or trade-specific pricing applies, the visible price may depend on approved customer status, VAT treatment, and commercial terms assigned to the account.',
    ],
  },
  {
    icon: Truck,
    title: '4. Delivery, risk, and returns',
    paragraphs: [
      'Delivery windows are indicative unless a specific dispatch commitment is confirmed in writing. Shipping method, delivery address validation, and export restrictions may affect fulfillment.',
      'Return handling, defects, and cancellation rights are subject to the applicable sales channel, product condition, and mandatory law. Additional shipping, customs, or carrier costs may apply depending on destination and order profile.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="container-wide py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#eff6ff_52%,#ffffff_100%)] p-8 shadow-sm md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            <FileCheck2 className="h-4 w-4 text-primary" />
            General terms for customers and merchants
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            These terms define how TeleTrade Hub provides website access, account onboarding, merchant review,
            pricing visibility, order handling, and support communication. They are designed to fit an EU/Germany-
            oriented trading environment without copying third-party legal wording.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-white px-3 py-1">Last reviewed: March 15, 2026</span>
            <Link href="/personal-data-processing" className="rounded-full bg-white px-3 py-1 hover:text-primary">
              Personal data processing terms
            </Link>
            <Link href="/privacy" className="rounded-full bg-white px-3 py-1 hover:text-primary">
              Privacy policy
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          {termsSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="border-slate-200 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="font-display text-2xl font-semibold text-slate-950">{section.title}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-slate-600 md:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}

          <Card className="border-slate-200 p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-slate-950">5. User obligations and restricted conduct</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              Users must not access the website unlawfully, attempt credential misuse, scrape supplier-protected data,
              upload unlawful documents, or interfere with account, payment, logistics, or approval workflows. TeleTrade
              Hub may log, investigate, and restrict suspicious activity where reasonably necessary.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-slate-950">6. Governing law and contact</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              Unless mandatory consumer law provides otherwise, these terms are intended to be interpreted in a manner
              consistent with German and broader EU e-commerce expectations. Questions about legal terms can be sent to{' '}
              <a href="mailto:legal@teletradehub.com" className="font-medium text-primary hover:underline">
                legal@teletradehub.com
              </a>
              .
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
