// src/components/auth/register-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter required')
    .regex(/[0-9]/, 'One number required'),
  role: z.enum(['OWNER', 'TENANT']),
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [apiErr, setApiErr] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'OWNER' },
  });

  const role = watch('role');

  const onSubmit = async (data: FormData) => {
    setApiErr(null);
    try {
      const res = await authApi.register(data);
      const { user, accessToken } = res.data.data;

      setAuth(user, accessToken);
      document.cookie = `rentos-role=${user.role}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
      router.replace(user.role === 'OWNER' ? '/owner' : '/tenant');
    } catch (err: any) {
      setApiErr(err?.response?.data?.error?.message ?? 'Registration failed.');
    }
  };

  return (
    <Card className="border-slate-700 bg-slate-800 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white text-xl">Create account</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {apiErr && (
            <div className="rounded-md bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              {apiErr}
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-slate-300">I am a</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['OWNER', 'TENANT'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setValue('role', r)}
                  className={`py-2.5 rounded-md text-sm font-medium transition-all border ${
                    role === r
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {r === 'OWNER' ? '🏠 Landlord' : '🔑 Tenant'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-email" className="text-slate-300">
              Email
            </Label>
            <Input
              id="reg-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-password" className="text-slate-300">
              Password
            </Label>
            <Input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
          <p className="text-sm text-slate-400 text-center">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
