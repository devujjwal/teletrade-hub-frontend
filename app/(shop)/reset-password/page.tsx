'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { authApi } from '@/lib/api/auth';
import { AlertCircle, ArrowLeft, CheckCircle, Lock } from 'lucide-react';

const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter')
      .regex(/[0-9]/, 'Password must include at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type TokenStatus = 'checking' | 'valid' | 'invalid';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get('token')?.trim() || '', [searchParams]);

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>('checking');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasResetSuccess, setHasResetSuccess] = useState(false);
  const [pageError, setPageError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      if (!token) {
        if (isMounted) {
          setTokenStatus('invalid');
          setPageError('Missing password reset token. Please request a new reset link.');
        }
        return;
      }

      try {
        await authApi.verifyResetPasswordToken(token);
        if (isMounted) {
          setTokenStatus('valid');
          setPageError('');
        }
      } catch (error: any) {
        if (isMounted) {
          setTokenStatus('invalid');
          setPageError(error?.message || 'This reset link is invalid or has expired.');
        }
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setTokenStatus('invalid');
      setPageError('Missing password reset token. Please request a new reset link.');
      return;
    }

    setIsSubmitting(true);
    setPageError('');

    try {
      await authApi.resetPasswordWithToken({
        token,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });
      setHasResetSuccess(true);
    } catch (error: any) {
      setPageError(error?.message || 'Unable to reset password. Please request a new reset link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <h1 className="font-display text-2xl font-bold mb-2">Verifying Link</h1>
          <p className="text-muted-foreground">Please wait while we validate your reset token.</p>
        </Card>
      </div>
    );
  }

  if (tokenStatus === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Invalid Reset Link</h1>
          <p className="text-muted-foreground mb-6">{pageError || 'This reset link is invalid or has expired.'}</p>
          <Link href="/forgot-password">
            <Button className="w-full">Request New Reset Link</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (hasResetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-7 w-7 text-success" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Password Updated</h1>
          <p className="text-muted-foreground mb-6">Your password has been reset successfully. You can now sign in with your new password.</p>
          <Link href="/login">
            <Button className="w-full">Back to Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-muted-foreground">Enter your new password to finish resetting your account.</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {pageError && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {pageError}
              </div>
            )}

            <div>
              <label htmlFor="new_password" className="block text-sm font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="new_password"
                  type="password"
                  placeholder="Enter a strong password"
                  {...register('new_password')}
                  className={`pl-10 ${errors.new_password ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.new_password && <p className="text-destructive text-xs mt-1">{errors.new_password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirm_password"
                  type="password"
                  placeholder="Re-enter your new password"
                  {...register('confirm_password')}
                  className={`pl-10 ${errors.confirm_password ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.confirm_password && <p className="text-destructive text-xs mt-1">{errors.confirm_password.message}</p>}
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Reset Password
            </Button>

            <div className="text-center text-sm">
              <Link href="/login" className="text-primary hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
