// ADDRESS SERVICE
export { AddressService } from './address.service';
export type { ViaCepResponse, State, City } from './address.service';

// CASHBACK SERVICE
export { CashbackService } from './cashback.service';
export type { RecentCashback, MonthlyCashbackValueData, MonthlyCashbackCountData } from './cashback.service';

// CUSTOMER SERVICE
export { CustomerService } from './customer.service';
export type {
  createAddress,
  createPerson,
  updateAddress,
  updatePerson,
} from './customer.service';

// PURCHASE SERVICE
export { PurchaseService } from './purchase.service';

// USER SERVICE
export { UserService } from './user.service';


// FEEDBACK SERVICE
export { FeedbackService } from './feedback.service';

// DASHBOARD STATS SERVICE
export { DashboardStatsService } from './dashboard-stats.service';

// CUSTOMERS STATS SERVICE
export { CustomersStatsService } from './customers-stats.service';

// PURCHASES STATS SERVICE
export { PurchasesStatsService } from './purchases-stats.service';