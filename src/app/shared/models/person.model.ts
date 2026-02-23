export interface Person {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  state: string;
  createdAt: Date;
  // opcionais
  email?: string;
  cityId?: number;
  dateOfBirth?: Date;
}