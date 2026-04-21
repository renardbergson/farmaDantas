import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { CustomersSessionStats } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomersStatsService {
  private readonly CUSTOMERS_STATS_URL = `${environment.apiBaseUrl}/api/customers/stats`;

  private refreshStatsSubject = new BehaviorSubject<void>(undefined);

  readonly stats$ = this.refreshStatsSubject.pipe(
    switchMap(() => this.getCustomersStats()),
  );

  constructor(private http: HttpClient) { }

  getCustomersStats(): Observable<CustomersSessionStats> {
    return this.http.get<CustomersSessionStats>(this.CUSTOMERS_STATS_URL);
  }

  refreshStats(): void {
    this.refreshStatsSubject.next();
  }
}
