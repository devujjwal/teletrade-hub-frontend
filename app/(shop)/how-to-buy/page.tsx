import { Metadata } from 'next';
import Card from '@/components/ui/card';
import { ShoppingCart, FileText, MessageCircle, Package } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import { getServerLanguage, withLanguage, type SiteLanguage } from '@/lib/i18n/server-language';

export const metadata: Metadata = {
  title: 'How to Buy | TeleTrade Hub',
  description: 'Learn the TeleTrade Hub order flow: place order, receive proforma invoice, clear payment, and track delivery.',
};

const content: Record<SiteLanguage, {
  heroTitle: string;
  heroSubtitle: string;
  steps: { title: string; description: string }[];
  benefitsTitle: string;
  benefits: string[];
  policyTitle: string;
  policy: string[];
  processTitle: string;
  processSteps: string[];
  ctaTitle: string;
  ctaSubtitle: string;
  createAccount: string;
  browseProducts: string;
}> = {
  en: {
    heroTitle: 'How to Buy',
    heroSubtitle: 'Place your order first, then complete payment after receiving the final proforma invoice.',
    steps: [
      { title: 'Browse & Select', description: 'Browse the catalog, compare specifications, and add products to your cart.' },
      { title: 'Place Your Order', description: 'Complete checkout with billing and delivery details. Final shipping is confirmed later.' },
      { title: 'Receive Proforma Invoice', description: 'We send the final invoice by email and WhatsApp (if provided), including confirmed charges.' },
      { title: 'Clear Payment Within 24 Hours', description: 'Please clear the invoice within 24 hours and share payment confirmation.' },
      { title: 'Processing & Delivery', description: 'After payment confirmation, we process and ship your order with status updates.' },
    ],
    benefitsTitle: 'Account Benefits',
    benefits: [
      'Track order progress in one place',
      'Save delivery addresses',
      'View order and invoice history',
      'Speed up repeat purchases',
    ],
    policyTitle: 'Important Notes',
    policy: [
      'Final shipping charges are confirmed in the proforma invoice.',
      'Invoice is shared via email and WhatsApp (if available).',
      'Payment confirmation is required within 24 hours.',
      'Unpaid orders may release reserved stock automatically.',
    ],
    processTitle: 'Payment Process',
    processSteps: ['Receive your proforma invoice', 'Clear payment within 24 hours', 'Share payment confirmation'],
    ctaTitle: 'Ready to Start Shopping?',
    ctaSubtitle: 'Browse our collection of premium telecommunication products.',
    createAccount: 'Create Account',
    browseProducts: 'Browse Products',
  },
  de: {
    heroTitle: 'Kaufanleitung',
    heroSubtitle: 'Bestellung übermitteln und die Zahlung im Anschluss auf Grundlage der finalen Proforma-Rechnung fristgerecht leisten.',
    steps: [
      { title: 'Produkte auswählen', description: 'Katalog prüfen, Spezifikationen vergleichen und gewünschte Artikel dem Warenkorb hinzufügen.' },
      { title: 'Bestellung übermitteln', description: 'Checkout mit Rechnungs- und Lieferdaten abschließen; Versandkosten werden im Anschluss verbindlich bestätigt.' },
      { title: 'Proforma-Rechnung erhalten', description: 'Die finale Proforma-Rechnung wird per E-Mail und, sofern hinterlegt, zusätzlich per WhatsApp bereitgestellt.' },
      { title: 'Zahlung innerhalb von 24 Stunden', description: 'Die Rechnungsbegleichung hat innerhalb von 24 Stunden zu erfolgen; anschließend ist die Zahlung zu bestätigen.' },
      { title: 'Bearbeitung und Auslieferung', description: 'Nach bestätigtem Zahlungseingang erfolgt die operative Bearbeitung und anschließende Versendung der Bestellung.' },
    ],
    benefitsTitle: 'Vorteile eines Kundenkontos',
    benefits: ['Zentraler Überblick über den Bestellstatus', 'Verwaltung gespeicherter Lieferadressen', 'Nachvollziehbarer Bestell- und Rechnungsverlauf', 'Beschleunigte Folgeaufträge'],
    policyTitle: 'Wichtige Hinweise',
    policy: [
      'Verbindliche Versandkosten werden in der Proforma-Rechnung ausgewiesen.',
      'Die Rechnung wird per E-Mail und, falls verfügbar, zusätzlich per WhatsApp übermittelt.',
      'Eine Zahlungsbestätigung innerhalb von 24 Stunden ist erforderlich.',
      'Nicht fristgerecht bezahlte Aufträge können zur Freigabe reservierter Bestände führen.',
    ],
    processTitle: 'Ablauf der Zahlungsabwicklung',
    processSteps: ['Erhalt der Proforma-Rechnung', 'Begleichung innerhalb von 24 Stunden', 'Übermittlung der Zahlungsbestätigung'],
    ctaTitle: 'Bereit zum Einkaufen?',
    ctaSubtitle: 'Entdecken Sie unser Sortiment an Premium-Telekommunikationsprodukten.',
    createAccount: 'Konto erstellen',
    browseProducts: 'Produkte ansehen',
  },
  fr: {
    heroTitle: 'Comment acheter',
    heroSubtitle: 'Passez la commande, puis finalisez le paiement après réception de la facture proforma.',
    steps: [
      { title: 'Parcourir et sélectionner', description: 'Parcourez le catalogue, comparez les spécifications et ajoutez les produits au panier.' },
      { title: 'Passer la commande', description: 'Finalisez le checkout avec vos informations de facturation et de livraison.' },
      { title: 'Recevoir la facture proforma', description: 'Nous envoyons la facture finale par e-mail et WhatsApp (si disponible).' },
      { title: 'Payer sous 24 heures', description: 'Régler la facture sous 24 heures puis confirmer le paiement.' },
      { title: 'Traitement et livraison', description: 'Après confirmation du paiement, la commande est traitée et expédiée.' },
    ],
    benefitsTitle: 'Avantages du compte',
    benefits: ['Suivre les commandes facilement', 'Enregistrer des adresses de livraison', 'Consulter l’historique des commandes', 'Accélérer les prochains achats'],
    policyTitle: 'Informations importantes',
    policy: [
      'Les frais de livraison finaux sont confirmés sur la facture proforma.',
      'La facture est envoyée par e-mail et WhatsApp (si disponible).',
      'La confirmation de paiement est requise sous 24 heures.',
      'Les commandes non payées peuvent libérer le stock réservé.',
    ],
    processTitle: 'Processus de paiement',
    processSteps: ['Recevoir la facture proforma', 'Régler sous 24 heures', 'Confirmer le paiement'],
    ctaTitle: 'Prêt à commander ?',
    ctaSubtitle: 'Découvrez notre sélection de produits télécom premium.',
    createAccount: 'Créer un compte',
    browseProducts: 'Voir les produits',
  },
  es: {
    heroTitle: 'Cómo comprar',
    heroSubtitle: 'Primero realiza el pedido y después completa el pago con la factura proforma final.',
    steps: [
      { title: 'Explora y selecciona', description: 'Revisa el catálogo, compara especificaciones y añade productos al carrito.' },
      { title: 'Realiza tu pedido', description: 'Completa el checkout con datos de facturación y entrega.' },
      { title: 'Recibe la factura proforma', description: 'Enviamos la factura final por correo y WhatsApp (si está disponible).' },
      { title: 'Paga en 24 horas', description: 'Liquida la factura en 24 horas y confirma el pago.' },
      { title: 'Procesamiento y entrega', description: 'Tras confirmar el pago, procesamos y enviamos el pedido.' },
    ],
    benefitsTitle: 'Ventajas de la cuenta',
    benefits: ['Seguimiento de pedidos', 'Guardar direcciones de entrega', 'Historial de pedidos y facturas', 'Compras repetidas más rápidas'],
    policyTitle: 'Notas importantes',
    policy: [
      'Los gastos de envío finales se confirman en la factura proforma.',
      'La factura se comparte por correo y WhatsApp (si está disponible).',
      'La confirmación de pago es obligatoria en 24 horas.',
      'Los pedidos impagados pueden liberar stock reservado.',
    ],
    processTitle: 'Proceso de pago',
    processSteps: ['Recibir factura proforma', 'Pagar en 24 horas', 'Confirmar el pago'],
    ctaTitle: '¿Listo para comprar?',
    ctaSubtitle: 'Explora nuestra colección de productos premium.',
    createAccount: 'Crear cuenta',
    browseProducts: 'Ver productos',
  },
  it: {
    heroTitle: 'Come acquistare',
    heroSubtitle: 'Effettua prima l’ordine e completa il pagamento dopo la fattura proforma finale.',
    steps: [
      { title: 'Sfoglia e seleziona', description: 'Consulta il catalogo, confronta le specifiche e aggiungi i prodotti al carrello.' },
      { title: 'Invia l’ordine', description: 'Completa il checkout con dati di fatturazione e consegna.' },
      { title: 'Ricevi la fattura proforma', description: 'Inviamo la fattura finale via email e WhatsApp (se disponibile).' },
      { title: 'Paga entro 24 ore', description: 'Salda la fattura entro 24 ore e conferma il pagamento.' },
      { title: 'Elaborazione e consegna', description: 'Dopo la conferma del pagamento, elaboriamo e spediamo l’ordine.' },
    ],
    benefitsTitle: 'Vantaggi account',
    benefits: ['Tracciamento ordini', 'Salvataggio indirizzi', 'Storico ordini e fatture', 'Riordini più veloci'],
    policyTitle: 'Note importanti',
    policy: [
      'I costi di spedizione finali sono confermati nella fattura proforma.',
      'La fattura viene inviata via email e WhatsApp (se disponibile).',
      'La conferma del pagamento è richiesta entro 24 ore.',
      'Gli ordini non pagati possono liberare stock riservato.',
    ],
    processTitle: 'Processo di pagamento',
    processSteps: ['Ricevi fattura proforma', 'Paga entro 24 ore', 'Conferma il pagamento'],
    ctaTitle: 'Pronto ad acquistare?',
    ctaSubtitle: 'Scopri la nostra selezione di prodotti telecom premium.',
    createAccount: 'Crea account',
    browseProducts: 'Sfoglia prodotti',
  },
  sk: {
    heroTitle: 'Ako nakupovať',
    heroSubtitle: 'Najprv odošlite objednávku a potom dokončite platbu podľa finálnej proforma faktúry.',
    steps: [
      { title: 'Vyberte produkty', description: 'Prezrite katalóg, porovnajte parametre a pridajte produkty do košíka.' },
      { title: 'Odošlite objednávku', description: 'Dokončite checkout s fakturačnými a dodacími údajmi.' },
      { title: 'Získajte proforma faktúru', description: 'Finálnu faktúru posielame e-mailom a cez WhatsApp (ak je dostupný).' },
      { title: 'Uhraďte do 24 hodín', description: 'Faktúru uhraďte do 24 hodín a potvrďte platbu.' },
      { title: 'Spracovanie a doručenie', description: 'Po potvrdení platby objednávku spracujeme a odošleme.' },
    ],
    benefitsTitle: 'Výhody účtu',
    benefits: ['Prehľad objednávok', 'Uložené doručovacie adresy', 'História objednávok a faktúr', 'Rýchlejšie opakované nákupy'],
    policyTitle: 'Dôležité informácie',
    policy: [
      'Finálne náklady na dopravu sú potvrdené v proforma faktúre.',
      'Faktúra sa zdieľa e-mailom a cez WhatsApp (ak je dostupný).',
      'Potvrdenie platby je potrebné do 24 hodín.',
      'Nezaplatené objednávky môžu uvoľniť rezervovaný sklad.',
    ],
    processTitle: 'Proces platby',
    processSteps: ['Prijmite proforma faktúru', 'Uhraďte do 24 hodín', 'Potvrďte platbu'],
    ctaTitle: 'Pripravení nakupovať?',
    ctaSubtitle: 'Objavte našu ponuku prémiových telekomunikačných produktov.',
    createAccount: 'Vytvoriť účet',
    browseProducts: 'Prehliadať produkty',
  },
};

