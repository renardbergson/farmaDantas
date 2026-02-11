import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Customer, CustomerStatus} from '../../../../../../shared/models/customer.model';

@Component({
  selector: 'app-customer-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-details-modal.component.html',
  styleUrl: './customer-details-modal.component.css'
})
export class CustomerDetailsModal {
  @Input() customer?: Customer;

  // Gera as iniciais do nome do cliente
  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  protected readonly CustomerStatus = CustomerStatus;

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
