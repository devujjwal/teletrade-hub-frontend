import { Metadata } from 'next';
import Card from '@/components/ui/card';
import { Cookie, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { getServerLanguage, type SiteLanguage } from '@/lib/i18n/server-language';

export const metadata: Metadata = {
  title: 'Cookie Policy | TeleTrade Hub',
  description: 'Information about the cookies used on TeleTrade Hub and how visitors can manage their preferences.',
};

const cookieContent: Record<SiteLanguage, {
  badge: string;
  title: string;
  intro: string;
  cards: { title: string; body: string }[];
  sectionTitle: string;
  paragraphs: string[];
}> = {
  en: {
    badge: 'Cookie transparency',
    title: 'Cookie Policy',
    intro: 'TeleTrade Hub uses cookies and similar technologies for security, language preference, session continuity, and user experience.',
    cards: [
      { title: 'Essential cookies', body: 'Required for security, login state, language preference, and core site functionality.' },
      { title: 'Preference and performance cookies', body: 'Optional cookies can store convenience preferences and support performance analysis where enabled.' },
      { title: 'How to manage cookies', body: 'You can control cookies in browser settings and through the consent banner on the site.' },
    ],
    sectionTitle: 'Cookies currently used by the site',
    paragraphs: [
      'Current cookie and browser storage usage is focused on language preferences, authentication continuity, and consent state.',
      'If additional analytics or advertising technologies are introduced, this policy should be updated before activation.',
    ],
  },
  de: {
    badge: 'Transparenz bei Cookie-Verarbeitung',
    title: 'Cookie-Richtlinie',
    intro: 'TeleTrade Hub verwendet Cookies und vergleichbare Technologien zur Gewährleistung von Sicherheit, zur Verwaltung von Spracheinstellungen sowie zur Stabilisierung sitzungsbezogener Prozesse.',
    cards: [
      { title: 'Technisch erforderliche Cookies', body: 'Diese Cookies sind für Sicherheitsfunktionen, Authentifizierung, Spracheinstellungen und den Betrieb wesentlicher Seitenfunktionen erforderlich.' },
      { title: 'Präferenz- und Performance-Cookies', body: 'Optionale Cookies unterstützen die Speicherung nutzerbezogener Präferenzen sowie die Analyse technischer Leistungsparameter.' },
      { title: 'Verwaltung von Cookie-Einstellungen', body: 'Cookie-Einstellungen können über Browserkonfigurationen sowie über das Consent-Banner auf der Website verwaltet werden.' },
    ],
    sectionTitle: 'Aktuell genutzte Cookies',
    paragraphs: [
      'Derzeit werden Cookies und browserbasierte Speichermechanismen im Wesentlichen für Spracheinstellungen, Authentifizierungskontinuität und Dokumentation des Einwilligungsstatus eingesetzt.',
      'Vor Einführung zusätzlicher Analyse- oder Werbetechnologien wird diese Richtlinie entsprechend aktualisiert.',
    ],
  },
  fr: {
    badge: 'Transparence cookies',
    title: 'Politique de cookies',
    intro: 'TeleTrade Hub utilise des cookies pour la sécurité, la langue, la continuité de session et l’expérience utilisateur.',
    cards: [
      { title: 'Cookies essentiels', body: 'Nécessaires à la sécurité, à la connexion, à la langue et au fonctionnement principal du site.' },
      { title: 'Cookies de préférence et performance', body: 'Ces cookies optionnels mémorisent des préférences et aident à l’analyse de performance.' },
      { title: 'Gestion des cookies', body: 'Vous pouvez gérer les cookies via le navigateur et la bannière de consentement.' },
    ],
    sectionTitle: 'Cookies actuellement utilisés',
    paragraphs: [
      'L’usage actuel concerne surtout la langue, la continuité d’authentification et l’état de consentement.',
      'Si de nouveaux outils analytiques ou publicitaires sont ajoutés, la politique sera mise à jour avant activation.',
    ],
  },
  es: {
    badge: 'Transparencia de cookies',
    title: 'Política de cookies',
    intro: 'TeleTrade Hub usa cookies para seguridad, idioma, continuidad de sesión y mejora de experiencia.',
    cards: [
      { title: 'Cookies esenciales', body: 'Necesarias para seguridad, sesión, idioma y funcionamiento básico del sitio.' },
      { title: 'Cookies de preferencia y rendimiento', body: 'Opcionales para recordar preferencias y analizar rendimiento cuando se habilitan.' },
      { title: 'Cómo gestionarlas', body: 'Puedes gestionarlas desde el navegador y desde el banner de consentimiento.' },
    ],
    sectionTitle: 'Cookies usadas actualmente',
    paragraphs: [
      'Actualmente se usan principalmente para idioma, autenticación y estado de consentimiento.',
      'Si se añaden herramientas de analítica o publicidad, esta política se actualizará antes de activarlas.',
    ],
  },
  it: {
    badge: 'Trasparenza sui cookie',
    title: 'Politica sui cookie',
    intro: 'TeleTrade Hub utilizza cookie per sicurezza, lingua, continuità di sessione e qualità dell’esperienza utente.',
    cards: [
      { title: 'Cookie essenziali', body: 'Necessari per sicurezza, login, preferenza lingua e funzionalità principali.' },
      { title: 'Cookie di preferenza e performance', body: 'Opzionali per memorizzare preferenze e supportare analisi prestazionali.' },
      { title: 'Gestione cookie', body: 'Puoi gestire i cookie dal browser e dal banner di consenso sul sito.' },
    ],
    sectionTitle: 'Cookie attualmente in uso',
    paragraphs: [
      'L’uso attuale riguarda soprattutto lingua, continuità di autenticazione e consenso.',
      'Se verranno introdotti strumenti analitici o pubblicitari, la policy sarà aggiornata prima dell’attivazione.',
    ],
  },
  sk: {
    badge: 'Transparentnosť cookies',
    title: 'Zásady používania cookies',
    intro: 'TeleTrade Hub používa cookies pre bezpečnosť, jazykové nastavenia, kontinuitu relácie a lepší používateľský zážitok.',
    cards: [
      { title: 'Nevyhnutné cookies', body: 'Potrebné pre bezpečnosť, prihlásenie, jazyk a základnú funkčnosť stránky.' },
      { title: 'Preferenčné a výkonnostné cookies', body: 'Voliteľné cookies na zapamätanie preferencií a meranie výkonnosti.' },
      { title: 'Správa cookies', body: 'Cookies môžete spravovať v prehliadači aj cez banner súhlasu na stránke.' },
    ],
    sectionTitle: 'Aktuálne používané cookies',
    paragraphs: [
      'Aktuálne sa používajú hlavne pre jazyk, kontinuitu autentifikácie a stav súhlasu.',
      'Ak pribudnú analytické alebo reklamné nástroje, zásady budú aktualizované pred ich aktiváciou.',
    ],
  },
};

export default async function CookiesPage() {
  const language = await getServerLanguage();
  const copy = cookieContent[language] || cookieContent.en;

  const icons = [ShieldCheck, SlidersHorizontal, Cookie];

  return (
    <div className="container-wide py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#eff6ff_100%)] p-8 shadow-sm md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            <Cookie className="h-4 w-4 text-primary" />
            {copy.badge}
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">{copy.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">{copy.intro}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {copy.cards.map((card, index) => {
            const Icon = icons[index];
            return (
              <Card key={card.title} className="border-slate-200 p-6">
                <Icon className="h-8 w-8 text-primary" />
                <h2 className="mt-4 font-display text-xl font-semibold text-slate-950">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
              </Card>
            );
          })}
        </div>

        <Card className="border-slate-200 p-6 md:p-8">
          <h2 className="font-display text-2xl font-semibold text-slate-950">{copy.sectionTitle}</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>
              <a href="mailto:privacy@teletradehub.com" className="font-medium text-primary hover:underline">
                privacy@teletradehub.com
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
