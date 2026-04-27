import type { AddressResponse } from './adress.model';

export interface Person {
  id?: string;
  name: string;
  cpf: string;
  phone: string;
  email: string | null;
  dateOfBirth: string | null;
  address: AddressResponse | null;
  addressId?: string;
  createdAt?: string;
}
