import type { CashbackStatus } from './cashback.model';

export enum PurchaseMode {
  IN_STORE = 'IN_STORE',
  DELIVERY = 'DELIVERY',
}

export enum PaymentMethod {
  CASH = 'CASH',
  PIX = 'PIX',
  DEBIT_CARD = 'DEBIT_CARD',
  CREDIT_CARD = 'CREDIT_CARD',
  OTHER = 'OTHER',
}

export enum PurchaseCategory {
  ANTIBIOTIC = 'ANTIBIOTIC',
  CONTRACEPTIVE = 'CONTRACEPTIVE',
  CONTINUOUS = 'CONTINUOUS',
  CONTROLLED = 'CONTROLLED',
  KIDS = 'KIDS',
  SUPPLEMENTS = 'SUPPLEMENTS',
  ELDERLY = 'ELDERLY',
}

export interface CreatePurchaseRequest {
  customerId: string;
  userId: string;
  mode: PurchaseMode;
  date: string;
  category: PurchaseCategory;
  paymentMethods: PaymentMethod[];
  totalValue: number;
  finalValue: number;
  generateCashback: boolean;
  cashbackValidityDays?: number | null;
  cashbackGenerationRate?: number | null;
  cashbackRedemptionRate?: number | null;
  observations?: string | null;
  usedCashbackId?: string | null;
}

export interface GeneratedCashbackInfo {
  id: string;
  value: number;
  minPurchaseValue: number;
  validUntil: string;
  status: CashbackStatus;
}

export interface UsedCashbackInfo {
  id: string;
  status: CashbackStatus;
}

export interface CreatePurchaseResponse {
  id: string;
  customerName: string;
  userName: string;
  category: PurchaseCategory;
  date: string;
  totalValue: number;
  finalValue: number;
  paymentMethods: PaymentMethod[];
  mode: PurchaseMode;
  observations: string | null;
  generatedCashbackInfo: GeneratedCashbackInfo | null;
  usedCashbackInfo: UsedCashbackInfo | null;
}

export interface ListPurchasesResponse {
  id: string;
  customerName: string;
  userName: string;
  category: PurchaseCategory;
  date: string;
  totalValue: number;
  finalValue: number;
  paymentMethods: PaymentMethod[];
  mode: PurchaseMode;
}

export interface PurchaseDetailsResponse {
  id: string;
  customerName: string;
  userName: string;
  date: string;
  category: PurchaseCategory;
  mode: PurchaseMode;
  paymentMethods: PaymentMethod[];
  totalValue: number;
  finalValue: number;
  observations: string | null;
  cashbackGenerationRate: number | null;
  generatedCashbackValue: number | null;
  redeemedCashbackValue: number | null;
}

export interface PurchaseSessionStats {
  purchasesThisMonth: number;
  purchasesAmountThisMonth: number;
  purchasesToday: number;
  purchasesAmountToday: number;
}

export type Purchase = ListPurchasesResponse;