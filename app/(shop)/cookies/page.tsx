import { Metadata } from 'next';
import Card from '@/components/ui/card';
import { Cookie, SlidersHorizontal, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy | TeleTrade Hub',
  description: 'Information about the cookies used on TeleTrade Hub and how visitors can manage their preferences.',
};

export default function CookiesPage() {
  return (
    <div className="container-wide py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#eff6ff_100%)] p-8 shadow-sm md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            <Cookie className="h-4 w-4 text-primary" />
            Cookie transparency
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Cookie Policy
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            TeleTrade Hub uses cookies and similar technologies to keep the storefront secure, remember language and
            session preferences, and improve the overall user experience. This page explains what is used and how
            visitors can control their choice.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-slate-200 p-6">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h2 className="mt-4 font-display text-xl font-semibold text-slate-950">Essential cookies</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              These cookies support security, session handling, language preference, and account access. They are needed
              for core site functionality and cannot be disabled if you want to use the account and checkout flows.
            </p>
          </Card>

          <Card className="border-slate-200 p-6">
            <SlidersHorizontal className="h-8 w-8 text-primary" />
            <h2 className="mt-4 font-display text-xl font-semibold text-slate-950">Preference and performance cookies</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Where enabled, these cookies help remember user preferences and improve performance analysis. The consent
              banner lets visitors choose whether to allow more than essential cookies.
            </p>
          </Card>

          <Card className="border-slate-200 p-6">
            <Cookie className="h-8 w-8 text-primary" />
            <h2 className="mt-4 font-display text-xl font-semibold text-slate-950">How to manage cookies</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              You can manage cookies through the browser settings of your device and by using the cookie banner shown on
              the website. Blocking essential cookies may prevent sign-in, cart, or account-related functionality.
            </p>
          </Card>
        </div>

        <Card className="border-slate-200 p-6 md:p-8">
          <h2 className="font-display text-2xl font-semibold text-slate-950">Cookies currently used by the site</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>
              TeleTrade Hub currently uses cookies and browser storage primarily for user language, authentication,
              consent state, and account/session continuity. If analytics or advertising tools are added later, this
              policy should be updated before those cookies are activated for visitors in consent-sensitive regions.
            </p>
            <p>
              If you have questions about cookie handling or consent records, contact{' '}
              <a href="mailto:privacy@teletradehub.com" className="font-medium text-primary hover:underline">
                privacy@teletradehub.com
              </a>
              .
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
