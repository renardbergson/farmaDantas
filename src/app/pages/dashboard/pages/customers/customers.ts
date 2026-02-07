import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers {
  customers = [
    {
      id: 1,
      name: "Maria Silva",
      email: "maria@email.com",
      phone: "(11) 99999-9999",
      cpf: "123.456.789-00",
      totalPurchases: 45,
      totalActiveCashback: 45.00,
      status: "active"
    },
    {
      id: 2,
      name: "João Santos",
      email: "joao@email.com",
      phone: "(11) 98888-8888",
      cpf: "234.567.890-11",
      totalPurchases: 38,
      totalActiveCashback: 22.50,
      status: "active"
    },
    {
      id: 3,
      name: "Ana Oliveira",
      email: "ana@email.com",
      phone: "(11) 97777-7777",
      cpf: "345.678.901-22",
      totalPurchases: 32,
      totalActiveCashback: 8.00,
      status: "active"
    },
    {
      id: 4,
      name: "Carlos Souza",
      email: "carlos@email.com",
      phone: "(11) 96666-6666",
      cpf: "456.789.012-33",
      totalPurchases: 28,
      totalActiveCashback: 0.00,
      status: "inactive"
    },
    {
      id: 5,
      name: "Paula Costa",
      email: "paula@email.com",
      phone: "(11) 95555-5555",
      cpf: "567.890.123-44",
      totalPurchases: 25,
      totalActiveCashback: 35.00,
      status: "active"
    }
  ];

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  newPurchase(): void {
    console.log('Nova compra clicada');
  }

  newCustomer(): void {
    console.log('Novo cliente clicado');
  }
}
