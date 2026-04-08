import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer, CustomerStatus } from '../../../../../../shared/models';
import { CustomerStatusLabelPipe } from '../../../../../../shared/pipes';

@Component({
  selector: 'app-customer-status-chart',
  standalone: true,
  imports: [CommonModule, CustomerStatusLabelPipe],
  templateUrl: './customer-status-chart.component.html',
  styleUrl: './customer-status-chart.component.css'
})
export class CustomerStatusChart implements OnChanges {
  @Input() customers: Customer[] = [];
  statusCounts: Record<CustomerStatus, number> = this.createEmptyStatusCounts();

  readonly statusMetrics = [
    {
      status: CustomerStatus.NEW,
      description: 'Recém cadastrado, nenhuma compra',
      class: 'badge-new',
      icon: 'bi-person-plus'
    },
    {
      status: CustomerStatus.ACTIVE,
      description: 'Comprou nos últimos 60 dias',
      class: 'badge-active',
      icon: 'bi-check-circle'
    },
    {
      status: CustomerStatus.ABSENT,
      description: 'Última compra entre 61 e 120 dias',
      class: 'badge-absent',
      icon: 'bi-clock-history'
    },
    {
      status: CustomerStatus.INACTIVE,
      description: 'Última compra há mais de 120 dias',
      class: 'badge-inactive',
      icon: 'bi-x-circle'
    }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customers']) {
      this.calculateCounts();
    }
  }

  private createEmptyStatusCounts(): Record<CustomerStatus, number> {
    return {
      [CustomerStatus.NEW]: 0,
      [CustomerStatus.ACTIVE]: 0,
      [CustomerStatus.ABSENT]: 0,
      [CustomerStatus.INACTIVE]: 0
    };
  }

  private calculateCounts(): void {
    // Reset counts
    this.statusCounts = this.createEmptyStatusCounts();
    // calculate
    this.customers.forEach(customer => {
      if (this.statusCounts[customer.status] !== undefined) {
        this.statusCounts[customer.status]++;
      }
    });
  }
}