export default async function HowToBuyPage() {
  const language = await getServerLanguage();
  const copy = content[language] || content.en;

  const icons = [ShoppingCart, ShoppingCart, FileText, MessageCircle, Package];

  return (
    <div className="container-wide py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{copy.heroTitle}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{copy.heroSubtitle}</p>
      </div>

      <div className="space-y-8 mb-12">
        {copy.steps.map((step, index) => {
          const Icon = icons[index];
          return (
            <Card key={step.title} className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {index + 1}
                    </span>
                    <h2 className="font-display text-2xl font-bold">{step.title}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-3">{copy.benefitsTitle}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {copy.benefits.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <Link href={withLanguage('/register', language)} className="inline-block mt-4">
            <Button variant="outline" size="sm">{copy.createAccount}</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-3">{copy.policyTitle}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {copy.policy.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-8">
        <h2 className="font-display text-2xl font-bold mb-6">{copy.processTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {copy.processSteps.map((step, index) => (
            <div key={step} className="text-center p-4 border border-border rounded-lg">
              <p className="font-semibold">Step {index + 1}</p>
              <p className="text-xs text-muted-foreground mt-1">{step}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="text-center mt-12">
        <h2 className="font-display text-2xl font-bold mb-4">{copy.ctaTitle}</h2>
        <p className="text-muted-foreground mb-6">{copy.ctaSubtitle}</p>
        <Button size="lg" asChild>
          <Link href={withLanguage('/products', language)}>{copy.browseProducts}</Link>
        </Button>
      </div>
    </div>
  );
}
