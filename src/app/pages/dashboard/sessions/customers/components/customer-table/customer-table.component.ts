import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer, CustomerStatus } from '../../../../../../shared/models';
import { getInitials } from '../../../../../../shared/utils/getInitials';
import { provideNgxMask } from 'ngx-mask';
import { CustomerStatusLabelPipe } from '../../../../../../shared/pipes/customer-status-label.pipe';
@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [CommonModule, CustomerStatusLabelPipe],
  providers: [provideNgxMask()],
  templateUrl: './customer-table.component.html',
  styleUrl: './customer-table.component.css',
})
export class CustomerTable {
  @Input() customers: Customer[] = [];
  @Input() totalCustomers = 0;
  @Input() hasActiveFilters = false;
  @Output() viewDetails = new EventEmitter<Customer>();
  @Output() editCustomer = new EventEmitter<Customer>();
  @Output() deleteCustomer = new EventEmitter<Customer>();
  getInitials: (name: string) => string;
  sortByCreatedAt: 'desc' | 'asc' = 'desc';

  constructor() {
    this.getInitials = getInitials;
  }

  get sortedCustomers(): Customer[] {
    return [...this.customers].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return this.sortByCreatedAt === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }

  get showEmptyState(): boolean {
    return this.sortedCustomers.length === 0;
  }

  get emptyStateTitle(): string {
    return this.totalCustomers > 0 && this.hasActiveFilters
      ? 'Nenhum cliente encontrado'
      : 'Nenhum cliente cadastrado';
  }

  get emptyStateMessage(): string {
    return this.totalCustomers > 0 && this.hasActiveFilters
      ? 'Ajuste ou desative os filtros para ver outros resultados.'
      : 'Cadastre um cliente para começar a preencher esta tabela.';
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
