import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Customer} from '../../models/customer.model';
import {Cashback, CashbackStatus} from '../../models/cashback.model';

@Component({
  selector: 'app-customer-cashbacks-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-cashbacks-modal.component.html',
  styleUrl: './customer-cashbacks-modal.component.css'
})
export class CustomerCashbacksModal {
  @Input() customer?: Customer;

  getStatusClass(status: CashbackStatus): string {
    switch (status) {
      case CashbackStatus.AVAILABLE: return 'status-available';
      case CashbackStatus.USED: return 'status-used';
      case CashbackStatus.EXPIRED: return 'status-expired';
      default: return '';
    }
  }
}
