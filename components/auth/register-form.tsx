'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/auth-store';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Card from '@/components/ui/card';
import toast from 'react-hot-toast';

const registerSchema = z
  .object({
    account_type: z.enum(['customer', 'merchant']),
    first_name: z.string().min(2, 'First name is required'),
    last_name: z.string().min(2, 'Last name is required'),
    address: z.string().min(3, 'Address is required'),
    postal_code: z.string().min(2, 'Postal code is required'),
    city: z.string().min(2, 'City is required'),
    country: z.string().min(2, 'Country is required'),
    phone: z.string().min(5, 'Phone is required'),
    mobile: z.string().min(5, 'Mobile is required'),
    email: z.string().email('Invalid email address'),
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

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileState>({
    id_card_file: null,
    passport_file: null,
    business_registration_certificate_file: null,
    vat_certificate_file: null,
    tax_number_certificate_file: null,
  });
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
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

      login(response.token, response.user, false);
      toast.success('Registration successful.');
      router.push('/account');
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

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="account_type" className="block text-sm font-medium mb-2">
            Account type *
          </label>
          <select
            id="account_type"
            {...register('account_type')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="customer">Customer</option>
            <option value="merchant">Merchant</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium mb-2">First name *</label>
            <Input id="first_name" {...register('first_name')} className={errors.first_name ? 'border-destructive' : ''} />
            {errors.first_name && <p className="text-destructive text-xs mt-1">{errors.first_name.message}</p>}
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium mb-2">Last name *</label>
            <Input id="last_name" {...register('last_name')} className={errors.last_name ? 'border-destructive' : ''} />
            {errors.last_name && <p className="text-destructive text-xs mt-1">{errors.last_name.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-2">Address *</label>
          <Input id="address" {...register('address')} className={errors.address ? 'border-destructive' : ''} />
          {errors.address && <p className="text-destructive text-xs mt-1">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="postal_code" className="block text-sm font-medium mb-2">Postal code *</label>
            <Input id="postal_code" {...register('postal_code')} className={errors.postal_code ? 'border-destructive' : ''} />
            {errors.postal_code && <p className="text-destructive text-xs mt-1">{errors.postal_code.message}</p>}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-2">City *</label>
            <Input id="city" {...register('city')} className={errors.city ? 'border-destructive' : ''} />
            {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">Country *</label>
            <Input id="country" {...register('country')} className={errors.country ? 'border-destructive' : ''} />
            {errors.country && <p className="text-destructive text-xs mt-1">{errors.country.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone *</label>
            <Input id="phone" {...register('phone')} className={errors.phone ? 'border-destructive' : ''} />
            {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium mb-2">Mobile *</label>
            <Input id="mobile" {...register('mobile')} className={errors.mobile ? 'border-destructive' : ''} />
            {errors.mobile && <p className="text-destructive text-xs mt-1">{errors.mobile.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
          <Input id="email" type="email" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>

        {accountType === 'merchant' && (
          <>
            <h3 className="font-semibold text-sm pt-2">Merchant information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tax_number" className="block text-sm font-medium mb-2">Tax number *</label>
                <Input id="tax_number" {...register('tax_number')} className={errors.tax_number ? 'border-destructive' : ''} />
                {errors.tax_number && <p className="text-destructive text-xs mt-1">{errors.tax_number.message}</p>}
              </div>
              <div>
                <label htmlFor="vat_number" className="block text-sm font-medium mb-2">VAT number *</label>
                <Input id="vat_number" {...register('vat_number')} className={errors.vat_number ? 'border-destructive' : ''} />
                {errors.vat_number && <p className="text-destructive text-xs mt-1">{errors.vat_number.message}</p>}
              </div>
            </div>

            <h3 className="font-semibold text-sm">Delivery address</h3>
            <div>
              <label htmlFor="delivery_address" className="block text-sm font-medium mb-2">Address *</label>
              <Input id="delivery_address" {...register('delivery_address')} className={errors.delivery_address ? 'border-destructive' : ''} />
              {errors.delivery_address && <p className="text-destructive text-xs mt-1">{errors.delivery_address.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="delivery_postal_code" className="block text-sm font-medium mb-2">Postal code *</label>
                <Input id="delivery_postal_code" {...register('delivery_postal_code')} className={errors.delivery_postal_code ? 'border-destructive' : ''} />
                {errors.delivery_postal_code && <p className="text-destructive text-xs mt-1">{errors.delivery_postal_code.message}</p>}
              </div>
              <div>
                <label htmlFor="delivery_city" className="block text-sm font-medium mb-2">City *</label>
                <Input id="delivery_city" {...register('delivery_city')} className={errors.delivery_city ? 'border-destructive' : ''} />
                {errors.delivery_city && <p className="text-destructive text-xs mt-1">{errors.delivery_city.message}</p>}
              </div>
              <div>
                <label htmlFor="delivery_country" className="block text-sm font-medium mb-2">Country *</label>
                <Input id="delivery_country" {...register('delivery_country')} className={errors.delivery_country ? 'border-destructive' : ''} />
                {errors.delivery_country && <p className="text-destructive text-xs mt-1">{errors.delivery_country.message}</p>}
              </div>
            </div>

            <h3 className="font-semibold text-sm">Bank details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="account_holder" className="block text-sm font-medium mb-2">Account holder *</label>
                <Input id="account_holder" {...register('account_holder')} className={errors.account_holder ? 'border-destructive' : ''} />
                {errors.account_holder && <p className="text-destructive text-xs mt-1">{errors.account_holder.message}</p>}
              </div>
              <div>
                <label htmlFor="bank_name" className="block text-sm font-medium mb-2">Bank *</label>
                <Input id="bank_name" {...register('bank_name')} className={errors.bank_name ? 'border-destructive' : ''} />
                {errors.bank_name && <p className="text-destructive text-xs mt-1">{errors.bank_name.message}</p>}
              </div>
              <div>
                <label htmlFor="iban" className="block text-sm font-medium mb-2">IBAN *</label>
                <Input id="iban" {...register('iban')} className={errors.iban ? 'border-destructive' : ''} />
                {errors.iban && <p className="text-destructive text-xs mt-1">{errors.iban.message}</p>}
              </div>
              <div>
                <label htmlFor="bic" className="block text-sm font-medium mb-2">BIC *</label>
                <Input id="bic" {...register('bic')} className={errors.bic ? 'border-destructive' : ''} />
                {errors.bic && <p className="text-destructive text-xs mt-1">{errors.bic.message}</p>}
              </div>
            </div>
          </>
        )}

        <h3 className="font-semibold text-sm pt-2">Document uploads</h3>
        {accountType === 'merchant' && (
          <div>
            <label htmlFor="business_registration_certificate_file" className="block text-sm font-medium mb-2">Business registration certificate *</label>
            <Input
              id="business_registration_certificate_file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFiles((prev) => ({ ...prev, business_registration_certificate_file: e.target.files?.[0] || null }))}
            />
            <p className="text-xs text-muted-foreground mt-1">{fileLabel}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="id_card_file" className="block text-sm font-medium mb-2">ID card (Ausweis) *</label>
            <Input
              id="id_card_file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFiles((prev) => ({ ...prev, id_card_file: e.target.files?.[0] || null }))}
            />
            <p className="text-xs text-muted-foreground mt-1">{fileLabel}</p>
          </div>
          <div>
            <label htmlFor="passport_file" className="block text-sm font-medium mb-2">Passport *</label>
            <Input
              id="passport_file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFiles((prev) => ({ ...prev, passport_file: e.target.files?.[0] || null }))}
            />
            <p className="text-xs text-muted-foreground mt-1">{fileLabel}</p>
          </div>
        </div>

        {accountType === 'merchant' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vat_certificate_file" className="block text-sm font-medium mb-2">VAT certificate *</label>
              <Input
                id="vat_certificate_file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFiles((prev) => ({ ...prev, vat_certificate_file: e.target.files?.[0] || null }))}
              />
              <p className="text-xs text-muted-foreground mt-1">{fileLabel}</p>
            </div>
            <div>
              <label htmlFor="tax_number_certificate_file" className="block text-sm font-medium mb-2">Tax number certificate *</label>
              <Input
                id="tax_number_certificate_file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFiles((prev) => ({ ...prev, tax_number_certificate_file: e.target.files?.[0] || null }))}
              />
              <p className="text-xs text-muted-foreground mt-1">{fileLabel}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password *</label>
            <Input id="password" type="password" {...register('password')} className={errors.password ? 'border-destructive' : ''} />
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm password *</label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} className={errors.confirmPassword ? 'border-destructive' : ''} />
            {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create Account
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="text-primary font-medium hover:underline">Login</Link>
        </div>
      </form>
    </Card>
  );
}
