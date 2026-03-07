import { Injectable } from '@angular/core';
import { Customer, CashbackStatus, PurchasesStats, Purchase, PurchaseMode, PurchaseModeThisMonth } from '../models';
import { getInitials } from '../utils/getInitials';

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
      const date = new Date(p?.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const count = purchasesThisMonth.length;
    const amount = purchasesThisMonth.reduce((sum, p) => sum + p.total, 0);
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

  /* SERVIÇOS */
  /**
   * Retorna estatísticas consolidadas de compras, cashbacks e taxa de retorno de TODOS os clientes.
   *
   * NÃO é necessário passar clientes enriquecidos (CashbackService.getCashbackStatsByCustomer).
   * Os dados brutos retornados por CustomerService.getCustomers() são suficientes.
   *
   * Dados utilizados de cada cliente:
   * - customer.person.createdAt
   * - customer.purchases
   * - customer.cashbacks
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
   * 4. Cálculo de variação (calculateRateChange)
   *    - lastMonth = 0 e thisMonth > 0: todo valor deste mês é crescimento (retorna thisMonth)
   *    - lastMonth = 0 e thisMonth = 0: nenhum dado, nenhuma variação (retorna 0)
   *    - Caso contrário: (thisMonth - lastMonth) / lastMonth
   *
   * @param customers Array de clientes (obtido via CustomerService.getCustomers())
   * @returns Estatísticas para os cards do dashboard
   * @example
   * this.customerService.getCustomers().subscribe(customers => {
   *   this.stats = this.purchaseService.getAllPurchaseStats(customers);
   * });
  */
  getAllPurchaseStats(customers: Customer[]): PurchasesStats {
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
      const createdAt = new Date(ct.person.createdAt);
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
      const purchases = ct.purchases ?? [];
      purchases.forEach(p => {
        const purchaseDate = new Date(p.date);
        purchaseDate.setHours(0, 0, 0, 0);
        if (purchaseDate.getTime() === today.getTime()) {
          purchasesToday++;
          purchasesAmountToday += p.total;
        }
        if (purchaseDate >= currentMonth && purchaseDate < nextMonth) {
          purchasesThisMonth++;
          purchasesAmountThisMonth += p.total;
        }
        if (purchaseDate >= lastMonth && purchaseDate < currentMonth) purchasesLastMonth++;
      });

      // --------------------
      // CARD 3: CASHBACKS
      // --------------------
      const cashbacks = ct.cashbacks ?? [];
      cashbacks.forEach(cb => {
        const cashbackDate = new Date(cb.createdAt);
        if (cb.status === CashbackStatus.ACTIVE) {
          activeCashbacks++;
          activeCashbacksAmount += cb.value;
          if (cashbackDate >= lastMonth && cashbackDate < currentMonth) activeCashbacksLastMonth++;
          if (cashbackDate >= currentMonth && cashbackDate < nextMonth) activeCashbacksThisMonth++;
        }
      });

      // ------------------------------
      // CARD 4: TAXA DE RETORNO MENSAL
      // ------------------------------
      let purchasesCountThisMonth = 0;
      let purchasesCountLastMonth = 0;

      purchases.forEach(p => {
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

    // -------------------------
    // FUNÇÃO - CALCULAR TAXAS
    // -------------------------
    function calculateRateChange(thisMonth: number, lastMonth: number): number {
      if (lastMonth === 0 && thisMonth > 0) {
        return thisMonth;
      } else if (lastMonth === 0 && thisMonth === 0) {
        return 0;
      } else {
        return (thisMonth - lastMonth) / lastMonth;
      }
    }

    // --------------------
    // TAXAS DE VARIAÇÃO
    // --------------------
    const newCustomersRateChange = calculateRateChange(newCustomersThisMonth, newCustomersLastMonth);
    const purchasesRateChange = calculateRateChange(purchasesThisMonth, purchasesLastMonth);
    const activeCashbacksRateChange = calculateRateChange(activeCashbacksThisMonth, activeCashbacksLastMonth);
    const returnRateThisMonth = customersWithPurchasesThisMonth > 0
      ? (returningCustomersThisMonth / customersWithPurchasesThisMonth) : 0;

    const returnRateLastMonth = customersWithPurchasesLastMonth > 0
      ? (returningCustomersLastMonth / customersWithPurchasesLastMonth) : 0;

    const returnRateChange = calculateRateChange(returnRateThisMonth, returnRateLastMonth);

    return {
      totalCustomers: customers.length,
      newCustomersToday,
      newCustomersRateChange,
      purchasesToday,
      purchasesAmountToday,
      purchasesThisMonth,
      purchasesAmountThisMonth,
      purchasesRateChange,
      activeCashbacks,
      activeCashbacksAmount,
      activeCashbacksRateChange,
      returnRateThisMonth,
      returnRateChange
    } satisfies PurchasesStats;
  }

  /**
   * Recebe uma lista de clientes crua de (customers.mock.ts) e enriquece cada cliente com as suas estatísticas de compras para o mês atual.
   * Calcula: 
   * - purchasesThisMonthCount,
   * - purchasesThisMonthAmount,
   * - purchaseModeThisMonth,
   * - monthlyAveragePerPurchase.
   *
   * @param customers Array de clientes (obtido via CustomerService.getCustomers())
   * @returns Array de clientes com as estatísticas de compras do mês atual
   * @example
   * this.customerService.getCustomers().subscribe(customers => {
   *   const withPurchaseStats = this.purchaseService.getPurchaseStatsByCustomer(customers);
   *   const withCashbackStats = this.cashbackService.getCashbackStatsByCustomer(customers);
   *   const enriched = customers.map((c, i) => ({ ...c, ...withPurchaseStats[i], ...withCashbackStats[i] }));
   * });
  */
  getPurchaseStatsByCustomer(customers: Customer[]): Customer[] {
    return customers.map(customer => {
      const stats = this.getCustomerPurchaseStats(customer.purchases ?? []);
      return {
        ...customer,
        purchasesThisMonthCount: stats.count,
        purchasesThisMonthAmount: stats.amount,
        purchaseModeThisMonth: stats.purchaseModeThisMonth,
        monthlyAveragePerPurchase: stats.monthlyAveragePerPurchase
      };
    })
  }

  /**
   * Retorna os 5 clientes com mais compras no mês atual.
   * Espera receber clientes já enriquecidos com activeCashbackAmount
   * (o componente deve chamar CashbackService.getCashbackStatsByCustomer antes).
   *
   * @param customers Array de clientes (com activeCashbackAmount preenchido)
   * @returns Top 5 ordenados por quantidade de compras (decrescente)
   * @example
   * const top5 = this.purchaseService.getTop5CustomersThisMonth(enrichedCustomers);
  */
  getTop5CustomersThisMonth(customers: Customer[]): TopCustomer[] {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const purchasesThisMonth = (customer: Customer) =>
      customer.purchases?.filter(pc =>
        pc.date.getMonth() === month && pc.date.getFullYear() === year
      ).length || 0;

    const top5 = customers
      .map(customer => {
        return {
          name: customer.person.name,
          avatar: getInitials(customer.person.name),
          purchases: purchasesThisMonth(customer),
          totalInCashback: customer.activeCashbackAmount
        } satisfies TopCustomer;
      })
      .filter(ct => ct.purchases > 0)
      .sort((a, b) => b.purchases - a.purchases)
      .slice(0, 5);
    return top5 satisfies TopCustomer[];
  }
}