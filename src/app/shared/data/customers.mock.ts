import { Customer, CustomerStatus } from '../models/customer.model';
import { CashbackStatus } from '../models/cashback.model';
import { PurchaseCategory } from '../models/purchase.model';

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
    purchasesThisMonthCount: 2,
    purchasesThisMonthAmount: 150.00,
    activeCashbackCount: 2,
    activeCashbackAmount: 15.00,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p1a2',
        date: new Date('2026-02-05'),
        total: 100.00,
        category: PurchaseCategory.ANTIBIOTIC,
        customerId: 'k2w1',
        customerName: "Maria Silva",
        employeeId: 'e01',
        employeeName: "Carlos Almeida",
        generatedCashbackId: 'c1b3',
        generatedCashbackAmount: 10.00
      },
      {
        id: 'p1a3',
        date: new Date('2026-02-12'),
        total: 50.00,
        category: PurchaseCategory.CONTINUOUS,
        customerId: 'k2w1',
        customerName: "Maria Silva",
        employeeId: 'e01',
        employeeName: "Carlos Almeida",
        generatedCashbackId: 'c1b4',
        generatedCashbackAmount: 5.00
      }
    ],
    cashbacks: [
      {
        id: 'c1b3',
        customerId: 'k2w1',
        customerName: "Maria Silva",
        originPurchaseId: 'p1a2',
        createdAt: new Date('2026-02-05'),
        validUntil: new Date('2026-03-05'),
        timeLeft: '13 dias',
        value: 10.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 20.00
      },
      {
        id: 'c1b4',
        customerId: 'k2w1',
        customerName: "Maria Silva",
        originPurchaseId: 'p1a3',
        createdAt: new Date('2026-02-12'),
        validUntil: new Date('2026-03-12'),
        timeLeft: '20 dias',
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
    purchasesThisMonthCount: 2,
    purchasesThisMonthAmount: 250.00,
    activeCashbackCount: 2,
    activeCashbackAmount: 25.00,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p3m9',
        date: new Date('2026-01-10'),
        total: 200.00,
        category: PurchaseCategory.SUPPLEMENTS,
        customerId: 'j8n4',
        customerName: "João Santos",
        employeeId: 'e02',
        employeeName: "Fernanda Souza"
      },
      {
        id: 'p4k2',
        date: new Date('2026-02-02'),
        total: 150.00,
        category: PurchaseCategory.CONTROLLED,
        customerId: 'j8n4',
        customerName: "João Santos",
        employeeId: 'e02',
        employeeName: "Fernanda Souza",
        generatedCashbackId: 'c4x5',
        generatedCashbackAmount: 15.00
      },
      {
        id: 'p5l1',
        date: new Date('2026-02-15'),
        total: 100.00,
        category: PurchaseCategory.CONTRACEPTIVE,
        customerId: 'j8n4',
        customerName: "João Santos",
        employeeId: 'e02',
        employeeName: "Fernanda Souza",
        generatedCashbackId: 'c5z2',
        generatedCashbackAmount: 10.00
      }
    ],
    cashbacks: [
      {
        id: 'c4x5',
        customerId: 'j8n4',
        customerName: "João Santos",
        originPurchaseId: 'p4k2',
        createdAt: new Date('2026-02-02'),
        validUntil: new Date('2026-03-02'),
        timeLeft: '10 dias',
        value: 15.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 40.00
      },
      {
        id: 'c5z2',
        customerId: 'j8n4',
        customerName: "João Santos",
        originPurchaseId: 'p5l1',
        createdAt: new Date('2026-02-15'),
        validUntil: new Date('2026-03-15'),
        timeLeft: '23 dias',
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
    purchasesThisMonthCount: 1,
    purchasesThisMonthAmount: 80.00,
    activeCashbackCount: 1,
    activeCashbackAmount: 8.00,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p6q7',
        date: new Date('2026-02-08'),
        total: 80.00,
        category: PurchaseCategory.KIDS,
        customerId: 'a1o9',
        customerName: "Ana Oliveira",
        employeeId: 'e03',
        employeeName: "Marcos Lima",
        generatedCashbackId: 'c6y8',
        generatedCashbackAmount: 8.00
      }
    ],
    cashbacks: [
      {
        id: 'c6y8',
        customerId: 'a1o9',
        customerName: "Ana Oliveira",
        originPurchaseId: 'p6q7',
        createdAt: new Date('2026-02-08'),
        validUntil: new Date('2026-03-08'),
        timeLeft: '16 dias',
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
    purchasesThisMonthCount: 4,
    purchasesThisMonthAmount: 350.00,
    activeCashbackCount: 4,
    activeCashbackAmount: 35.00,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p24q0',
        date: new Date('2026-02-05'),
        total: 120.00,
        category: PurchaseCategory.CONTINUOUS,
        customerId: 'c7w0',
        customerName: "Carla Dias",
        employeeId: 'e04',
        employeeName: "Patrícia Gomes",
        generatedCashbackId: 'c18m2',
        generatedCashbackAmount: 12.00
      },
      {
        id: 'p24q1',
        date: new Date('2026-02-10'),
        total: 90.00,
        category: PurchaseCategory.SUPPLEMENTS,
        customerId: 'c7w0',
        customerName: "Carla Dias",
        employeeId: 'e04',
        employeeName: "Patrícia Gomes",
        generatedCashbackId: 'c18m3',
        generatedCashbackAmount: 9.00
      },
      {
        id: 'p24q2',
        date: new Date('2026-02-18'),
        total: 80.00,
        category: PurchaseCategory.ELDERLY,
        customerId: 'c7w0',
        customerName: "Carla Dias",
        employeeId: 'e04',
        employeeName: "Patrícia Gomes",
        generatedCashbackId: 'c18m4',
        generatedCashbackAmount: 8.00
      },
      {
        id: 'p24q3',
        date: new Date('2026-02-17'), // corrigido
        total: 60.00,
        category: PurchaseCategory.ANTIBIOTIC,
        customerId: 'c7w0',
        customerName: "Carla Dias",
        employeeId: 'e04',
        employeeName: "Patrícia Gomes",
        generatedCashbackId: 'c18m5',
        generatedCashbackAmount: 6.00
      }
    ],
    cashbacks: [
      {
        id: 'c18m2',
        customerId: 'c7w0',
        customerName: "Carla Dias",
        originPurchaseId: 'p24q0',
        createdAt: new Date('2026-02-05'),
        validUntil: new Date('2026-03-05'),
        timeLeft: '13 dias',
        value: 12.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 30.00
      },
      {
        id: 'c18m3',
        customerId: 'c7w0',
        customerName: "Carla Dias",
        originPurchaseId: 'p24q1',
        createdAt: new Date('2026-02-10'),
        validUntil: new Date('2026-03-10'),
        timeLeft: '18 dias',
        value: 9.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 25.00
      },
      {
        id: 'c18m4',
        customerId: 'c7w0',
        customerName: "Carla Dias",
        originPurchaseId: 'p24q2',
        createdAt: new Date('2026-02-18'),
        validUntil: new Date('2026-03-18'),
        timeLeft: '26 dias',
        value: 8.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 20.00
      },
      {
        id: 'c18m5',
        customerId: 'c7w0',
        customerName: "Carla Dias",
        originPurchaseId: 'p24q3',
        createdAt: new Date('2026-02-17'), // corrigido
        validUntil: new Date('2026-03-17'),
        timeLeft: '25 dias',
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
    purchasesThisMonthCount: 3,
    purchasesThisMonthAmount: 285.00,
    activeCashbackCount: 3,
    activeCashbackAmount: 28.00,
    status: CustomerStatus.ACTIVE,
    purchases: [
      {
        id: 'p25r0',
        date: new Date('2026-02-08'),
        total: 140.00,
        category: PurchaseCategory.CONTINUOUS,
        customerId: 'r8s1',
        customerName: "Roberto Lima",
        employeeId: 'e05',
        employeeName: "Rafael Costa",
        generatedCashbackId: 'c19n0',
        generatedCashbackAmount: 14.00
      },
      {
        id: 'p25r1',
        date: new Date('2026-02-16'),
        total: 85.00,
        category: PurchaseCategory.CONTRACEPTIVE,
        customerId: 'r8s1',
        customerName: "Roberto Lima",
        employeeId: 'e05',
        employeeName: "Rafael Costa",
        generatedCashbackId: 'c19n1',
        generatedCashbackAmount: 8.00
      },
      {
        id: 'p25r2',
        date: new Date('2026-02-18'), // corrigido
        total: 60.00,
        category: PurchaseCategory.ANTIBIOTIC,
        customerId: 'r8s1',
        customerName: "Roberto Lima",
        employeeId: 'e05',
        employeeName: "Rafael Costa",
        generatedCashbackId: 'c19n2',
        generatedCashbackAmount: 6.00
      }
    ],
    cashbacks: [
      {
        id: 'c19n0',
        customerId: 'r8s1',
        customerName: "Roberto Lima",
        originPurchaseId: 'p25r0',
        createdAt: new Date('2026-02-08'),
        validUntil: new Date('2026-03-08'),
        timeLeft: '16 dias',
        value: 14.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 35.00
      },
      {
        id: 'c19n1',
        customerId: 'r8s1',
        customerName: "Roberto Lima",
        originPurchaseId: 'p25r1',
        createdAt: new Date('2026-02-16'),
        validUntil: new Date('2026-03-16'),
        timeLeft: '24 dias',
        value: 8.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 20.00
      },
      {
        id: 'c19n2',
        customerId: 'r8s1',
        customerName: "Roberto Lima",
        originPurchaseId: 'p25r2',
        createdAt: new Date('2026-02-18'), // corrigido
        validUntil: new Date('2026-03-18'),
        timeLeft: '26 dias',
        value: 6.00,
        status: CashbackStatus.ACTIVE,
        minPurchaseValue: 15.00
      }
    ]
  }
];
