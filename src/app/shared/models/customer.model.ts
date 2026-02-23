import { Person } from './person.model';
import { Cashback } from './cashback.model';
import { Purchase } from './purchase.model';

export enum CustomerStatus {
  NEW = 'novo',
  ACTIVE = 'ativo',
  ABSENT = 'ausente',
  INACTIVE = 'inativo'
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
  purchases?: Purchase[];
  cashbacks?: Cashback[];
}
