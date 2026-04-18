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
  stateId: number;
  cityId: number;
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
  address: AddressResponse;
  purchasesThisMonth: PurchasesThisMonth;
  activeCashback: ActiveCashback;
  cashbackLifetime: CashbackLifetime;
}

export interface CustomersSessionStats {
  total: number;
  byStatus: Record<CustomerStatus, number>;
}

export interface CreateAddressRequest {
  zipCode: string;
  street: string;
  number?: string | null;
  complement?: string | null;
  neighborhood: string;
  cityId: number;
  stateId: number;
}

export interface CreatePersonRequest {
  name: string;
  phone: string;
  email?: string | null;
  cpf: string;
  dateOfBirth?: string | null;
  address: CreateAddressRequest;
}

export type CreateCustomerRequest = CreatePersonRequest;

export interface CreateCustomerResponse {
  status: CustomerStatus;
  name: string;
  phone: string;
  email: string | null;
  dateOfBirth: string | null;
  createdAt: string;
  address: AddressResponse;
}

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

export type Customer = ListCustomersResponse;
