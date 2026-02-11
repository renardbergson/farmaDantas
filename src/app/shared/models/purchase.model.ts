export interface Purchase {
  id: string;
  customerId: string;
  date: Date;
  totalValue: number;
  cashbackValueGenerated: number; // Valor de cashback gerado
  cashbackUsed?: number;          // Cashback resgatado
  usedCashbackId?: string;        // id do cashback resgatado
}
