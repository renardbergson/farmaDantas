import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { DashboardStatsResponse } from '../models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardStatsService {
  private readonly DASHBOARD_STATS_URL = 'http://localhost:8080/api/dashboard/stats';

  private refreshStatsSubject = new BehaviorSubject<void>(undefined);

  readonly stats$ = this.refreshStatsSubject.pipe(
    switchMap(() => this.getDashboardStats()),
  );

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStatsResponse> {
    return this.http.get<DashboardStatsResponse>(this.DASHBOARD_STATS_URL);
  }

  refreshStats(): void {
    this.refreshStatsSubject.next();
  }
}
