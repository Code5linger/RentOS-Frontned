// src/lib/api/payment.api.ts
import { apiClient } from './client';
import { Payment, ApiResponse, TenantDashboard } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export interface InitiatePaymentPayload {
  invoiceId: string;
  amount: string;
  method: import('@/lib/types').PaymentMethod;
}

export const paymentApi = {
  // Owner
  initiate: (data: InitiatePaymentPayload) =>
    apiClient.post<ApiResponse<Payment>>('/payments', data, {
      headers: { 'Idempotency-Key': uuidv4() },
    }),

  get: (id: string) => apiClient.get<ApiResponse<Payment>>(`/payments/${id}`),

  byInvoice: (invoiceId: string) =>
    apiClient.get<ApiResponse<Payment[]>>(
      `/payments/invoices/${invoiceId}/payments`,
    ),

  // Tenant
  myPayments: () => apiClient.get<ApiResponse<Payment[]>>('/me/payments'),

  myDashboard: () =>
    apiClient.get<ApiResponse<TenantDashboard>>('/me/dashboard'),
};
