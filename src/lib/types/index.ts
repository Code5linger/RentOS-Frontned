// src/lib/types/index.ts

export type Role = 'OWNER' | 'TENANT' | 'ADMIN';

export type LeaseStatus = 'ACTIVE' | 'ENDED';
export type InvoiceStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'LATE';
export type PaymentStatus = 'INITIATED' | 'SUCCESS' | 'FAILED';
export type PaymentMethod =
  | 'CASH'
  | 'BANK_TRANSFER'
  | 'MOBILE_BANKING'
  | 'CHEQUE';

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  rentAmount: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lease {
  id: string;
  unitId: string;
  tenantId: string;
  ownerId: string;
  startDate: string;
  endDate: string | null;
  monthlyRent: string;
  billingDay: number;
  status: LeaseStatus;
  createdAt: string;
  updatedAt: string;
  // enriched (tenant view)
  unit?: { id: string; unitNumber: string; rentAmount: string };
  property?: { id: string; name: string; address: string };
}

export interface RentInvoice {
  id: string;
  leaseId: string;
  ownerId: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  totalAmount: string;
  paidAmount: string;
  remainingBalance?: string;
  dueDate: string;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  ownerId: string;
  amount: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionRef: string | null;
  createdAt: string;
  // enriched (tenant view)
  invoice?: {
    id: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    totalAmount: string;
    status: string;
  };
}

export interface InvoiceSummary {
  invoiceId: string;
  totalAmount: string;
  paidAmount: string;
  remainingBalance: string;
  status: InvoiceStatus;
  dueDate: string;
}

export interface TenantDashboard {
  activeLeaseCount: number;
  overdueInvoiceCount: number;
  pendingInvoiceCount: number;
  totalOutstanding: string;
  recentInvoices: Array<{
    id: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    totalAmount: string;
    paidAmount: string;
    remainingBalance: string;
    status: InvoiceStatus;
    dueDate: string;
  }>;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}
