export enum CustomerStatus {
  ACTIVE = 'ativo',
  INACTIVE = 'inativo'
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  totalPurchases: number;
  totalActiveCashback: number;
  status: CustomerStatus;
}
