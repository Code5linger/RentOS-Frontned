// src/components/layout/tenant-bottom-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  KeyRound,
  FileText,
  CreditCard,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/stores/auth.store';
import { authApi } from '@/lib/api/auth.api';

const NAV = [
  { href: '/tenant', label: 'Home', icon: LayoutDashboard },
  { href: '/tenant/leases', label: 'Lease', icon: KeyRound },
  { href: '/tenant/invoices', label: 'Invoices', icon: FileText },
  { href: '/tenant/payments', label: 'Payments', icon: CreditCard },
];

export function TenantBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    clearAuth();
    document.cookie = 'rentos-role=; path=/; max-age=0';
    router.replace('/auth/login');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 safe-area-pb">
      <div className="flex items-stretch h-16">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== '/tenant' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
                active ? 'text-blue-600' : 'text-slate-500',
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}

        {/* Logout as last item */}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-slate-500"
        >
          <LogOut size={20} strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </nav>
  );
}
