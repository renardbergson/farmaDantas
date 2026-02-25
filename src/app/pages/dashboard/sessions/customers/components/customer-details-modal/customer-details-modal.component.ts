import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer, CustomerStatus } from '../../../../../../shared/models';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CustomerService, PurchaseModeData } from '../../../../../../shared/services/customer.service';

@Component({
  selector: 'app-customer-details-modal',
  standalone: true,
  imports: [CommonModule, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './customer-details-modal.component.html',
  styleUrl: './customer-details-modal.component.css'
})
export class CustomerDetailsModal implements OnChanges {
  @Input() customer?: Customer;
  protected readonly CustomerStatus = CustomerStatus;
  customerPurchaseModeData: PurchaseModeData = {
    in_store: 0,
    delivery: 0
  };

  constructor(private customerService: CustomerService) { }

  ngOnChanges(changes: SimpleChanges): void {
    const newCustomer = changes['customer']?.currentValue as Customer | undefined;
    if (newCustomer) {
      this.getPurchaseModeData(newCustomer);
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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

  getPurchaseModeData(customer: Customer): void {
    this.customerService.getPurchaseModeData(customer).subscribe({
      next: (data) => {
        this.customerPurchaseModeData = data;
      },
      error: (err) => console.error('Ocorreu um erro ao tentar obter as modalidades de compra do cliente:', err)
    })
  }

  getMonthlyAveragePerPurchase(customer: Customer): number {
    if (!customer.purchasesThisMonthCount) return 0;
    return customer.purchasesThisMonthAmount / customer.purchasesThisMonthCount;
  }
}
