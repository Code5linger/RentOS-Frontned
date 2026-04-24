// src/app/owner/page.tsx
'use client';

import { useLeases } from '@/lib/hooks/use-leases';
import { useInvoices } from '@/lib/hooks/use-invoices';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatMoney, formatMoneyCompact } from '@/lib/utils/money';
import { formatDate } from '@/lib/utils/date';
import {
  Building2,
  KeyRound,
  FileText,
  TrendingUp,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

export default function OwnerDashboard() {
  const { data: leases, isLoading: loadingLeases } = useLeases('ACTIVE');
  const { data: invoices, isLoading: loadingInvoices } = useInvoices();

  const loading = loadingLeases || loadingInvoices;

  const overdueInvoices = invoices?.filter((i) => i.status === 'LATE') ?? [];
  const pendingInvoices =
    invoices?.filter((i) => i.status === 'PENDING' || i.status === 'PARTIAL') ??
    [];

  const totalOutstanding = pendingInvoices.reduce(
    (sum, inv) =>
      sum + parseFloat(inv.totalAmount) - parseFloat(inv.paidAmount),
    0,
  );

  const stats = [
    {
      label: 'Active leases',
      value: leases?.length ?? 0,
      icon: KeyRound,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Outstanding',
      value: formatMoneyCompact(totalOutstanding),
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Overdue',
      value: overdueInvoices.length,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'Total invoices',
      value: invoices?.length ?? 0,
      icon: FileText,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Overview of your portfolio
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
          >
            <div
              className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}
            >
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Overdue alert */}
      {overdueInvoices.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              {overdueInvoices.length} overdue invoice
              {overdueInvoices.length > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-red-600 mt-0.5">
              Collect outstanding rent to keep records accurate.
            </p>
          </div>
          <Link
            href="/owner/invoices?status=LATE"
            className="ml-auto text-xs font-medium text-red-700 underline shrink-0"
          >
            View all
          </Link>
        </div>
      )}

      {/* Recent invoices */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Recent invoices</h2>
          <Link
            href="/owner/invoices"
            className="text-sm text-blue-600 hover:underline"
          >
            View all
          </Link>
        </div>

        {invoices && invoices.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {invoices.slice(0, 6).map((inv) => (
              <Link
                key={inv.id}
                href={`/owner/invoices/${inv.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {formatDate(inv.billingPeriodStart)} –{' '}
                    {formatDate(inv.billingPeriodEnd)}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Due {formatDate(inv.dueDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">
                    {formatMoney(inv.totalAmount)}
                  </span>
                  <StatusBadge status={inv.status} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 px-5 py-8 text-center">
            No invoices yet
          </p>
        )}
      </div>
    </div>
  );
}
