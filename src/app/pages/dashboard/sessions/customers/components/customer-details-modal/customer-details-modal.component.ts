import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Customer,
  CustomerDetailsResponse,
  CustomerStatus,
} from '../../../../../../shared/models';
import { CustomerService } from '../../../../../../shared/services';
import { getInitials } from '../../../../../../shared/utils/getInitials';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-customer-details-modal',
  standalone: true,
  imports: [CommonModule, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './customer-details-modal.component.html',
  styleUrl: './customer-details-modal.component.css',
})
export class CustomerDetailsModal implements OnChanges {
  @Input() customer?: Customer;
  customerDetails: CustomerDetailsResponse | null = null;

  protected readonly CustomerStatus = CustomerStatus;
  protected readonly getInitials = getInitials;

  constructor(private customerService: CustomerService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['customer']) return;

    if (this.customer?.id) {
      this.customerService.getCustomerDetails(this.customer.id).subscribe({
        next: (details) => (this.customerDetails = details),
        error: (err) => console.error('Erro ao carregar detalhes do cliente:', err),
      });
    } else {
      this.customerDetails = null;
    }
  }

  getStatusClass(status: CustomerStatus): string {
    switch (status) {
      case CustomerStatus.NEW:
        return 'badge-new';
      case CustomerStatus.ACTIVE:
        return 'badge-active';
      case CustomerStatus.ABSENT:
        return 'badge-absent';
      case CustomerStatus.INACTIVE:
        return 'badge-inactive';
      default:
        return 'badge-inactive';
    }
  }
}