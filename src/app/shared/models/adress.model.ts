/** Espelha {@code AddressResponse} da API. */
export interface AddressResponse {
  zipCode: string;
  street: string;
  number: string | null;
  complement: string | null;
  neighborhood: string;
  cityId: number;
  cityName: string;
  stateId: number;
  stateName: string;
}

export type Address = AddressResponse;
