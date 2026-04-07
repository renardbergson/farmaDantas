/** Espelha {@code Cashback.CashbackStatus} serializado pela API. */
export enum CashbackStatus {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
}

/** Espelha {@code ListCashbacksResponse} da API. */
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
