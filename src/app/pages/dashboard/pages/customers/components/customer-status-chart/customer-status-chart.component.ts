import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer, CustomerStatus } from '../../customerModel';

@Component({
  selector: 'app-customer-status-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-status-chart.component.html',
  styleUrl: './customer-status-chart.component.css'
})
export class CustomerStatusChart implements OnChanges {
  @Input() customers: Customer[] = [];

  statusCounts = {
    [CustomerStatus.NEW]: 0,
    [CustomerStatus.ACTIVE]: 0,
    [CustomerStatus.ABSENT]: 0,
    [CustomerStatus.INACTIVE]: 0
  };

  statusMetrics = [
    {
      status: CustomerStatus.NEW,
      label: 'Novo',
      description: 'Cadastrado, sem nenhuma compra',
      class: 'badge-new',
      icon: 'bi-person-plus'
    },
    {
      status: CustomerStatus.ACTIVE,
      label: 'Ativo',
      description: 'Comprou nos últimos 60 dias',
      class: 'badge-active',
      icon: 'bi-check-circle'
    },
    {
      status: CustomerStatus.ABSENT,
      label: 'Ausente',
      description: 'Última compra entre 61 e 120 dias',
      class: 'badge-absent',
      icon: 'bi-clock-history'
    },
    {
      status: CustomerStatus.INACTIVE,
      label: 'Inativo',
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

  private calculateCounts(): void {
    // Reset counts
    this.statusCounts = {
      [CustomerStatus.NEW]: 0,
      [CustomerStatus.ACTIVE]: 0,
      [CustomerStatus.ABSENT]: 0,
      [CustomerStatus.INACTIVE]: 0
    };

    this.customers.forEach(customer => {
      if (this.statusCounts[customer.status] !== undefined) {
        this.statusCounts[customer.status]++;
      }
    });
  }

  getPercentage(status: CustomerStatus): number {
    if (this.customers.length === 0) return 0;
    return (this.statusCounts[status] / this.customers.length) * 100;
  }
}
