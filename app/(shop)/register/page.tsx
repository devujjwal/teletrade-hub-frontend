'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/auth/register-form';
import { useAuthStore } from '@/lib/store/auth-store';
import { useLanguage } from '@/contexts/language-context';
import { ShieldCheck, Truck, WalletCards } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { user, token, _hasHydrated } = useAuthStore();
  const { t, language } = useLanguage();
  const ui = {
    en: {
      registrationDetails: 'Registration Details',
      registrationHelp: 'Complete the form below to submit your account request.',
      secureOnboarding: 'Secure onboarding',
      secureOnboardingDesc: 'Document verification and protected account approval flow.',
      fastFulfillment: 'Fast fulfillment',
      fastFulfillmentDesc: 'Track products, categories, and orders in one place.',
      businessReady: 'Business ready',
      businessReadyDesc: 'Merchant profile supports tax and bank details for B2B use.',
    },
    de: {
      registrationDetails: 'Registrierungsdetails',
      registrationHelp: 'Füllen Sie das folgende Formular aus, um Ihre Kontoanfrage einzureichen.',
      secureOnboarding: 'Sicheres Onboarding',
      secureOnboardingDesc: 'Dokumentenprüfung und geschützter Konto-Freigabeprozess.',
      fastFulfillment: 'Schnelle Abwicklung',
      fastFulfillmentDesc: 'Verfolgen Sie Produkte, Kategorien und Bestellungen an einem Ort.',
      businessReady: 'Bereit für Unternehmen',
      businessReadyDesc: 'Das Händlerprofil unterstützt Steuer- und Bankdaten für B2B.',
    },
    fr: {
      registrationDetails: "Détails d'inscription",
      registrationHelp: "Remplissez le formulaire ci-dessous pour envoyer votre demande de compte.",
      secureOnboarding: 'Intégration sécurisée',
      secureOnboardingDesc: "Vérification des documents et flux d'approbation sécurisé.",
      fastFulfillment: 'Traitement rapide',
      fastFulfillmentDesc: 'Suivez produits, catégories et commandes en un seul endroit.',
      businessReady: 'Prêt pour le B2B',
      businessReadyDesc: 'Le profil marchand prend en charge les données fiscales et bancaires.',
    },
    es: {
      registrationDetails: 'Detalles de registro',
      registrationHelp: 'Complete el formulario para enviar su solicitud de cuenta.',
      secureOnboarding: 'Onboarding seguro',
      secureOnboardingDesc: 'Verificación documental y aprobación de cuenta protegida.',
      fastFulfillment: 'Gestión rápida',
      fastFulfillmentDesc: 'Sigue productos, categorías y pedidos en un solo lugar.',
      businessReady: 'Listo para negocios',
      businessReadyDesc: 'El perfil comercial admite datos fiscales y bancarios para B2B.',
    },
    it: {
      registrationDetails: 'Dettagli di registrazione',
      registrationHelp: 'Compila il modulo per inviare la richiesta di account.',
      secureOnboarding: 'Onboarding sicuro',
      secureOnboardingDesc: 'Verifica documenti e flusso di approvazione protetto.',
      fastFulfillment: 'Gestione rapida',
      fastFulfillmentDesc: 'Monitora prodotti, categorie e ordini in un solo posto.',
      businessReady: 'Pronto per il business',
      businessReadyDesc: 'Il profilo merchant supporta dati fiscali e bancari per B2B.',
    },
    sk: {
      registrationDetails: 'Detaily registrácie',
      registrationHelp: 'Vyplňte formulár nižšie a odošlite žiadosť o účet.',
      secureOnboarding: 'Bezpečný onboarding',
      secureOnboardingDesc: 'Overenie dokumentov a chránený schvaľovací proces účtu.',
      fastFulfillment: 'Rýchle vybavenie',
      fastFulfillmentDesc: 'Sledujte produkty, kategórie a objednávky na jednom mieste.',
      businessReady: 'Pripravené pre biznis',
      businessReadyDesc: 'Profil obchodníka podporuje daňové a bankové údaje pre B2B.',
    },
  }[language];

  useEffect(() => {
    // Only redirect if hydrated and user is logged in
    if (_hasHydrated && token && user) {
      router.push('/account');
    }
  }, [_hasHydrated, token, user, router]);

  // Show loading while hydrating
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('common.loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // Don't show register form if user is already logged in (will redirect)
  if (token && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('common.loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-10 px-4 md:py-14">
      <div className="mx-auto grid w-full max-w-6xl items-start gap-8 lg:grid-cols-[1.05fr_1.35fr]">
        <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            TeleTrade Hub
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
            {t('auth.createAccount') || 'Create Account'}
          </h1>
          <p className="mt-3 text-slate-600">
            {t('auth.registerSubtitle') || 'Join TeleTrade Hub and start shopping'}
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{ui.secureOnboarding}</p>
                <p className="text-xs text-slate-600">{ui.secureOnboardingDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3">
              <Truck className="mt-0.5 h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{ui.fastFulfillment}</p>
                <p className="text-xs text-slate-600">{ui.fastFulfillmentDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3">
              <WalletCards className="mt-0.5 h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{ui.businessReady}</p>
                <p className="text-xs text-slate-600">{ui.businessReadyDesc}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-5 text-center lg:text-left">
            <h2 className="font-display text-2xl font-bold text-slate-900">{ui.registrationDetails}</h2>
            <p className="mt-1 text-sm text-slate-600">{ui.registrationHelp}</p>
          </div>
          <div className="rounded-3xl border border-white/60 bg-white/70 p-1 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.55)] backdrop-blur">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
