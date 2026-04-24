// src/lib/api/property.api.ts
import { apiClient } from './client';
import { Property, Unit, ApiResponse } from '@/lib/types';

export const propertyApi = {
  list: () => apiClient.get<ApiResponse<Property[]>>('/properties'),

  get: (id: string) =>
    apiClient.get<ApiResponse<Property>>(`/properties/${id}`),

  create: (data: { name: string; address: string }) =>
    apiClient.post<ApiResponse<Property>>('/properties', data),

  update: (id: string, data: { name?: string; address?: string }) =>
    apiClient.patch<ApiResponse<Property>>(`/properties/${id}`, data),

  delete: (id: string) => apiClient.delete(`/properties/${id}`),

  // Units
  createUnit: (
    propertyId: string,
    data: { unitNumber: string; rentAmount: string },
  ) =>
    apiClient.post<ApiResponse<Unit>>(`/properties/${propertyId}/units`, data),

  deleteUnit: (propertyId: string, unitId: string) =>
    apiClient.delete(`/properties/${propertyId}/units/${unitId}`),

  listUnits: (propertyId: string) =>
    apiClient.get<ApiResponse<Unit[]>>(`/properties/${propertyId}/units`),
};
