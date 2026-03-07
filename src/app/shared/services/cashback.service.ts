import { Injectable } from '@angular/core';
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

/**
 * Estatísticas de cashback de um cliente.
 * Usado para enriquecer cada Customer, pois o MOCK não fornece esses valores.
 *
 * @see customer.model.ts - interface Customer
 * @see customers.mock.ts - dados mock sem os cálculos
 * @example
 * const stats = this.cashbackService.getCustomerCashbackStats(customer.cashbacks);
 */
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

  /* UTILITÁRIOS */
  /**
   * Formata o texto de validade do cashback com base no número de dias restantes.
   * @param diffDays Número de dias restantes
   * @returns Texto de validade do cashback
   * @example
   * const expiresInText = this.cashbackService.formatExpiresInText(10);
  */
  private formatExpiresInText(diffDays: number): string {
    if (diffDays === 0) return 'Expira hoje';
    if (diffDays === 1) return 'Expira amanhã';
    return `Expira em ${diffDays} dias`;
  }

  /**
   * Retorna as estatísticas de cashback calculadas a partir do array de cashbacks.
   *
   * NECESSÁRIO PORQUE: O MOCK (customers.mock.ts) não possui os valores calculados
   * (activeCashbackCount, activeCashbackAmount, totalCashbackEarned, totalCashbackUsed).
   * Esses campos são exigidos pela interface Customer (@see customer.model.ts).
   * Em um cenário com backend real, esses valores viriam já calculados da API.
   *
   * @param cashbacks Array de cashbacks do cliente
   * @returns Estatísticas (ativos, valor ativo, total ganho, total utilizado)
   * @example
   * const stats = this.cashbackService.getCustomerCashbackStats(customer.cashbacks);
 */
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
  /**
   * Retorna os últimos cashbacks válidos (não expirados, validade até 30 dias) de TODOS os clientes,
   * ordenados por data de criação decrescente.
   * @param customers Array de clientes com seus cashbacks
   * @returns Array com no máximo 4 cashbacks recentes
   * @example
   * const cashbacks = this.cashbackService.getAllLastCashbacks(customers);
  */
  getAllLastCashbacks(customers: Customer[]): RecentCashback[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allCashbacks = customers.flatMap(customer => {
      return (customer.cashbacks || [])
        .map(cb => {
          const validUntil = new Date(cb.validUntil);
          validUntil.setHours(0, 0, 0, 0);

          const diffTime = validUntil.getTime() - today.getTime(); // retorna a diferença em ms
          const diffDays = Math.ceil(diffTime / this.MS_PER_DAY); // converte ms para dias

          const isExpired = diffDays < 0 || diffDays > this.MAX_DAYS_VALIDITY;
          if (isExpired) return null;

          const expiresInText = this.formatExpiresInText(diffDays);

          return {
            customerName: customer.person.name,
            createdAt: cb.createdAt,
            expiresIn: expiresInText,
            status: cb.status,
            value: cb.value
          } satisfies RecentCashback;
        })
        .filter((cb): cb is RecentCashback => cb !== null); // Na prática, o comportamento em runtime é o mesmo: .filter() continue removendo os valores null. O type predicate "cb is RecentCashback" apenas diz ao TypeScript que o filtro remove os valores null, para que o TypeScript possa inferir o tipo correto. Assim, o retorno da função passar a ser RecentCashback[] ao invés de (RecentCashback | null)[].
    });
    return allCashbacks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, this.LAST_CASHBACKS_LIMIT);
  }

  /**
   * Retorna os totais em cashback gerados por mês nos últimos 6 meses de TODOS os clientes.
   * @param customers Array de clientes com seus cashbacks
   * @returns Objeto com labels (nomes dos meses) e values (soma dos valores por mês)
   * @example
   * const data = this.cashbackService.getAllLastMonthsCashbackTotals(customers);
   * 
   * COMO FUNCIONA O CÁLCULO DOS MESES:
    1. now.getMonth() retorna o mês atual de 0 a 11.
      Ex: fevereiro = 1, pois os meses começam em 0.

    2. No cálculo now.getMonth() - i, estamos voltando mês a mês para obter os últimos 6 meses, incluindo o mês atual.
      Ex: se estamos em fevereiro (1), os valores serão:
      -4, -3, -2, -1, 0, 1

    3. Quando o mês fica negativo, o JavaScript ajusta automaticamente para o ano anterior.
      Ex: new Date(2026, -1, 1) → dezembro de 2025

    4. O metodo date.getMonth() sempre retorna um valor entre 0 e 11. Ou seja, o array "monthNames" nunca é acessado com índice negativo.
  
  COMO FUNCIONA A SOMA DOS CASHBACKS DO MÊS:
    Estrutura dos dados:
    - this.customers é um array de clientes.
    - Cada cliente possui um array de cashbacks.

    Exemplo:
    customers = [
      { cashbacks: [cb1, cb2] },
      { cashbacks: [cb3] }
    ]

    Ou seja: um array de clientes contendo arrays de cashbacks.

    O flatMap é usado para:
    1. Pegar o array de cashbacks de cada cliente (map).
    2. Unir todos esses arrays em um único array (flatten).

    Resultado:
    [cb1, cb2, cb3]

    Depois disso:
    - filter: mantém apenas os cashbacks do mês/ano atual do loop.
    - reduce: soma os valores desses cashbacks.
  */
  getAllLastMonthsCashbackTotals(customers: Customer[]): MonthlyCashbackValueData {
    const labels: string[] = [];
    const values: number[] = [];
    const now = new Date();

    for (let i = this.LAST_MONTHS_COUNT - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();

      labels.push(this.MONTH_NAMES[month]);

      const monthTotal = customers
        .flatMap(customer => customer.cashbacks || [])
        .filter(cb =>
          cb.createdAt.getMonth() === month &&
          cb.createdAt.getFullYear() === year
        )
        .reduce((sum, cb) => sum + cb.value, 0);

      values.push(monthTotal);
    }
    return { labels, values };
  }

  /**
   * Retorna a quantidade de cashbacks gerados por mês nos últimos 6 meses de TODOS os clientes.
   * @param customers Array de clientes com seus cashbacks
   * @returns Objeto com labels (nomes dos meses) e quantities (quantidade por mês)
   * @example
   * const data = this.cashbackService.getAllLastMonthsCashbackCount(customers);
   */
  getAllLastMonthsCashbackCount(customers: Customer[]): MonthlyCashbackCountData {
    const labels: string[] = [];
    const quantities: number[] = [];
    const now = new Date();

    for (let i = this.LAST_MONTHS_COUNT - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();

      labels.push(this.MONTH_NAMES[month]);

      const monthCount = customers
        .flatMap(customer => customer.cashbacks || [])
        .filter(cb =>
          cb.createdAt.getMonth() === month &&
          cb.createdAt.getFullYear() === year
        )
        .length;
      quantities.push(monthCount);
    }
    return { labels, quantities };
  }

  /**
   * Retorna os clientes enriquecidos com as estatísticas de cashback de cada um.
   * Calcula: activeCashbackCount, activeCashbackAmount, totalCashbackEarned, totalCashbackUsed.
   *
   * NECESSÁRIO PORQUE: O MOCK (customers.mock.ts) não possui os valores calculados
   * exigidos pela interface Customer (@see customer.model.ts).
   * Em um cenário com backend real, esses valores viriam já calculados da API.
   *
   * @param customers Array de clientes (obtido via CustomerService.getCustomers())
   * @returns Array de clientes com as estatísticas de cashback do mês atual
   * @example
   * const withCashbackStats = this.cashbackService.getCashbackStatsByCustomer(customers);
   */
  getCashbackStatsByCustomer(customers: Customer[]): Customer[] {
    return customers.map(customer => {
      const stats = this.getCustomerCashbackStats(customer.cashbacks || []);
      return {
        ...customer,
        activeCashbackCount: stats.activeCashbackCount,
        activeCashbackAmount: stats.activeCashbackAmount,
        totalCashbackEarned: stats.totalCashbackEarned,
        totalCashbackUsed: stats.totalCashbackUsed
      } satisfies Customer;
    });
  }
}
