'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  legalAcceptance: z.literal(true, {
    errorMap: () => ({
      message:
        'Please confirm that you accept the Terms & Conditions and the General Terms and Conditions of processing personal data.',
    }),
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data.email, data.password);
      login(response.token, response.user, false);
      toast.success(t('auth.loginSuccess') || 'Login successful!');
      
      // Respect redirect query parameter if present
      const redirect = searchParams.get('redirect');
      if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
        router.push(redirect);
      } else {
        router.push('/account');
      }
    } catch (error: any) {
      toast.error(error.message || t('auth.loginFailed') || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-input" />
            <span className="text-sm">{t('auth.rememberMe') || 'Remember me'}</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              {...register('legalAcceptance')}
              className="mt-1 rounded border-input"
            />
            <span className="text-sm leading-6 text-slate-700">
              By logging in, I confirm that I have read and accept the{' '}
              <Link href="/terms" className="font-medium text-primary hover:underline">
                Terms &amp; Conditions
              </Link>{' '}
              and the{' '}
              <Link href="/personal-data-processing" className="font-medium text-primary hover:underline">
                General Terms and Conditions of processing personal data
              </Link>
              . Details about site cookies are available in the{' '}
              <Link href="/cookies" className="font-medium text-primary hover:underline">
                Cookie Policy
              </Link>
              .
            </span>
          </label>
          {errors.legalAcceptance && (
            <p className="mt-2 text-xs text-destructive">{errors.legalAcceptance.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {t('auth.login')}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t('auth.noAccount')} </span>
          <Link href="/register" className="text-primary font-medium hover:underline">
            {t('auth.register')}
          </Link>
        </div>
      </form>
    </Card>
  );
}
