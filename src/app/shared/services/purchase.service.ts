import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Customer,
  Cashback,
  PurchasesStats,
  Purchase,
  PurchaseMode,
  PurchaseModeThisMonth,
  CreatePurchaseRequest,
  CreatePurchaseResponse,
  PurchaseDetailsResponse,
} from '../models';
import { getInitials } from '../utils/getInitials';
import type { CustomerCashbackStats } from './cashback.service';
export interface TopCustomer {
  name: string;
  avatar: string;
  purchases: number;
  totalInCashback: number;
}
@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private readonly PURCHASES_URL = 'http://localhost:8080/api/purchases';

  constructor(private http: HttpClient) { }

  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.PURCHASES_URL);
  }

  getPurchasesByCustomer(customerId: string): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.PURCHASES_URL}?customerId=${customerId}`);
  }

  getPurchaseDetails(purchaseId: string): Observable<PurchaseDetailsResponse> {
    return this.http.get<PurchaseDetailsResponse>(`${this.PURCHASES_URL}/${purchaseId}/details`);
  }

  addPurchase(body: CreatePurchaseRequest): Observable<CreatePurchaseResponse> {
    return this.http.post<CreatePurchaseResponse>(`${this.PURCHASES_URL}/create`, body);
  }

  deletePurchase(purchaseId: string): Observable<void> {
    return this.http.delete<void>(`${this.PURCHASES_URL}/${purchaseId}/delete`);
  }

  /* UTILITÁRIOS */
  private getCustomerPurchaseStats(purchases: Purchase[]): {
    count: number;
    amount: number;
    purchaseModeThisMonth: PurchaseModeThisMonth;
    monthlyAveragePerPurchase: number;
  } {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const purchasesThisMonth = purchases.filter(p => {
      const date = new Date(p.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const count = purchasesThisMonth.length;
    const amount = purchasesThisMonth.reduce((sum, p) => sum + p.finalValue, 0);
    const purchaseModeThisMonth: PurchaseModeThisMonth = {
      in_store: purchasesThisMonth.filter(p => p.mode === PurchaseMode.IN_STORE).length,
      delivery: purchasesThisMonth.filter(p => p.mode === PurchaseMode.DELIVERY).length
    };
    const monthlyAveragePerPurchase = count > 0 ? amount / count : 0;

    return {
      count,
      amount,
      purchaseModeThisMonth,
      monthlyAveragePerPurchase
    };
  }

  private purchasesForCustomer(customer: Customer, allPurchases: Purchase[]): Purchase[] {
    return (allPurchases || []).filter(p => p.customerName === customer.name);
  }

  private cashbacksForCustomer(customer: Customer, allCashbacks: Cashback[]): Cashback[] {
    return (allCashbacks || []).filter(cb => cb.customerName === customer.name);
  }

  /* SERVIÇOS */
  /**
   * Retorna estatísticas consolidadas de compras, cashbacks e taxa de retorno de TODOS os clientes.
   *
   * NÃO é necessário passar clientes “enriquecidos” com arrays aninhados: usa as listas já vindas da API
   * (`CustomerService.getCustomers()`, `getPurchases()`, `CashbackService.getCashbacks()`) e cruza por nome
   * (`customer.name` ↔ `customerName` em compras/cashbacks). Quando a API passar `customerId` nas listas,
   * este cruzamento pode ser trocado por ID.
   *
   * Dados utilizados por cliente:
   * - `customer.createdAt` (listagem de clientes)
   * - compras filtradas por `customerName`
   * - cashbacks filtrados por `customerName`
   *
   * COMO FUNCIONA:
   *
   * 1. Normalização de datas
   *    Para comparar datas, normalizamos para "a data à meia-noite" (setHours(0,0,0,0)),
   *    assim apenas o dia é considerado, ignorando hora, minuto e segundo.
   *
   * 2. Datas de referência
   *    - currentMonth: primeiro dia do mês atual (new Date(ano, mês, 1))
   *    - lastMonth: primeiro dia do mês anterior (mês - 1; quando negativo, JS ajusta para o ano anterior)
   *    - nextMonth: primeiro dia do mês seguinte
   *
   * 3. Taxa de retorno mensal
   *    - customersWithPurchases: clientes que compraram ao menos 1x no período
   *    - returningCustomers: clientes que compraram mais de 1x no período
   *    - Taxa = returningCustomers / customersWithPurchases
   *
   * 4. Variação vs mês anterior
   *    - Deltas em contagem: newCustomersChange, purchasesChange, activeCashbacksChange, returningCustomersChange
   *
   * @param customers Array de clientes (obtido via CustomerService.getCustomers())
   * @param purchases Array de compras (obtido via PurchaseService.getPurchases())
   * @param cashbacks Array de cashbacks (obtido via CashbackService.getCashbacks())
   * @returns Estatísticas para os cards do dashboard
   * @example
   * forkJoin({
   *   customers: this.customerService.getCustomers(),
   *   purchases: this.purchaseService.getPurchases(),
   *   cashbacks: this.cashbackService.getCashbacks()
   * }).subscribe(({ customers, purchases, cashbacks }) => {
   *   this.stats = this.purchaseService.getAllPurchaseStats(customers, purchases, cashbacks);
   * });
   */
  getAllPurchaseStats(customers: Customer[], purchases: Purchase[], cashbacks: Cashback[]): PurchasesStats {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    // Customers
    let newCustomersToday = 0;
    let newCustomersThisMonth = 0;
    let newCustomersLastMonth = 0;
    let customersWithPurchasesLastMonth = 0;
    let customersWithPurchasesThisMonth = 0;

    // Purchases
    let purchasesToday = 0;
    let purchasesAmountToday = 0;
    let purchasesThisMonth = 0;
    let purchasesLastMonth = 0;
    let purchasesAmountThisMonth = 0;

    // Cashbacks
    let activeCashbacks = 0;
    let activeCashbacksAmount = 0;
    let activeCashbacksLastMonth = 0;
    let activeCashbacksThisMonth = 0;

    // Returning rate
    let returningCustomersThisMonth = 0;
    let returningCustomersLastMonth = 0;

    customers.forEach(ct => {
      const createdAt = new Date(ct.createdAt);
      createdAt.setHours(0, 0, 0, 0);

      // --------------------
      // CARD 1: CLIENTES
      // --------------------
      if (createdAt.getTime() === today.getTime()) newCustomersToday++;
      if (createdAt >= currentMonth && createdAt < nextMonth) newCustomersThisMonth++;
      if (createdAt >= lastMonth && createdAt < currentMonth) newCustomersLastMonth++;

      // --------------------
      // CARD 2: PURCHASES
      // --------------------
      const custPurchases = this.purchasesForCustomer(ct, purchases);
      custPurchases.forEach(p => {
        const purchaseDate = new Date(p.date);
        purchaseDate.setHours(0, 0, 0, 0);
        if (purchaseDate.getTime() === today.getTime()) {
          purchasesToday++;
          purchasesAmountToday += p.finalValue;
        }
        if (purchaseDate >= currentMonth && purchaseDate < nextMonth) {
          purchasesThisMonth++;
          purchasesAmountThisMonth += p.finalValue;
        }
        if (purchaseDate >= lastMonth && purchaseDate < currentMonth) purchasesLastMonth++;
      });

      // --------------------
      // CARD 3: CASHBACKS
      // --------------------
      const custCashbacks = this.cashbacksForCustomer(ct, cashbacks);
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      custCashbacks.forEach(cb => {
        const cashbackCreatedAt = new Date(cb.createdAt);
        const validUntil = new Date(cb.validUntil);
        validUntil.setHours(0, 0, 0, 0);
        const diffTime = validUntil.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / MS_PER_DAY);
        const isExpired = diffDays < 0 || diffDays > 30;
        if (!isExpired) {
          activeCashbacks++;
          activeCashbacksAmount += cb.value;
          if (cashbackCreatedAt >= lastMonth && cashbackCreatedAt < currentMonth) activeCashbacksLastMonth++;
          if (cashbackCreatedAt >= currentMonth && cashbackCreatedAt < nextMonth) activeCashbacksThisMonth++;
        }
      });

      // ------------------------------
      // CARD 4: TAXA DE RETORNO MENSAL
      // ------------------------------
      let purchasesCountThisMonth = 0;
      let purchasesCountLastMonth = 0;

      custPurchases.forEach(p => {
        const purchaseDate = new Date(p.date);
        if (purchaseDate >= currentMonth && purchaseDate < nextMonth) purchasesCountThisMonth++;
        if (purchaseDate >= lastMonth && purchaseDate < currentMonth) purchasesCountLastMonth++;
      });

      if (purchasesCountThisMonth > 0) {
        customersWithPurchasesThisMonth++;
      }
      if (purchasesCountLastMonth > 0) {
        customersWithPurchasesLastMonth++;
      }
      if (purchasesCountThisMonth > 1) {
        returningCustomersThisMonth++;
      }
      if (purchasesCountLastMonth > 1) {
        returningCustomersLastMonth++;
      }
    });

    // --------------------
    // VARIAÇÕES (DELTAS) VS MÊS ANTERIOR
    // --------------------
    const newCustomersChange = newCustomersThisMonth - newCustomersLastMonth;
    const purchasesChange = purchasesThisMonth - purchasesLastMonth;
    const activeCashbacksChange = activeCashbacksThisMonth - activeCashbacksLastMonth;
    const returningCustomersChange = returningCustomersThisMonth - returningCustomersLastMonth;

    const returnRateThisMonth = customersWithPurchasesThisMonth > 0
      ? (returningCustomersThisMonth / customersWithPurchasesThisMonth) : 0;

    return {
      totalCustomers: customers.length,
      newCustomersToday,
      newCustomersChange,
      purchasesToday,
      purchasesAmountToday,
      purchasesThisMonth,
      purchasesAmountThisMonth,
      purchasesChange,
      activeCashbacks,
      activeCashbacksAmount,
      activeCashbacksChange,
      returnRateThisMonth,
      returningCustomersChange
    } satisfies PurchasesStats;
  }

  getPurchaseStatsByCustomer(customers: Customer[], allPurchases: Purchase[]): Array<{
    purchasesThisMonthCount: number;
    purchasesThisMonthAmount: number;
    purchaseModeThisMonth: PurchaseModeThisMonth;
    monthlyAveragePerPurchase: number;
  }> {
    return customers.map(customer => {
      const stats = this.getCustomerPurchaseStats(this.purchasesForCustomer(customer, allPurchases));
      return {
        purchasesThisMonthCount: stats.count,
        purchasesThisMonthAmount: stats.amount,
        purchaseModeThisMonth: stats.purchaseModeThisMonth,
        monthlyAveragePerPurchase: stats.monthlyAveragePerPurchase
      };
    });
  }

  getTop5CustomersThisMonth(
    customers: Customer[],
    allPurchases: Purchase[],
    cashbackStats: CustomerCashbackStats[],
  ): TopCustomer[] {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const purchasesThisMonth = (customer: Customer) =>
      this.purchasesForCustomer(customer, allPurchases).filter(pc => {
        const d = new Date(pc.date);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length;

    const top5 = customers
      .map((customer, i) => {
        return {
          name: customer.name,
          avatar: getInitials(customer.name),
          purchases: purchasesThisMonth(customer),
          totalInCashback: cashbackStats[i]?.activeCashbackAmount ?? 0
        } satisfies TopCustomer;
      })
      .filter(ct => ct.purchases > 0)
      .sort((a, b) => b.purchases - a.purchases)
      .slice(0, 5);
    return top5 satisfies TopCustomer[];
  }
}