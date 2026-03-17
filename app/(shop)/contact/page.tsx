'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsApi, PublicSettings } from '@/lib/api/settings';
import { useLanguage } from '@/contexts/language-context';
import type { SiteLanguage } from '@/lib/i18n/server-language';

type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

const contactCopy: Record<SiteLanguage, {
  heroTitle: string;
  heroSubtitle: string;
  cards: { email: string; phone: string; address: string; hours: string };
  notAvailable: { email: string; phone: string; address: string };
  businessHours: string[];
  formTitle: string;
  labels: {
    name: string;
    email: string;
    phoneOptional: string;
    subject: string;
    message: string;
    send: string;
  };
  validation: {
    nameMin: string;
    emailInvalid: string;
    subjectMin: string;
    messageMin: string;
  };
  toast: { success: string; error: string };
}> = {
  en: {
    heroTitle: 'Contact Us',
    heroSubtitle: 'Have a question? Send us a message and our team will respond quickly.',
    cards: { email: 'Email', phone: 'Phone', address: 'Address', hours: 'Business Hours' },
    notAvailable: { email: 'Email not available', phone: 'Phone not available', address: 'Address not available' },
    businessHours: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM', 'Sunday: Closed'],
    formTitle: 'Send us a Message',
    labels: {
      name: 'Name',
      email: 'Email',
      phoneOptional: 'Phone (Optional)',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
    },
    validation: {
      nameMin: 'Name must be at least 2 characters',
      emailInvalid: 'Invalid email address',
      subjectMin: 'Subject must be at least 3 characters',
      messageMin: 'Message must be at least 10 characters',
    },
    toast: {
      success: 'Thank you for your message. We will get back to you soon.',
      error: 'Failed to send message. Please try again.',
    },
  },
  de: {
    heroTitle: 'Kontakt',
    heroSubtitle: 'Für geschäftliche oder organisatorische Rückfragen stehen wir Ihnen gerne zur Verfügung.',
    cards: { email: 'E-Mail', phone: 'Telefon', address: 'Anschrift', hours: 'Geschäftszeiten' },
    notAvailable: { email: 'E-Mail derzeit nicht verfügbar', phone: 'Telefonnummer derzeit nicht verfügbar', address: 'Anschrift derzeit nicht verfügbar' },
    businessHours: ['Montag - Freitag: 09:00 - 18:00', 'Samstag: 10:00 - 16:00', 'Sonntag: Geschlossen'],
    formTitle: 'Kontaktanfrage senden',
    labels: {
      name: 'Vollständiger Name',
      email: 'E-Mail',
      phoneOptional: 'Telefon (Optional)',
      subject: 'Betreff',
      message: 'Nachricht',
      send: 'Anfrage übermitteln',
    },
    validation: {
      nameMin: 'Der Name muss mindestens 2 Zeichen umfassen',
      emailInvalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      subjectMin: 'Der Betreff muss mindestens 3 Zeichen umfassen',
      messageMin: 'Die Nachricht muss mindestens 10 Zeichen umfassen',
    },
    toast: {
      success: 'Vielen Dank für Ihre Anfrage. Wir melden uns schnellstmöglich bei Ihnen.',
      error: 'Die Anfrage konnte nicht übermittelt werden. Bitte versuchen Sie es erneut.',
    },
  },
  fr: {
    heroTitle: 'Contact',
    heroSubtitle: 'Une question? Envoyez-nous un message et nous vous repondrons rapidement.',
    cards: { email: 'E-mail', phone: 'Telephone', address: 'Adresse', hours: 'Horaires' },
    notAvailable: { email: 'E-mail non disponible', phone: 'Telephone non disponible', address: 'Adresse non disponible' },
    businessHours: ['Lundi - Vendredi: 09:00 - 18:00', 'Samedi: 10:00 - 16:00', 'Dimanche: Ferme'],
    formTitle: 'Envoyer un message',
    labels: {
      name: 'Nom',
      email: 'E-mail',
      phoneOptional: 'Telephone (Optionnel)',
      subject: 'Sujet',
      message: 'Message',
      send: 'Envoyer',
    },
    validation: {
      nameMin: 'Le nom doit contenir au moins 2 caracteres',
      emailInvalid: 'Adresse e-mail invalide',
      subjectMin: 'Le sujet doit contenir au moins 3 caracteres',
      messageMin: 'Le message doit contenir au moins 10 caracteres',
    },
    toast: {
      success: 'Merci pour votre message. Nous reviendrons vers vous rapidement.',
      error: 'Echec de envoi. Veuillez reessayer.',
    },
  },
  es: {
    heroTitle: 'Contacto',
    heroSubtitle: 'Tiene una consulta? Envienos un mensaje y responderemos pronto.',
    cards: { email: 'Correo', phone: 'Telefono', address: 'Direccion', hours: 'Horario de atencion' },
    notAvailable: { email: 'Correo no disponible', phone: 'Telefono no disponible', address: 'Direccion no disponible' },
    businessHours: ['Lunes - Viernes: 09:00 - 18:00', 'Sabado: 10:00 - 16:00', 'Domingo: Cerrado'],
    formTitle: 'Envienos un mensaje',
    labels: {
      name: 'Nombre',
      email: 'Correo',
      phoneOptional: 'Telefono (Opcional)',
      subject: 'Asunto',
      message: 'Mensaje',
      send: 'Enviar mensaje',
    },
    validation: {
      nameMin: 'El nombre debe tener al menos 2 caracteres',
      emailInvalid: 'Correo electronico no valido',
      subjectMin: 'El asunto debe tener al menos 3 caracteres',
      messageMin: 'El mensaje debe tener al menos 10 caracteres',
    },
    toast: {
      success: 'Gracias por su mensaje. Responderemos pronto.',
      error: 'No se pudo enviar el mensaje. Intente de nuevo.',
    },
  },
  it: {
    heroTitle: 'Contatti',
    heroSubtitle: 'Ha una domanda? Invii un messaggio e risponderemo al piu presto.',
    cards: { email: 'Email', phone: 'Telefono', address: 'Indirizzo', hours: 'Orari' },
    notAvailable: { email: 'Email non disponibile', phone: 'Telefono non disponibile', address: 'Indirizzo non disponibile' },
    businessHours: ['Lunedi - Venerdi: 09:00 - 18:00', 'Sabato: 10:00 - 16:00', 'Domenica: Chiuso'],
    formTitle: 'Invia un messaggio',
    labels: {
      name: 'Nome',
      email: 'Email',
      phoneOptional: 'Telefono (Opzionale)',
      subject: 'Oggetto',
      message: 'Messaggio',
      send: 'Invia messaggio',
    },
    validation: {
      nameMin: 'Il nome deve contenere almeno 2 caratteri',
      emailInvalid: 'Email non valida',
      subjectMin: 'Oggetto deve contenere almeno 3 caratteri',
      messageMin: 'Il messaggio deve contenere almeno 10 caratteri',
    },
    toast: {
      success: 'Grazie per il messaggio. Risponderemo presto.',
      error: 'Invio non riuscito. Riprovi.',
    },
  },
  sk: {
    heroTitle: 'Kontakt',
    heroSubtitle: 'Mate otazku? Poslite nam spravu a odpovieme co najskor.',
    cards: { email: 'E-mail', phone: 'Telefon', address: 'Adresa', hours: 'Otváracie hodiny' },
    notAvailable: { email: 'E-mail nie je dostupny', phone: 'Telefon nie je dostupny', address: 'Adresa nie je dostupna' },
    businessHours: ['Pondelok - Piatok: 09:00 - 18:00', 'Sobota: 10:00 - 16:00', 'Nedela: Zatvorene'],
    formTitle: 'Poslite nam spravu',
    labels: {
      name: 'Meno',
      email: 'E-mail',
      phoneOptional: 'Telefon (Volitelne)',
      subject: 'Predmet',
      message: 'Sprava',
      send: 'Odoslat spravu',
    },
    validation: {
      nameMin: 'Meno musi mat aspon 2 znaky',
      emailInvalid: 'Neplatna e-mailova adresa',
      subjectMin: 'Predmet musi mat aspon 3 znaky',
      messageMin: 'Sprava musi mat aspon 10 znakov',
    },
    toast: {
      success: 'Dakujeme za spravu. Ozveme sa coskoro.',
      error: 'Spravu sa nepodarilo odoslat. Skuste znova.',
    },
  },
};

