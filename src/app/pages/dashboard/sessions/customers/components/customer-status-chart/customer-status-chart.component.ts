import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersSessionStats, CustomerStatus } from '../../../../../../shared/models';
import { CustomerStatusLabelPipe } from '../../../../../../shared/pipes';
import { catchError, Observable, of, startWith } from 'rxjs';
import { CustomerService, FeedbackService } from '../../../../../../shared/services';

const emptyStats: CustomersSessionStats = {
  total: 0,
  byStatus: {
    [CustomerStatus.NEW]: 0,
    [CustomerStatus.ACTIVE]: 0,
    [CustomerStatus.ABSENT]: 0,
    [CustomerStatus.INACTIVE]: 0
  }
};

@Component({
  selector: 'app-customer-status-chart',
  standalone: true,
  imports: [CommonModule, CustomerStatusLabelPipe],
  templateUrl: './customer-status-chart.component.html',
  styleUrl: './customer-status-chart.component.css'
})
export class CustomerStatusChart {
  readonly stats$: Observable<CustomersSessionStats>;

  readonly statusMetrics = [
    {
      status: CustomerStatus.NEW,
      description: 'Recém cadastrado ou sem compras',
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

  constructor(
    private customerService: CustomerService,
    private feedback: FeedbackService
  ) {
    this.stats$ = this.customerService.stats$.pipe(
      catchError((err) => {
        this.feedback.apiError(err, 'Erro ao tentar carregar estatísticas de clientes');
        console.error('Erro ao tentar carregar estatísticas de clientes:', err);
        return of(emptyStats);
      }),
      startWith(emptyStats) // fallback
    )
  }
}
