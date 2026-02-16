import {Injectable} from '@angular/core';
import {Customer, CustomerStatus} from '../models/customer.model';
import {Observable, of} from 'rxjs';
import {MOCK_CUSTOMERS} from '../data/customers.mock';
import {nanoid} from 'nanoid';

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
      purchasesCount: 0,
      totalActiveCashback: 0,
      totalCashbackValueGenerated: 0,
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

    if(index !== -1) {
      this.customers[index] = {
        ...this.customers[index], // mantemos os dados antigos
        ...customerData // sobrescrevemos apenas dados novos (parciais)
      }
      return of(this.customers[index]);
    }

    throw new Error('Cliente não encontrado!');
  }
}
