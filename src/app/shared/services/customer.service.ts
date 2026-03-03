import { Injectable } from '@angular/core';
import { Customer, CustomerStatus, PurchasesStats, CashbackStatus, Person, Address, PurchaseMode, Purchase, PurchaseModeThisMonth, Cashback } from '../models';
import { Observable, of } from 'rxjs';
import { MOCK_CUSTOMERS } from '../data/customers.mock';
import { nanoid } from 'nanoid';
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

export type createAddress = Pick<
  Address, 'zipCode' | 'stateId' | 'stateName' | 'cityId' | 'cityName' | 'neighborhood' | 'street'
> & Partial<Pick<Address, 'number' | 'complement'>>;

export type createPerson = Pick<Person, 'name' | 'cpf' | 'phone'> &
  Partial<Pick<Person, 'email' | 'dateOfBirth'>> & {
    address: createAddress;
  }

export type updateAddress = Partial<Pick<
  Address, 'zipCode' | 'stateId' | 'stateName' | 'cityId' | 'cityName' | 'neighborhood' | 'street' | 'number' | 'complement'
>>;

export type updatePerson = Partial<Pick<Person, 'name' | 'cpf' | 'phone' | 'email' |
  // mesmo que alguns campos de Person sejam obrigatórios, no caso de update, podemos enviar somente o que queremos atualizar
  'dateOfBirth'>> & {
    address: updateAddress;
  };

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customers: Customer[] = [...MOCK_CUSTOMERS];

  private getCustomerMonthlyPurchaseData(purchases: Purchase[]): {
    count: number;
    amount: number;
    purchaseModeThisMonth: PurchaseModeThisMonth;
    monthlyAveragePerPurchase: number;
  } {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const purchasesThisMonth = (purchases || []).filter(p => {
      const date = new Date(p?.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })

    const count = purchasesThisMonth.length;
    const amount = purchasesThisMonth.reduce((sum, p) => sum + p.total, 0);
    const purchaseModeThisMonth = {
      in_store: purchasesThisMonth.filter(p => p.mode === PurchaseMode.IN_STORE).length,
      delivery: purchasesThisMonth.filter(p => p.mode === PurchaseMode.DELIVERY).length
    }
    const monthlyAveragePerPurchase = count > 0 ? amount / count : 0;

    return {
      count,
      amount,
      purchaseModeThisMonth,
      monthlyAveragePerPurchase
    }
  }

  private getCustomerMonthlyCashbackData(cashbacks: Cashback[]): {
    activeCashbackCount: number;
    activeCashbackAmount: number;
    totalCashbackEarned: number;
    totalCashbackUsed: number;
  } {
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
    }
  }

  getCustomers(): Observable<Customer[]> {
    const updated = this.customers.map(c => {
      const purchaseStats = this.getCustomerMonthlyPurchaseData(c.purchases || []);

      const cashbackStats = this.getCustomerMonthlyCashbackData(c.cashbacks || []);

      return {
        ...c,
        purchasesThisMonthCount: purchaseStats.count,
        purchasesThisMonthAmount: purchaseStats.amount,
        purchaseModeThisMonth: purchaseStats.purchaseModeThisMonth,
        activeCashbackCount: cashbackStats.activeCashbackCount,
        activeCashbackAmount: cashbackStats.activeCashbackAmount,
        totalCashbackEarned: cashbackStats.totalCashbackEarned,
        totalCashbackUsed: cashbackStats.totalCashbackUsed,
        monthlyAveragePerPurchase: purchaseStats.monthlyAveragePerPurchase
      }
    })

    // O operador of da biblioteca RxJS transforma
    // qualquer dado em um Observable
    return of(updated);
  }

  addCustomer(customerData: createPerson): Observable<Customer> {
    // 1. O que é o Partial<Person>?
    // - O Partial é um Utility Type do TypeScript que torna todos os
    //   campos de Person opcionais. O formulário envia apenas os dados
    //   da pessoa (name, cpf, email, phone, cityId, etc.) que o usuário preencheu.
    // 2. Por que não receber Customer ou Person completo?
    // - O formulário não tem id, createdAt da Person; isso é
    //   definido aqui no serviço (simulando um backend). O componente só
    //   envia o que o usuário digitou.
    // 3. Fluxo: a partir dos dados da pessoa (customerData), montamos a
    //   Person (com id e createdAt gerados aqui) e o Customer (id próprio,
    //   personId referenciando a Person, contadores zerados, status NEW).
    const personId = nanoid(4);
    const addressId = nanoid(4);
    const customer: Customer = {
      id: nanoid(4),
      personId: personId,
      person: {
        id: personId,
        addressId: addressId,
        address: {
          id: addressId,
          zipCode: customerData.address?.zipCode,
          stateId: customerData.address?.stateId,
          stateName: customerData.address?.stateName,
          cityId: customerData.address?.cityId,
          cityName: customerData.address?.cityName,
          neighborhood: customerData.address?.neighborhood,
          street: customerData.address?.street,
          number: customerData.address?.number,
          complement: customerData.address?.complement
        },
        name: customerData.name,
        cpf: customerData.cpf,
        phone: customerData.phone,
        createdAt: new Date(),
        email: customerData.email,
        dateOfBirth: customerData.dateOfBirth,
      },
      cashbacks: [],
      purchases: [],
      purchasesThisMonthCount: 0,
      purchasesThisMonthAmount: 0,
      purchaseModeThisMonth: {
        in_store: 0,
        delivery: 0
      },
      monthlyAveragePerPurchase: 0,
      activeCashbackCount: 0,
      activeCashbackAmount: 0,
      totalCashbackEarned: 0,
      totalCashbackUsed: 0,
      status: CustomerStatus.NEW,
    } as Customer;

    // 4. Por que "as Customer"?
    // - customerData é Partial<Person>, então campos como name, cpf podem ser undefined.
    //   Montamos manualmente Person e Customer com todos os campos necessários; mesmo assim
    //   o TypeScript pode inferir o tipo de forma conservadora. O "as Customer" afirma
    //   que o objeto montado está completo e atende à interface Customer.
    this.customers.push(customer);
    return of(customer);
  }

  updateCustomer(id: string, customerData: updatePerson): Observable<Customer> {
    const index = this.customers.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error('Cliente não encontrado!');
    }

    const existingCustomer = this.customers[index];
    const existingPerson = existingCustomer.person;
    const existingAddress = existingPerson.address;

    // Merge do endereço: dados antigos + novos (parciais)
    const mergedAddress: Address = {
      ...existingAddress,
      ...customerData.address
    }

    // Merge dos dados da pessoa: dados antigos + novos (parciais)
    const mergedPerson: Person = {
      ...existingPerson,
      ...customerData,
      address: mergedAddress
    }

    // Merge do consumidor (completo agora)
    const updatedCustomer: Customer = {
      ...existingCustomer,
      person: mergedPerson // pessoa + endereço
    }
    this.customers[index] = updatedCustomer;
    return of(updatedCustomer);
  }

  deleteCustomer(customer: Customer): Observable<Customer> {
    const index = this.customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      this.customers.splice(index, 1);
    }
    return of(customer); // cliente que foi removido
  }

  getPurchasesStats(): Observable<PurchasesStats> {
    // Para comparar datas, o ideal é normalizar a 
    // data para "a data à meia-noite", pois assim, 
    // apenas a data é considerada, ignorando hora, minuto e    segundo.
    // Para isso, é preciso zerar o horário de purchaseDate 
    // antes da comparação
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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

    this.customers.forEach(ct => {
      const createdAt = new Date(ct.person.createdAt);
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
        purchaseDate.setHours(0, 0, 0, 0);

        if (purchaseDate.getTime() === today.getTime()) {
          purchasesToday++;
          purchasesAmountToday += p.total;
        }

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

    const stats: PurchasesStats = {
      totalCustomers,
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
        const cashbackStats = this.getCustomerMonthlyCashbackData(customer.cashbacks || []);

        return {
          name: customer.person.name,
          avatar: getInitials(customer.person.name),
          purchases: purchasesCount,
          totalInCashback: cashbackStats.activeCashbackAmount
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
          customerName: customer.person.name,
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

    for (let i = 5; i >= 0; i--) {
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

    for (let i = 5; i >= 0; i--) {
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
