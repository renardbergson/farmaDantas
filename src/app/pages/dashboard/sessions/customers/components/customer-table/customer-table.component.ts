import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Customer, CustomerStatus} from '../../../../../../shared/models/customer.model';
import {NgxMaskPipe, provideNgxMask} from 'ngx-mask';

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [CommonModule, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './customer-table.component.html',
  styleUrl: './customer-table.component.css',
})
export class CustomerTable {
  @Input() customers: Customer[] = [];
  @Output() viewDetails = new EventEmitter<Customer>();
  @Output() editCustomer = new EventEmitter<Customer>();
  @Output() deleteCustomer = new EventEmitter<Customer>();

  // Gera as iniciais do nome do cliente
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  onViewDetails(customer: Customer): void {
    this.viewDetails.emit(customer);
  }

  onEditCustomer(customer: Customer): void {
    this.editCustomer.emit(customer);
  }

  onDeleteCustomer(customer: Customer): void {
    this.deleteCustomer.emit(customer);
  }

  getStatusClass(status: CustomerStatus): string {
    switch (status) {
      case CustomerStatus.NEW: return 'badge-new';
      case CustomerStatus.ACTIVE: return 'badge-active';
      case CustomerStatus.ABSENT: return 'badge-absent';
      case CustomerStatus.INACTIVE: return 'badge-inactive';
      default: return 'badge-inactive';
    }
  }
}
