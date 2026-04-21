import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private readonly VIACEP_URL = environment.viaCepBaseUrl;
  private readonly IBGE_BASE_URL = environment.ibgeBaseUrl;

  constructor(private http: HttpClient) { }

  getAddressByZipCode(zipCode: string): Observable<ViaCepResponse> {
    const flatZipCode = zipCode.replace(/\D/g, '');
    return this.http.get<ViaCepResponse>(`${this.VIACEP_URL}/${flatZipCode}/json/`);
  }

  getStates(): Observable<State[]> {
    const IBGE_STATES_URL = `${this.IBGE_BASE_URL}/estados`;
    return this.http.get<State[]>(IBGE_STATES_URL);
  }

  getCities(state: State): Observable<City[]> {
    const IBGE_CITIES_URL = `${this.IBGE_BASE_URL}/estados/${state.sigla}/municipios`;
    return this.http.get<City[]>(IBGE_CITIES_URL);
  }
}
