'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api/auth';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Card from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';
import { Briefcase, CheckCircle2, Clock3, MailCheck, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';

const PHONE_PATTERN = /^\+?[0-9][0-9\s()-]{6,19}$/;

const registerSchema = z
  .object({
    account_type: z.enum(['customer', 'merchant']),
    first_name: z.string().min(2, 'First name is required'),
    last_name: z.string().min(2, 'Last name is required'),
    address: z.string().min(3, 'Address is required'),
    postal_code: z.string().min(2, 'Postal code is required'),
    city: z.string().min(2, 'City is required'),
    country: z.string().min(2, 'Country is required'),
    phone: z
      .string()
      .trim()
      .max(50, 'Phone must not exceed 50 characters')
      .refine((value) => value.length === 0 || PHONE_PATTERN.test(value), 'Enter a valid phone number')
      .default(''),
    mobile: z
      .string()
      .trim()
      .min(1, 'Mobile is required')
      .max(50, 'Mobile must not exceed 50 characters')
      .refine((value) => PHONE_PATTERN.test(value), 'Enter a valid mobile number'),
    email: z.string().trim().email('Invalid email address').max(254, 'Email is too long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    tax_number: z.string().optional(),
    vat_number: z.string().optional(),
    delivery_address: z.string().optional(),
    delivery_postal_code: z.string().optional(),
    delivery_city: z.string().optional(),
    delivery_country: z.string().optional(),
    account_holder: z.string().optional(),
    bank_name: z.string().optional(),
    iban: z.string().optional(),
    bic: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ['confirmPassword'],
      });
    }

    if (data.account_type !== 'merchant') {
      return;
    }

    const merchantRequired: Array<keyof typeof data> = [
      'tax_number',
      'vat_number',
      'delivery_address',
      'delivery_postal_code',
      'delivery_city',
      'delivery_country',
      'account_holder',
      'bank_name',
      'iban',
      'bic',
    ];

    merchantRequired.forEach((field) => {
      if (!data[field] || String(data[field]).trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This field is required for merchant registration',
          path: [field],
        });
      }
    });
  });

type RegisterFormData = z.infer<typeof registerSchema>;

type FileFieldKey =
  | 'id_card_file'
  | 'passport_file'
  | 'business_registration_certificate_file'
  | 'vat_certificate_file'
  | 'tax_number_certificate_file';

type FileState = Record<FileFieldKey, File | null>;

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const ACCEPTED_FILE_INPUT = '.pdf,.jpg,.jpeg,.png';

