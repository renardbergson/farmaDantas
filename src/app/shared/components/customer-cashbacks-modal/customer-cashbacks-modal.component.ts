import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../../models/customer.model';
import { Cashback, CashbackStatus } from '../../models/cashback.model';

@Component({
  selector: 'app-customer-cashbacks-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-cashbacks-modal.component.html',
  styleUrl: './customer-cashbacks-modal.component.css'
})
export class CustomerCashbacksModal implements OnChanges {
  @Input() customer?: Customer;

  // Set que armazena os filtros de cashbacks selecionados
  statuses = Object.values(CashbackStatus).map(status => ({
    value: status,
    class: this.getFilterClass(status)
  }))
  selectedStatus: Set<CashbackStatus> = new Set();

  // Array de cashbacks filtrados com base nos status selecionados
  filteredCashbacks: Cashback[] = [];

  ngOnChanges(): void {
    // ngOnChanges() é um hook chamado sempre que o
    // valor de um @Input() é atribuido ou alterado
    this.applyFilters();
  }

  toggleStatus(status: CashbackStatus): void {
    if (this.selectedStatus.has(status)) {
      this.selectedStatus.delete(status);
    } else {
      this.selectedStatus.add(status);
    }

    const totalEnumStatusCount = Object.values(CashbackStatus).length;
    if (this.selectedStatus.size === totalEnumStatusCount) {
      this.selectedStatus.clear();
    }

    this.applyFilters();
  }

  getFilterClass(status: CashbackStatus): string {
    switch (status) {
      case CashbackStatus.ACTIVE: return 'filter-available';
      case CashbackStatus.USED: return 'filter-used';
      case CashbackStatus.EXPIRED: return 'filter-expired';
      default: return '';
    }
  }

  getStatusClass(status: CashbackStatus): string {
    switch (status) {
      case CashbackStatus.ACTIVE: return 'status-available';
      case CashbackStatus.USED: return 'status-used';
      case CashbackStatus.EXPIRED: return 'status-expired';
      default: return '';
    }
  }

  applyFilters(): void {
    if (!this.customer?.cashbacks) return;

    this.filteredCashbacks = this.selectedStatus.size === 0
      ? this.customer.cashbacks
      : this.customer.cashbacks.filter(cb => this.selectedStatus.has(cb.status));
  }
}
