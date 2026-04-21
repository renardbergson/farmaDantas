import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cashback } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CashbackService {
  private readonly CASHBACKS_URL = `${environment.apiBaseUrl}/api/cashbacks`;

  constructor(private http: HttpClient) { }

  getCashbacks(): Observable<Cashback[]> {
    return this.http.get<Cashback[]>(this.CASHBACKS_URL);
  }

  getCashbacksByCustomer(customerId: string): Observable<Cashback[]> {
    return this.http.get<Cashback[]>(`${this.CASHBACKS_URL}?customerId=${customerId}`);
  }

  getAvailableCashbacksForCustomer(customerId: string): Observable<Cashback[]> {
    return this.http.get<Cashback[]>(
      `${this.CASHBACKS_URL}?customerId=${customerId}&activeOnly=true`,
    );
  }
}