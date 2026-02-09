import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerHeader, CustomerAddNewModal, CustomerDetailsModal, CustomerSearchCard, CustomerTable, CustomerStatusChart} from './components';
import {Customer, CustomerStatus} from './customerModel';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    CustomerHeader,
    CustomerSearchCard,
    CustomerTable,
    CustomerAddNewModal,
    CustomerDetailsModal,
    CustomerStatusChart
  ],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers {
  // Lista original de clientes
  allCustomers: Customer[] = [
    {
      id: '1',
      name: "Maria Silva",
      email: "maria@email.com",
      phone: "(11) 99999-9999",
      cpf: "123.456.789-00",
      city: "Santa Luzia",
      state: "Paraíba",
      createdAt: new Date("2023-01-01"),
      dateOfBirth: new Date("1992-08-01"),
      totalPurchases: 45,
      totalActiveCashback: 45.00,
      status: CustomerStatus.NEW
    },
    {
      id: '2',
      name: "João Santos",
      email: "joao@email.com",
      phone: "(11) 98888-8888",
      cpf: "234.567.890-11",
      city: "João Pessoa",
      state: "Paraíba",
      createdAt: new Date("2023-02-01"),
      dateOfBirth: new Date("1990-05-15"),
      totalPurchases: 38,
      totalActiveCashback: 22.50,
      status: CustomerStatus.ACTIVE
    },
    {
      id: '3',
      name: "Ana Oliveira",
      email: "ana@email.com",
      phone: "(11) 97777-7777",
      cpf: "345.678.901-22",
      city: "João Pessoa",
      state: "Paraíba",
      createdAt: new Date("2023-03-01"),
      dateOfBirth: new Date("1995-02-20"),
      totalPurchases: 32,
      totalActiveCashback: 8.00,
      status: CustomerStatus.ACTIVE
    },
    {
      id: '4',
      name: "Carlos Souza",
      email: "carlos@email.com",
      phone: "(11) 96666-6666",
      cpf: "456.789.012-33",
      city: "João Pessoa",
      state: "Paraíba",
      createdAt: new Date("2023-04-01"),
      dateOfBirth: new Date("1998-09-10"),
      totalPurchases: 28,
      totalActiveCashback: 0.00,
      status: CustomerStatus.INACTIVE
    },
    {
      id: '5',
      name: "Paula Costa",
      email: "paula@email.com",
      phone: "(11) 95555-5555",
      cpf: "567.890.123-44",
      city: "João Pessoa",
      state: "Paraíba",
      createdAt: new Date("2023-05-01"),
      dateOfBirth: new Date("1998-09-10"),
      totalPurchases: 25,
      totalActiveCashback: 35.00,
      status: CustomerStatus.ABSENT
    }
  ];
  // Filtros
  searchTerm: string = '';
  currentStatusFilters: CustomerStatus[] = [];
  // Lista de clientes filtrada para exibição
  filteredCustomers: Customer[] = [...this.allCustomers];
  // Captura cliente selecionado na tabela
  selectedCustomer?: Customer;

  // Filtra os clientes com base no termo de busca
  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  // Filtra is clientes com base nos status selecionados
  onFilterStatus(statuses: CustomerStatus[]): void {
    this.currentStatusFilters = statuses;
    this.applyFilters();
    console.log('Status selecionados para filtro:', this.currentStatusFilters);
  }

  applyFilters(): void {
    this.filteredCustomers = this.allCustomers.filter(customer => {
      const matchesSearchTerm =
        // verifica se o nome, cpf ou e-mail bate com a busca
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.cpf.includes(this.searchTerm) ||
        customer.email.toLowerCase().includes(this.searchTerm)

      const matchesStatusSearch =
        // verifica se o status do cliente bate com os filtros selecionados
        this.currentStatusFilters.length === 0 ||
        this.currentStatusFilters.includes(customer.status);

      // retorno do filter
      return matchesSearchTerm && matchesStatusSearch;
    });
  }

  // Abre o modal de novo cliente
  onAddCustomer(): void {
    // abertura de modal gerenciada pelo bootstrap ***
  }

  // Atribui o cliente selecionado ao modal de detalhes
  onSelectCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
  }
}
