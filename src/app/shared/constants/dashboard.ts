import { DashboardStatsResponse } from "../models";

export const emptyDashboardStats: DashboardStatsResponse = {
  customers: {
    totalCustomers: 0,
    newCustomersToday: 0,
  },
  purchases: {
    purchasesThisMonth: 0,
    purchasesAmountThisMonth: 0,
    top5CustomersThisMonth: [],
  },
  cashbacks: {
    activeCashbacks: 0,
    activeCashbacksAmount: 0,
    recentCashbacks: [],
    lastSixMonths: [],
  },
  returningCustomers: {
    returningCustomersThisMonth: 0,
  },
};