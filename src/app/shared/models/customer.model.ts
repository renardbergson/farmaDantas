import { Person } from './person.model';
import { Cashback } from './cashback.model';
import { Purchase } from './purchase.model';

export enum CustomerStatus {
  NEW = 'novo',
  ACTIVE = 'ativo',
  ABSENT = 'ausente',
  INACTIVE = 'inativo'
}

export interface PurchaseModeThisMonth {
  in_store: number;
  delivery: number;
}

export interface Customer {
  id: string;
  personId: string;
  person: Person;
  status: CustomerStatus;
  purchasesThisMonthCount: number;
  purchasesThisMonthAmount: number;
  activeCashbackCount: number;
  activeCashbackAmount: number;
  totalCashbackEarned: number;
  totalCashbackUsed: number;
  purchaseModeThisMonth: PurchaseModeThisMonth;
  monthlyAveragePerPurchase: number; // ticket médio de compras no mês
  purchases: Purchase[] | null;
  cashbacks: Cashback[] | null;
}
