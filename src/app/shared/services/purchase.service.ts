import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  Purchase,
  CreatePurchaseRequest,
  CreatePurchaseResponse,
  PurchaseDetailsResponse,
} from '../models';
import { DashboardStatsService } from './dashboard-stats.service';
import { PurchasesStatsService } from './purchases-stats.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private readonly PURCHASES_URL = `${environment.apiBaseUrl}/api/purchases`;

  constructor(
    private http: HttpClient,
    private dashboardStatsService: DashboardStatsService,
    private purchasesStatsService: PurchasesStatsService
  ) { }

  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.PURCHASES_URL);
  }

  getPurchaseDetails(purchaseId: string): Observable<PurchaseDetailsResponse> {
    return this.http.get<PurchaseDetailsResponse>(`${this.PURCHASES_URL}/${purchaseId}/details`);
  }

  addPurchase(body: CreatePurchaseRequest): Observable<CreatePurchaseResponse> {
    return this.http.post<CreatePurchaseResponse>(`${this.PURCHASES_URL}/create`, body).pipe(
      tap(() => {
        this.dashboardStatsService.refreshStats();
        this.purchasesStatsService.refreshStats();
      }),
    );
  }

  deletePurchase(purchaseId: string): Observable<void> {
    return this.http.delete<void>(`${this.PURCHASES_URL}/${purchaseId}/delete`).pipe(
      tap(() => {
        this.dashboardStatsService.refreshStats();
        this.purchasesStatsService.refreshStats();
      }),
    );
  }
}