// src/app/tenant/page.tsx
'use client';

import { useMyDashboard } from '@/lib/hooks/use-invoices';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatMoney } from '@/lib/utils/money';
import { formatDate } from '@/lib/utils/date';
import { AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth.store';

export default function TenantDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useMyDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 size={28} className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-8 pb-4 space-y-5 max-w-lg mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Hi, {user?.email?.split('@')[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm">Here's your rental summary</p>
      </div>

      {/* Outstanding card */}
      <div
        className={`rounded-2xl p-5 text-white ${
          (data?.overdueInvoiceCount ?? 0) > 0
            ? 'bg-gradient-to-br from-red-600 to-red-700'
            : 'bg-gradient-to-br from-blue-600 to-blue-700'
        }`}
      >
        <p className="text-sm opacity-80">Total outstanding</p>
        <p className="text-4xl font-bold mt-1">
          {formatMoney(data?.totalOutstanding ?? '0')}
        </p>
        <div className="flex gap-4 mt-4 text-sm">
          <span className="flex items-center gap-1.5 opacity-90">
            <AlertCircle size={14} />
            {data?.overdueInvoiceCount ?? 0} overdue
          </span>
          <span className="flex items-center gap-1.5 opacity-90">
            <Clock size={14} />
            {data?.pendingInvoiceCount ?? 0} pending
          </span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Active leases</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {data?.activeLeaseCount ?? 0}
          </p>
        </div>
        <Link
          href="/tenant/invoices"
          className="bg-white rounded-xl border border-slate-200 p-4 block hover:border-blue-300 transition-colors"
        >
          <p className="text-xs text-slate-500">View all invoices</p>
          <p className="text-sm font-semibold text-blue-600 mt-1">
            {data?.recentInvoices?.length ?? 0} recent →
          </p>
        </Link>
      </div>

      {/* Recent invoices */}
      {data?.recentInvoices && data.recentInvoices.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="font-semibold text-sm text-slate-800">
              Recent invoices
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recentInvoices.map((inv) => (
              <Link
                key={inv.id}
                href={`/tenant/invoices/${inv.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {formatDate(inv.billingPeriodStart)}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Due {formatDate(inv.dueDate)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-slate-900">
                    {formatMoney(inv.totalAmount)}
                  </span>
                  <StatusBadge status={inv.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
