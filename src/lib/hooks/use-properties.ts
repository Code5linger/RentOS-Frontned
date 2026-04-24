// src/lib/hooks/use-properties.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyApi } from '@/lib/api/property.api';
import { toast } from 'sonner';

export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  detail: (id: string) => [...propertyKeys.all, id] as const,
  units: (id: string) => [...propertyKeys.all, id, 'units'] as const,
};

export function useProperties() {
  return useQuery({
    queryKey: propertyKeys.lists(),
    queryFn: () => propertyApi.list().then((r) => r.data.data),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertyApi.get(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useUnits(propertyId: string) {
  return useQuery({
    queryKey: propertyKeys.units(propertyId),
    queryFn: () => propertyApi.listUnits(propertyId).then((r) => r.data.data),
    enabled: !!propertyId,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: propertyApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: propertyKeys.lists() });
      toast.success('Property created');
    },
    onError: () => toast.error('Failed to create property'),
  });
}

export function useUpdateProperty(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; address?: string }) =>
      propertyApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: propertyKeys.detail(id) });
      qc.invalidateQueries({ queryKey: propertyKeys.lists() });
      toast.success('Property updated');
    },
    onError: () => toast.error('Failed to update property'),
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: propertyApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: propertyKeys.lists() });
      toast.success('Property deleted');
    },
    onError: () => toast.error('Failed to delete property'),
  });
}

export function useCreateUnit(propertyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { unitNumber: string; rentAmount: string }) =>
      propertyApi.createUnit(propertyId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: propertyKeys.units(propertyId) });
      toast.success('Unit added');
    },
    onError: () => toast.error('Failed to add unit'),
  });
}
