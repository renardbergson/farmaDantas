import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerService, TopCustomer } from '../../../../../../shared/services/customer.service';

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
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.loadTop5CustomesThisMonth();
  }

  viewAllCustomers(): void {
    this.router.navigate(['/user/customers']);
  }

  loadTop5CustomesThisMonth() {
    this.customerService.getTop5CustomersThisMonth().subscribe({
      next: (data) => {
        this.top5CustomersThisMonth = data;
      },
      error: (error) => {
        console.error('Erro ao carregar os top 5 clientes:', error);
      }
    });
  }
}
