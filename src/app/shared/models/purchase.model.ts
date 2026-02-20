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
  date: Date;
  total: number;
  category: PurchaseCategory;
  customerId: string;
  customerName: string;
  employeeId: string,
  employeeName: string,

  // OPCIONAIS
  generatedCashbackId?: string; // id do cashback gerado
  generatedCashbackAmount?: number;
  usedCashbackId?: string;     // id do cashback resgatado
  usedCashbackAmount?: number;
}
