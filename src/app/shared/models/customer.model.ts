import {Cashback} from './cashback.model';
import {Purchase} from './purchase.model';

export enum CustomerStatus {
  NEW = 'novo',
  ACTIVE = 'ativo',
  ABSENT = 'ausente',
  INACTIVE = 'inativo'
}

export interface Customer {
  // obrigatórios
  id: string;
  status: CustomerStatus;
  name: string;
  cpf: string;
  phone: string;
  state: string;
  createdAt: Date;
  purchasesCount: number;
  totalActiveCashback: number;
  totalCashbackValueGenerated: number;
  // opcionais
  email?: string;
  city?: string,
  dateOfBirth?: Date;
  cashbacks?: Cashback[];
  purchases?: Purchase[];
}
