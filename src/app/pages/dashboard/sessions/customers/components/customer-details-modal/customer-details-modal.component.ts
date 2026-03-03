import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer, CustomerStatus } from '../../../../../../shared/models';
import { getInitials } from '../../../../../../shared/utils/getInitials';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-customer-details-modal',
  standalone: true,
  imports: [CommonModule, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './customer-details-modal.component.html',
  styleUrl: './customer-details-modal.component.css'
})
export class CustomerDetailsModal {
  @Input() customer?: Customer;
  protected readonly CustomerStatus = CustomerStatus;
  protected readonly getInitials = getInitials;

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
