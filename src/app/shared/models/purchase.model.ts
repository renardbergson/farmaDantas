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
  total: number;
  category: PurchaseCategory;
  customerId: string;
  customerName: string;
  employeeId: string,
  employeeName: string,
  paymentMethods: PaymentMethod[];

  // OPCIONAIS
  generatedCashbackId?: string; // id do cashback gerado
  generatedCashbackAmount?: number;
  cashbackPercent?: number;
  usedCashbackId?: string;     // id do cashback resgatado
  usedCashbackAmount?: number;
}
