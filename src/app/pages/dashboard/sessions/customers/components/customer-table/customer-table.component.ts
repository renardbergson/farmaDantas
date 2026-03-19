import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer, CustomerStatus } from '../../../../../../shared/models';
import { getInitials } from '../../../../../../shared/utils/getInitials';
import { provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [CommonModule],
  providers: [provideNgxMask()],
  templateUrl: './customer-table.component.html',
  styleUrl: './customer-table.component.css',
})
export class CustomerTable {
  @Input() customers: Customer[] = [];
  sortByCreatedAt: 'desc' | 'asc' = 'desc';
  getInitials: (name: string) => string;
  @Output() viewDetails = new EventEmitter<Customer>();
  @Output() editCustomer = new EventEmitter<Customer>();
  @Output() deleteCustomer = new EventEmitter<Customer>();

  constructor() {
    this.getInitials = getInitials;
  }

  get sortedCustomers(): Customer[] {
    return [...this.customers].sort((a, b) => {
      const dateA = new Date(a.person.createdAt).getTime();
      const dateB = new Date(b.person.createdAt).getTime();
      return this.sortByCreatedAt === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }

  toggleSortByCreatedAt(): void {
    this.sortByCreatedAt = this.sortByCreatedAt === 'desc' ? 'asc' : 'desc';
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
