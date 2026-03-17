import { Metadata } from 'next';
import Link from 'next/link';
import Card from '@/components/ui/card';
import { ShieldCheck, Database, LockKeyhole, Scale } from 'lucide-react';
import { getServerLanguage, withLanguage, type SiteLanguage } from '@/lib/i18n/server-language';

export const metadata: Metadata = {
  title: 'Privacy Policy | TeleTrade Hub',
  description: 'Overview of how TeleTrade Hub handles personal data in line with GDPR expectations for EU customers.',
};

const privacyContent: Record<SiteLanguage, {
  badge: string;
  title: string;
  intro: string;
  lastReviewed: string;
  links: { personalData: string; cookies: string };
  sections: { title: string; body: string[] }[];
  rightsTitle: string;
  rightsBody: string[];
  contactTitle: string;
  contactBody: string;
}> = {
  en: {
    badge: 'GDPR-focused privacy notice',
    title: 'Privacy Policy',
    intro: 'This page explains what personal data TeleTrade Hub processes, why it is processed, and how users can exercise their rights.',
    lastReviewed: 'Last reviewed: March 17, 2026',
    links: { personalData: 'View personal data processing terms', cookies: 'View cookie policy' },
    sections: [
      { title: '1. Controller and scope', body: ['TeleTrade Hub acts as controller for account, order, onboarding, and support-related personal data.', 'This policy applies to visitors, customers, and merchant applicants interacting with our services.'] },
      { title: '2. Categories of data', body: ['We may process contact, billing, shipping, tax, and account data necessary for business operations.', 'For business onboarding, additional verification documents may be required.'] },
      { title: '3. Legal bases', body: ['Data processing relies on contractual necessity, legal obligations, and legitimate interests where applicable.', 'Where optional cookies or marketing are used, consent is requested as required.'] },
      { title: '4. Data sharing and safeguards', body: ['Data may be shared with vetted processors supporting hosting, communications, payment, and logistics.', 'Appropriate access controls and technical safeguards are applied to reduce exposure risks.'] },
    ],
    rightsTitle: '5. Data subject rights',
    rightsBody: ['Depending on legal context, users may request access, correction, deletion, restriction, objection, or portability of their data.', 'Users may also contact a relevant supervisory authority if they believe data is processed unlawfully.'],
    contactTitle: '6. Privacy contact',
    contactBody: 'For privacy-related requests, contact',
  },
  de: {
    badge: 'DSGVO-orientierter Datenschutzhinweis',
    title: 'Datenschutzerklärung',
    intro: 'Diese Datenschutzerklärung erläutert Art, Umfang und Zwecke der Verarbeitung personenbezogener Daten bei TeleTrade Hub sowie die Rechte betroffener Personen.',
    lastReviewed: 'Letzte Prüfung: 17. März 2026',
    links: { personalData: 'Bedingungen zur Datenverarbeitung ansehen', cookies: 'Cookie-Richtlinie ansehen' },
    sections: [
      { title: '1. Verantwortlicher und sachlicher Geltungsbereich', body: ['TeleTrade Hub ist Verantwortlicher im Sinne der DSGVO für personenbezogene Daten, die im Rahmen von Konto-, Bestell-, Onboarding- und Supportprozessen verarbeitet werden.', 'Diese Erklärung gilt für Besucher, registrierte Kunden sowie Antragsteller gewerblicher Konten.'] },
      { title: '2. Kategorien verarbeiteter Daten', body: ['Abhängig vom Nutzungskontext verarbeiten wir insbesondere Kontakt-, Rechnungs-, Liefer-, Steuer- und Kontodaten.', 'Bei gewerblichen Registrierungen können ergänzende Nachweise zur Identitäts- und Unternehmensprüfung erforderlich sein.'] },
      { title: '3. Rechtsgrundlagen der Verarbeitung', body: ['Die Verarbeitung erfolgt insbesondere zur Vertragserfüllung, zur Erfüllung gesetzlicher Verpflichtungen sowie auf Grundlage berechtigter Interessen, soweit zulässig.', 'Für optionale Cookies und marketingbezogene Verarbeitungsvorgänge wird, soweit erforderlich, eine wirksame Einwilligung eingeholt.'] },
      { title: '4. Datenweitergabe und technische-organisatorische Maßnahmen', body: ['Eine Weitergabe erfolgt ausschließlich an vertraglich gebundene und überprüfte Dienstleister, etwa für Hosting, Kommunikation, Zahlungsabwicklung und Logistik.', 'Zur Risikominimierung setzen wir angemessene technische und organisatorische Maßnahmen ein, insbesondere Zugriffsbeschränkungen und Schutzmechanismen auf Systemebene.'] },
    ],
    rightsTitle: '5. Rechte betroffener Personen',
    rightsBody: ['Betroffenen stehen nach Maßgabe der gesetzlichen Voraussetzungen insbesondere Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch und Datenübertragbarkeit zu.', 'Sofern Sie der Auffassung sind, dass eine Verarbeitung nicht rechtmäßig erfolgt, können Sie sich an die zuständige Datenschutzaufsichtsbehörde wenden.'],
    contactTitle: '6. Datenschutzkontakt',
    contactBody: 'Für datenschutzrechtliche Anliegen kontaktieren Sie bitte',
  },
  fr: {
    badge: 'Notice de confidentialité orientée RGPD',
    title: 'Politique de confidentialité',
    intro: 'Cette page présente les données traitées par TeleTrade Hub, les finalités de traitement et les droits des personnes concernées.',
    lastReviewed: 'Dernière révision : 17 mars 2026',
    links: { personalData: 'Voir les conditions de traitement des données', cookies: 'Voir la politique de cookies' },
    sections: [
      { title: '1. Responsable et périmètre', body: ['TeleTrade Hub agit comme responsable du traitement pour les données liées au compte, aux commandes et au support.', 'Cette politique couvre visiteurs, clients et candidats professionnels.'] },
      { title: '2. Catégories de données', body: ['Nous pouvons traiter des données de contact, facturation, livraison, fiscalité et compte.', 'Des documents complémentaires peuvent être demandés pour l’onboarding professionnel.'] },
      { title: '3. Bases légales', body: ['Le traitement repose sur l’exécution du contrat, les obligations légales et l’intérêt légitime selon le cas.', 'Le consentement est sollicité pour les cookies optionnels et usages marketing.'] },
      { title: '4. Partage et sécurité', body: ['Les données peuvent être partagées avec des sous-traitants vérifiés (hébergement, paiements, logistique).', 'Des mesures techniques et organisationnelles sont appliquées pour limiter les risques.'] },
    ],
    rightsTitle: '5. Droits des personnes',
    rightsBody: ['Selon le contexte, vous pouvez demander accès, rectification, effacement, limitation, opposition ou portabilité.', 'Vous pouvez également contacter une autorité de contrôle compétente en cas de doute sur la légalité du traitement.'],
    contactTitle: '6. Contact confidentialité',
    contactBody: 'Pour toute demande liée à la confidentialité, contactez',
  },
  es: {
    badge: 'Aviso de privacidad orientado al RGPD',
    title: 'Política de privacidad',
    intro: 'Esta página explica qué datos personales trata TeleTrade Hub, con qué finalidad y cómo ejercer los derechos de protección de datos.',
    lastReviewed: 'Última revisión: 17 de marzo de 2026',
    links: { personalData: 'Ver términos de tratamiento de datos', cookies: 'Ver política de cookies' },
    sections: [
      { title: '1. Responsable y alcance', body: ['TeleTrade Hub actúa como responsable del tratamiento para datos de cuenta, pedidos y soporte.', 'Esta política aplica a visitantes, clientes y solicitantes comerciales.'] },
      { title: '2. Categorías de datos', body: ['Podemos tratar datos de contacto, facturación, envío, fiscalidad y cuenta.', 'Para alta comercial pueden solicitarse documentos de verificación adicionales.'] },
      { title: '3. Bases legales', body: ['El tratamiento se basa en ejecución contractual, obligaciones legales e interés legítimo cuando corresponda.', 'Para cookies opcionales y marketing se solicitará consentimiento cuando sea necesario.'] },
      { title: '4. Cesión y seguridad', body: ['Los datos pueden compartirse con proveedores verificados de hosting, pagos, comunicación y logística.', 'Aplicamos medidas técnicas y controles de acceso para reducir riesgos.'] },
    ],
    rightsTitle: '5. Derechos de los interesados',
    rightsBody: ['Según el caso, puedes solicitar acceso, rectificación, supresión, limitación, oposición o portabilidad.', 'También puedes acudir a una autoridad de control competente si consideras que el tratamiento es ilícito.'],
    contactTitle: '6. Contacto de privacidad',
    contactBody: 'Para solicitudes de privacidad, escribe a',
  },
  it: {
    badge: 'Informativa privacy orientata al GDPR',
    title: 'Informativa sulla privacy',
    intro: 'Questa pagina descrive quali dati personali tratta TeleTrade Hub, le finalità e i diritti degli interessati.',
    lastReviewed: 'Ultima revisione: 17 marzo 2026',
    links: { personalData: 'Vedi termini sul trattamento dati', cookies: 'Vedi politica cookie' },
    sections: [
      { title: '1. Titolare e ambito', body: ['TeleTrade Hub è titolare del trattamento per dati relativi a account, ordini e supporto.', 'La policy si applica a visitatori, clienti e candidati business.'] },
      { title: '2. Categorie di dati', body: ['Possiamo trattare dati di contatto, fatturazione, spedizione, fiscali e di account.', 'Per onboarding business possono essere richiesti documenti aggiuntivi.'] },
      { title: '3. Basi giuridiche', body: ['Il trattamento si basa su esecuzione contrattuale, obblighi di legge e legittimo interesse quando applicabile.', 'Per cookie opzionali e marketing viene richiesto consenso ove necessario.'] },
      { title: '4. Condivisione e sicurezza', body: ['I dati possono essere condivisi con fornitori verificati per hosting, pagamenti, comunicazioni e logistica.', 'Applichiamo controlli di accesso e misure tecniche per ridurre i rischi.'] },
    ],
    rightsTitle: '5. Diritti dell’interessato',
    rightsBody: ['In base al contesto, è possibile richiedere accesso, rettifica, cancellazione, limitazione, opposizione o portabilità.', 'È possibile anche presentare reclamo all’autorità competente se si ritiene il trattamento illecito.'],
    contactTitle: '6. Contatto privacy',
    contactBody: 'Per richieste privacy, contatta',
  },
  sk: {
    badge: 'Oznámenie o ochrane súkromia podľa GDPR',
    title: 'Zásady ochrany súkromia',
    intro: 'Táto stránka vysvetľuje, aké osobné údaje TeleTrade Hub spracúva, na aké účely a ako môžete uplatniť svoje práva.',
    lastReviewed: 'Posledná revízia: 17. marec 2026',
    links: { personalData: 'Zobraziť podmienky spracovania údajov', cookies: 'Zobraziť zásady cookies' },
    sections: [
      { title: '1. Prevádzkovateľ a rozsah', body: ['TeleTrade Hub je prevádzkovateľom údajov súvisiacich s účtom, objednávkami a podporou.', 'Tieto zásady platia pre návštevníkov, zákazníkov aj firemných žiadateľov.'] },
      { title: '2. Kategórie údajov', body: ['Môžeme spracúvať kontaktné, fakturačné, dodacie, daňové a účtové údaje.', 'Pri firemnej registrácii môžu byť vyžadované doplnkové dokumenty.'] },
      { title: '3. Právne základy', body: ['Spracovanie je založené na plnení zmluvy, zákonných povinnostiach a oprávnenom záujme podľa okolností.', 'Pri voliteľných cookies a marketingu sa vyžaduje súhlas, ak je to potrebné.'] },
      { title: '4. Zdieľanie a ochrana', body: ['Údaje môžu byť zdieľané s overenými dodávateľmi hostingu, platieb, komunikácie a logistiky.', 'Používame prístupové kontroly a technické opatrenia na zníženie rizík.'] },
    ],
    rightsTitle: '5. Práva dotknutých osôb',
    rightsBody: ['V závislosti od právneho rámca môžete požiadať o prístup, opravu, výmaz, obmedzenie, námietku alebo prenositeľnosť údajov.', 'Ak sa domnievate, že spracovanie je nezákonné, môžete kontaktovať príslušný dozorný orgán.'],
    contactTitle: '6. Kontakt pre ochranu súkromia',
    contactBody: 'Pre žiadosti o ochranu súkromia kontaktujte',
  },
};

export default async function PrivacyPage() {
  const language = await getServerLanguage();
  const copy = privacyContent[language] || privacyContent.en;

  const icons = [ShieldCheck, Database, Scale, LockKeyhole];

  return (
    <div className="container-wide py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#eff6ff_0%,#fff7ed_48%,#ffffff_100%)] p-8 shadow-sm md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            <ShieldCheck className="h-4 w-4 text-primary" />
            {copy.badge}
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">{copy.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">{copy.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-white px-3 py-1">{copy.lastReviewed}</span>
            <Link href={withLanguage('/personal-data-processing', language)} className="rounded-full bg-white px-3 py-1 hover:text-primary">
              {copy.links.personalData}
            </Link>
            <Link href={withLanguage('/cookies', language)} className="rounded-full bg-white px-3 py-1 hover:text-primary">
              {copy.links.cookies}
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
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-slate-600 md:text-base">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}

          <Card className="border-slate-200 p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-slate-950">{copy.rightsTitle}</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-slate-600 md:grid-cols-2 md:text-base">
              {copy.rightsBody.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </Card>

          <Card className="border-slate-200 p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-slate-950">{copy.contactTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {copy.contactBody}{' '}
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
