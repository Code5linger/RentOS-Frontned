// src/lib/api/invoice.api.ts
import { apiClient } from './client';
import { RentInvoice, ApiResponse, InvoiceSummary } from '@/lib/types';

export const invoiceApi = {
  // Owner
  list: (params?: { status?: string; leaseId?: string }) =>
    apiClient.get<ApiResponse<RentInvoice[]>>('/invoices', { params }),

  get: (id: string) =>
    apiClient.get<ApiResponse<RentInvoice>>(`/invoices/${id}`),

  summary: (invoiceId: string) =>
    apiClient.get<ApiResponse<InvoiceSummary>>(
      `/payments/invoices/${invoiceId}/summary`,
    ),

  // Tenant
  myInvoices: (params?: { status?: string; leaseId?: string }) =>
    apiClient.get<ApiResponse<RentInvoice[]>>('/me/invoices', { params }),

  myInvoice: (id: string) =>
    apiClient.get<
      ApiResponse<{
        invoice: RentInvoice;
        payments: import('@/lib/types').Payment[];
      }>
    >(`/me/invoices/${id}`),
};
