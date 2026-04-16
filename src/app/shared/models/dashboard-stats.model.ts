export interface DashboardCustomersStats {
  totalCustomers: number;
  newCustomersToday: number;
}

export interface DashboardTop5Customer {
  name: string;
  purchasesCount: number;
  activeCashbackAmount: number;
}

export interface DashboardPurchasesStats {
  purchasesThisMonth: number;
  purchasesAmountThisMonth: number;
  top5CustomersThisMonth: DashboardTop5Customer[];
}

export interface DashboardCashbacksStats {
  activeCashbacks: number;
  activeCashbacksAmount: number;
}

export interface DashboardReturningCustomersStats {
  returningCustomersThisMonth: number;
}

export interface DashboardStatsResponse {
  customers: DashboardCustomersStats;
  purchases: DashboardPurchasesStats;
  cashbacks: DashboardCashbacksStats;
  returningCustomers: DashboardReturningCustomersStats;
}