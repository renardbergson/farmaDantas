import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';

export interface City {
  nome: string;
}

@Injectable({
  providedIn: 'root', // serviço disponível em toda a aplicação
})
export class AddressService {
  private readonly IBGE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/PB/municipios';

  constructor(private http: HttpClient) {}

  getCities(): Observable<string[]> {
    return this.http.get<City[]>(this.IBGE_URL).pipe(
      map(cities => cities.map(city => city.nome).sort())
    )
  }
}
