// src/lib/hooks/use-invoices.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceApi } from '@/lib/api/invoice.api';
import { paymentApi } from '@/lib/api/payment.api';
import { toast } from 'sonner';
import type { InitiatePaymentPayload } from '@/lib/api/payment.api';

export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: (p?: object) => [...invoiceKeys.all, p] as const,
  detail: (id: string) => [...invoiceKeys.all, id] as const,
  mine: ['my-invoices'] as const,
  myList: (p?: object) => [...invoiceKeys.mine, p] as const,
};

export function useInvoices(params?: { status?: string; leaseId?: string }) {
  return useQuery({
    queryKey: invoiceKeys.lists(params),
    queryFn: () => invoiceApi.list(params).then((r) => r.data.data),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: () => invoiceApi.get(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useMyInvoices(params?: { status?: string }) {
  return useQuery({
    queryKey: invoiceKeys.myList(params),
    queryFn: () => invoiceApi.myInvoices(params).then((r) => r.data.data),
  });
}

export function useMyInvoiceDetail(id: string) {
  return useQuery({
    queryKey: [...invoiceKeys.mine, id],
    queryFn: () => invoiceApi.myInvoice(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useInitiatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InitiatePaymentPayload) => paymentApi.initiate(data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: invoiceKeys.detail(vars.invoiceId) });
      qc.invalidateQueries({ queryKey: invoiceKeys.lists() });
      toast.success('Payment recorded successfully');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error?.message ?? 'Payment failed';
      toast.error(msg);
    },
  });
}

export function useMyDashboard() {
  return useQuery({
    queryKey: ['tenant-dashboard'],
    queryFn: () => paymentApi.myDashboard().then((r) => r.data.data),
  });
}
