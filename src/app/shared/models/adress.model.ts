export interface AddressResponse {
  zipCode: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  cityId: number | null;
  cityName: string | null;
  stateId: number | null;
  stateName: string | null;
}

export type Address = AddressResponse;
