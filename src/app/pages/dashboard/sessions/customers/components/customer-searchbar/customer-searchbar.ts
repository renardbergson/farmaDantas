import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerStatus } from '../../../../../../shared/models';

export interface CustomerFilters {
  term: string;
  statuses: CustomerStatus[];
}

@Component({
  selector: 'app-customer-searchbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-searchbar.html',
  styleUrl: './customer-searchbar.css',
})
export class CustomerSearchbar {
  @Output() filtersChange = new EventEmitter<CustomerFilters>();

  searchTerm: string = '';
  selectedStatuses: Set<CustomerStatus> = new Set();

  constructor() { }

  statusStyles: Record<CustomerStatus, string> = {
    [CustomerStatus.NEW]: 'filter-new',
    [CustomerStatus.ACTIVE]: 'filter-active',
    [CustomerStatus.ABSENT]: 'filter-absent',
    [CustomerStatus.INACTIVE]: 'filter-inactive'
  };
  statuses = Object.values(CustomerStatus).map(status => ({
    value: status,
    class: this.statusStyles[status]
  }));

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.emitFilters();
  }

  toggleStatus(status: CustomerStatus): void {
    if (this.selectedStatuses.has(status)) {
      this.selectedStatuses.delete(status);
    } else {
      this.selectedStatuses.add(status);
    }

    const totalEnumStatusCount = Object.values(CustomerStatus).length;
    if (this.selectedStatuses.size === totalEnumStatusCount) {
      this.selectedStatuses = new Set();
    }

    this.emitFilters();
  }

  private emitFilters(): void {
    this.filtersChange.emit({
      term: this.searchTerm,
      statuses: Array.from(this.selectedStatuses)
    });
  }
}
