import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerHeader, CustomerAddNewModal, CustomerDeleteModal, CustomerDetailsModal, CustomerSearchCard, CustomerTable, CustomerStatusChart} from './components';
import { CustomerCashbacksModal } from '../../../../shared/components';
import {Customer, CustomerStatus} from '../../../../shared/models/customer.model';
import {CashbackStatus} from '../../../../shared/models/cashback.model';
import {CustomerService} from '../../../../shared/services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    CustomerHeader,
    CustomerSearchCard,
    CustomerTable,
    CustomerAddNewModal,
    CustomerDeleteModal,
    CustomerDetailsModal,
    CustomerCashbacksModal,
    CustomerStatusChart
  ],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit {
  // Lista original de clientes
  originalCustomers: Customer[] = [];
  // Lista filtrada de clientes
  filteredCustomers: Customer[] = [];
  // Filtros de clientes
  searchTerm: string = '';
  customerStatusFilters: CustomerStatus[] = [];
  // Cliente selecionado na tabela
  selectedCustomer?: Customer;
  // Cliente para editar
  customerToEdit?: Customer;
  // Cliente para excluir
  customerToDelete: Customer | null = null;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.originalCustomers = data;
        this.filteredCustomers = data;
      },
      error: (err) => console.error(err),
    })
  }

  // Filtra os clientes com base no termo de busca
  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyCustomerFilters();
  }

  // Filtra is clientes com base nos status selecionados
  onFilterCustomerStatus(statuses: CustomerStatus[]): void {
    this.customerStatusFilters = statuses;
    this.applyCustomerFilters();
  }

  applyCustomerFilters(): void {
    this.filteredCustomers = this.originalCustomers.filter(customer => {
      const matchesSearchTerm =
        // verifica se o nome, cpf ou e-mail bate com a busca
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.cpf.includes(this.searchTerm) ||
        customer.email?.toLowerCase().includes(this.searchTerm)

      const matchesStatusSearch =
        // verifica se o status do cliente bate com os filtros selecionados
        this.customerStatusFilters.length === 0 ||
        this.customerStatusFilters.includes(customer.status);

      // retorno do filter
      return matchesSearchTerm && matchesStatusSearch;
    });
  }

  // Abre o modal de novo cliente
  onAddCustomer(): void {
    // abertura de modal gerenciada pelo bootstrap ***
    this.customerToEdit = undefined; // garante que o modal inicie limpo
  }

  // Atribui o cliente selecionado ao modal de detalhes
  onSelectCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
  }

  onEditCustomer(customer: Customer): void {
    this.customerToEdit = customer;
  }

  onDeleteCustomer(customer: Customer): void {
    this.customerToDelete = customer;
  }

  confirmDelete(customer: Customer): void {
    this.filteredCustomers = this.filteredCustomers.filter(c => c.id !== customer.id);
  }
}
