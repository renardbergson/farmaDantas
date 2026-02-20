import { Injectable } from '@angular/core';
import { Customer, CustomerStatus } from '../models/customer.model';
import { Observable, of } from 'rxjs';
import { MOCK_CUSTOMERS } from '../data/customers.mock';
import { nanoid } from 'nanoid';
import { DashboardStats } from '../models/dashboard-stats.model';
import { CashbackStatus } from '../models/cashback.model';
import { getInitials } from '../utils/getInitials';

export interface TopCustomer {
  name: string;
  avatar: string;
  purchases: number;
  totalInCashback: number;
}

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

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customers: Customer[] = [...MOCK_CUSTOMERS];

  getCustomers(): Observable<Customer[]> {
    // O operador of da biblioteca RxJS transforma
    // qualquer dado em um Observable
    return of(this.customers);
  }

  addCustomer(customerData: Partial<Customer>): Observable<Customer> {
    // 1. O que é o Partial<T>
    // - O Partial é um Utility Type do TypeScript que pega todos
    //   os campos de uma interface e os torna opcionais.
    // - Ao usar Partial<Customer>, para o TypeScript, todos os
    //   campos passam a ter um ? invisível:
    // 2. Por que não usar direto customerData: Customer ?
    // - Se definissemos o metodo como addCustomer(customer: Customer),
    //   o TypeScript nos obrigaria a passar um objeto completo já na
    //   chamada da função (no componente ou formulário). Isso geraria
    //   dois problemas:
    //   2.1. Campos Gerados pelo Servidor/Serviço: teriamos que inventar
    //   um id, um createdAt e zerar todos os contadores (purchasesCount,
    //   totalActiveCashback) manualmente no componente antes de enviar
    //   para o serviço.
    //   2.2 Responsabilidade: A responsabilidade de gerar o ID (nanoid)
    //   e definir a data de criação deve ser do Serviço (simulando um Backend),
    //   e não do formulário que o usuário preenche.
    // 3. Quais as vantagens na prática?
    // - Ao usar Partial<Customer>, permitimos que o componente de origem envie
    //   apenas o que ele realmente tem (os dados vindos dos inputs do formulário)
    const newCustomer: Customer = {
      ...customerData,
      id: nanoid(4),
      createdAt: new Date(),
      purchasesThisMonthCount: 0,
      purchasesThisMonthAmount: 0,
      activeCashbackCount: 0,
      activeCashbackAmount: 0,
      status: CustomerStatus.NEW,
      cashbacks: []
    } as Customer;

    // 4. Por que "as Customer"?
    // - O trecho as Customer é um Type Assertion (Asserção de Tipo) no TypeScript.
    //   Ele serve para "tranquilizar" o compilador. Vamos entender o porquê dele ser
    //   necessário naquele contexto específico:
    // - Como foi visto anteriormente, definimos o parâmetro da função como Partial<Customer>.
    //   Isso significa que, para o TypeScript, todas as propriedades do objeto customerData
    //   são opcionais (podem ser undefined).
    //   No entanto, no final da função, queremos retornar um Customer completo (onde campos
    //   como name, email e cpf são obrigatórios).
    // - Mesmo que tenhamos preenchido manualmente os campos obrigatórios (como id, createdAt,
    //   status, etc.) usando o spread operator (...customerData), o TypeScript ainda pode ficar
    //   "na dúvida" se o objeto resultante realmente possui todos os campos obrigatórios da
    //   interface Customer.
    // - Ao usar "as Customer", estamos dizendo explicitamente ao compilador: "Eu sei o que
    //   estou fazendo. Eu garanto que este objeto que acabei de montar possui todas as propriedades
    //   necessárias para ser considerado um Customer completo."

    this.customers.push(newCustomer);
    return of(newCustomer);
  }

  updateCustomer(id: string, customerData: Partial<Customer>): Observable<Customer> {
    const index = this.customers.findIndex(c => c.id === id);

    if (index !== -1) {
      this.customers[index] = {
        ...this.customers[index], // mantemos os dados antigos
        ...customerData // sobrescrevemos apenas dados novos (parciais)
      }
      return of(this.customers[index]);
    }

    throw new Error('Cliente não encontrado!');
  }

  getDashboardStats(): Observable<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // zera as horas, minutos, segundos e milissegundos,
    // para levar em consideração apenas a data

    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // cria uma data que representa o primeiro dia do mês atual, à meia-noite
    // new Date(ano, mês, dia)
    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    // cria uma data que representa o primeiro dia do mês anterior, à meia-noite
    // new Date(ano, mês atual - 1 (mês passado), dia)
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    // cria uma data que representa o primeiro dia do mês seguinte, à meia-noite
    // new Date(ano, mês atual + 1 (próximo mês), dia)

    // Customers
    const totalCustomers = this.customers.length;
    let newCustomersToday = 0;
    let newCustomersThisMonth = 0;
    let newCustomersLastMonth = 0;
    let customersWithPurchasesLastMonth = 0;
    let customersWithPurchasesThisMonth = 0;

    // Purchases
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

    this.customers.forEach(ct => {
      const createdAt = new Date(ct.createdAt);
      createdAt.setHours(0, 0, 0, 0); // zeramos as horas para comparar apenas a data

      // --------------------
      // CARD 1: CLIENTES
      // --------------------
      if (createdAt.getTime() === today.getTime()) {
        newCustomersToday++;
      }

      if (createdAt >= currentMonth && createdAt < nextMonth) {
        newCustomersThisMonth++;
      }

      if (createdAt >= lastMonth && createdAt < currentMonth) {
        newCustomersLastMonth++;
      }

      // --------------------
      // CARD 2: PURCHASES
      // --------------------
      const purchases = ct.purchases ?? [];

      purchases.forEach(p => {
        const purchaseDate = new Date(p.date);

        if (purchaseDate >= currentMonth && purchaseDate < nextMonth) {
          purchasesThisMonth++;
          purchasesAmountThisMonth += p.total;
        }

        if (purchaseDate >= lastMonth && purchaseDate < currentMonth) {
          purchasesLastMonth++;
        }
      });

      // --------------------
      // CARD 3: CASHBACKS
      // --------------------
      const cashbacks = ct.cashbacks ?? [];

      cashbacks.forEach(cb => {
        const cashbackDate = new Date(cb.createdAt);

        if (cb.status === CashbackStatus.ACTIVE) {
          // total geral
          activeCashbacks++;
          activeCashbacksAmount += cb.value;

          // mês passado
          if (cashbackDate >= lastMonth && cashbackDate < currentMonth) {
            activeCashbacksLastMonth++;
          }

          // mês atual
          if (cashbackDate >= currentMonth && cashbackDate < nextMonth) {
            activeCashbacksThisMonth++;
          }
        }
      });

      // --------------------
      // CARD 4: TAXA DE RETORNO MENSAL
      // --------------------
      let purchasesCountThisMonth = 0;
      let purchasesCountLastMonth = 0;

      purchases.forEach(p => {
        const purchaseDate = new Date(p.date);

        if (purchaseDate >= currentMonth && purchaseDate < nextMonth) {
          purchasesCountThisMonth++;
        }

        if (purchaseDate >= lastMonth && purchaseDate < currentMonth) {
          purchasesCountLastMonth++;
        }
      });

      // comprou neste mês
      if (purchasesCountThisMonth > 0) {
        customersWithPurchasesThisMonth++;
      }

      // comprou no mês passado
      if (purchasesCountLastMonth > 0) {
        customersWithPurchasesLastMonth++;
      }

      // fez mais de uma compra neste mês
      if (purchasesCountThisMonth > 1) {
        returningCustomersThisMonth++;
      }

      // fez mais de uma compra no mês passado
      if (purchasesCountLastMonth > 1) {
        returningCustomersLastMonth++;
      }
    });

    // -------------------------
    // FUNÇÃO - CALCULAR TAXAS
    // -------------------------
    function calculateRateChange(thisMonth: number, lastMonth: number): number {
      if (lastMonth === 0 && thisMonth > 0) {
        // todo valor deste mês é crescimento
        return thisMonth;
      } else if (lastMonth === 0 && thisMonth === 0) {
        return 0; // nenhum dado, nenhuma variação
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

    // TAXA DE RECOMPRA
    const returnRateThisMonth = customersWithPurchasesThisMonth > 0
      ? (returningCustomersThisMonth / customersWithPurchasesThisMonth)
      : 0;

    const returnRateLastMonth = customersWithPurchasesLastMonth > 0
      ? (returningCustomersLastMonth / customersWithPurchasesLastMonth)
      : 0;

    const returnRateChange = calculateRateChange(returnRateThisMonth, returnRateLastMonth);

    const stats: DashboardStats = {
      totalCustomers,
      newCustomersToday,
      newCustomersRateChange,
      purchasesThisMonth,
      purchasesAmountThisMonth,
      purchasesRateChange,
      activeCashbacks,
      activeCashbacksAmount,
      activeCashbacksRateChange,
      returnRateThisMonth,
      returnRateChange
    }

    return of(stats);
  }

  getTop5CustomersThisMonth(): Observable<TopCustomer[]> {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const purchasesThisMonth = (customer: Customer) => {
      return customer.purchases?.filter(pc =>
        pc.date.getMonth() === month &&
        pc.date.getFullYear() === year
      ).length || 0;
    };

    const top5 = this.customers
      .map(customer => {
        const purchasesCount = purchasesThisMonth(customer);

        return {
          name: customer.name,
          avatar: getInitials(customer.name),
          purchases: purchasesCount,
          totalInCashback: customer.activeCashbackAmount
        }
      })
      .filter(ct => ct.purchases > 0)
      .sort((a, b) => b.purchases - a.purchases)
      .slice(0, 5);
    // O sort recebe uma função de comparação:
    // - Se retornar valor negativo → 'a' vem antes de 'b'
    // - Se retornar valor positivo → 'b' vem antes de 'a'
    /*
      Exemplo 1:
      a = 10
      b = 5
      10 - 5 = 5 (então 'b' vem antes de 'a')

      Exemplo 2:
      a = 5
      b = 10
      5 - 10 = -5 (então 'a' vem antes de 'b')
    */
    // Aqui fazemos (b - a) para ordenar em ordem decrescente,
    // ou seja, quem tem mais compras no mês aparece primeiro.
    // Do contrário, se fizermos (a - b), quem tiver menos compras
    // aparecerá primeiro.
    // Obs: o .sort() modifica o array original criado por .filter()
    return of(top5);
  }

  getLastCashbacks(): Observable<RecentCashback[]> {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    // 1000 ms = 1s, 60s = 1min, 60min = 1h, 24h = 1 dia

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allCashbacks = this.customers.flatMap(customer => {
      return (customer.cashbacks || []).map(cb => {
        const validUntil = new Date(cb.validUntil);
        validUntil.setHours(0, 0, 0, 0);

        // Diferença em milissegundos entre a data de validade e hoje
        const diffTime = validUntil.getTime() - today.getTime();

        // Converte milissegundos para dias
        const diffDays = Math.ceil(diffTime / MS_PER_DAY);

        // Regra de negócio: validade máxima de 30 dias
        const isExpired = diffDays < 0 || diffDays > 30;
        if (isExpired) return null;

        let expiresInText: string;
        if (diffDays === 0) {
          expiresInText = "Expira hoje";
        } else if (diffDays === 1) {
          expiresInText = "Expira amanhã";
        } else {
          expiresInText = `Expira em ${diffDays} dias`;
        }

        return {
          customerName: customer.name,
          createdAt: cb.createdAt,
          expiresIn: expiresInText,
          status: cb.status,
          value: cb.value
        }
      }).filter(Boolean) as RecentCashback[]; // remove os expirados (null)
    });

    const sortedCashbacks = allCashbacks.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const lastCashbacks = sortedCashbacks.slice(0, 4);
    return of(lastCashbacks);
  }

  getCashbackValuesData(): Observable<MonthlyCashbackValueData> {
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const labels: string[] = [];
    const values: number[] = [];

    const now = new Date();

    for(let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      /*
        1. now.getMonth() retorna o mês atual de 0 a 11.
           Ex: fevereiro = 1, pois os meses começam em 0.

        2. No cálculo now.getMonth() - i, estamos voltando
           mês a mês para obter os últimos 6 meses,
           incluindo o mês atual.

           Ex: se estamos em fevereiro (1), os valores serão:
           -4, -3, -2, -1, 0, 1

        3. Quando o mês fica negativo, o JavaScript ajusta
           automaticamente para o ano anterior.

           Ex: new Date(2026, -1, 1) → dezembro de 2025

        4. O metodo date.getMonth() sempre retorna um valor
           entre 0 e 11. Ou seja, o array "monthNames"
           nunca é acessado com índice negativo.
      */
      const month = date.getMonth();
      const year = date.getFullYear();

      labels.push(monthNames[month]);

      /*
        Soma dos cashbacks do mês.

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
      const monthTotal = this.customers
        .flatMap(customer => customer.cashbacks || [])
        .filter(cb =>
          cb.createdAt.getMonth() === month &&
          cb.createdAt.getFullYear() === year
        )
        .reduce((sum, cb) => sum + cb.value, 0);

      values.push(monthTotal);
    }

    return of({ labels, values });
  }

  getCashbackCountData(): Observable<MonthlyCashbackCountData> {
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const labels: string[] = [];
    const quantities: number[] = [];

    const now = new Date();

    for(let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();

      labels.push(monthNames[month]);

      const monthCount = this.customers
        .flatMap(customer => customer.cashbacks || [])
        .filter(cb =>
          cb.createdAt.getMonth() === month &&
          cb.createdAt.getFullYear() === year
        )
        .length;

      quantities.push(monthCount);
    }

    return of({ labels, quantities });
  }
}
