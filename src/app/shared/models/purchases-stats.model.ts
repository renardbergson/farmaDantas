export interface PurchasesStats {
  totalCustomers: number;
  newCustomersToday: number;
  newCustomersChange: number;
  purchasesToday: number;
  purchasesAmountToday: number;
  purchasesThisMonth: number;
  purchasesAmountThisMonth: number;
  purchasesChange: number;
  activeCashbacks: number;
  activeCashbacksAmount: number;
  activeCashbacksChange: number;
  returnRateThisMonth: number;
  returningCustomersChange: number;
}

export interface PurchaseSessionStats {
  purchasesThisMonth: number;
  purchasesAmountThisMonth: number;
  purchasesToday: number;
  purchasesAmountToday: number;
}