import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  erro: boolean | null; // só existe quando o CEP não é encontrado
}
export interface State {
  id: number;
  sigla: string;
  nome: string;
}

export interface City {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root', // serviço disponível em toda a aplicação
})
export class AddressService {
  private readonly VIACEP_URL = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) { }

  getAddressByZipCode(zipCode: string): Observable<ViaCepResponse> {
    const flatZipCode = zipCode.replace(/\D/g, '');
    return this.http.get<ViaCepResponse>(`${this.VIACEP_URL}/${flatZipCode}/json/`);
  }

  getStates(): Observable<State[]> {
    const IBGE_STATES_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
    return this.http.get<State[]>(IBGE_STATES_URL)
  }

  getCities(state: State): Observable<City[]> {
    const IBGE_CITIES_URL = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.sigla}/municipios`;
    return this.http.get<City[]>(IBGE_CITIES_URL)
  }
}
