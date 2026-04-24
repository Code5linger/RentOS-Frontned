// src/app/auth/login/page.tsx
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            RentOS
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Financial infrastructure for landlords
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
