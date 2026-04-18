import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { PurchaseSessionStats } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PurchasesStatsService {
  private readonly PURCHASES_STATS_URL = 'http://localhost:8080/api/purchases/stats';

  private refreshStatsSubject = new BehaviorSubject<void>(undefined);

  readonly stats$ = this.refreshStatsSubject.pipe(
    switchMap(() => this.getPurchasesStats()),
  );

  constructor(private http: HttpClient) { }

  getPurchasesStats(): Observable<PurchaseSessionStats> {
    return this.http.get<PurchaseSessionStats>(this.PURCHASES_STATS_URL);
  }

  refreshStats(): void {
    this.refreshStatsSubject.next();
  }
}