export default function RegisterForm() {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [submittedRegistration, setSubmittedRegistration] = useState<{
    accountType: 'customer' | 'merchant';
    email: string;
    firstName: string;
  } | null>(null);
  const [files, setFiles] = useState<FileState>({
    id_card_file: null,
    passport_file: null,
    business_registration_certificate_file: null,
    vat_certificate_file: null,
    tax_number_certificate_file: null,
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      account_type: 'customer',
    },
  });

  const accountType = watch('account_type');

  const requiredFileFields = useMemo<FileFieldKey[]>(() => {
    if (accountType === 'merchant') {
      return [
        'business_registration_certificate_file',
        'id_card_file',
        'passport_file',
        'vat_certificate_file',
        'tax_number_certificate_file',
      ];
    }

    return ['id_card_file', 'passport_file'];
  }, [accountType]);

  const validateFiles = () => {
    for (const field of requiredFileFields) {
      const file = files[field];
      if (!file) {
        toast.error(`Please upload ${field.replaceAll('_', ' ').replace(' file', '')}.`);
        return false;
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        toast.error(`${file.name}: invalid file type. Allowed: PDF, JPG, PNG.`);
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: file too large. Max size is 10MB.`);
        return false;
      }
    }

    return true;
  };

  const handleFileChange = (field: FileFieldKey, file: File | null, inputElement?: HTMLInputElement) => {
    if (!file) {
      setFiles((prev) => ({ ...prev, [field]: null }));
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast.error(`${file.name}: invalid file type. Allowed: PDF, JPG, PNG.`);
      if (inputElement) {
        inputElement.value = '';
      }
      return;
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      toast.error(`${file.name}: file too large. Max size is 10MB.`);
      if (inputElement) {
        inputElement.value = '';
      }
      return;
    }

    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!validateFiles()) return;

    setIsLoading(true);
    try {
      const response = await authApi.register({
        account_type: data.account_type,
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        address: data.address.trim(),
        postal_code: data.postal_code.trim(),
        city: data.city.trim(),
        country: data.country.trim(),
        phone: data.phone.trim(),
        mobile: data.mobile.trim(),
        email: data.email.trim(),
        password: data.password,
        tax_number: data.tax_number?.trim(),
        vat_number: data.vat_number?.trim(),
        delivery_address: data.delivery_address?.trim(),
        delivery_postal_code: data.delivery_postal_code?.trim(),
        delivery_city: data.delivery_city?.trim(),
        delivery_country: data.delivery_country?.trim(),
        account_holder: data.account_holder?.trim(),
        bank_name: data.bank_name?.trim(),
        iban: data.iban?.trim(),
        bic: data.bic?.trim(),
        id_card_file: files.id_card_file,
        passport_file: files.passport_file,
        business_registration_certificate_file: files.business_registration_certificate_file,
        vat_certificate_file: files.vat_certificate_file,
        tax_number_certificate_file: files.tax_number_certificate_file,
      });

      const firstName = data.first_name.trim();
      const email = data.email.trim();
      setSubmittedRegistration({
        accountType: data.account_type,
        email,
        firstName,
      });
      toast.success(
        response?.message ||
          'Registration submitted successfully. Your account is pending approval and we will notify you by email once it is verified.'
      );
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = Object.entries(error.errors)
          .map(([, messages]: [string, any]) => (Array.isArray(messages) ? messages.join(', ') : messages))
          .join('\n');
        toast.error(errorMessages);
      } else {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fileLabel = 'Accepted: PDF, JPG, PNG. Max 10MB.';
  const selectedTabBase =
    'relative flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all';
  const ui = {
    en: {
      accountType: 'Account type *', customer: 'Customer', merchant: 'Merchant',
      firstName: 'First name *', lastName: 'Last name *', address: 'Address *',
      postalCode: 'Postal code *', city: 'City *', country: 'Country *',
      phone: 'Phone', phoneOptional: 'Optional', mobile: 'Mobile *', email: 'Email *',
      merchantInfo: 'Merchant information', taxNumber: 'Tax number *', vatNumber: 'VAT number *',
      deliveryAddressTitle: 'Delivery address', bankDetails: 'Bank details',
      accountHolder: 'Account holder *', bank: 'Bank *', iban: 'IBAN *', bic: 'BIC *',
      documentUploads: 'Document uploads', businessCertificate: 'Business registration certificate *',
      idCard: 'ID card (Ausweis) *', passport: 'Passport *', vatCertificate: 'VAT certificate *',
      taxCertificate: 'Tax number certificate *', password: 'Password *', confirmPassword: 'Confirm password *',
      createAccount: 'Create Account', hasAccount: 'Already have an account? ', login: 'Login',
      pendingBadge: 'Application received',
      pendingTitle: 'Your account is pending approval',
      pendingDescription: 'We have received your registration and sent it to our admin team for verification.',
      pendingEmailNotice: 'Once the review is complete, we will notify you by email.',
      pendingEmailLabel: 'Notification email',
      pendingTimelineTitle: 'What happens next',
      pendingStepReview: 'Our team verifies your submitted profile and documents.',
      pendingStepApprove: 'After approval, your account will be activated for login.',
      pendingStepEmail: 'You will receive an email update at this address.',
      pendingBackHome: 'Back to home',
      pendingSecondary: 'Need to register another account?',
      pendingRestart: 'Submit another application'
    },
    de: {
      accountType: 'Kontotyp *', customer: 'Kunde', merchant: 'Händler',
      firstName: 'Vorname *', lastName: 'Nachname *', address: 'Adresse *',
      postalCode: 'Postleitzahl *', city: 'Stadt *', country: 'Land *',
      phone: 'Telefon', phoneOptional: 'Optional', mobile: 'Mobil *', email: 'E-Mail *',
      merchantInfo: 'Händlerinformationen', taxNumber: 'Steuernummer *', vatNumber: 'USt-IdNr. *',
      deliveryAddressTitle: 'Lieferadresse', bankDetails: 'Bankdaten',
      accountHolder: 'Kontoinhaber *', bank: 'Bank *', iban: 'IBAN *', bic: 'BIC *',
      documentUploads: 'Dokument-Uploads', businessCertificate: 'Gewerbeanmeldung *',
      idCard: 'Ausweis *', passport: 'Reisepass *', vatCertificate: 'USt-Zertifikat *',
      taxCertificate: 'Steuernummer-Zertifikat *', password: 'Passwort *', confirmPassword: 'Passwort bestätigen *',
      createAccount: 'Konto erstellen', hasAccount: 'Bereits ein Konto? ', login: 'Anmelden',
      pendingBadge: 'Antrag eingegangen',
      pendingTitle: 'Ihr Konto wartet auf Freigabe',
      pendingDescription: 'Wir haben Ihre Registrierung erhalten und an unser Admin-Team zur Prüfung weitergeleitet.',
      pendingEmailNotice: 'Sobald die Prüfung abgeschlossen ist, benachrichtigen wir Sie per E-Mail.',
      pendingEmailLabel: 'Benachrichtigungs-E-Mail',
      pendingTimelineTitle: 'So geht es weiter',
      pendingStepReview: 'Unser Team prüft Ihr Profil und die eingereichten Dokumente.',
      pendingStepApprove: 'Nach der Freigabe wird Ihr Konto für die Anmeldung aktiviert.',
      pendingStepEmail: 'Sie erhalten ein Update per E-Mail an diese Adresse.',
      pendingBackHome: 'Zur Startseite',
      pendingSecondary: 'Möchten Sie ein weiteres Konto registrieren?',
      pendingRestart: 'Neue Registrierung starten'
    },
    fr: {
      accountType: 'Type de compte *', customer: 'Client', merchant: 'Marchand',
      firstName: 'Prénom *', lastName: 'Nom *', address: 'Adresse *',
      postalCode: 'Code postal *', city: 'Ville *', country: 'Pays *',
      phone: 'Téléphone', phoneOptional: 'Optionnel', mobile: 'Mobile *', email: 'E-mail *',
      merchantInfo: 'Informations marchand', taxNumber: 'Numéro fiscal *', vatNumber: 'Numéro TVA *',
      deliveryAddressTitle: 'Adresse de livraison', bankDetails: 'Coordonnées bancaires',
      accountHolder: 'Titulaire du compte *', bank: 'Banque *', iban: 'IBAN *', bic: 'BIC *',
      documentUploads: 'Téléchargement de documents', businessCertificate: "Certificat d'immatriculation *",
      idCard: "Carte d'identité *", passport: 'Passeport *', vatCertificate: 'Certificat TVA *',
      taxCertificate: 'Certificat fiscal *', password: 'Mot de passe *', confirmPassword: 'Confirmer le mot de passe *',
      createAccount: 'Créer un compte', hasAccount: 'Vous avez déjà un compte ? ', login: 'Connexion',
      pendingBadge: 'Demande reçue',
      pendingTitle: 'Votre compte est en attente d’approbation',
      pendingDescription: 'Nous avons bien reçu votre inscription et l’avons transmise à notre équipe admin pour vérification.',
      pendingEmailNotice: 'Une fois la vérification terminée, nous vous informerons par e-mail.',
      pendingEmailLabel: 'E-mail de notification',
      pendingTimelineTitle: 'Étapes suivantes',
      pendingStepReview: 'Notre équipe vérifie votre profil et vos documents.',
      pendingStepApprove: 'Après validation, votre compte sera activé pour la connexion.',
      pendingStepEmail: 'Vous recevrez une mise à jour à cette adresse e-mail.',
      pendingBackHome: 'Retour à l’accueil',
      pendingSecondary: 'Besoin d’enregistrer un autre compte ?',
      pendingRestart: 'Soumettre une autre demande'
    },
    es: {
      accountType: 'Tipo de cuenta *', customer: 'Cliente', merchant: 'Comerciante',
      firstName: 'Nombre *', lastName: 'Apellido *', address: 'Dirección *',
      postalCode: 'Código postal *', city: 'Ciudad *', country: 'País *',
      phone: 'Teléfono', phoneOptional: 'Opcional', mobile: 'Móvil *', email: 'Correo electrónico *',
      merchantInfo: 'Información del comerciante', taxNumber: 'Número fiscal *', vatNumber: 'Número de IVA *',
      deliveryAddressTitle: 'Dirección de entrega', bankDetails: 'Datos bancarios',
      accountHolder: 'Titular de la cuenta *', bank: 'Banco *', iban: 'IBAN *', bic: 'BIC *',
      documentUploads: 'Carga de documentos', businessCertificate: 'Certificado de registro mercantil *',
      idCard: 'Documento de identidad *', passport: 'Pasaporte *', vatCertificate: 'Certificado de IVA *',
      taxCertificate: 'Certificado fiscal *', password: 'Contraseña *', confirmPassword: 'Confirmar contraseña *',
      createAccount: 'Crear cuenta', hasAccount: '¿Ya tienes cuenta? ', login: 'Iniciar sesión',
      pendingBadge: 'Solicitud recibida',
      pendingTitle: 'Tu cuenta está pendiente de aprobación',
      pendingDescription: 'Hemos recibido tu registro y lo hemos enviado a nuestro equipo administrador para verificación.',
      pendingEmailNotice: 'Cuando la revisión termine, te notificaremos por correo electrónico.',
      pendingEmailLabel: 'Correo de notificación',
      pendingTimelineTitle: 'Qué sigue',
      pendingStepReview: 'Nuestro equipo verifica tu perfil y los documentos enviados.',
      pendingStepApprove: 'Después de aprobarla, tu cuenta quedará activada para iniciar sesión.',
      pendingStepEmail: 'Recibirás una actualización en esta dirección de correo.',
      pendingBackHome: 'Volver al inicio',
      pendingSecondary: '¿Necesitas registrar otra cuenta?',
      pendingRestart: 'Enviar otra solicitud'
    },
    it: {
      accountType: 'Tipo di account *', customer: 'Cliente', merchant: 'Commerciante',
      firstName: 'Nome *', lastName: 'Cognome *', address: 'Indirizzo *',
      postalCode: 'CAP *', city: 'Città *', country: 'Paese *',
      phone: 'Telefono', phoneOptional: 'Opzionale', mobile: 'Cellulare *', email: 'Email *',
      merchantInfo: 'Informazioni commerciante', taxNumber: 'Codice fiscale *', vatNumber: 'Partita IVA *',
      deliveryAddressTitle: 'Indirizzo di consegna', bankDetails: 'Dati bancari',
      accountHolder: 'Intestatario conto *', bank: 'Banca *', iban: 'IBAN *', bic: 'BIC *',
      documentUploads: 'Caricamento documenti', businessCertificate: 'Certificato di registrazione aziendale *',
      idCard: "Carta d'identità *", passport: 'Passaporto *', vatCertificate: 'Certificato IVA *',
      taxCertificate: 'Certificato fiscale *', password: 'Password *', confirmPassword: 'Conferma password *',
      createAccount: 'Crea account', hasAccount: 'Hai già un account? ', login: 'Accedi',
      pendingBadge: 'Richiesta ricevuta',
      pendingTitle: 'Il tuo account è in attesa di approvazione',
      pendingDescription: 'Abbiamo ricevuto la tua registrazione e l’abbiamo inviata al nostro team admin per la verifica.',
      pendingEmailNotice: 'Quando la revisione sarà completata, ti avviseremo via email.',
      pendingEmailLabel: 'Email di notifica',
      pendingTimelineTitle: 'Cosa succede ora',
      pendingStepReview: 'Il nostro team verifica il tuo profilo e i documenti inviati.',
      pendingStepApprove: 'Dopo l’approvazione, il tuo account sarà attivato per l’accesso.',
      pendingStepEmail: 'Riceverai un aggiornamento a questo indirizzo email.',
      pendingBackHome: 'Torna alla home',
      pendingSecondary: 'Vuoi registrare un altro account?',
      pendingRestart: 'Invia un’altra richiesta'
    },
    sk: {
      accountType: 'Typ účtu *', customer: 'Zákazník', merchant: 'Obchodník',
      firstName: 'Meno *', lastName: 'Priezvisko *', address: 'Adresa *',
      postalCode: 'PSČ *', city: 'Mesto *', country: 'Krajina *',
      phone: 'Telefón', phoneOptional: 'Voliteľné', mobile: 'Mobil *', email: 'E-mail *',
      merchantInfo: 'Informácie o obchodníkovi', taxNumber: 'Daňové číslo *', vatNumber: 'IČ DPH *',
      deliveryAddressTitle: 'Dodacia adresa', bankDetails: 'Bankové údaje',
      accountHolder: 'Majiteľ účtu *', bank: 'Banka *', iban: 'IBAN *', bic: 'BIC *',
      documentUploads: 'Nahranie dokumentov', businessCertificate: 'Osvedčenie o registrácii firmy *',
      idCard: 'Občiansky preukaz *', passport: 'Pas *', vatCertificate: 'Osvedčenie o DPH *',
      taxCertificate: 'Osvedčenie o daňovom čísle *', password: 'Heslo *', confirmPassword: 'Potvrďte heslo *',
      createAccount: 'Vytvoriť účet', hasAccount: 'Už máte účet? ', login: 'Prihlásiť sa',
      pendingBadge: 'Žiadosť prijatá',
      pendingTitle: 'Váš účet čaká na schválenie',
      pendingDescription: 'Vašu registráciu sme prijali a odoslali nášmu admin tímu na overenie.',
      pendingEmailNotice: 'Po dokončení kontroly vás budeme informovať e-mailom.',
      pendingEmailLabel: 'Notifikačný e-mail',
      pendingTimelineTitle: 'Čo bude nasledovať',
      pendingStepReview: 'Náš tím overí váš profil a nahrané dokumenty.',
      pendingStepApprove: 'Po schválení bude váš účet aktivovaný na prihlásenie.',
      pendingStepEmail: 'Aktualizáciu dostanete na túto e-mailovú adresu.',
      pendingBackHome: 'Späť na domovskú stránku',
      pendingSecondary: 'Potrebujete zaregistrovať ďalší účet?',
      pendingRestart: 'Odoslať ďalšiu žiadosť'
    },
  }[language];

  if (submittedRegistration) {
    return (
      <Card className="overflow-hidden border-0 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.25),_transparent_45%),linear-gradient(135deg,#082f49_0%,#0f172a_52%,#111827_100%)] p-0 text-white shadow-2xl">
        <div className="grid gap-0 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6 p-8 md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur">
              <CheckCircle2 className="h-4 w-4" />
              {ui.pendingBadge}
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{ui.pendingTitle}</h2>
              <p className="max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
                {submittedRegistration.firstName}, {ui.pendingDescription}
              </p>
              <p className="max-w-2xl text-sm leading-6 text-slate-300">{ui.pendingEmailNotice}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <MailCheck className="h-4 w-4 text-amber-300" />
                  {ui.pendingEmailLabel}
                </div>
                <p className="break-all text-sm text-slate-200">{submittedRegistration.email}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <Clock3 className="h-4 w-4 text-amber-300" />
                  {ui.accountType}
                </div>
                <p className="text-sm capitalize text-slate-200">{submittedRegistration.accountType}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                {ui.pendingBackHome}
              </Link>
              <button
                type="button"
                onClick={() => setSubmittedRegistration(null)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {ui.pendingRestart}
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 bg-slate-950/20 p-8 backdrop-blur lg:border-l lg:border-t-0">
            <h3 className="mb-5 text-lg font-semibold text-white">{ui.pendingTimelineTitle}</h3>
            <div className="space-y-4">
              {[ui.pendingStepReview, ui.pendingStepApprove, ui.pendingStepEmail].map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-300 font-semibold text-slate-950">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-200">{step}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-300">{ui.pendingSecondary}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/80 bg-gradient-to-b from-white to-slate-50/70 p-6 shadow-sm md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="account_type" className="mb-3 block text-sm font-medium">
            {ui.accountType}
          </label>
          <input type="hidden" id="account_type" {...register('account_type')} />
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-100/70 p-2">
            <button
              type="button"
              onClick={() => setValue('account_type', 'customer', { shouldValidate: true })}
              className={`${selectedTabBase} ${
                accountType === 'customer'
                  ? 'border-blue-200 bg-white text-blue-700 shadow-sm'
                  : 'border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-white/70'
              }`}
            >
              <UserRound className="h-4 w-4" />
              <span>{ui.customer}</span>
            </button>
            <button
              type="button"
              onClick={() => setValue('account_type', 'merchant', { shouldValidate: true })}
              className={`${selectedTabBase} ${
                accountType === 'merchant'
                  ? 'border-amber-200 bg-white text-amber-700 shadow-sm'
                  : 'border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-white/70'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>{ui.merchant}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium mb-2">{ui.firstName}</label>
            <Input id="first_name" {...register('first_name')} className={errors.first_name ? 'border-destructive' : ''} />
            {errors.first_name && <p className="text-destructive text-xs mt-1">{errors.first_name.message}</p>}
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium mb-2">{ui.lastName}</label>
            <Input id="last_name" {...register('last_name')} className={errors.last_name ? 'border-destructive' : ''} />
            {errors.last_name && <p className="text-destructive text-xs mt-1">{errors.last_name.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-2">{ui.address}</label>
          <Input id="address" {...register('address')} className={errors.address ? 'border-destructive' : ''} />
          {errors.address && <p className="text-destructive text-xs mt-1">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="postal_code" className="block text-sm font-medium mb-2">{ui.postalCode}</label>
            <Input id="postal_code" {...register('postal_code')} className={errors.postal_code ? 'border-destructive' : ''} />
            {errors.postal_code && <p className="text-destructive text-xs mt-1">{errors.postal_code.message}</p>}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-2">{ui.city}</label>
            <Input id="city" {...register('city')} className={errors.city ? 'border-destructive' : ''} />
            {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">{ui.country}</label>
            <Input id="country" {...register('country')} className={errors.country ? 'border-destructive' : ''} />
            {errors.country && <p className="text-destructive text-xs mt-1">{errors.country.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">{ui.phone}</label>
            <Input
              id="phone"
              type="tel"
              placeholder="+49 123 456789"
              {...register('phone')}
              className={errors.phone ? 'border-destructive' : ''}
            />
            <p className="mt-1 text-xs text-muted-foreground">{ui.phoneOptional}</p>
            {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium mb-2">{ui.mobile}</label>
            <Input
              id="mobile"
              type="tel"
              placeholder="+49 123 456789"
              {...register('mobile')}
              className={errors.mobile ? 'border-destructive' : ''}
            />
            {errors.mobile && <p className="text-destructive text-xs mt-1">{errors.mobile.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">{ui.email}</label>
          <Input id="email" type="email" placeholder="name@company.com" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>

        {accountType === 'merchant' && (
          <>
            <h3 className="font-semibold text-sm pt-2">{ui.merchantInfo}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tax_number" className="block text-sm font-medium mb-2">{ui.taxNumber}</label>
                <Input id="tax_number" {...register('tax_number')} className={errors.tax_number ? 'border-destructive' : ''} />
                {errors.tax_number && <p className="text-destructive text-xs mt-1">{errors.tax_number.message}</p>}
              </div>
              <div>
                <label htmlFor="vat_number" className="block text-sm font-medium mb-2">{ui.vatNumber}</label>
                <Input id="vat_number" {...register('vat_number')} className={errors.vat_number ? 'border-destructive' : ''} />
                {errors.vat_number && <p className="text-destructive text-xs mt-1">{errors.vat_number.message}</p>}
              </div>
            </div>

            <h3 className="font-semibold text-sm">{ui.deliveryAddressTitle}</h3>
            <div>
              <label htmlFor="delivery_address" className="block text-sm font-medium mb-2">Address *</label>
              <Input id="delivery_address" {...register('delivery_address')} className={errors.delivery_address ? 'border-destructive' : ''} />
              {errors.delivery_address && <p className="text-destructive text-xs mt-1">{errors.delivery_address.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="delivery_postal_code" className="block text-sm font-medium mb-2">{ui.postalCode}</label>
                <Input id="delivery_postal_code" {...register('delivery_postal_code')} className={errors.delivery_postal_code ? 'border-destructive' : ''} />
                {errors.delivery_postal_code && <p className="text-destructive text-xs mt-1">{errors.delivery_postal_code.message}</p>}
              </div>
              <div>
                <label htmlFor="delivery_city" className="block text-sm font-medium mb-2">{ui.city}</label>
                <Input id="delivery_city" {...register('delivery_city')} className={errors.delivery_city ? 'border-destructive' : ''} />
                {errors.delivery_city && <p className="text-destructive text-xs mt-1">{errors.delivery_city.message}</p>}
              </div>
              <div>
                <label htmlFor="delivery_country" className="block text-sm font-medium mb-2">{ui.country}</label>
                <Input id="delivery_country" {...register('delivery_country')} className={errors.delivery_country ? 'border-destructive' : ''} />
                {errors.delivery_country && <p className="text-destructive text-xs mt-1">{errors.delivery_country.message}</p>}
              </div>
            </div>

            <h3 className="font-semibold text-sm">{ui.bankDetails}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="account_holder" className="block text-sm font-medium mb-2">{ui.accountHolder}</label>
                <Input id="account_holder" {...register('account_holder')} className={errors.account_holder ? 'border-destructive' : ''} />
                {errors.account_holder && <p className="text-destructive text-xs mt-1">{errors.account_holder.message}</p>}
              </div>
              <div>
                <label htmlFor="bank_name" className="block text-sm font-medium mb-2">{ui.bank}</label>
                <Input id="bank_name" {...register('bank_name')} className={errors.bank_name ? 'border-destructive' : ''} />
                {errors.bank_name && <p className="text-destructive text-xs mt-1">{errors.bank_name.message}</p>}
              </div>
              <div>
                <label htmlFor="iban" className="block text-sm font-medium mb-2">{ui.iban}</label>
                <Input id="iban" {...register('iban')} className={errors.iban ? 'border-destructive' : ''} />
                {errors.iban && <p className="text-destructive text-xs mt-1">{errors.iban.message}</p>}
              </div>
              <div>
                <label htmlFor="bic" className="block text-sm font-medium mb-2">{ui.bic}</label>
                <Input id="bic" {...register('bic')} className={errors.bic ? 'border-destructive' : ''} />
                {errors.bic && <p className="text-destructive text-xs mt-1">{errors.bic.message}</p>}
              </div>
            </div>
          </>
        )}

        <h3 className="font-semibold text-sm pt-2">{ui.documentUploads}</h3>
        {accountType === 'merchant' && (
          <div>
            <label htmlFor="business_registration_certificate_file" className="block text-sm font-medium mb-2">{ui.businessCertificate}</label>
            <Input
              id="business_registration_certificate_file"
              type="file"
              accept={ACCEPTED_FILE_INPUT}
              onChange={(e) =>
                handleFileChange('business_registration_certificate_file', e.target.files?.[0] || null, e.target)
              }
            />
            <p className="text-xs text-muted-foreground mt-1">{fileLabel}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="id_card_file" className="block text-sm font-medium mb-2">{ui.idCard}</label>
            <Input
              id="id_card_file"
              type="file"
              accept={ACCEPTED_FILE_INPUT}
              onChange={(e) => handleFileChange('id_card_file', e.target.files?.[0] || null, e.target)}
            />
            <p className="text-xs text-muted-foreground mt-1">{fileLabel}</p>
          </div>
          <div>
            <label htmlFor="passport_file" className="block text-sm font-medium mb-2">{ui.passport}</label>
            <Input
              id="passport_file"
              type="file"
              accept={ACCEPTED_FILE_INPUT}
              onChange={(e) => handleFileChange('passport_file', e.target.files?.[0] || null, e.target)}
            />
            <p className="text-xs text-muted-foreground mt-1">{fileLabel}</p>
          </div>
        </div>

        {accountType === 'merchant' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vat_certificate_file" className="block text-sm font-medium mb-2">{ui.vatCertificate}</label>
              <Input
                id="vat_certificate_file"
                type="file"
                accept={ACCEPTED_FILE_INPUT}
                onChange={(e) => handleFileChange('vat_certificate_file', e.target.files?.[0] || null, e.target)}
              />
              <p className="text-xs text-muted-foreground mt-1">{fileLabel}</p>
            </div>
            <div>
              <label htmlFor="tax_number_certificate_file" className="block text-sm font-medium mb-2">{ui.taxCertificate}</label>
              <Input
                id="tax_number_certificate_file"
                type="file"
                accept={ACCEPTED_FILE_INPUT}
                onChange={(e) =>
                  handleFileChange('tax_number_certificate_file', e.target.files?.[0] || null, e.target)
                }
              />
              <p className="text-xs text-muted-foreground mt-1">{fileLabel}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">{ui.password}</label>
            <Input id="password" type="password" {...register('password')} className={errors.password ? 'border-destructive' : ''} />
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">{ui.confirmPassword}</label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} className={errors.confirmPassword ? 'border-destructive' : ''} />
            {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {ui.createAccount}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">{ui.hasAccount}</span>
          <Link href="/login" className="text-primary font-medium hover:underline">{ui.login}</Link>
        </div>
      </form>
    </Card>
  );
}
