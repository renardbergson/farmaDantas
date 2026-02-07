import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Customer, CustomerStatus} from '../../customerModel';

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-table.component.html',
  styleUrl: './customer-table.component.css',
})
export class CustomerTable {
  @Input() customers: Customer[] = [];

  // Gera as iniciais do nome do cliente
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  protected readonly CustomerStatus = CustomerStatus;
}
