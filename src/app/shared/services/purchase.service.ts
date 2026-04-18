import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import {
  Purchase,
  CreatePurchaseRequest,
  CreatePurchaseResponse,
  PurchaseDetailsResponse,
  PurchaseSessionStats
} from '../models';
import { DashboardStatsService } from './dashboard-stats.service';
@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private readonly PURCHASES_URL = 'http://localhost:8080/api/purchases';

  // Criação e encapsulamento de um Subject para atualizar stats de compras
  // Abordagem automática, para que componentes que provoquem mudanças nas
  // Purchases não precisem chamar o método refreshStats() internamente,
  // assim o service ficará encarregado de tudo
  private refreshStatsSubject = new BehaviorSubject<void>(undefined);
  readonly stats$ = this.refreshStatsSubject.pipe(
    switchMap(() => this.getPurchaseSessionStats())
  );
  refreshStats() {
    this.refreshStatsSubject.next();
  }
  // =======================================================================

  constructor(
    private http: HttpClient,
    private dashboardStatsService: DashboardStatsService
  ) { }

  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.PURCHASES_URL);
  }

  getPurchasesByCustomer(customerId: string): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.PURCHASES_URL}?customerId=${customerId}`);
  }

  getPurchaseDetails(purchaseId: string): Observable<PurchaseDetailsResponse> {
    return this.http.get<PurchaseDetailsResponse>(`${this.PURCHASES_URL}/${purchaseId}/details`);
  }

  getPurchaseSessionStats(): Observable<PurchaseSessionStats> {
    return this.http.get<PurchaseSessionStats>(`${this.PURCHASES_URL}/stats`);
  }

  addPurchase(body: CreatePurchaseRequest): Observable<CreatePurchaseResponse> {
    return this.http.post<CreatePurchaseResponse>(`${this.PURCHASES_URL}/create`, body)
      .pipe(
        tap(() => {
          this.refreshStats(); // stats de compras
          this.dashboardStatsService.refreshStats(); // stats de dashboard
        })
      );
  }

  deletePurchase(purchaseId: string): Observable<void> {
    return this.http.delete<void>(`${this.PURCHASES_URL}/${purchaseId}/delete`)
      .pipe(
        tap(() => {
          this.refreshStats(); // stats de compras
          this.dashboardStatsService.refreshStats(); // stats de dashboard
        })
      );
  }
}