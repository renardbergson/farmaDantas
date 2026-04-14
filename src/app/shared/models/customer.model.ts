import type { AddressResponse } from './adress.model';

export enum CustomerStatus {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  ABSENT = 'ABSENT',
  INACTIVE = 'INACTIVE',
}

/** Espelha {@code ListCustomersResponse} da API. */
export interface ListCustomersResponse {
  id: string;
  name: string;
  email: string | null;
  cpf: string;
  dateOfBirth?: string | null;
  createdAt: string;
  purchasesThisMonthCount: number;
  status: CustomerStatus;
  stateId: number;
  cityId: number;
}

export interface PurchaseModeThisMonth {
  in_store: number;
  delivery: number;
}

/** Espelha {@code CustomerDetailsResponse.PurchasesThisMonth} da API. */
export interface PurchasesThisMonth {
  count: number;
  totalAmount: number;
  purchaseMode: PurchaseModeThisMonth;
  averageTicket: number;
}

/** Espelha {@code CustomerDetailsResponse.ActiveCashback} da API. */
export interface ActiveCashback {
  count: number;
  amount: number;
}

/** Espelha {@code CustomerDetailsResponse.CashbackLifetime} da API. */
export interface CashbackLifetime {
  totalEarnedCount: number;
  totalEarnedAmount: number;
  totalUsedCount: number;
  totalUsedAmount: number;
}

/** Espelha {@code CustomerDetailsResponse} da API. */
export interface CustomerDetailsResponse {
  status: CustomerStatus;
  name: string;
  phone: string;
  email: string | null;
  cpf: string;
  dateOfBirth: string | null;
  age: number | null;
  createdAt: string;
  address: AddressResponse;
  purchasesThisMonth: PurchasesThisMonth;
  activeCashback: ActiveCashback;
  cashbackLifetime: CashbackLifetime;
}

/** Espelha {@code CustomerStatsResponse} da API (GET /api/customers/stats). */
export interface CustomersSessionStats {
  total: number;
  byStatus: Record<CustomerStatus, number>;
}

/** Espelha {@code CreateAddressRequest} da API. */
export interface CreateAddressRequest {
  zipCode: string;
  street: string;
  number?: string | null;
  complement?: string | null;
  neighborhood: string;
  cityId: number;
  stateId: number;
}

/** Espelha {@code CreatePersonRequest} da API. */
export interface CreatePersonRequest {
  name: string;
  phone: string;
  email?: string | null;
  cpf: string;
  dateOfBirth?: string | null;
  address: CreateAddressRequest;
}

/**
 * Corpo JSON de criação de cliente: {@code CreateCustomerRequest} com {@code person} desempacotado (JsonUnwrapped).
 */
export type CreateCustomerRequest = CreatePersonRequest;

/** Espelha {@code CreateCustomerResponse} da API. */
export interface CreateCustomerResponse {
  status: CustomerStatus;
  name: string;
  phone: string;
  email: string | null;
  dateOfBirth: string | null;
  createdAt: string;
  address: AddressResponse;
}

/** Espelha {@code UpdateCustomerResponse} da API. */
export interface UpdateCustomerResponse {
  status: CustomerStatus;
  name: string;
  phone: string;
  email: string | null;
  cpf: string;
  dateOfBirth: string | null;
  createdAt: string;
  address: AddressResponse;
}

/** Linha de listagem de clientes na API. */
export type Customer = ListCustomersResponse;
