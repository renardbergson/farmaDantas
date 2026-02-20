import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerService, RecentCashback } from '../../../../../../shared/services/customer.service';
import { CashbackStatus } from '../../../../../../shared/models/cashback.model';
@Component({
  selector: 'app-dashboard-recent-cashbacks',
  imports: [CommonModule],
  templateUrl: './dashboard-recent-cashbacks.component.html',
  styleUrl: './dashboard-recent-cashbacks.component.css',
})
export class DashboardRecentCashbacks implements OnInit {
  recentCashbacks: RecentCashback[] = [];
  CashbackStatus = CashbackStatus;

  constructor(
    private router: Router,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.getLast4Cashbacks();
  }

  viewAllCashbacks(): void {
    this.router.navigate(['/user/cashbacks']);
  }

  getLast4Cashbacks() {
    this.customerService.getLastCashbacks().subscribe({
      next: (data) => {
        this.recentCashbacks = data;
      },
      error: (error) => {
        console.error('Erro ao obter cashbacks recentes:', error);
      }
    })
  }
}
