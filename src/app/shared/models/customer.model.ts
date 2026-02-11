import {Cashback} from './cashback.model';
import {Purchase} from './purchase.model';

export enum CustomerStatus {
  NEW = 'novo',
  ACTIVE = 'ativo',
  ABSENT = 'ausente',
  INACTIVE = 'inativo'
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  city: string,
  state: string;
  createdAt: Date;
  dateOfBirth: Date;
  purchasesCount: number;
  totalActiveCashback: number;
  totalCashbackValueGenerated: number;
  cashbacks?: Cashback[];
  purchases?: Purchase[];
  status: CustomerStatus;
}