export default function ContactPage() {
  const { language } = useLanguage();
  const copy = contactCopy[language] || contactCopy.en;

  const contactSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, copy.validation.nameMin),
        email: z.string().email(copy.validation.emailInvalid),
        phone: z.string().optional(),
        subject: z.string().min(3, copy.validation.subjectMin),
        message: z.string().min(10, copy.validation.messageMin),
      }),
    [copy.validation]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<PublicSettings>({
    site_name: 'TeleTrade Hub',
    site_email: '',
    address: '',
    contact_number: '',
    whatsapp_number: '',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    youtube_url: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const publicSettings = await settingsApi.getPublic();
        setSettings(publicSettings);
      } catch (error) {
        console.error('Failed to load contact settings:', error);
      }
    };
    loadSettings();
  }, []);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(copy.toast.success);
      reset();
    } catch {
      toast.error(copy.toast.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-wide py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{copy.heroTitle}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{copy.heroSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{copy.cards.email}</h3>
                {settings.site_email ? (
                  <a href={`mailto:${settings.site_email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {settings.site_email}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{copy.notAvailable.email}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{copy.cards.phone}</h3>
                {settings.contact_number ? (
                  <a href={`tel:${settings.contact_number.replace(/\s/g, '')}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {settings.contact_number}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{copy.notAvailable.phone}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{copy.cards.address}</h3>
                {settings.address ? (
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{settings.address}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">{copy.notAvailable.address}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{copy.cards.hours}</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  {copy.businessHours.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-8">
            <h2 className="font-display text-2xl font-bold mb-6">{copy.formTitle}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">{copy.labels.name} *</label>
                  <Input id="name" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">{copy.labels.email} *</label>
                  <Input id="email" type="email" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">{copy.labels.phoneOptional}</label>
                <Input id="phone" type="tel" {...register('phone')} />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">{copy.labels.subject} *</label>
                <Input id="subject" {...register('subject')} className={errors.subject ? 'border-destructive' : ''} />
                {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">{copy.labels.message} *</label>
                <textarea
                  id="message"
                  rows={6}
                  {...register('message')}
                  className={`w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.message ? 'border-destructive' : ''}`}
                />
                {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
              </div>

              <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                <Send className="w-4 h-4 mr-2" />
                {copy.labels.send}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
