import { Metadata } from 'next';
import RegisterForm from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Register | TeleTrade Hub',
  description: 'Create a new TeleTrade Hub account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join TeleTrade Hub and start shopping</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}

