import {Customer, CustomerStatus} from '../models/customer.model';
import {CashbackStatus} from '../models/cashback.model';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'k2w1',
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(83) 99999-9999",
    cpf: "123.456.789-00",
    city: "Santa Luzia",
    state: "Paraíba",
    createdAt: new Date("2023-01-01"),
    dateOfBirth: new Date("1992-08-01"),
    purchasesCount: 1,
    totalActiveCashback: 10.00,
    totalCashbackValueGenerated: 10.00,
    status: CustomerStatus.NEW,
    purchases: [
      {
        id: 'p1a2',
        customerId: 'k2w1',
        date: new Date('2024-01-15'),
        totalValue: 100.00,
        cashbackValueGenerated: 10.00
      }
    ],
    cashbacks: [
      {
        id: 'c1b3',
        customerId: 'k2w1',
        originPurchaseId: 'p1a2',
        createdAt: new Date('2024-01-15'),
        validUntil: new Date('2024-02-15'),
        value: 10.00,
        status: CashbackStatus.AVAILABLE,
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
    createdAt: new Date("2023-02-01"),
    dateOfBirth: new Date("1990-05-15"),
    purchasesCount: 3,
    totalActiveCashback: 32.50,
    totalCashbackValueGenerated: 62.50,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p3m9',
        customerId: 'j8n4',
        date: new Date('2023-12-10'),
        totalValue: 300.00,
        cashbackValueGenerated: 30.00
      },
      {
        id: 'p4k2',
        customerId: 'j8n4',
        date: new Date('2024-01-20'),
        totalValue: 200.00,
        cashbackValueGenerated: 20.00
      },
      {
        id: 'p5l1',
        customerId: 'j8n4',
        date: new Date('2024-02-05'),
        totalValue: 125.00,
        cashbackValueGenerated: 12.50,
        cashbackUsed: 15.00,
        usedCashbackId: 'c3v8'
      }
    ],
    cashbacks: [
      {
        id: 'c3v8',
        customerId: 'j8n4',
        originPurchaseId: 'p3m9',
        createdAt: new Date('2023-12-10'),
        validUntil: new Date('2024-01-10'),
        value: 15.00,
        status: CashbackStatus.USED,
        usedInPurchaseId: 'p5l1',
        minPurchaseValue: 60.00
      },
      {
        id: 'c4x5',
        customerId: 'j8n4',
        originPurchaseId: 'p4k2',
        createdAt: new Date('2024-01-20'),
        validUntil: new Date('2024-02-20'),
        value: 20.00,
        status: CashbackStatus.AVAILABLE,
        minPurchaseValue: 40.00
      },
      {
        id: 'c5z2',
        customerId: 'j8n4',
        originPurchaseId: 'p5l1',
        createdAt: new Date('2024-02-05'),
        validUntil: new Date('2024-03-05'),
        value: 12.50,
        status: CashbackStatus.AVAILABLE,
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
    createdAt: new Date("2023-03-01"),
    dateOfBirth: new Date("1995-02-20"),
    purchasesCount: 2,
    totalActiveCashback: 25.00,
    totalCashbackValueGenerated: 25.00,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p6q7',
        customerId: 'a1o9',
        date: new Date('2023-12-15'),
        totalValue: 150.00,
        cashbackValueGenerated: 15.00
      },
      {
        id: 'p7w3',
        customerId: 'a1o9',
        date: new Date('2024-01-10'),
        totalValue: 100.00,
        cashbackValueGenerated: 10.00
      }
    ],
    cashbacks: [
      {
        id: 'c6y8',
        customerId: 'a1o9',
        originPurchaseId: 'p6q7',
        createdAt: new Date('2023-12-15'),
        validUntil: new Date('2024-02-15'),
        value: 15.00,
        status: CashbackStatus.AVAILABLE,
        minPurchaseValue: 30.00
      },
      {
        id: 'c7u2',
        customerId: 'a1o9',
        originPurchaseId: 'p7w3',
        createdAt: new Date('2024-01-10'),
        validUntil: new Date('2024-02-10'),
        value: 10.00,
        status: CashbackStatus.AVAILABLE,
        minPurchaseValue: 20.00
      }
    ]
  },
  {
    id: 'c4s2',
    name: "Carlos Souza",
    email: "carlos@email.com",
    phone: "(83) 94444-4444",
    cpf: "456.789.012-33",
    city: "Patos",
    state: "Paraíba",
    createdAt: new Date("2023-04-01"),
    dateOfBirth: new Date("1988-09-10"),
    purchasesCount: 2,
    totalActiveCashback: 0.00,
    totalCashbackValueGenerated: 35.00,
    status: CustomerStatus.INACTIVE,
    purchases: [
      {
        id: 'p8r1',
        customerId: 'c4s2',
        date: new Date('2023-01-10'),
        totalValue: 200.00,
        cashbackValueGenerated: 20.00
      },
      {
        id: 'p9t5',
        customerId: 'c4s2',
        date: new Date('2023-05-20'),
        totalValue: 150.00,
        cashbackValueGenerated: 15.00
      }
    ],
    cashbacks: [
      {
        id: 'c8i4',
        customerId: 'c4s2',
        originPurchaseId: 'p8r1',
        createdAt: new Date('2023-01-10'),
        validUntil: new Date('2023-02-10'),
        value: 20.00,
        status: CashbackStatus.EXPIRED,
        minPurchaseValue: 40.00
      },
      {
        id: 'c9o6',
        customerId: 'c4s2',
        originPurchaseId: 'p9t5',
        createdAt: new Date('2023-05-20'),
        validUntil: new Date('2023-06-20'),
        value: 15.00,
        status: CashbackStatus.EXPIRED,
        minPurchaseValue: 30.00
      }
    ]
  },
  {
    id: 'p5c8',
    name: "Paula Costa",
    email: "paula@email.com",
    phone: "(83) 95555-5555",
    cpf: "567.890.123-44",
    city: "Sousa",
    state: "Paraíba",
    createdAt: new Date("2023-05-01"),
    dateOfBirth: new Date("1994-11-25"),
    purchasesCount: 2,
    totalActiveCashback: 0.00,
    totalCashbackValueGenerated: 55.00,
    status: CustomerStatus.ABSENT,
    purchases: [
      {
        id: 'p1x2',
        customerId: 'p5c8',
        date: new Date('2023-06-15'),
        totalValue: 300.00,
        cashbackValueGenerated: 30.00
      },
      {
        id: 'p2y3',
        customerId: 'p5c8',
        date: new Date('2023-09-10'),
        totalValue: 250.00,
        cashbackValueGenerated: 25.00
      }
    ],
    cashbacks: [
      {
        id: 'c1z4',
        customerId: 'p5c8',
        originPurchaseId: 'p1x2',
        createdAt: new Date('2023-06-15'),
        validUntil: new Date('2023-07-15'),
        value: 30.00,
        status: CashbackStatus.EXPIRED,
        minPurchaseValue: 60.00
      },
      {
        id: 'c2w5',
        customerId: 'p5c8',
        originPurchaseId: 'p2y3',
        createdAt: new Date('2023-09-10'),
        validUntil: new Date('2023-10-10'),
        value: 25.00,
        status: CashbackStatus.EXPIRED,
        minPurchaseValue: 50.00
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
    createdAt: new Date("2024-01-10"),
    dateOfBirth: new Date("1985-03-12"),
    purchasesCount: 1,
    totalActiveCashback: 50.00,
    totalCashbackValueGenerated: 50.00,
    status: CustomerStatus.NEW,
    purchases: [
      {
        id: 'p4e1',
        customerId: 'r3t9',
        date: new Date('2024-01-20'),
        totalValue: 500.00,
        cashbackValueGenerated: 50.00
      }
    ],
    cashbacks: [
      {
        id: 'c5r2',
        customerId: 'r3t9',
        originPurchaseId: 'p4e1',
        createdAt: new Date('2024-01-20'),
        validUntil: new Date('2024-03-20'),
        value: 50.00,
        status: CashbackStatus.AVAILABLE,
        minPurchaseValue: 100.00
      }
    ]
  },
  {
    id: 'f7g2',
    name: "Fernanda Gomes",
    email: "fernanda@email.com",
    phone: "(83) 91234-5678",
    cpf: "789.012.345-66",
    city: "Cajazeiras",
    state: "Paraíba",
    createdAt: new Date("2023-08-15"),
    dateOfBirth: new Date("1991-07-22"),
    purchasesCount: 4,
    totalActiveCashback: 15.00,
    totalCashbackValueGenerated: 80.00,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p1q1',
        customerId: 'f7g2',
        date: new Date('2023-09-01'),
        totalValue: 200.00,
        cashbackValueGenerated: 20.00
      },
      {
        id: 'p2w2',
        customerId: 'f7g2',
        date: new Date('2023-10-15'),
        totalValue: 200.00,
        cashbackValueGenerated: 20.00,
        cashbackUsed: 20.00,
        usedCashbackId: 'c1a1'
      },
      {
        id: 'p3e3',
        customerId: 'f7g2',
        date: new Date('2023-12-01'),
        totalValue: 250.00,
        cashbackValueGenerated: 25.00,
        cashbackUsed: 20.00,
        usedCashbackId: 'c2b2'
      },
      {
        id: 'p4r4',
        customerId: 'f7g2',
        date: new Date('2024-02-01'),
        totalValue: 150.00,
        cashbackValueGenerated: 15.00,
        cashbackUsed: 25.00,
        usedCashbackId: 'c3c3'
      }
    ],
    cashbacks: [
      {
        id: 'c1a1',
        customerId: 'f7g2',
        originPurchaseId: 'p1q1',
        createdAt: new Date('2023-09-01'),
        validUntil: new Date('2023-10-01'),
        value: 20.00,
        status: CashbackStatus.USED,
        usedInPurchaseId: 'p2w2',
        minPurchaseValue: 40.00
      },
      {
        id: 'c2b2',
        customerId: 'f7g2',
        originPurchaseId: 'p2w2',
        createdAt: new Date('2023-10-15'),
        validUntil: new Date('2023-11-15'),
        value: 20.00,
        status: CashbackStatus.USED,
        usedInPurchaseId: 'p3e3',
        minPurchaseValue: 40.00
      },
      {
        id: 'c3c3',
        customerId: 'f7g2',
        originPurchaseId: 'p3e3',
        createdAt: new Date('2023-12-01'),
        validUntil: new Date('2024-01-01'),
        value: 25.00,
        status: CashbackStatus.USED,
        usedInPurchaseId: 'p4r4',
        minPurchaseValue: 50.00
      },
      {
        id: 'c4d4',
        customerId: 'f7g2',
        originPurchaseId: 'p4r4',
        createdAt: new Date('2024-02-01'),
        validUntil: new Date('2024-03-01'),
        value: 15.00,
        status: CashbackStatus.AVAILABLE,
        minPurchaseValue: 30.00
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
    createdAt: new Date("2023-06-20"),
    dateOfBirth: new Date("1980-12-05"),
    purchasesCount: 0,
    totalActiveCashback: 0.00,
    totalCashbackValueGenerated: 0.00,
    status: CustomerStatus.NEW,
    purchases: [],
    cashbacks: []
  },
  {
    id: 's9l2',
    name: "Sandra Lima",
    email: "sandra@email.com",
    phone: "(83) 99112-2334",
    cpf: "901.234.567-88",
    city: "Santa Rita",
    state: "Paraíba",
    createdAt: new Date("2023-02-15"),
    dateOfBirth: new Date("1975-05-30"),
    purchasesCount: 2,
    totalActiveCashback: 0.00,
    totalCashbackValueGenerated: 40.00,
    status: CustomerStatus.INACTIVE,
    purchases: [
      {
        id: 'p5t1',
        customerId: 's9l2',
        date: new Date('2023-03-01'),
        totalValue: 200.00,
        cashbackValueGenerated: 20.00
      },
      {
        id: 'p6u2',
        customerId: 's9l2',
        date: new Date('2023-04-10'),
        totalValue: 200.00,
        cashbackValueGenerated: 20.00
      }
    ],
    cashbacks: [
      {
        id: 'c5v3',
        customerId: 's9l2',
        originPurchaseId: 'p5t1',
        createdAt: new Date('2023-03-01'),
        validUntil: new Date('2023-04-01'),
        value: 20.00,
        status: CashbackStatus.EXPIRED,
        minPurchaseValue: 40.00
      },
      {
        id: 'c6x4',
        customerId: 's9l2',
        originPurchaseId: 'p6u2',
        createdAt: new Date('2023-04-10'),
        validUntil: new Date('2023-05-10'),
        value: 20.00,
        status: CashbackStatus.EXPIRED,
        minPurchaseValue: 40.00
      }
    ]
  },
  {
    id: 'v4b6',
    name: "Vinícius Barbosa",
    email: "vinicius@email.com",
    phone: "(83) 98822-3344",
    cpf: "012.345.678-99",
    city: "Bayeux",
    state: "Paraíba",
    createdAt: new Date("2023-11-01"),
    dateOfBirth: new Date("1993-01-18"),
    purchasesCount: 1,
    totalActiveCashback: 0.00,
    totalCashbackValueGenerated: 15.00,
    status: CustomerStatus.ABSENT,
    purchases: [
      {
        id: 'p7z8',
        customerId: 'v4b6',
        date: new Date('2023-11-15'),
        totalValue: 150.00,
        cashbackValueGenerated: 15.00
      }
    ],
    cashbacks: [
      {
        id: 'c7m9',
        customerId: 'v4b6',
        originPurchaseId: 'p7z8',
        createdAt: new Date('2023-11-15'),
        validUntil: new Date('2023-12-15'),
        value: 15.00,
        status: CashbackStatus.EXPIRED,
        minPurchaseValue: 30.00
      }
    ]
  }
];
