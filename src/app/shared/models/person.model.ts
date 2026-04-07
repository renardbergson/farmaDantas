import type { AddressResponse } from './adress.model';

/**
 * Modelo usado na UI e em mocks; payloads de criação/atualização alinhados à API
 * estão em {@link CreatePersonRequest} / tipos com JsonUnwrapped.
 */
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
