import { Address } from "./adress.model";
export interface Person {
  id: string;
  addressId: string;
  name: string;
  cpf: string;
  phone: string;
  address: Address;
  createdAt: Date;
  // opcionais (valor ou null)
  email: string | null;
  dateOfBirth: Date | null;
}