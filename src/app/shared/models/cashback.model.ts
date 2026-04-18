export enum CashbackStatus {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
}

export interface ListCashbacksResponse {
  id: string;
  status: CashbackStatus;
  value: number;
  minPurchaseValue: number;
  customerName: string;
  originPurchaseId: string;
  usedInPurchaseId: string | null;
  createdAt: string;
  validUntil: string;
}

export type Cashback = ListCashbacksResponse;
