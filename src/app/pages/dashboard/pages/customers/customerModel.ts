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
  totalPurchases: number;
  totalActiveCashback: number;
  status: CustomerStatus;
}
