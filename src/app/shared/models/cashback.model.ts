export enum CashbackStatus {
  ACTIVE = 'Ativo',
  USED = 'Utilizado',
  EXPIRED = 'Expirado'
}

export interface Cashback {
  id: string;
  value: number;
  customerId: string;
  customerName: string;
  createdAt: Date;
  validUntil: Date;
  timeLeft: string;
  originPurchaseId: string;
  status: CashbackStatus;
  minPurchaseValue: number;
  usedInPurchaseId: string | null;
}
