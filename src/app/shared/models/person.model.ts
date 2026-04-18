import type { AddressResponse } from './adress.model';

export interface Person {
  name: string;
  cpf: string;
  phone: string;
  email: string | null;
  dateOfBirth: string | null;
  address: AddressResponse;
  id?: string;
  addressId?: string;
  createdAt?: string;
}
