import { Metadata } from 'next';
import Link from 'next/link';
import Card from '@/components/ui/card';
import { FileCheck2, Building2, ReceiptText, Truck } from 'lucide-react';
import { getServerLanguage, withLanguage, type SiteLanguage } from '@/lib/i18n/server-language';

export const metadata: Metadata = {
  title: 'Terms & Conditions | TeleTrade Hub',
  description: 'General business terms for using TeleTrade Hub, account access, merchant approval, and trade purchases.',
};

const termsContent: Record<SiteLanguage, {
  badge: string;
  title: string;
  intro: string;
  lastReviewed: string;
  personalDataLink: string;
  privacyLink: string;
  sections: { title: string; paragraphs: string[] }[];
  section5Title: string;
  section5Body: string;
  section6Title: string;
  section6Body: string;
}> = {
  en: {
    badge: 'General terms for customers and merchants',
    title: 'Terms & Conditions',
    intro: 'These terms define account use, order handling, pricing visibility, and business onboarding expectations on TeleTrade Hub.',
    lastReviewed: 'Last reviewed: March 17, 2026',
    personalDataLink: 'Personal data processing terms',
    privacyLink: 'Privacy policy',
    sections: [
      {
        title: '1. Scope of terms',
        paragraphs: [
          'These Terms & Conditions govern website access, account registration, order communication, and trade-related purchasing workflows.',
          'Use of the platform is limited to lawful retail and business activity.',
        ],
      },
      {
        title: '2. Accounts and merchant approval',
        paragraphs: [
          'Users must provide accurate data during registration. Business accounts may require document checks before activation.',
          'Access may be restricted if submitted information is incomplete, inconsistent, or non-compliant.',
        ],
      },
      {
        title: '3. Offers, pricing, and order acceptance',
        paragraphs: [
          'Product listings and prices are informational and become binding only after order review and acceptance.',
          'Pricing can vary by account type, VAT handling, and approved commercial terms.',
        ],
      },
      {
        title: '4. Delivery and returns framework',
        paragraphs: [
          'Delivery windows are indicative unless otherwise confirmed in writing.',
          'Cancellation, defects, and return handling depend on product condition and mandatory legal obligations.',
        ],
      },
    ],
    section5Title: '5. User obligations',
    section5Body: 'Users must not misuse credentials, disrupt platform operations, upload unlawful material, or attempt unauthorized access to protected data.',
    section6Title: '6. Governing law and contact',
    section6Body: 'Unless mandatory consumer law provides otherwise, these terms are interpreted with German and EU e-commerce principles in mind.',
  },
  de: {
    badge: 'Allgemeine Geschäftsbedingungen für Kunden und Geschäftspartner',
    title: 'AGB',
    intro: 'Diese Allgemeinen Geschäftsbedingungen regeln die Nutzung von TeleTrade Hub, insbesondere Kontoführung, Vertragsabwicklung, Preisangaben sowie die Freischaltung gewerblicher Konten.',
    lastReviewed: 'Letzte Prüfung: 17. März 2026',
    personalDataLink: 'Bedingungen zur Datenverarbeitung',
    privacyLink: 'Datenschutzerklärung',
    sections: [
      {
        title: '1. Geltungsbereich',
        paragraphs: [
          'Diese AGB gelten für den Zugriff auf die Website, die Registrierung, die Kommunikation im Rahmen von Bestellungen sowie für sämtliche handelsbezogenen Prozesse.',
          'Die Nutzung der Plattform ist ausschließlich zu rechtmäßigen privaten und gewerblichen Zwecken zulässig.',
        ],
      },
      {
        title: '2. Konten und Händlerfreigabe',
        paragraphs: [
          'Im Rahmen der Registrierung sind vollständige und zutreffende Angaben bereitzustellen. Gewerbliche Konten können vor Freischaltung einer gesonderten Prüfung unterliegen.',
          'Bei unvollständigen, widersprüchlichen oder nicht verifizierbaren Angaben kann der Zugriff vorübergehend oder dauerhaft beschränkt werden.',
        ],
      },
      {
        title: '3. Angebote, Preise und Annahme',
        paragraphs: [
          'Produktdarstellungen, Verfügbarkeiten und Preisangaben sind freibleibend und werden erst mit ausdrücklicher Annahme der Bestellung verbindlich.',
          'Preisstellungen können je nach Kontotyp, umsatzsteuerlicher Behandlung sowie vertraglich vereinbarten Konditionen abweichen.',
        ],
      },
      {
        title: '4. Lieferung und Rückabwicklung',
        paragraphs: [
          'Lieferfristen gelten, sofern nicht ausdrücklich schriftlich bestätigt, als unverbindliche Richtwerte.',
          'Stornierung, Mängelbearbeitung und Rückabwicklung richten sich nach dem Zustand der Ware, den einschlägigen Vertragsbedingungen sowie zwingenden gesetzlichen Vorschriften.',
        ],
      },
    ],
    section5Title: '5. Pflichten der Nutzer',
    section5Body: 'Nutzer sind verpflichtet, Zugangsdaten vertraulich zu behandeln, die Plattform nicht zu beeinträchtigen und keine rechtswidrigen Inhalte zu übermitteln oder zu speichern.',
    section6Title: '6. Anwendbares Recht und Kontakt',
    section6Body: 'Soweit keine zwingenden verbraucherschutzrechtlichen Bestimmungen entgegenstehen, unterliegen Auslegung und Anwendung dieser Bedingungen den Grundsätzen des deutschen und europäischen E-Commerce-Rechts.',
  },
  fr: {
    badge: 'Conditions générales pour clients et professionnels',
    title: 'Conditions générales',
    intro: 'Ces conditions encadrent l’utilisation du compte, la gestion des commandes, la visibilité des prix et l’onboarding professionnel.',
    lastReviewed: 'Dernière révision : 17 mars 2026',
    personalDataLink: 'Conditions de traitement des données',
    privacyLink: 'Politique de confidentialité',
    sections: [
      { title: '1. Champ d’application', paragraphs: ['Ces conditions régissent l’accès au site, l’inscription et les flux de commande.', 'La plateforme est réservée à un usage légal, particulier ou professionnel.'] },
      { title: '2. Comptes et validation pro', paragraphs: ['Les informations fournies doivent être exactes. Les comptes professionnels peuvent nécessiter une vérification.', 'L’accès peut être limité si les données sont incomplètes ou non conformes.'] },
      { title: '3. Offres et prix', paragraphs: ['Les prix affichés sont informatifs jusqu’à validation de la commande.', 'Le prix final peut dépendre du statut client et du traitement fiscal.'] },
      { title: '4. Livraison et retours', paragraphs: ['Les délais de livraison sont indicatifs sauf engagement écrit.', 'Les retours et annulations dépendent de l’état des produits et du droit applicable.'] },
    ],
    section5Title: '5. Obligations utilisateur',
    section5Body: 'Il est interdit d’utiliser abusivement des identifiants, de perturber les systèmes ou d’accéder à des données protégées sans autorisation.',
    section6Title: '6. Droit applicable et contact',
    section6Body: 'Sauf disposition impérative contraire, l’interprétation suit les principes allemands et européens du commerce électronique.',
  },
  es: {
    badge: 'Condiciones generales para clientes y comercios',
    title: 'Términos y condiciones',
    intro: 'Estas condiciones regulan el uso de cuentas, la gestión de pedidos y el proceso de aprobación comercial en TeleTrade Hub.',
    lastReviewed: 'Última revisión: 17 de marzo de 2026',
    personalDataLink: 'Términos de tratamiento de datos',
    privacyLink: 'Política de privacidad',
    sections: [
      { title: '1. Alcance', paragraphs: ['Estas condiciones rigen el acceso al sitio, el registro y los flujos de compra.', 'La plataforma solo puede usarse para actividad legal minorista o empresarial.'] },
      { title: '2. Cuentas y aprobación comercial', paragraphs: ['El usuario debe aportar datos correctos. Las cuentas de empresa pueden requerir validación documental.', 'El acceso puede limitarse con información incompleta o inconsistente.'] },
      { title: '3. Ofertas y precios', paragraphs: ['Los precios y listados son informativos hasta la aceptación final del pedido.', 'El precio visible puede variar según estado de cliente y tratamiento fiscal.'] },
      { title: '4. Entrega y devoluciones', paragraphs: ['Los plazos de entrega son orientativos salvo confirmación escrita.', 'Cancelaciones y devoluciones se gestionan según estado del producto y ley aplicable.'] },
    ],
    section5Title: '5. Obligaciones del usuario',
    section5Body: 'No se permite el uso indebido de credenciales, la alteración de sistemas o el acceso no autorizado a datos protegidos.',
    section6Title: '6. Ley aplicable y contacto',
    section6Body: 'Salvo norma imperativa en contrario, la interpretación se ajusta a principios de comercio electrónico de Alemania y la UE.',
  },
  it: {
    badge: 'Condizioni generali per clienti e aziende',
    title: 'Termini e condizioni',
    intro: 'Questi termini disciplinano uso dell’account, gestione ordini, visibilità prezzi e onboarding commerciale su TeleTrade Hub.',
    lastReviewed: 'Ultima revisione: 17 marzo 2026',
    personalDataLink: 'Termini sul trattamento dati',
    privacyLink: 'Informativa privacy',
    sections: [
      { title: '1. Ambito di applicazione', paragraphs: ['I presenti termini regolano accesso al sito, registrazione e processi di acquisto.', 'La piattaforma è destinata a uso lecito retail e business.'] },
      { title: '2. Account e approvazione business', paragraphs: ['Gli utenti devono fornire dati corretti. Gli account business possono richiedere verifica documentale.', 'L’accesso può essere limitato in caso di dati incompleti o incoerenti.'] },
      { title: '3. Offerte e prezzi', paragraphs: ['Listini e disponibilità hanno valore informativo fino all’accettazione dell’ordine.', 'Il prezzo può variare in base a status cliente e trattamento IVA.'] },
      { title: '4. Consegna e resi', paragraphs: ['I tempi di consegna sono indicativi salvo conferma scritta.', 'Resi e cancellazioni dipendono da stato prodotto e obblighi di legge.'] },
    ],
    section5Title: '5. Obblighi utente',
    section5Body: 'È vietato usare credenziali impropriamente, alterare i sistemi o tentare accessi non autorizzati a dati protetti.',
    section6Title: '6. Legge applicabile e contatti',
    section6Body: 'Salvo norme imperative diverse, l’interpretazione segue i principi tedeschi ed europei dell’e-commerce.',
  },
  sk: {
    badge: 'Všeobecné podmienky pre zákazníkov a firmy',
    title: 'Obchodné podmienky',
    intro: 'Tieto podmienky upravujú používanie účtu, spracovanie objednávok a schvaľovanie firemných účtov v TeleTrade Hub.',
    lastReviewed: 'Posledná revízia: 17. marec 2026',
    personalDataLink: 'Podmienky spracovania údajov',
    privacyLink: 'Zásady ochrany súkromia',
    sections: [
      { title: '1. Rozsah podmienok', paragraphs: ['Podmienky upravujú prístup na stránku, registráciu a nákupné procesy.', 'Platforma je určená len na zákonné retail a B2B použitie.'] },
      { title: '2. Účty a schválenie firmy', paragraphs: ['Používateľ musí uviesť správne údaje. Firemné účty môžu vyžadovať overenie dokumentov.', 'Pri neúplných alebo nesúladných údajoch môže byť prístup obmedzený.'] },
      { title: '3. Ponuky a ceny', paragraphs: ['Ceny a dostupnosť sú informatívne do finálneho potvrdenia objednávky.', 'Finálna cena sa môže líšiť podľa typu účtu a daňového režimu.'] },
      { title: '4. Doručenie a vrátenie', paragraphs: ['Dodacie lehoty sú orientačné, ak nie je dohodnuté inak.', 'Storno a vrátenie sa riadi stavom tovaru a platným právom.'] },
    ],
    section5Title: '5. Povinnosti používateľa',
    section5Body: 'Nie je dovolené zneužívať prihlasovanie, narúšať systémy ani neoprávnene pristupovať k chráneným údajom.',
    section6Title: '6. Rozhodné právo a kontakt',
    section6Body: 'Ak záväzné spotrebiteľské právo neurčuje inak, výklad vychádza z nemeckých a EÚ zásad e-commerce.',
  },
};

