// src/components/shared/status-badge.tsx
import { cn } from '@/lib/utils/cn';
import type { InvoiceStatus, LeaseStatus, PaymentStatus } from '@/lib/types';

type Status = InvoiceStatus | LeaseStatus | PaymentStatus;

const config: Record<Status, { label: string; classes: string }> = {
  PENDING: {
    label: 'Pending',
    classes: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  PARTIAL: {
    label: 'Partial',
    classes: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  PAID: {
    label: 'Paid',
    classes: 'bg-green-100 text-green-800 border-green-200',
  },
  LATE: { label: 'Overdue', classes: 'bg-red-100 text-red-800 border-red-200' },
  ACTIVE: {
    label: 'Active',
    classes: 'bg-green-100 text-green-800 border-green-200',
  },
  ENDED: {
    label: 'Ended',
    classes: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  INITIATED: {
    label: 'Processing',
    classes: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  SUCCESS: {
    label: 'Success',
    classes: 'bg-green-100 text-green-800 border-green-200',
  },
  FAILED: {
    label: 'Failed',
    classes: 'bg-red-100 text-red-800 border-red-200',
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, classes } = config[status] ?? {
    label: status,
    classes: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        classes,
      )}
    >
      {label}
    </span>
  );
}
