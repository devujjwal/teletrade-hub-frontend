import { Metadata } from 'next';
import Link from 'next/link';
import Card from '@/components/ui/card';
import { ShieldCheck, Database, LockKeyhole, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | TeleTrade Hub',
  description: 'Overview of how TeleTrade Hub handles personal data in line with GDPR expectations for EU customers.',
};

const sections = [
  {
    icon: ShieldCheck,
    title: '1. Controller and scope',
    body: [
      'TeleTrade Hub acts as the controller for the personal data processed through this website, customer accounts, order handling, support communication, and merchant onboarding.',
      'This privacy policy applies to visitors, registered customers, merchant applicants, and business contacts who interact with our shop or support channels.',
    ],
  },
  {
    icon: Database,
    title: '2. Categories of data we process',
    body: [
      'We process identification and contact data such as name, company name, email address, billing and delivery addresses, phone numbers, tax information, and account credentials.',
      'For merchant or trade registrations we may also process verification documents, VAT data, bank details, and communications needed for approval and compliance checks.',
    ],
  },
  {
    icon: Scale,
    title: '3. Legal bases under GDPR',
    body: [
      'We process personal data to perform a contract or to take pre-contractual steps, for example to create accounts, review registrations, process orders, and answer support requests.',
      'Certain processing is required to comply with legal obligations, including accounting, tax retention, anti-fraud checks, and dispute handling. Where optional cookies or marketing are used, we rely on consent.',
    ],
  },
  {
    icon: LockKeyhole,
    title: '4. Data sharing and protection',
    body: [
      'We share data only with processors and service providers that support our operations, such as hosting, storage, email delivery, payments, and logistics. They may process data only on our instructions and with appropriate safeguards.',
      'We apply access controls, encryption in transit, role-based permissions, logging, and retention limits to reduce unnecessary exposure of customer and merchant information.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="container-wide py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#eff6ff_0%,#fff7ed_48%,#ffffff_100%)] p-8 shadow-sm md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            <ShieldCheck className="h-4 w-4 text-primary" />
            GDPR-focused privacy notice
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            TeleTrade Hub serves customers with EU and Germany-oriented compliance expectations in mind. This page
            explains what personal data we process, why we process it, and how data subjects can exercise their rights.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-white px-3 py-1">Last reviewed: March 15, 2026</span>
            <Link href="/personal-data-processing" className="rounded-full bg-white px-3 py-1 hover:text-primary">
              View personal data processing terms
            </Link>
            <Link href="/cookies" className="rounded-full bg-white px-3 py-1 hover:text-primary">
              View cookie policy
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="border-slate-200 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="font-display text-2xl font-semibold text-slate-950">{section.title}</h2>
                    {section.body.map((paragraph) => (
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
            <h2 className="font-display text-2xl font-semibold text-slate-950">5. Data subject rights</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-slate-600 md:grid-cols-2 md:text-base">
              <p>
                Depending on the circumstances, you may have the right to access your data, request correction,
                object to certain processing, request restriction, request erasure, and receive your data in a
                portable format.
              </p>
              <p>
                If you believe your data is being processed unlawfully, you may also lodge a complaint with the
                competent supervisory authority in the EU member state of your residence or place of work.
              </p>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-slate-950">6. Contact for privacy requests</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              For privacy, data access, rectification, or deletion requests, contact{' '}
              <a href="mailto:privacy@teletradehub.com" className="font-medium text-primary hover:underline">
                privacy@teletradehub.com
              </a>
              . If your request concerns merchant onboarding documents or business verification, please reference the
              email address used during registration so we can locate your records safely.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
