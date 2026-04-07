import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  CustomerService,
  CashbackService,
  PurchaseService,
  TopCustomer
} from '../../../../../../shared/services';

@Component({
  selector: 'app-dashboard-top-customers',
  imports: [CommonModule],
  templateUrl: './dashboard-top-customers.component.html',
  styleUrl: './dashboard-top-customers.component.css',
})
export class DashboardTopCustomers implements OnInit {
  top5CustomersThisMonth: TopCustomer[] = [];

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private cashbackService: CashbackService,
    private purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
    this.loadTop5CustomersThisMonth();
  }

  viewAllCustomers(): void {
    this.router.navigate(['/user/customers']);
  }

  loadTop5CustomersThisMonth() {
    forkJoin({
      customers: this.customerService.getCustomers(),
      purchases: this.purchaseService.getPurchases(),
      cashbacks: this.cashbackService.getCashbacks(),
    }).subscribe({
      next: ({ customers, purchases, cashbacks }) => {
        const cashbackStats = this.cashbackService.getCashbackStatsByCustomer(customers, cashbacks);
        this.top5CustomersThisMonth = this.purchaseService.getTop5CustomersThisMonth(
          customers,
          purchases,
          cashbackStats,
        );
      },
      error: (error) => {
        console.error('Ocorreu um erro ao tentar carregar os top 5 clientes:', error);
      }
    });
  }
}