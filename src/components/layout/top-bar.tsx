// src/components/layout/top-bar.tsx
'use client';

import { useAuthStore } from '@/lib/stores/auth.store';
import { Bell } from 'lucide-react';

export function TopBar() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 relative">
          <Bell size={18} />
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
          {user?.email?.[0]?.toUpperCase() ?? 'U'}
        </div>
      </div>
    </header>
  );
}
