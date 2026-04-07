import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CashbackStatus, Cashback } from '../models';
export interface RecentCashback {
  customerName: string;
  createdAt: Date;
  expiresIn: string;
  status: CashbackStatus;
  value: number;
}
export interface MonthlyCashbackValueData {
  labels: string[];
  values: number[];
}
export interface MonthlyCashbackCountData {
  labels: string[];
  quantities: number[];
}
export interface CustomerCashbackStats {
  activeCashbackCount: number;
  activeCashbackAmount: number;
  totalCashbackEarned: number;
  totalCashbackUsed: number;
}
@Injectable({
  providedIn: 'root',
})
export class CashbackService {
  /* CONSTANTES */
  private readonly MS_PER_DAY = 1000 * 60 * 60 * 24; // 1000 ms = 1s, 60s = 1min, 60min = 1h, 24h = 1 dia
  private readonly MAX_DAYS_VALIDITY = 30;
  private readonly LAST_CASHBACKS_LIMIT = 4;

  private readonly LAST_MONTHS_COUNT = 6;
  private readonly MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  private readonly CASHBACKS_URL = 'http://localhost:8080/api/cashbacks';

  constructor(private http: HttpClient) { }

  getCashbacks(): Observable<Cashback[]> {
    return this.http.get<Cashback[]>(this.CASHBACKS_URL);
  }

  getCashbacksByCustomer(customerId: string): Observable<Cashback[]> {
    return this.http.get<Cashback[]>(`${this.CASHBACKS_URL}?customerId=${customerId}`);
  }

  getAvailableCashbacksForCustomer(customerId: string): Observable<Cashback[]> {
    return this.http.get<Cashback[]>(
      `${this.CASHBACKS_URL}?customerId=${customerId}&availableOnly=true`,
    );
  }

  /* UTILITÁRIOS */
  private formatExpiresInText(diffDays: number): string {
    if (diffDays === 0) return 'Expira hoje';
    if (diffDays === 1) return 'Expira amanhã';
    return `Expira em ${diffDays} dias`;
  }

  private getCustomerCashbackStats(cashbacks: Cashback[]): CustomerCashbackStats {
    const list = cashbacks || [];
    const active = list.filter(cb => cb.status === CashbackStatus.ACTIVE);
    const activeAmount = active.reduce((sum, cb) => sum + cb.value, 0);
    const earned = list.reduce((sum, cb) => sum + cb.value, 0);
    const used = list
      .filter(cb => cb.status === CashbackStatus.USED)
      .reduce((sum, cb) => sum + cb.value, 0);

    return {
      activeCashbackCount: active.length,
      activeCashbackAmount: activeAmount,
      totalCashbackEarned: earned,
      totalCashbackUsed: used
    } satisfies CustomerCashbackStats;
  }

  /* SERVIÇOS */
  getAllLastCashbacks(cashbacks: Cashback[]): RecentCashback[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allCashbacks = (cashbacks || [])
      .map(cb => {
        const validUntil = new Date(cb.validUntil);
        validUntil.setHours(0, 0, 0, 0);

        const diffTime = validUntil.getTime() - today.getTime(); // retorna a diferença em ms
        const diffDays = Math.ceil(diffTime / this.MS_PER_DAY); // converte ms para dias

        const isExpired = diffDays < 0 || diffDays > this.MAX_DAYS_VALIDITY;
        if (isExpired) return null;

        const expiresInText = this.formatExpiresInText(diffDays);

        return {
          customerName: cb.customerName,
          createdAt: new Date(cb.createdAt),
          expiresIn: expiresInText,
          status: cb.status,
          value: cb.value
        } satisfies RecentCashback;
      })
      .filter((cb): cb is RecentCashback => cb !== null);

    return allCashbacks
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, this.LAST_CASHBACKS_LIMIT);
  }

  getAllLastMonthsCashbackTotals(cashbacks: Cashback[]): MonthlyCashbackValueData {
    const labels: string[] = [];
    const values: number[] = [];
    const now = new Date();

    for (let i = this.LAST_MONTHS_COUNT - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();

      labels.push(this.MONTH_NAMES[month]);

      const monthTotal = (cashbacks || [])
        .filter(cb => {
          const d = new Date(cb.createdAt);
          return d.getMonth() === month && d.getFullYear() === year;
        })
        .reduce((sum, cb) => sum + cb.value, 0);

      values.push(monthTotal);
    }
    return { labels, values };
  }

  getAllLastMonthsCashbackCount(cashbacks: Cashback[]): MonthlyCashbackCountData {
    const labels: string[] = [];
    const quantities: number[] = [];
    const now = new Date();

    for (let i = this.LAST_MONTHS_COUNT - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();

      labels.push(this.MONTH_NAMES[month]);

      const monthCount = (cashbacks || []).filter(cb => {
        const d = new Date(cb.createdAt);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length;
      quantities.push(monthCount);
    }
    return { labels, quantities };
  }

  getCashbackStatsByCustomer(customers: Customer[], allCashbacks: Cashback[]): CustomerCashbackStats[] {
    return customers.map(customer => {
      const forCustomer = (allCashbacks || []).filter(cb => cb.customerName === customer.name);
      return this.getCustomerCashbackStats(forCustomer);
    });
  }
}