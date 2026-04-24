// src/app/auth/register/page.tsx
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            RentOS
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Create your account
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
