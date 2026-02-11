export enum CashbackStatus {
  AVAILABLE = 'Disponível',
  USED = 'Utilizado',
  EXPIRED = 'Expirado'
}

export interface Cashback {
  id: string;
  customerId: string;
  originPurchaseId: string;
  createdAt: Date;
  validUntil: Date;
  value: number;
  status: CashbackStatus;
  minPurchaseValue: number;
  usedInPurchaseId?: string;
}
