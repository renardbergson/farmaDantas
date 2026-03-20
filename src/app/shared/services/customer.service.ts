import { Injectable } from '@angular/core';
import { Customer, CustomerStatus, Person, Address, Purchase } from '../models';
import { Observable, of } from 'rxjs';
import { MOCK_CUSTOMERS } from '../data/customers.mock';
import { nanoid } from 'nanoid';

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

  /**
   * Retorna a lista de clientes CRUA de (customers.mock.ts), ou seja: 
   * 
   * 1. sem as estatísticas calculadas de compras do mês:
   * - purchasesThisMonthCount
   * - purchasesThisMonthAmount
   * - purchaseModeThisMonth
   * - monthlyAveragePerPurchase
   * 
   * 2. sem as estatísticas calculadas de cashback:
   * - activeCashbackCount
   * - activeCashbackAmount
   * - totalCashbackEarned
   * - totalCashbackUsed
   * 
   * Para obter clientes enriquecidos, o componente deve chamar PurchaseService.getPurchaseStatsByCustomer e CashbackService.getCashbackStatsByCustomer após getCustomers().
   * @returns Array de clientes
   * @example
   * this.customerService.getCustomers().subscribe(customers => {
   *   this.customers = customers;
   * });
  */
  getCustomers(): Observable<Customer[]> {
    return of(this.customers);
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
          number: customerData.address?.number?.trim() || null,
          complement: customerData.address?.complement?.trim() || null
        },
        name: customerData.name,
        cpf: customerData.cpf,
        phone: customerData.phone,
        createdAt: new Date(),
        email: customerData.email ?? null,
        dateOfBirth: customerData.dateOfBirth ?? null,
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
}
