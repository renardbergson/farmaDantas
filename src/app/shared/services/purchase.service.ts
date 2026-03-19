import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { nanoid } from 'nanoid';
import { Customer, CashbackStatus, PurchasesStats, Purchase, PurchaseMode, PurchaseModeThisMonth, Cashback } from '../models';
import { getInitials } from '../utils/getInitials';
import { CASHBACK_CONFIG } from '../constants/cashback.config';

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
   * 4. Variação vs mês anterior
   *    - Deltas em contagem: newCustomersChange, purchasesChange, activeCashbacksChange, returningCustomersChange
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
      const cashbacks = ct.cashbacks ?? [];
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      cashbacks.forEach(cb => {
        const createdAt = new Date(cb.createdAt);
        const validUntil = new Date(cb.validUntil);
        validUntil.setHours(0, 0, 0, 0);
        const diffTime = validUntil.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / MS_PER_DAY);
        const isExpired = diffDays < 0 || diffDays > 30;
        if (!isExpired) {
          activeCashbacks++;
          activeCashbacksAmount += cb.value;
          if (createdAt >= lastMonth && createdAt < currentMonth) activeCashbacksLastMonth++;
          if (createdAt >= currentMonth && createdAt < nextMonth) activeCashbacksThisMonth++;
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
  getPurchaseStatsByCustomer(customers: Customer[]): Pick<Customer, 'purchasesThisMonthCount' | 'purchasesThisMonthAmount' | 'purchaseModeThisMonth' | 'monthlyAveragePerPurchase'>[] {
    return customers.map(customer => {
      const stats = this.getCustomerPurchaseStats(customer.purchases ?? []);
      return {
        purchasesThisMonthCount: stats.count,
        purchasesThisMonthAmount: stats.amount,
        purchaseModeThisMonth: stats.purchaseModeThisMonth,
        monthlyAveragePerPurchase: stats.monthlyAveragePerPurchase
      };
    });
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

  /**
   * Registra uma nova compra para um cliente e atualiza o estado de cashbacks.
   *
   * **Fluxo:**
   * 1. Gera um ID único para a compra (`p${nanoid(4)}`).
   * 2. Se houver cashback utilizado (`data.usedCashback`): marca o cashback como `USED` e associa ao `purchaseId`.
   * 3. Se houver valor de cashback gerado (`data.generatedCashbackValue`): cria um novo cashback com validade de 30 dias a partir da data da compra e adiciona em `customer.cashbacks`.
   * 4. Monta a compra completa com `generatedCashback` (ou `null`) e adiciona em `customer.purchases`.
   *
   * **Mutação do cliente:** O método altera o objeto `customer` in-place (adiciona compra e cashbacks).
   * O cliente é a fonte de verdade; após o `subscribe`, o componente deve recarregar os dados para refletir
   * as estatísticas atualizadas (ex.: `purchasesThisMonthCount`, `activeCashbackAmount`).
   *
   * **Quanto a uso do operador ??=**:
   * ele atribui [] a customer.cashbacks apenas se customer.cashbacks for null/undefined; depois faz push.
   * Usar (customer.cashbacks ?? []).push(...) não funcionaria: ?? só retorna um valor, não altera.
   * Com ??, se cashbacks fosse null, o push iria para um array temporário que seria descartado — o cashback se perderia.
   * 
   * @param customer Cliente que receberá a compra (deve ser o objeto completo com `purchases` e `cashbacks`).
   * @param data Dados da compra (sem `id` e `generatedCashback`). O `generatedCashbackValue` opcional
   *             define o valor em R$ do cashback gerado; se omitido ou `null`, nenhum cashback é criado.
   * @returns Observable que emite a compra criada.
   *
   * @example
   * const data = {
   *   mode: PurchaseMode.IN_STORE,
   *   date: new Date(),
   *   totalValue: 100,
   *   finalValue: 90,
   *   category: PurchaseCategory.CONTINUOUS,
   *   customerId: customer.id,
   *   customerName: customer.person.name,
   *   employeeId: 'e01',
   *   employeeName: 'Funcionário',
   *   paymentMethods: [PaymentMethod.PIX],
   *   observations: null,
   *   usedCashbackGenerationRate: 0.10,
   *   usedCashback: cashbackSelecionado, // opcional
   *   generatedCashbackValue: 9.00       // opcional; gera cashback de R$ 9,00
   * };
   * this.purchaseService.addPurchase(customer, data).subscribe(purchase => {
   *   this.loadPurchases(); // recarrega lista e stats
   * });
   */
  addPurchase(customer: Customer, data: Omit<Purchase, 'id' | 'generatedCashback'> & { generatedCashbackValue?: number | null }): Observable<Purchase> {
    const purchaseId = `p${nanoid(4)}`;

    if (data.usedCashback) {
      const cb = customer.cashbacks?.find(cb => cb.id === data.usedCashback!.id);
      if (cb) {
        cb.status = CashbackStatus.USED;
        cb.usedInPurchaseId = purchaseId;
      }
    }

    let generatedCashback: Cashback | null = null;

    if (data.generatedCashbackValue != null) {
      const validUntil = new Date(data.date);
      validUntil.setDate(validUntil.getDate() + 30);

      generatedCashback = {
        id: `c${nanoid(4)}`,
        value: data.generatedCashbackValue,
        customerId: customer.id,
        customerName: customer.person.name,
        createdAt: data.date,
        validUntil,
        timeLeft: '30 dias',
        originPurchaseId: purchaseId,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: data.generatedCashbackValue / CASHBACK_CONFIG.cashbackRedemptionRate,
        usedInPurchaseId: null
      };

      (customer.cashbacks ??= []).push(generatedCashback);
    }

    const newPurchase: Purchase = {
      id: purchaseId,
      mode: data.mode,
      date: data.date,
      totalValue: data.totalValue,
      finalValue: data.finalValue,
      category: data.category,
      customerId: customer.id,
      customerName: customer.person.name,
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      paymentMethods: data.paymentMethods,
      observations: data.observations ?? null,
      usedCashbackGenerationRate: data.usedCashbackGenerationRate ?? null,
      usedCashback: data.usedCashback ?? null,
      generatedCashback,
    };

    (customer.purchases ??= []).push(newPurchase);
    return of(newPurchase);
  }
}