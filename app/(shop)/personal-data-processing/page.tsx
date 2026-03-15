import { Metadata } from 'next';
import Link from 'next/link';
import Card from '@/components/ui/card';
import { FileSpreadsheet, Shield, UserCog, Files } from 'lucide-react';

export const metadata: Metadata = {
  title: 'General Terms and Conditions of Processing Personal Data | TeleTrade Hub',
  description: 'Rules for how TeleTrade Hub processes customer and merchant personal data during onboarding, account access, and order handling.',
};

const processingSections = [
  {
    icon: FileSpreadsheet,
    title: '1. Purpose of processing',
    paragraphs: [
      'TeleTrade Hub processes personal data to create and maintain customer accounts, evaluate merchant registrations, process orders, provide support, and comply with tax, accounting, and fraud-prevention obligations.',
      'Merchant onboarding may require additional data and document review because trading access is granted only after administrative verification.',
    ],
  },
  {
    icon: Shield,
    title: '2. What may be processed',
    paragraphs: [
      'Depending on account type, processed data may include identification details, addresses, phone numbers, email addresses, tax and VAT identifiers, business documents, bank details, support communications, and account activity records.',
      'Sensitive categories of data are not intentionally requested. Users should avoid uploading unrelated personal information in business documents where not required.',
    ],
  },
  {
    icon: UserCog,
    title: '3. Who may access the data',
    paragraphs: [
      'Access is limited to personnel and processors who need the information for onboarding, support, compliance, fulfillment, technical maintenance, or legal obligations.',
      'Where processors are used, they are contractually required to maintain confidentiality, apply adequate security measures, and process data only for authorized purposes.',
    ],
  },
  {
    icon: Files,
    title: '4. Retention and rights',
    paragraphs: [
      'Account and transaction data is retained only for as long as required for contractual, operational, compliance, and legal defense purposes. Supporting documents collected during onboarding are reviewed and retained according to the relevant legal and business need.',
      'Data subjects may request access, correction, deletion where applicable, restriction, objection, or portability, subject to legal retention duties and legitimate business interests.',
    ],
  },
];

export default function PersonalDataProcessingPage() {
  return (
    <div className="container-wide py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eff6ff_55%,#fff7ed_100%)] p-8 shadow-sm md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            <Shield className="h-4 w-4 text-primary" />
            Personal data processing terms
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            General Terms and Conditions of Processing Personal Data
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            This document explains the framework under which TeleTrade Hub processes customer and merchant data in an
            EU/GDPR-oriented business environment. It is intended to support the login and account onboarding consent flow.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-white px-3 py-1">Last reviewed: March 15, 2026</span>
            <Link href="/privacy" className="rounded-full bg-white px-3 py-1 hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="rounded-full bg-white px-3 py-1 hover:text-primary">
              Cookie Policy
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          {processingSections.map((section) => {
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
            <h2 className="font-display text-2xl font-semibold text-slate-950">5. International transfers and storage providers</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              TeleTrade Hub may use reputable hosting, storage, email, and infrastructure providers. Where personal data
              is processed outside the EEA, appropriate safeguards such as standard contractual clauses or equivalent
              protections should be applied by the relevant provider.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-slate-950">6. Contact and exercise of rights</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              Requests concerning access, correction, deletion, or processing objections can be sent to{' '}
              <a href="mailto:privacy@teletradehub.com" className="font-medium text-primary hover:underline">
                privacy@teletradehub.com
              </a>
              . For merchant verification matters, include the registration email and company name so requests can be
              validated before disclosure.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