export default async function TermsPage() {
  const language = await getServerLanguage();
  const copy = termsContent[language] || termsContent.en;

  const icons = [FileCheck2, Building2, ReceiptText, Truck];

  return (
    <div className="container-wide py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#eff6ff_52%,#ffffff_100%)] p-8 shadow-sm md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            <FileCheck2 className="h-4 w-4 text-primary" />
            {copy.badge}
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">{copy.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">{copy.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-white px-3 py-1">{copy.lastReviewed}</span>
            <Link href={withLanguage('/personal-data-processing', language)} className="rounded-full bg-white px-3 py-1 hover:text-primary">
              {copy.personalDataLink}
            </Link>
            <Link href={withLanguage('/privacy', language)} className="rounded-full bg-white px-3 py-1 hover:text-primary">
              {copy.privacyLink}
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          {copy.sections.map((section, index) => {
            const Icon = icons[index];
            return (
              <Card key={section.title} className="border-slate-200 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="font-display text-2xl font-semibold text-slate-950">{section.title}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-slate-600 md:text-base">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}

          <Card className="border-slate-200 p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-slate-950">{copy.section5Title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">{copy.section5Body}</p>
          </Card>

          <Card className="border-slate-200 p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-slate-950">{copy.section6Title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {copy.section6Body}{' '}
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
