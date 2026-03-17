import { Metadata } from 'next';
import Link from 'next/link';
import Card from '@/components/ui/card';
import { FileSpreadsheet, Shield, UserCog, Files } from 'lucide-react';
import { getServerLanguage, withLanguage, type SiteLanguage } from '@/lib/i18n/server-language';

export const metadata: Metadata = {
  title: 'General Terms and Conditions of Processing Personal Data | TeleTrade Hub',
  description: 'Rules for how TeleTrade Hub processes customer and merchant personal data during onboarding, account access, and order handling.',
};

const pdpContent: Record<SiteLanguage, {
  badge: string;
  title: string;
  intro: string;
  lastReviewed: string;
  privacyLabel: string;
  cookieLabel: string;
  sections: { title: string; paragraphs: string[] }[];
  section5Title: string;
  section5Body: string;
  section6Title: string;
  section6Body: string;
}> = {
  en: {
    badge: 'Personal data processing terms',
    title: 'General Terms and Conditions of Processing Personal Data',
    intro: 'This framework explains how TeleTrade Hub processes personal data for account creation, onboarding, ordering, and compliance obligations.',
    lastReviewed: 'Last reviewed: March 17, 2026',
    privacyLabel: 'Privacy policy',
    cookieLabel: 'Cookie policy',
    sections: [
      { title: '1. Purpose of processing', paragraphs: ['Data is processed to provide accounts, evaluate registrations, process orders, and provide support.', 'Additional onboarding checks may be required for business and merchant access.'] },
      { title: '2. Data categories', paragraphs: ['Depending on account type, data may include identity, contact, business, tax, billing, and communication records.', 'Users should avoid submitting unnecessary sensitive information.'] },
      { title: '3. Access control', paragraphs: ['Access is limited to authorized personnel and processors with a clear operational need.', 'Processors are contractually required to keep data confidential and secure.'] },
      { title: '4. Retention and rights', paragraphs: ['Data is retained only as long as required for contractual, legal, and operational reasons.', 'Rights requests are handled in line with legal retention duties and applicable data protection law.'] },
    ],
    section5Title: '5. International transfers and infrastructure providers',
    section5Body: 'If data is processed outside the EEA, appropriate safeguards are required, including approved contractual mechanisms where applicable.',
    section6Title: '6. Contact for rights requests',
    section6Body: 'For access, correction, deletion, or objection requests, contact',
  },
  de: {
    badge: 'Vertragsbedingungen zur Verarbeitung personenbezogener Daten',
    title: 'Allgemeine Bedingungen zur Verarbeitung personenbezogener Daten',
    intro: 'Dieses Dokument konkretisiert die Rahmenbedingungen, unter denen TeleTrade Hub personenbezogene Daten für Kontoführung, Onboarding, Bestellabwicklung und Compliance-Zwecke verarbeitet.',
    lastReviewed: 'Letzte Prüfung: 17. März 2026',
    privacyLabel: 'Datenschutzerklärung',
    cookieLabel: 'Cookie-Richtlinie',
    sections: [
      { title: '1. Verarbeitungszwecke', paragraphs: ['Die Verarbeitung erfolgt insbesondere zur Kontoführung, zur Prüfung von Registrierungen, zur Bestellabwicklung sowie zur Bearbeitung von Supportanfragen.', 'Für gewerbliche Konten können ergänzende Prüf- und Nachweisverfahren erforderlich sein.'] },
      { title: '2. Kategorien personenbezogener Daten', paragraphs: ['Je nach Kontotyp und Geschäftsbeziehung können insbesondere Identitäts-, Kontakt-, Unternehmens-, Steuer- und Kommunikationsdaten verarbeitet werden.', 'Die Übermittlung nicht erforderlicher sensibler Informationen sollte unterbleiben.'] },
      { title: '3. Zugriffs- und Berechtigungskonzept', paragraphs: ['Zugriff auf personenbezogene Daten erhalten ausschließlich berechtigte Personen sowie vertraglich gebundene Dienstleister mit dokumentiertem Aufgabenbezug.', 'Dienstleister sind vertraglich zur Vertraulichkeit, zur Zweckbindung sowie zur Einhaltung angemessener Sicherheitsstandards verpflichtet.'] },
      { title: '4. Speicherfristen und Betroffenenrechte', paragraphs: ['Personenbezogene Daten werden nur so lange gespeichert, wie dies für vertragliche, gesetzliche oder berechtigte betriebliche Zwecke erforderlich ist.', 'Anfragen zu Betroffenenrechten werden unter Berücksichtigung gesetzlicher Aufbewahrungs- und Nachweispflichten bearbeitet.'] },
    ],
    section5Title: '5. Internationale Übermittlungen und Infrastruktur',
    section5Body: 'Soweit Datenverarbeitungen außerhalb des EWR erfolgen, werden geeignete Garantien, insbesondere vertragliche Absicherungen nach geltendem Datenschutzrecht, sichergestellt.',
    section6Title: '6. Kontakt für Rechteanfragen',
    section6Body: 'Für Auskunfts-, Berichtigungs-, Löschungs- oder Widerspruchsanfragen wenden Sie sich an',
  },
  fr: {
    badge: 'Conditions de traitement des données personnelles',
    title: 'Conditions générales de traitement des données personnelles',
    intro: 'Ce cadre décrit comment TeleTrade Hub traite les données pour les comptes, l’onboarding, les commandes et les obligations de conformité.',
    lastReviewed: 'Dernière révision : 17 mars 2026',
    privacyLabel: 'Politique de confidentialité',
    cookieLabel: 'Politique de cookies',
    sections: [
      { title: '1. Finalité du traitement', paragraphs: ['Les données sont traitées pour gérer les comptes, vérifier les inscriptions et exécuter les commandes.', 'Des vérifications supplémentaires peuvent être demandées pour les accès professionnels.'] },
      { title: '2. Catégories de données', paragraphs: ['Selon le type de compte, les données peuvent inclure identité, contact, fiscalité et échanges opérationnels.', 'Les utilisateurs doivent éviter l’envoi de données sensibles non nécessaires.'] },
      { title: '3. Contrôle des accès', paragraphs: ['L’accès est limité aux équipes et sous-traitants autorisés ayant un besoin opérationnel.', 'Les sous-traitants sont tenus contractuellement à la confidentialité et à la sécurité.'] },
      { title: '4. Conservation et droits', paragraphs: ['Les données sont conservées uniquement pendant la durée nécessaire aux obligations contractuelles et légales.', 'Les demandes d’exercice de droits sont traitées selon la réglementation applicable.'] },
    ],
    section5Title: '5. Transferts internationaux et infrastructures',
    section5Body: 'En cas de traitement hors EEE, des garanties appropriées doivent être mises en place.',
    section6Title: '6. Contact pour l’exercice des droits',
    section6Body: 'Pour les demandes d’accès, rectification, suppression ou opposition, contactez',
  },
  es: {
    badge: 'Términos de tratamiento de datos personales',
    title: 'Condiciones generales de tratamiento de datos personales',
    intro: 'Este marco explica cómo TeleTrade Hub trata datos personales para cuentas, onboarding, pedidos y obligaciones legales.',
    lastReviewed: 'Última revisión: 17 de marzo de 2026',
    privacyLabel: 'Política de privacidad',
    cookieLabel: 'Política de cookies',
    sections: [
      { title: '1. Finalidad del tratamiento', paragraphs: ['Los datos se tratan para cuentas, validación de registros, pedidos y soporte.', 'El acceso comercial puede requerir revisiones adicionales de verificación.'] },
      { title: '2. Categorías de datos', paragraphs: ['Según el tipo de cuenta, pueden tratarse datos de identidad, contacto, fiscales y de actividad.', 'Evita enviar datos sensibles que no sean necesarios.'] },
      { title: '3. Control de acceso', paragraphs: ['El acceso está limitado a personal y proveedores autorizados con necesidad operativa.', 'Los proveedores deben cumplir compromisos contractuales de confidencialidad y seguridad.'] },
      { title: '4. Conservación y derechos', paragraphs: ['Los datos se conservan solo durante el tiempo necesario para fines legales y operativos.', 'Las solicitudes de derechos se gestionan conforme a normativa aplicable.'] },
    ],
    section5Title: '5. Transferencias internacionales e infraestructura',
    section5Body: 'Cuando exista tratamiento fuera del EEE, se aplicarán garantías adecuadas y mecanismos contractuales válidos.',
    section6Title: '6. Contacto para ejercer derechos',
    section6Body: 'Para solicitudes de acceso, corrección, eliminación u oposición, escribe a',
  },
  it: {
    badge: 'Termini per il trattamento dei dati personali',
    title: 'Condizioni generali di trattamento dei dati personali',
    intro: 'Questo quadro spiega come TeleTrade Hub tratta i dati personali per account, onboarding, ordini e conformità normativa.',
    lastReviewed: 'Ultima revisione: 17 marzo 2026',
    privacyLabel: 'Informativa privacy',
    cookieLabel: 'Politica cookie',
    sections: [
      { title: '1. Finalità del trattamento', paragraphs: ['I dati sono trattati per gestione account, verifica registrazioni, ordini e supporto.', 'Per accessi business possono essere richiesti controlli aggiuntivi.'] },
      { title: '2. Categorie di dati', paragraphs: ['In base al tipo di account, possono essere trattati dati identificativi, di contatto, fiscali e operativi.', 'Gli utenti devono evitare l’invio di dati sensibili non necessari.'] },
      { title: '3. Controllo accessi', paragraphs: ['L’accesso è limitato a personale e fornitori autorizzati con necessità operativa.', 'I fornitori sono vincolati contrattualmente a riservatezza e sicurezza.'] },
      { title: '4. Conservazione e diritti', paragraphs: ['I dati sono conservati solo per il tempo necessario a finalità legali e operative.', 'Le richieste sui diritti sono gestite in conformità alla normativa applicabile.'] },
    ],
    section5Title: '5. Trasferimenti internazionali e infrastruttura',
    section5Body: 'Se i dati sono trattati fuori dallo SEE, devono essere adottate adeguate garanzie contrattuali.',
    section6Title: '6. Contatto per l’esercizio dei diritti',
    section6Body: 'Per richieste di accesso, rettifica, cancellazione o opposizione, contatta',
  },
  sk: {
    badge: 'Podmienky spracovania osobných údajov',
    title: 'Všeobecné podmienky spracovania osobných údajov',
    intro: 'Tento rámec vysvetľuje, ako TeleTrade Hub spracúva osobné údaje pre účty, onboarding, objednávky a zákonné povinnosti.',
    lastReviewed: 'Posledná revízia: 17. marec 2026',
    privacyLabel: 'Zásady ochrany súkromia',
    cookieLabel: 'Zásady cookies',
    sections: [
      { title: '1. Účel spracovania', paragraphs: ['Údaje sa spracúvajú na správu účtov, overenie registrácií, objednávky a podporu.', 'Pri firemnom prístupe môžu byť potrebné doplnkové kontroly.'] },
      { title: '2. Kategórie údajov', paragraphs: ['Podľa typu účtu sa môžu spracúvať identifikačné, kontaktné, daňové a prevádzkové údaje.', 'Používatelia nemajú posielať nepotrebné citlivé údaje.'] },
      { title: '3. Riadenie prístupu', paragraphs: ['Prístup majú len autorizované osoby a dodávatelia s prevádzkovou potrebou.', 'Dodávatelia sú zmluvne viazaní na dôvernosť a bezpečnosť.'] },
      { title: '4. Uchovávanie a práva', paragraphs: ['Údaje sa uchovávajú iba počas potrebnej doby na právne a prevádzkové účely.', 'Žiadosti o práva sa vybavujú podľa príslušnej legislatívy.'] },
    ],
    section5Title: '5. Medzinárodné prenosy a infraštruktúra',
    section5Body: 'Ak sa údaje spracúvajú mimo EHP, musia byť zavedené primerané záruky a zmluvné mechanizmy.',
    section6Title: '6. Kontakt pre uplatnenie práv',
    section6Body: 'Pre žiadosti o prístup, opravu, výmaz alebo námietku kontaktujte',
  },
};

export default async function PersonalDataProcessingPage() {
  const language = await getServerLanguage();
  const copy = pdpContent[language] || pdpContent.en;

  const icons = [FileSpreadsheet, Shield, UserCog, Files];

  return (
    <div className="container-wide py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eff6ff_55%,#fff7ed_100%)] p-8 shadow-sm md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            <Shield className="h-4 w-4 text-primary" />
            {copy.badge}
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">{copy.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">{copy.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-white px-3 py-1">{copy.lastReviewed}</span>
            <Link href={withLanguage('/privacy', language)} className="rounded-full bg-white px-3 py-1 hover:text-primary">
              {copy.privacyLabel}
            </Link>
            <Link href={withLanguage('/cookies', language)} className="rounded-full bg-white px-3 py-1 hover:text-primary">
              {copy.cookieLabel}
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
              <a href="mailto:privacy@teletradehub.com" className="font-medium text-primary hover:underline">
                privacy@teletradehub.com
              </a>
              .
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
