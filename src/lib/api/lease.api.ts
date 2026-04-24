// src/lib/api/lease.api.ts
import { apiClient } from './client';
import { Lease, ApiResponse } from '@/lib/types';

export interface CreateLeasePayload {
  unitId: string;
  tenantId: string;
  startDate: string;
  endDate?: string;
  monthlyRent: string;
  billingDay: number;
}

export const leaseApi = {
  list: (status?: string) =>
    apiClient.get<ApiResponse<Lease[]>>('/leases', {
      params: status ? { status } : undefined,
    }),

  get: (id: string) => apiClient.get<ApiResponse<Lease>>(`/leases/${id}`),

  create: (data: CreateLeasePayload) =>
    apiClient.post<ApiResponse<Lease>>('/leases', data),

  end: (id: string, endDate?: string) =>
    apiClient.patch<ApiResponse<Lease>>(`/leases/${id}/end`, { endDate }),

  // Tenant
  myLeases: () => apiClient.get<ApiResponse<Lease[]>>('/me/leases'),

  myLease: (id: string) =>
    apiClient.get<ApiResponse<Lease>>(`/me/leases/${id}`),
};
