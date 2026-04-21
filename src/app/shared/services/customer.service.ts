import { Injectable } from '@angular/core';
import {
  Customer,
  CreateCustomerRequest,
  CreateCustomerResponse,
  CustomerDetailsResponse,
  UpdateCustomerResponse,
  Person,
  Address,
} from '../models';
import { Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DashboardStatsService } from './dashboard-stats.service';
import { CustomersStatsService } from './customers-stats.service';
import { environment } from '../../../environments/environment';

export type createAddress = Pick<
  Address,
  'zipCode' | 'cityId' | 'stateId' | 'neighborhood' | 'street'
> &
  Partial<Pick<Address, 'number' | 'complement'>>;

export type createPerson = Pick<Person, 'name' | 'cpf' | 'phone'> &
  Partial<Pick<Person, 'email' | 'dateOfBirth'>> & {
    address: createAddress;
  };

export type updateAddress = Partial<
  Pick<Address, 'zipCode' | 'cityId' | 'stateId' | 'neighborhood' | 'street' | 'number' | 'complement'>
>;

export type updatePerson = Partial<
  Pick<Person, 'name' | 'cpf' | 'phone' | 'email' | 'dateOfBirth'>
> & {
  // mesmo que alguns campos de Person sejam obrigatórios, no caso de update, podemos enviar somente o que queremos atualizar
  address: updateAddress;
};

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly CUSTOMERS_URL = `${environment.apiBaseUrl}/api/customers`;

  constructor(
    private http: HttpClient,
    private dashboardStatsService: DashboardStatsService,
    private customersStatsService: CustomersStatsService,
  ) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.CUSTOMERS_URL);
  }

  getCustomerDetails(customerId: string): Observable<CustomerDetailsResponse> {
    return this.http.get<CustomerDetailsResponse>(`${this.CUSTOMERS_URL}/${customerId}/details`);
  }

  addCustomer(customerData: createPerson): Observable<CreateCustomerResponse> {
    const body = this.mapFormToCreateRequest(customerData);
    return this.http.post<CreateCustomerResponse>(`${this.CUSTOMERS_URL}/create`, body).pipe(
      tap(() => {
        this.dashboardStatsService.refreshStats();
        this.customersStatsService.refreshStats();
      })
    );
  }

  updateCustomer(id: string, customerData: updatePerson): Observable<UpdateCustomerResponse> {
    return this.getCustomerDetails(id).pipe(
      switchMap((details) => {
        const existingPerson = this.detailsToPerson(details);
        const existingAddress = existingPerson.address;

        // Merge do endereço: dados antigos + novos (parciais)
        const mergedAddress: Address = {
          ...existingAddress,
          ...customerData.address,
        };

        // Merge dos dados da pessoa: dados antigos + novos (parciais)
        const mergedPerson: Person = {
          ...existingPerson,
          ...customerData,
          address: mergedAddress,
        };

        const body = this.personToCreateRequest(mergedPerson);
        return this.http.put<UpdateCustomerResponse>(`${this.CUSTOMERS_URL}/${id}/update`, body);
      }),
    );
  }

  deleteCustomer(customer: Customer): Observable<void> {
    return this.http.delete<void>(`${this.CUSTOMERS_URL}/${customer.id}/delete`).pipe(
      tap(() => {
        this.dashboardStatsService.refreshStats();
        this.customersStatsService.refreshStats();
      })
    );
  }

  private detailsToPerson(details: CustomerDetailsResponse): Person {
    return {
      name: details.name,
      cpf: details.cpf,
      phone: details.phone,
      email: details.email,
      dateOfBirth: details.dateOfBirth,
      address: { ...details.address },
    };
  }

  private mapFormToCreateRequest(data: createPerson): CreateCustomerRequest {
    const a = data.address;
    return {
      name: data.name,
      phone: data.phone,
      cpf: data.cpf,
      email: data.email ?? null,
      dateOfBirth: data.dateOfBirth ?? null,
      address: {
        zipCode: a.zipCode,
        street: a.street,
        number: a.number?.trim() || null,
        complement: a.complement?.trim() || null,
        neighborhood: a.neighborhood,
        cityId: a.cityId,
        stateId: a.stateId,
      },
    };
  }

  private personToCreateRequest(p: Person): CreateCustomerRequest {
    const a = p.address;
    return {
      name: p.name,
      phone: p.phone,
      cpf: p.cpf,
      email: p.email,
      dateOfBirth: p.dateOfBirth,
      address: {
        zipCode: a.zipCode,
        street: a.street,
        number: a.number?.trim() || null,
        complement: a.complement?.trim() || null,
        neighborhood: a.neighborhood,
        cityId: a.cityId,
        stateId: a.stateId,
      },
    };
  }
}