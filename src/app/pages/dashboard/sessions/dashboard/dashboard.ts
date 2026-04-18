import { Component } from '@angular/core';
import {
  DashboardHeader,
  DashboardStatsGrid,
  DashboardMonthlyCashbackValues,
  DashboardMonthlyCashbackCount,
  DashboardTopCustomers,
  DashboardRecentCashbacks
} from './components/index';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardHeader, DashboardStatsGrid, DashboardMonthlyCashbackValues, DashboardMonthlyCashbackCount, DashboardTopCustomers, DashboardRecentCashbacks],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
}
