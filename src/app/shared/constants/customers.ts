import { CustomersSessionStats, CustomerStatus } from "../models";

export const emptyStats: CustomersSessionStats = {
  total: 0,
  byStatus: {
    [CustomerStatus.NEW]: 0,
    [CustomerStatus.ACTIVE]: 0,
    [CustomerStatus.ABSENT]: 0,
    [CustomerStatus.INACTIVE]: 0
  }
};