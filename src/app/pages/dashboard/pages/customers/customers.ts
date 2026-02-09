import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerHeader, CustomerModal, CustomerDetailsModal, CustomerSearchCard, CustomerTable, CustomerStatusChart} from './components';
import {Customer, CustomerStatus} from './customerModel';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    CustomerHeader,
    CustomerSearchCard,
    CustomerTable,
    CustomerModal,
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

  // Lista de clientes filtrada para exibição
  filteredCustomers: Customer[] = [...this.allCustomers];

  // Captura cliente selecionado na tabela
  selectedCustomer?: Customer;

  // Filtra os clientes com base no termo de busca
  onSearch(term: string): void {
    const searchTerm = term.toLowerCase();
    this.filteredCustomers = this.allCustomers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.cpf.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm)
    );
  }

  // Abre o modal de novo cliente
  onAddCustomer(): void {
    // abertura de modal gerenciada pelo bootstrap ***
    console.log('Abrir modal de novo cliente');
  }

  // Atribui o cliente selecionado ao modal de detalhes
  onSelectCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
  }
}
