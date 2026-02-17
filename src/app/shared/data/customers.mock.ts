import { Customer, CustomerStatus } from '../models/customer.model';
import { CashbackStatus } from '../models/cashback.model';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'k2w1',
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(83) 99999-9999",
    cpf: "123.456.789-00",
    city: "Santa Luzia",
    state: "Paraíba",
    createdAt: new Date("2026-02-01"),
    dateOfBirth: new Date("1992-08-01"),
    purchasesCount: 2,
    totalActiveCashback: 15.00,
    totalCashbackValueGenerated: 15.00,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p1a2',
        customerId: 'k2w1',
        date: new Date('2026-02-05'),
        totalValue: 100.00,
        cashbackValueGenerated: 10.00
      },
      {
        id: 'p1a3',
        customerId: 'k2w1',
        date: new Date('2026-02-12'),
        totalValue: 50.00,
        cashbackValueGenerated: 5.00
      }
    ],
    cashbacks: [
      {
        id: 'c1b3',
        customerId: 'k2w1',
        originPurchaseId: 'p1a2',
        createdAt: new Date('2026-02-05'),
        validUntil: new Date('2026-03-05'),
        value: 10.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 20.00
      },
      {
        id: 'c1b4',
        customerId: 'k2w1',
        originPurchaseId: 'p1a3',
        createdAt: new Date('2026-02-12'),
        validUntil: new Date('2026-03-12'),
        value: 5.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 20.00
      }
    ]
  },
  {
    id: 'j8n4',
    name: "João Santos",
    email: "joao@email.com",
    phone: "(83) 98888-8888",
    cpf: "234.567.890-11",
    city: "João Pessoa",
    state: "Paraíba",
    createdAt: new Date("2025-11-10"),
    dateOfBirth: new Date("1990-05-15"),
    purchasesCount: 3,
    totalActiveCashback: 20.00,
    totalCashbackValueGenerated: 45.00,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p3m9',
        customerId: 'j8n4',
        date: new Date('2026-01-10'),
        totalValue: 200.00,
        cashbackValueGenerated: 20.00
      },
      {
        id: 'p4k2',
        customerId: 'j8n4',
        date: new Date('2026-02-02'),
        totalValue: 150.00,
        cashbackValueGenerated: 15.00
      },
      {
        id: 'p5l1',
        customerId: 'j8n4',
        date: new Date('2026-02-15'),
        totalValue: 100.00,
        cashbackValueGenerated: 10.00
      }
    ],
    cashbacks: [
      {
        id: 'c4x5',
        customerId: 'j8n4',
        originPurchaseId: 'p4k2',
        createdAt: new Date('2026-02-02'),
        validUntil: new Date('2026-03-02'),
        value: 15.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 40.00
      },
      {
        id: 'c5z2',
        customerId: 'j8n4',
        originPurchaseId: 'p5l1',
        createdAt: new Date('2026-02-15'),
        validUntil: new Date('2026-03-15'),
        value: 10.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 30.00
      }
    ]
  },
  {
    id: 'a1o9',
    name: "Ana Oliveira",
    email: "ana@email.com",
    phone: "(83) 91111-1111",
    cpf: "345.678.901-22",
    city: "Campina Grande",
    state: "Paraíba",
    createdAt: new Date("2025-12-05"),
    dateOfBirth: new Date("1995-02-20"),
    purchasesCount: 1,
    totalActiveCashback: 8.00,
    totalCashbackValueGenerated: 8.00,
    status: CustomerStatus.NEW,
    purchases: [
      {
        id: 'p6q7',
        customerId: 'a1o9',
        date: new Date('2026-02-08'),
        totalValue: 80.00,
        cashbackValueGenerated: 8.00
      }
    ],
    cashbacks: [
      {
        id: 'c6y8',
        customerId: 'a1o9',
        originPurchaseId: 'p6q7',
        createdAt: new Date('2026-02-08'),
        validUntil: new Date('2026-03-08'),
        value: 8.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 30.00
      }
    ]
  },
  {
    id: 'r3t9',
    name: "Ricardo Teixeira",
    email: "ricardo@email.com",
    phone: "(83) 98765-4321",
    cpf: "678.901.234-55",
    city: "João Pessoa",
    state: "Paraíba",
    createdAt: new Date("2026-01-05"),
    dateOfBirth: new Date("1985-03-12"),
    purchasesCount: 2,
    totalActiveCashback: 25.00,
    totalCashbackValueGenerated: 25.00,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p4e1',
        customerId: 'r3t9',
        date: new Date('2026-01-20'),
        totalValue: 150.00,
        cashbackValueGenerated: 15.00
      },
      {
        id: 'p4e2',
        customerId: 'r3t9',
        date: new Date('2026-02-10'),
        totalValue: 100.00,
        cashbackValueGenerated: 10.00
      }
    ],
    cashbacks: [
      {
        id: 'c5r2',
        customerId: 'r3t9',
        originPurchaseId: 'p4e2',
        createdAt: new Date('2026-02-10'),
        validUntil: new Date('2026-03-10'),
        value: 10.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 50.00
      }
    ]
  },
  {
    id: 'm1n8',
    name: "Marcos Neves",
    email: "marcos@email.com",
    phone: "(83) 99887-7665",
    cpf: "890.123.456-77",
    city: "Cabedelo",
    state: "Paraíba",
    createdAt: new Date("2026-02-16"),
    dateOfBirth: new Date("1980-12-05"),
    purchasesCount: 0,
    totalActiveCashback: 0.00,
    totalCashbackValueGenerated: 0.00,
    status: CustomerStatus.NEW,
    purchases: [],
    cashbacks: []
  }
];
