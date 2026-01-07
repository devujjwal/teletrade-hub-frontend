import { Metadata } from 'next';
import LoginForm from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Login | TeleTrade Hub',
  description: 'Login to your TeleTrade Hub account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Login to your account to continue shopping</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

