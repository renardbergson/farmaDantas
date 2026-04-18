export type { Person } from './person.model';
export type {
  Customer,
  ListCustomersResponse,
  CustomerDetailsResponse,
  CreateAddressRequest,
  CreatePersonRequest,
  CreateCustomerRequest,
  CreateCustomerResponse,
  UpdateCustomerResponse,
  CustomersSessionStats,
  PurchasesThisMonth,
  ActiveCashback,
  CashbackLifetime,
  PurchaseModeThisMonth,
} from './customer.model';
export { CustomerStatus } from './customer.model';
export type { Cashback, ListCashbacksResponse } from './cashback.model';
export { CashbackStatus } from './cashback.model';
export type {
  Purchase,
  ListPurchasesResponse,
  CreatePurchaseRequest,
  CreatePurchaseResponse,
  GeneratedCashbackInfo,
  UsedCashbackInfo,
  PurchaseDetailsResponse,
  PurchaseSessionStats,
} from './purchase.model';
export { PurchaseCategory, PurchaseMode, PaymentMethod } from './purchase.model';
export type {
  User,
  ListUsersResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UpdateUserRoleRequest,
  UpdateUserRoleResponse,
} from './user';
export { UserRole } from './user';
export type { Address, AddressResponse } from './adress.model';
export type {
  DashboardCustomersStats,
  DashboardTop5Customer,
  DashboardPurchasesStats,
  DashboardCashbacksStats,
  DashboardReturningCustomersStats,
  DashboardStatsResponse,
} from './dashboard-stats.model';