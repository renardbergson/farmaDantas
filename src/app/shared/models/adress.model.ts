export interface Address {
  id: string;
  zipCode: string;
  stateId: number;
  cityId: number;
  neighborhood: string;
  street: string;
  number?: string;
  complement?: string;
}