'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/auth-store';
import { useLanguage } from '@/contexts/language-context';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Card from '@/components/ui/card';
import toast from 'react-hot-toast';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Split name into first_name and last_name
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || firstName; // Use first name as last if only one word

      const response = await authApi.register({
        first_name: firstName,
        last_name: lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      login(response.token, response.user, false);
      toast.success(t('auth.registerSuccess') || 'Account created successfully!');
      router.push('/account');
    } catch (error: any) {
      // Show specific validation errors from backend
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => {
            const fieldName = field.replace('_', ' ');
            return Array.isArray(messages) ? messages.join(', ') : messages;
          })
          .join('\n');
        toast.error(errorMessages);
      } else {
        toast.error(error.response?.data?.message || t('auth.registerFailed') || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            {t('auth.fullName') || 'Full Name'}
          </label>
          <Input
            id="name"
            type="text"
            placeholder={t('auth.fullNamePlaceholder') || 'John Doe'}
            {...register('name')}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            {t('auth.email')}
          </label>
          <Input
            id="email"
            type="email"
            placeholder={t('auth.emailPlaceholder') || 'your@email.com'}
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            {t('auth.phone') || 'Phone'} {t('common.optional') || '(Optional)'}
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder={t('auth.phonePlaceholder') || '+1 234 567 8900'}
            {...register('phone')}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            {t('auth.password')}
          </label>
          <Input
            id="password"
            type="password"
            placeholder={t('auth.passwordPlaceholder') || '••••••••'}
            {...register('password')}
            className={errors.password ? 'border-destructive' : ''}
          />
          {errors.password && (
            <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
          )}
          {!errors.password && password && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">{t('auth.passwordRequirements') || 'Password requirements:'}</p>
              <div className="flex flex-col gap-1">
                <p className={`text-xs ${password.length >= 8 ? 'text-success' : 'text-muted-foreground'}`}>
                  {password.length >= 8 ? '✓' : '○'} {t('auth.passwordMinLength') || 'At least 8 characters'}
                </p>
                <p className={`text-xs ${/[A-Z]/.test(password) ? 'text-success' : 'text-muted-foreground'}`}>
                  {/[A-Z]/.test(password) ? '✓' : '○'} {t('auth.passwordUppercase') || 'One uppercase letter'}
                </p>
                <p className={`text-xs ${/[a-z]/.test(password) ? 'text-success' : 'text-muted-foreground'}`}>
                  {/[a-z]/.test(password) ? '✓' : '○'} {t('auth.passwordLowercase') || 'One lowercase letter'}
                </p>
                <p className={`text-xs ${/[0-9]/.test(password) ? 'text-success' : 'text-muted-foreground'}`}>
                  {/[0-9]/.test(password) ? '✓' : '○'} {t('auth.passwordNumber') || 'One number'}
                </p>
                <p className={`text-xs ${/[^A-Za-z0-9]/.test(password) ? 'text-success' : 'text-muted-foreground'}`}>
                  {/[^A-Za-z0-9]/.test(password) ? '✓' : '○'} {t('auth.passwordSpecial') || 'One special character'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            {t('auth.confirmPassword')}
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder={t('auth.passwordPlaceholder') || '••••••••'}
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-destructive' : ''}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {t('auth.createAccount') || 'Create Account'}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t('auth.hasAccount')} </span>
          <Link href="/login" className="text-primary font-medium hover:underline">
            {t('auth.login')}
          </Link>
        </div>
      </form>
    </Card>
  );
}
