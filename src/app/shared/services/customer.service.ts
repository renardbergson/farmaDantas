import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  Customer,
  CreateCustomerRequest,
  CreateCustomerResponse,
  CustomerDetailsResponse,
  UpdateCustomerResponse,
  UpdateCustomerRequest,
  UpdateAddressPayload,
} from '../models';
import { DashboardStatsService } from './dashboard-stats.service';
import { CustomersStatsService } from './customers-stats.service';
import { environment } from '../../../environments/environment';

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

  addCustomer(data: CreateCustomerRequest): Observable<CreateCustomerResponse> {
    const body: CreateCustomerRequest = {
      ...data,
      email: data.email ?? null,
      dateOfBirth: data.dateOfBirth ?? null,
      address: data.address
        ? {
          ...data.address,
          number: data.address.number?.trim() || null,
          complement: data.address.complement?.trim() || null,
        }
        : null,
    };

    return this.http.post<CreateCustomerResponse>(`${this.CUSTOMERS_URL}/create`, body).pipe(
      tap(() => {
        this.dashboardStatsService.refreshStats();
        this.customersStatsService.refreshStats();
      }),
    );
  }

  updateCustomer(
    id: string,
    payload: UpdateCustomerRequest,
  ): Observable<UpdateCustomerResponse> {
    const sanitizeAddress = (address: UpdateAddressPayload): UpdateAddressPayload => ({
      zipCode: address.zipCode ?? null,
      street: address.street ?? null,
      number: address.number?.trim() || null,
      complement: address.complement?.trim() || null,
      neighborhood: address.neighborhood ?? null,
      cityId: this.normalizeId(address.cityId),
      stateId: this.normalizeId(address.stateId)
    })

    const body: UpdateCustomerRequest = {
      ...payload,
      email: payload.email ?? null,
      dateOfBirth: payload.dateOfBirth ?? null,
      ...(payload.address === undefined
        ? {} // em spread condicional, {} não vira payload vazio, significa: não adicione nada neste ponto do merge
        : payload.address === null
          ? { address: null }
          : { address: sanitizeAddress(payload.address) }
      )
    }

    return this.http.put<UpdateCustomerResponse>(`${this.CUSTOMERS_URL}/${id}/update`, body).pipe(
      tap(() => {
        this.dashboardStatsService.refreshStats();
        this.customersStatsService.refreshStats();
      }),
    );
  }

  deleteCustomer(customer: Customer): Observable<void> {
    return this.http.delete<void>(`${this.CUSTOMERS_URL}/${customer.id}/delete`).pipe(
      tap(() => {
        this.dashboardStatsService.refreshStats();
        this.customersStatsService.refreshStats();
      }),
    );
  }

  private normalizeId = (value: unknown): number | null => {
    if (value === '' || value === null || value === undefined) return null;
    const nb = Number(value);
    return Number.isNaN(nb) ? null : nb;
  }
}