// src/lib/hooks/use-leases.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaseApi, CreateLeasePayload } from '@/lib/api/lease.api';
import { toast } from 'sonner';

export const leaseKeys = {
  all: ['leases'] as const,
  lists: (s?: string) => [...leaseKeys.all, s] as const,
  detail: (id: string) => [...leaseKeys.all, id] as const,
  mine: ['my-leases'] as const,
};

export function useLeases(status?: string) {
  return useQuery({
    queryKey: leaseKeys.lists(status),
    queryFn: () => leaseApi.list(status).then((r) => r.data.data),
  });
}

export function useLease(id: string) {
  return useQuery({
    queryKey: leaseKeys.detail(id),
    queryFn: () => leaseApi.get(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useMyLeases() {
  return useQuery({
    queryKey: leaseKeys.mine,
    queryFn: () => leaseApi.myLeases().then((r) => r.data.data),
  });
}

export function useCreateLease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeasePayload) => leaseApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leaseKeys.lists() });
      toast.success('Lease created');
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error?.message ?? 'Failed to create lease';
      toast.error(msg);
    },
  });
}

export function useEndLease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, endDate }: { id: string; endDate?: string }) =>
      leaseApi.end(id, endDate),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leaseKeys.lists() });
      toast.success('Lease ended');
    },
    onError: () => toast.error('Failed to end lease'),
  });
}
