import type { Cashback } from './cashback.model';

export enum PurchaseMode {
  IN_STORE = "Presencial",
  DELIVERY = "Delivery",
}

export enum PaymentMethod {
  CASH = 'Dinheiro',
  PIX = 'PIX',
  DEBIT_CARD = 'Cartão de débito',
  CREDIT_CARD = 'Cartão de crédito',
  OTHER = 'Outro',
}

export enum PurchaseCategory {
  ANTIBIOTIC = "Antibiótico",
  CONTRACEPTIVE = "Anticoncepcional",
  CONTINUOUS = "Contínuo",
  CONTROLLED = "Controlado",
  KIDS = "Infantil",
  SUPPLEMENTS = "Suplementos",
  ELDERLY = "Idoso",
}

export interface Purchase {
  id: string;
  mode: PurchaseMode;
  date: Date;
  totalValue: number;
  finalValue: number;
  category: PurchaseCategory;
  customerId: string;
  customerName: string;
  employeeId: string,
  employeeName: string,
  paymentMethods: PaymentMethod[];

  // opcionais (valor ou null)
  observations: string | null;
  usedCashbackGenerationRate: number | null;
  usedCashback: Cashback | null;
  generatedCashback: Cashback | null;
}
