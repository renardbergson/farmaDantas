export interface Address {
  id: string;
  zipCode: string;
  stateId: number;
  stateName: string;
  cityId: number;
  cityName: string;
  neighborhood: string;
  street: string;
  number: string | null;
  complement: string | null;
}