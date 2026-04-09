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
export type { TopCustomer } from './purchase.service';
export type { PurchasesStats } from '../models';

// USER SERVICE
export { UserService } from './user.service';


// FEEDBACK SERVICE
export { FeedbackService } from './feedback.service';