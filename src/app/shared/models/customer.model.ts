import type { AddressResponse } from './adress.model';

export enum CustomerStatus {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  ABSENT = 'ABSENT',
  INACTIVE = 'INACTIVE',
}

export interface ListCustomersResponse {
  id: string;
  name: string;
  email: string | null;
  cpf: string;
  dateOfBirth?: string | null;
  createdAt: string;
  purchasesThisMonthCount: number;
  status: CustomerStatus;
  stateId: number | null;
  cityId: number | null;
}

export interface PurchaseModeThisMonth {
  in_store: number;
  delivery: number;
}

export interface PurchasesThisMonth {
  count: number;
  totalAmount: number;
  purchaseMode: PurchaseModeThisMonth;
  averageTicket: number;
}

export interface ActiveCashback {
  count: number;
  amount: number;
}

export interface CashbackLifetime {
  totalEarnedCount: number;
  totalEarnedAmount: number;
  totalUsedCount: number;
  totalUsedAmount: number;
}

export interface CustomerDetailsResponse {
  status: CustomerStatus;
  name: string;
  phone: string;
  email: string | null;
  cpf: string;
  dateOfBirth: string | null;
  age: number | null;
  createdAt: string;
  address: AddressResponse | null;
  purchasesThisMonth: PurchasesThisMonth;
  activeCashback: ActiveCashback;
  cashbackLifetime: CashbackLifetime;
}

export interface CustomersSessionStats {
  total: number;
  byStatus: Record<CustomerStatus, number>;
}

export interface CreateAddressRequest {
  zipCode?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  cityId?: number | null;
  stateId?: number | null;
}

export interface CreatePersonRequest {
  name: string;
  phone: string;
  email?: string | null;
  cpf: string;
  dateOfBirth?: string | null;
  address?: CreateAddressRequest | null;
}

export type CreateCustomerRequest = CreatePersonRequest;

export interface CreateCustomerResponse {
  status: CustomerStatus;
  name: string;
  phone: string;
  email: string | null;
  dateOfBirth: string | null;
  createdAt: string;
  address: AddressResponse | null;
}

export interface UpdateAddressPayload {
  zipCode?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  cityId?: number | null;
  stateId?: number | null;
}

export interface UpdateCustomerRequest {
  name: string;
  phone: string;
  email?: string | null;
  cpf: string;
  dateOfBirth?: string | null;
  // semântica do backend:
  // - undefined: não mexe
  // - null: remove endereço
  // - objeto: patch/cria parcial
  address?: UpdateAddressPayload | null;
}

export interface UpdateCustomerResponse {
  status: CustomerStatus;
  name: string;
  phone: string;
  email: string | null;
  cpf: string;
  dateOfBirth: string | null;
  createdAt: string;
  address: AddressResponse | null;
}

export type Customer = ListCustomersResponse;
