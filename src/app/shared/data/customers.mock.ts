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
  },
  {
    id: 'p2q5',
    name: "Pedro Almeida",
    email: "pedro@email.com",
    phone: "(83) 97766-5544",
    cpf: "901.234.567-88",
    city: "Patos",
    state: "Paraíba",
    createdAt: new Date("2025-12-15"),
    dateOfBirth: new Date("1978-06-22"),
    purchasesCount: 5,
    totalActiveCashback: 50.00,
    totalCashbackValueGenerated: 75.00,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p7w3',
        customerId: 'p2q5',
        date: new Date('2026-01-05'),
        totalValue: 250.00,
        cashbackValueGenerated: 25.00
      },
      {
        id: 'p8x4',
        customerId: 'p2q5',
        date: new Date('2026-01-12'),
        totalValue: 180.00,
        cashbackValueGenerated: 18.00
      },
      {
        id: 'p9y5',
        customerId: 'p2q5',
        date: new Date('2026-02-05'),
        totalValue: 300.00,
        cashbackValueGenerated: 30.00
      },
      {
        id: 'p9y6',
        customerId: 'p2q5',
        date: new Date('2026-02-15'),
        totalValue: 220.00,
        cashbackValueGenerated: 22.00
      },
      {
        id: 'p9y7',
        customerId: 'p2q5',
        date: new Date('2026-02-20'),
        totalValue: 150.00,
        cashbackValueGenerated: 15.00
      }
    ],
    cashbacks: [
      {
        id: 'c7a1',
        customerId: 'p2q5',
        originPurchaseId: 'p7w3',
        createdAt: new Date('2026-01-05'),
        validUntil: new Date('2026-02-05'),
        value: 25.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 60.00
      },
      {
        id: 'c8b2',
        customerId: 'p2q5',
        originPurchaseId: 'p8x4',
        createdAt: new Date('2026-01-12'),
        validUntil: new Date('2026-02-12'),
        value: 18.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 45.00
      },
      {
        id: 'c8b3',
        customerId: 'p2q5',
        originPurchaseId: 'p9y5',
        createdAt: new Date('2026-02-05'),
        validUntil: new Date('2026-03-05'),
        value: 30.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 70.00
      },
      {
        id: 'c8b4',
        customerId: 'p2q5',
        originPurchaseId: 'p9y6',
        createdAt: new Date('2026-02-15'),
        validUntil: new Date('2026-03-15'),
        value: 22.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 50.00
      }
    ]
  },
  {
    id: 's3r6',
    name: "Sônia Ramos",
    email: "sonia@email.com",
    phone: "(83) 96655-4433",
    cpf: "012.345.678-99",
    city: "Guarabira",
    state: "Paraíba",
    createdAt: new Date("2025-11-20"),
    dateOfBirth: new Date("1988-09-10"),
    purchasesCount: 5,
    totalActiveCashback: 42.00,
    totalCashbackValueGenerated: 68.00,
    status: CustomerStatus.ABSENT,
    purchases: [
      {
        id: 'p10z6',
        customerId: 's3r6',
        date: new Date('2025-10-15'),
        totalValue: 200.00,
        cashbackValueGenerated: 20.00
      },
      {
        id: 'p11a7',
        customerId: 's3r6',
        date: new Date('2025-10-22'),
        totalValue: 160.00,
        cashbackValueGenerated: 16.00
      },
      {
        id: 'p12b8',
        customerId: 's3r6',
        date: new Date('2025-10-29'),
        totalValue: 140.00,
        cashbackValueGenerated: 14.00
      },
      {
        id: 'p13c9',
        customerId: 's3r6',
        date: new Date('2025-11-01'),
        totalValue: 90.00,
        cashbackValueGenerated: 9.00
      }
    ],
    cashbacks: [
      {
        id: 'c9d3',
        customerId: 's3r6',
        originPurchaseId: 'p10z6',
        createdAt: new Date('2026-01-08'),
        validUntil: new Date('2026-02-08'),
        value: 20.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 50.00
      },
      {
        id: 'c10e4',
        customerId: 's3r6',
        originPurchaseId: 'p11a7',
        createdAt: new Date('2026-01-15'),
        validUntil: new Date('2026-02-15'),
        value: 16.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 40.00
      },
      {
        id: 'c11f5',
        customerId: 's3r6',
        originPurchaseId: 'p12b8',
        createdAt: new Date('2026-01-22'),
        validUntil: new Date('2026-02-22'),
        value: 14.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 35.00
      }
    ]
  },
  {
    id: 'l4t7',
    name: "Lucas Ferreira",
    email: "lucas@email.com",
    phone: "(83) 95544-3322",
    cpf: "123.456.789-01",
    city: "Bayeux",
    state: "Paraíba",
    createdAt: new Date("2025-10-05"),
    dateOfBirth: new Date("1993-04-18"),
    purchasesCount: 3,
    totalActiveCashback: 28.00,
    totalCashbackValueGenerated: 38.00,
    status: CustomerStatus.INACTIVE,
    purchases: [
      {
        id: 'p14g0',
        customerId: 'l4t7',
        date: new Date('2025-09-15'),
        totalValue: 180.00,
        cashbackValueGenerated: 18.00
      },
      {
        id: 'p15h1',
        customerId: 'l4t7',
        date: new Date('2025-09-22'),
        totalValue: 120.00,
        cashbackValueGenerated: 12.00
      },
      {
        id: 'p16i2',
        customerId: 'l4t7',
        date: new Date('2025-09-29'),
        totalValue: 80.00,
        cashbackValueGenerated: 8.00
      }
    ],
    cashbacks: [
      {
        id: 'c12g6',
        customerId: 'l4t7',
        originPurchaseId: 'p14g0',
        createdAt: new Date('2026-01-03'),
        validUntil: new Date('2026-02-03'),
        value: 18.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 45.00
      },
      {
        id: 'c13h7',
        customerId: 'l4t7',
        originPurchaseId: 'p15h1',
        createdAt: new Date('2026-01-10'),
        validUntil: new Date('2026-02-10'),
        value: 12.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 30.00
      }
    ]
  },
  {
    id: 'f5u8',
    name: "Fernanda Costa",
    email: "fernanda@email.com",
    phone: "(83) 94433-2211",
    cpf: "234.567.890-12",
    city: "Cajazeiras",
    state: "Paraíba",
    createdAt: new Date("2025-12-28"),
    dateOfBirth: new Date("1987-07-25"),
    purchasesCount: 2,
    totalActiveCashback: 15.00,
    totalCashbackValueGenerated: 25.00,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p17j3',
        customerId: 'f5u8',
        date: new Date('2026-01-12'),
        totalValue: 150.00,
        cashbackValueGenerated: 15.00
      },
      {
        id: 'p18k4',
        customerId: 'f5u8',
        date: new Date('2026-01-28'),
        totalValue: 100.00,
        cashbackValueGenerated: 10.00
      }
    ],
    cashbacks: [
      {
        id: 'c14i8',
        customerId: 'f5u8',
        originPurchaseId: 'p17j3',
        createdAt: new Date('2026-01-12'),
        validUntil: new Date('2026-02-12'),
        value: 15.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 40.00
      }
    ]
  },
  {
    id: 't6v9',
    name: "Thiago Mendes",
    email: "thiago@email.com",
    phone: "(83) 93322-1100",
    cpf: "345.678.901-23",
    city: "Sousa",
    state: "Paraíba",
    createdAt: new Date("2025-11-15"),
    dateOfBirth: new Date("1991-11-30"),
    purchasesCount: 6,
    totalActiveCashback: 48.00,
    totalCashbackValueGenerated: 72.00,
    status: CustomerStatus.ABSENT,
    purchases: [
      {
        id: 'p19l5',
        customerId: 't6v9',
        date: new Date('2025-10-20'),
        totalValue: 220.00,
        cashbackValueGenerated: 22.00
      },
      {
        id: 'p20m6',
        customerId: 't6v9',
        date: new Date('2025-10-27'),
        totalValue: 190.00,
        cashbackValueGenerated: 19.00
      },
      {
        id: 'p21n7',
        customerId: 't6v9',
        date: new Date('2025-11-03'),
        totalValue: 170.00,
        cashbackValueGenerated: 17.00
      },
      {
        id: 'p22o8',
        customerId: 't6v9',
        date: new Date('2025-11-10'),
        totalValue: 130.00,
        cashbackValueGenerated: 13.00
      },
      {
        id: 'p23p9',
        customerId: 't6v9',
        date: new Date('2025-11-17'),
        totalValue: 110.00,
        cashbackValueGenerated: 11.00
      }
    ],
    cashbacks: [
      {
        id: 'c15j9',
        customerId: 't6v9',
        originPurchaseId: 'p19l5',
        createdAt: new Date('2026-01-02'),
        validUntil: new Date('2026-02-02'),
        value: 22.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 55.00
      },
      {
        id: 'c16k0',
        customerId: 't6v9',
        originPurchaseId: 'p20m6',
        createdAt: new Date('2026-01-09'),
        validUntil: new Date('2026-02-09'),
        value: 19.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 48.00
      },
      {
        id: 'c17l1',
        customerId: 't6v9',
        originPurchaseId: 'p21n7',
        createdAt: new Date('2026-01-16'),
        validUntil: new Date('2026-02-16'),
        value: 17.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 42.00
      }
    ]
  },
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
        date: new Date('2026-02-22'),
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
        createdAt: new Date('2026-02-22'),
        validUntil: new Date('2026-03-22'),
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
        date: new Date('2026-02-25'),
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
        createdAt: new Date('2026-02-25'),
        validUntil: new Date('2026-03-25'),
        value: 6.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 15.00
      }
    ]
  }
];
