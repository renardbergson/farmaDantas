export interface DashboardCustomersStats {
  totalCustomers: number;
  newCustomersToday: number;
}

export interface DashboardPurchasesStats {
  purchasesThisMonth: number;
  purchasesAmountThisMonth: number;
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