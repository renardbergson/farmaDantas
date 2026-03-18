export const CASHBACK_CONFIG = {
  /** Porcentagem da compra que vira cashback (ex.: 10 = 10%) */
  cashbackGenerationRate: 0.10,
  /** Taxa para minPurchaseValue = cashbackValue / rate (0.10 = 10%) */
  cashbackRedemptionRate: 0.10,
} as const;