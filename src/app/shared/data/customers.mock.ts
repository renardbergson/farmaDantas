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
    status: CustomerStatus.ACTIVE,
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

  /* ... todos os outros clientes permanecem exatamente iguais ... */

  {
    id: 'c7w0',
    name: "Carla Dias",
    email: "carla@email.com",
    phone: "(83) 92211-0099",
    cpf: "456.789.012-34",
    city: "Pombal",
    state: "Paraíba",
    createdAt: new Date("2026-01-08"),
    dateOfBirth: new Date("1986-03-08"),
    purchasesCount: 4,
    totalActiveCashback: 35.00,
    totalCashbackValueGenerated: 35.00,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p24q0',
        customerId: 'c7w0',
        date: new Date('2026-02-05'),
        totalValue: 120.00,
        cashbackValueGenerated: 12.00
      },
      {
        id: 'p24q1',
        customerId: 'c7w0',
        date: new Date('2026-02-10'),
        totalValue: 90.00,
        cashbackValueGenerated: 9.00
      },
      {
        id: 'p24q2',
        customerId: 'c7w0',
        date: new Date('2026-02-18'),
        totalValue: 80.00,
        cashbackValueGenerated: 8.00
      },
      {
        id: 'p24q3',
        customerId: 'c7w0',
        date: new Date('2026-02-17'), // corrigido
        totalValue: 60.00,
        cashbackValueGenerated: 6.00
      }
    ],
    cashbacks: [
      {
        id: 'c18m2',
        customerId: 'c7w0',
        originPurchaseId: 'p24q0',
        createdAt: new Date('2026-02-05'),
        validUntil: new Date('2026-03-05'),
        value: 12.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 30.00
      },
      {
        id: 'c18m3',
        customerId: 'c7w0',
        originPurchaseId: 'p24q1',
        createdAt: new Date('2026-02-10'),
        validUntil: new Date('2026-03-10'),
        value: 9.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 25.00
      },
      {
        id: 'c18m4',
        customerId: 'c7w0',
        originPurchaseId: 'p24q2',
        createdAt: new Date('2026-02-18'),
        validUntil: new Date('2026-03-18'),
        value: 8.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 20.00
      },
      {
        id: 'c18m5',
        customerId: 'c7w0',
        originPurchaseId: 'p24q3',
        createdAt: new Date('2026-02-17'), // corrigido
        validUntil: new Date('2026-03-17'),
        value: 6.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 15.00
      }
    ]
  },
  {
    id: 'r8s1',
    name: "Roberto Lima",
    email: "roberto@email.com",
    phone: "(83) 91100-9988",
    cpf: "567.890.123-45",
    city: "Campina Grande",
    state: "Paraíba",
    createdAt: new Date("2026-02-01"),
    dateOfBirth: new Date("1982-05-14"),
    purchasesCount: 3,
    totalActiveCashback: 28.00,
    totalCashbackValueGenerated: 28.00,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p25r0',
        customerId: 'r8s1',
        date: new Date('2026-02-08'),
        totalValue: 140.00,
        cashbackValueGenerated: 14.00
      },
      {
        id: 'p25r1',
        customerId: 'r8s1',
        date: new Date('2026-02-16'),
        totalValue: 85.00,
        cashbackValueGenerated: 8.00
      },
      {
        id: 'p25r2',
        customerId: 'r8s1',
        date: new Date('2026-02-18'), // corrigido
        totalValue: 60.00,
        cashbackValueGenerated: 6.00
      }
    ],
    cashbacks: [
      {
        id: 'c19n0',
        customerId: 'r8s1',
        originPurchaseId: 'p25r0',
        createdAt: new Date('2026-02-08'),
        validUntil: new Date('2026-03-08'),
        value: 14.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 35.00
      },
      {
        id: 'c19n1',
        customerId: 'r8s1',
        originPurchaseId: 'p25r1',
        createdAt: new Date('2026-02-16'),
        validUntil: new Date('2026-03-16'),
        value: 8.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 20.00
      },
      {
        id: 'c19n2',
        customerId: 'r8s1',
        originPurchaseId: 'p25r2',
        createdAt: new Date('2026-02-18'), // corrigido
        validUntil: new Date('2026-03-18'),
        value: 6.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 15.00
      }
    ]
  }
];
