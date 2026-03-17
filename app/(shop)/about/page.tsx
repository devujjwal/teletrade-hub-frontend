import { Metadata } from 'next';
import { Shield, Truck, Headphones, Award } from 'lucide-react';
import Card from '@/components/ui/card';
import { getServerLanguage, type SiteLanguage } from '@/lib/i18n/server-language';

export const metadata: Metadata = {
  title: 'About Us | TeleTrade Hub',
  description: 'Learn about TeleTrade Hub - Your trusted partner for premium telecommunication products',
};

const aboutContent: Record<SiteLanguage, {
  heroTitle: string;
  heroSubtitle: string;
  missionTitle: string;
  missionBody: string[];
  valuesTitle: string;
  values: { title: string; description: string }[];
  storyTitle: string;
  storyBody: string[];
  whyTitle: string;
  whyCards: { title: string; description: string }[];
}> = {
  en: {
    heroTitle: 'About TeleTrade Hub',
    heroSubtitle: 'Your trusted partner for premium telecommunication products and exceptional service.',
    missionTitle: 'Our Mission',
    missionBody: [
      'We help customers and business buyers access trusted telecom products from leading global brands.',
      'Our goal is to combine quality devices, transparent pricing, and dependable support in one platform.',
    ],
    valuesTitle: 'Our Values',
    values: [
      { title: 'Trust & Reliability', description: 'We build long-term customer relationships through consistency and transparency.' },
      { title: 'Quality First', description: 'We focus on products that meet strict quality and authenticity standards.' },
      { title: 'Customer Support', description: 'Our team supports you from product selection to post-purchase assistance.' },
      { title: 'Fast Fulfillment', description: 'We optimize order handling to keep delivery timelines predictable.' },
    ],
    storyTitle: 'Our Story',
    storyBody: [
      'TeleTrade Hub was created to simplify access to modern communication technology for retail and trade buyers.',
      'What started as a focused telecom operation has grown into a trusted digital channel with operational discipline and customer-first support.',
    ],
    whyTitle: 'Why Choose TeleTrade Hub?',
    whyCards: [
      { title: 'Wide Selection', description: 'A curated catalog of phones, tablets, and accessories from top brands.' },
      { title: 'Competitive Pricing', description: 'Business-ready pricing logic designed for clear and fair purchasing decisions.' },
      { title: 'Secure Shopping', description: 'Strong account and payment safeguards across the customer journey.' },
    ],
  },
  de: {
    heroTitle: 'Über TeleTrade Hub',
    heroSubtitle: 'Ihr verlässlicher Geschäftspartner für Premium-Telekommunikationsprodukte und strukturierte Serviceprozesse.',
    missionTitle: 'Unsere Mission',
    missionBody: [
      'Wir stellen Privat- und Geschäftskunden ein verlässliches Sortiment an Telekommunikationsprodukten führender Hersteller bereit.',
      'Unser Anspruch ist die Verbindung aus qualitätsgesicherter Produktauswahl, transparenter Preislogik und verbindlicher Betreuung entlang des gesamten Bestellprozesses.',
    ],
    valuesTitle: 'Unsere Werte',
    values: [
      { title: 'Vertrauen und Verlässlichkeit', description: 'Wir gestalten Geschäftsbeziehungen langfristig durch nachvollziehbare Prozesse und verbindliche Kommunikation.' },
      { title: 'Qualitätsorientierung', description: 'Wir fokussieren uns auf Produkte, die hohen Standards hinsichtlich Qualität, Herkunft und Belastbarkeit entsprechen.' },
      { title: 'Professioneller Kundensupport', description: 'Unser Team begleitet Sie strukturiert von der Produktauswahl bis zur Nachbetreuung.' },
      { title: 'Effiziente Abwicklung', description: 'Wir optimieren operative Abläufe für planbare Bearbeitungs- und Lieferzeiten.' },
    ],
    storyTitle: 'Unsere Geschichte',
    storyBody: [
      'TeleTrade Hub wurde gegründet, um den Zugang zu moderner Kommunikationstechnologie für Endkunden und gewerbliche Abnehmer effizienter und transparenter zu gestalten.',
      'Aus einer spezialisierten Telekommunikationsstruktur entstand ein belastbarer digitaler Vertriebskanal mit klarer Serviceorientierung und operativer Verlässlichkeit.',
    ],
    whyTitle: 'Warum TeleTrade Hub?',
    whyCards: [
      { title: 'Breites, kuratiertes Sortiment', description: 'Ausgewählte Smartphones, Tablets und Zubehörartikel mit klarem Qualitätsfokus.' },
      { title: 'Nachvollziehbare Preisstruktur', description: 'Transparente und marktorientierte Konditionen für private und gewerbliche Kunden.' },
      { title: 'Sichere Geschäftsabwicklung', description: 'Verlässliche Schutzmechanismen für Konten, Datenverarbeitung und Zahlungsprozesse.' },
    ],
  },
  fr: {
    heroTitle: 'À propos de TeleTrade Hub',
    heroSubtitle: 'Votre partenaire de confiance pour les produits télécom premium et un service fiable.',
    missionTitle: 'Notre mission',
    missionBody: [
      'Nous aidons les clients particuliers et professionnels à accéder à des produits télécom de marques reconnues.',
      'Notre objectif est de réunir qualité, prix clairs et support réactif sur une seule plateforme.',
    ],
    valuesTitle: 'Nos valeurs',
    values: [
      { title: 'Confiance et fiabilité', description: 'Nous construisons des relations durables avec une approche transparente.' },
      { title: 'Qualité avant tout', description: 'Nous sélectionnons des produits conformes à des standards stricts.' },
      { title: 'Support client', description: 'Notre équipe vous accompagne avant et après l’achat.' },
      { title: 'Traitement rapide', description: 'Nous optimisons le traitement des commandes pour des délais maîtrisés.' },
    ],
    storyTitle: 'Notre histoire',
    storyBody: [
      'TeleTrade Hub est né pour simplifier l’accès aux technologies de communication modernes.',
      'D’une activité spécialisée, nous avons évolué vers une plateforme e-commerce fiable orientée service.',
    ],
    whyTitle: 'Pourquoi choisir TeleTrade Hub ?',
    whyCards: [
      { title: 'Large sélection', description: 'Un catalogue ciblé de smartphones, tablettes et accessoires.' },
      { title: 'Prix compétitifs', description: 'Une structure tarifaire claire adaptée aux achats pro et retail.' },
      { title: 'Achat sécurisé', description: 'Des protections solides pour le compte, les données et le paiement.' },
    ],
  },
  es: {
    heroTitle: 'Sobre TeleTrade Hub',
    heroSubtitle: 'Tu socio de confianza para productos de telecomunicación premium y servicio excelente.',
    missionTitle: 'Nuestra misión',
    missionBody: [
      'Facilitamos a clientes particulares y empresas el acceso a productos telecom de marcas líderes.',
      'Buscamos unir calidad, precios claros y soporte confiable en una sola plataforma.',
    ],
    valuesTitle: 'Nuestros valores',
    values: [
      { title: 'Confianza y fiabilidad', description: 'Construimos relaciones duraderas con transparencia y consistencia.' },
      { title: 'Calidad primero', description: 'Seleccionamos productos con altos estándares de calidad y autenticidad.' },
      { title: 'Atención al cliente', description: 'Nuestro equipo te acompaña desde la compra hasta el soporte posterior.' },
      { title: 'Gestión rápida', description: 'Optimizamos la preparación de pedidos para entregas previsibles.' },
    ],
    storyTitle: 'Nuestra historia',
    storyBody: [
      'TeleTrade Hub nació para simplificar el acceso a tecnología de comunicación moderna.',
      'De una operación especializada pasamos a una plataforma digital confiable centrada en el cliente.',
    ],
    whyTitle: '¿Por qué elegir TeleTrade Hub?',
    whyCards: [
      { title: 'Amplia selección', description: 'Catálogo seleccionado de móviles, tablets y accesorios.' },
      { title: 'Precios competitivos', description: 'Precios claros y equilibrados para clientes particulares y profesionales.' },
      { title: 'Compra segura', description: 'Protección reforzada para cuenta, datos y pagos.' },
    ],
  },
  it: {
    heroTitle: 'Chi è TeleTrade Hub',
    heroSubtitle: 'Il tuo partner affidabile per prodotti telecom premium e un servizio eccellente.',
    missionTitle: 'La nostra missione',
    missionBody: [
      'Aiutiamo clienti privati e business ad accedere a prodotti telecom di marchi leader.',
      'Puntiamo a unire qualità, prezzi trasparenti e supporto affidabile in un’unica piattaforma.',
    ],
    valuesTitle: 'I nostri valori',
    values: [
      { title: 'Fiducia e affidabilità', description: 'Costruiamo relazioni durature con trasparenza e coerenza.' },
      { title: 'Qualità prima di tutto', description: 'Selezioniamo prodotti con standard elevati di qualità e autenticità.' },
      { title: 'Supporto clienti', description: 'Il nostro team ti segue dalla scelta al post-vendita.' },
      { title: 'Evasione rapida', description: 'Ottimizziamo i processi per tempi di consegna prevedibili.' },
    ],
    storyTitle: 'La nostra storia',
    storyBody: [
      'TeleTrade Hub è nato per semplificare l’accesso alla tecnologia di comunicazione moderna.',
      'Da realtà specializzata siamo cresciuti in una piattaforma e-commerce affidabile e orientata al servizio.',
    ],
    whyTitle: 'Perché scegliere TeleTrade Hub?',
    whyCards: [
      { title: 'Ampia selezione', description: 'Catalogo curato di smartphone, tablet e accessori.' },
      { title: 'Prezzi competitivi', description: 'Prezzi chiari e coerenti per retail e business.' },
      { title: 'Acquisti sicuri', description: 'Protezioni solide per account, dati e pagamenti.' },
    ],
  },
  sk: {
    heroTitle: 'O TeleTrade Hub',
    heroSubtitle: 'Váš spoľahlivý partner pre prémiové telekomunikačné produkty a kvalitné služby.',
    missionTitle: 'Naša misia',
    missionBody: [
      'Pomáhame retail aj firemným zákazníkom získať spoľahlivé telekomunikačné produkty od popredných značiek.',
      'Naším cieľom je spojiť kvalitu, transparentné ceny a spoľahlivú podporu na jednom mieste.',
    ],
    valuesTitle: 'Naše hodnoty',
    values: [
      { title: 'Dôvera a spoľahlivosť', description: 'Budujeme dlhodobé vzťahy cez transparentnosť a stabilitu.' },
      { title: 'Kvalita na prvom mieste', description: 'Ponúkame produkty s vysokým štandardom kvality a originality.' },
      { title: 'Zákaznícka podpora', description: 'Náš tím pomáha od výberu až po podporu po nákupe.' },
      { title: 'Rýchle spracovanie', description: 'Optimalizujeme procesy pre predvídateľné doručenie.' },
    ],
    storyTitle: 'Náš príbeh',
    storyBody: [
      'TeleTrade Hub vznikol s cieľom zjednodušiť prístup k modernej komunikačnej technológii.',
      'Z menšej špecializovanej prevádzky sme vyrástli na dôveryhodnú e-commerce platformu orientovanú na zákazníka.',
    ],
    whyTitle: 'Prečo si vybrať TeleTrade Hub?',
    whyCards: [
      { title: 'Široký výber', description: 'Starostlivo vybraný katalóg telefónov, tabletov a príslušenstva.' },
      { title: 'Konkurencieschopné ceny', description: 'Jasná a férová cenotvorba pre retail aj B2B.' },
      { title: 'Bezpečný nákup', description: 'Silná ochrana účtu, údajov a platieb.' },
    ],
  },
};

export default async function AboutPage() {
  const language = await getServerLanguage();
  const content = aboutContent[language] || aboutContent.en;

  const valueIcons = [Shield, Award, Headphones, Truck];

  return (
    <div className="container-wide py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{content.heroTitle}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{content.heroSubtitle}</p>
      </div>

      <section className="mb-16">
        <Card className="p-8 md:p-12">
          <h2 className="font-display text-3xl font-bold mb-6">{content.missionTitle}</h2>
          {content.missionBody.map((paragraph) => (
            <p key={paragraph} className="text-muted-foreground text-lg leading-relaxed mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="font-display text-3xl font-bold mb-8 text-center">{content.valuesTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.values.map((value, index) => {
            const Icon = valueIcons[index];
            return (
              <Card key={value.title} className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mb-16">
        <Card className="p-8 md:p-12">
          <h2 className="font-display text-3xl font-bold mb-6">{content.storyTitle}</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {content.storyBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-3xl font-bold mb-8 text-center">{content.whyTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.whyCards.map((card) => (
            <Card key={card.title} className="p-6">
              <h3 className="font-semibold text-lg mb-3">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
