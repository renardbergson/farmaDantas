import { Injectable } from '@angular/core';
import {Customer, CustomerStatus} from '../models/customer.model';
import {CashbackStatus} from '../models/cashback.model';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customers: Customer[] = [
    {
      id: '1',
      name: "Maria Silva",
      email: "maria@email.com",
      phone: "(11) 99999-9999",
      cpf: "123.456.789-00",
      city: "Santa Luzia",
      state: "Paraíba",
      createdAt: new Date("2023-01-01"),
      dateOfBirth: new Date("1992-08-01"),
      purchasesCount: 0,
      totalActiveCashback: 0.00,
      totalCashbackValueGenerated: 0.00,
      status: CustomerStatus.NEW,
      purchases: [],
      cashbacks: []
    },
    {
      id: '2',
      name: "João Santos",
      email: "joao@email.com",
      phone: "(11) 98888-8888",
      cpf: "234.567.890-11",
      city: "João Pessoa",
      state: "Paraíba",
      createdAt: new Date("2023-02-01"),
      dateOfBirth: new Date("1990-05-15"),
      purchasesCount: 3,
      totalActiveCashback: 47.50,
      totalCashbackValueGenerated: 62.50,
      status: CustomerStatus.ACTIVE,
      purchases: [
        {
          id: 'p3',
          customerId: '2',
          date: new Date('2025-12-10'),
          totalValue: 300.00,
          cashbackValueGenerated: 30.00
        },
        {
          id: 'p3_1',
          customerId: '2',
          date: new Date('2026-01-20'),
          totalValue: 200.00,
          cashbackValueGenerated: 20.00
        },
        {
          id: 'p4',
          customerId: '2',
          date: new Date('2026-02-05'),
          totalValue: 125.00,
          cashbackValueGenerated: 12.50,
          cashbackUsed: 15.00,
          usedCashbackId: 'c3'
        }
      ],
      cashbacks: [
        {
          id: 'c3',
          customerId: '2',
          originPurchaseId: 'p3',
          createdAt: new Date('2025-12-10'),
          validUntil: new Date('2026-01-10'),
          value: 15.00,
          status: CashbackStatus.USED,
          usedInPurchaseId: 'p4',
          minPurchaseValue: 60.00
        },
        {
          id: 'c3_1',
          customerId: '2',
          originPurchaseId: 'p3_1',
          createdAt: new Date('2026-01-20'),
          validUntil: new Date('2026-02-20'),
          value: 20.00,
          status: CashbackStatus.AVAILABLE,
          minPurchaseValue: 40.00
        },
        {
          id: 'c4',
          customerId: '2',
          originPurchaseId: 'p4',
          createdAt: new Date('2026-02-05'),
          validUntil: new Date('2026-03-05'),
          value: 12.50,
          status: CashbackStatus.AVAILABLE,
          minPurchaseValue: 30.00
        },
        {
          id: 'c4_extra',
          customerId: '2',
          originPurchaseId: 'p1_old',
          createdAt: new Date('2025-10-01'),
          validUntil: new Date('2025-11-01'),
          value: 15.00,
          status: CashbackStatus.AVAILABLE,
          minPurchaseValue: 30.00
        }
      ]
    },
    {
      id: '3',
      name: "Ana Oliveira",
      email: "ana@email.com",
      phone: "(11) 97777-7777",
      cpf: "345.678.901-22",
      city: "João Pessoa",
      state: "Paraíba",
      createdAt: new Date("2023-03-01"),
      dateOfBirth: new Date("1995-02-20"),
      purchasesCount: 2,
      totalActiveCashback: 25.00,
      totalCashbackValueGenerated: 25.00,
      status: CustomerStatus.ACTIVE,
      purchases: [
        {
          id: 'p5_old',
          customerId: '3',
          date: new Date('2025-12-15'),
          totalValue: 150.00,
          cashbackValueGenerated: 15.00
        },
        {
          id: 'p5',
          customerId: '3',
          date: new Date('2026-01-10'),
          totalValue: 100.00,
          cashbackValueGenerated: 10.00
        }
      ],
      cashbacks: [
        {
          id: 'c5_old',
          customerId: '3',
          originPurchaseId: 'p5_old',
          createdAt: new Date('2025-12-15'),
          validUntil: new Date('2026-02-15'),
          value: 15.00,
          status: CashbackStatus.AVAILABLE,
          minPurchaseValue: 30.00
        },
        {
          id: 'c5',
          customerId: '3',
          originPurchaseId: 'p5',
          createdAt: new Date('2026-01-10'),
          validUntil: new Date('2026-02-10'),
          value: 10.00,
          status: CashbackStatus.AVAILABLE,
          minPurchaseValue: 20.00
        }
      ]
    },
    {
      id: '4',
      name: "Carlos Souza",
      email: "carlos@email.com",
      phone: "(11) 96666-6666",
      cpf: "456.789.012-33",
      city: "João Pessoa",
      state: "Paraíba",
      createdAt: new Date("2023-04-01"),
      dateOfBirth: new Date("1998-09-10"),
      purchasesCount: 2,
      totalActiveCashback: 0.00,
      totalCashbackValueGenerated: 35.00,
      status: CustomerStatus.INACTIVE,
      purchases: [
        {
          id: 'p6_oldest',
          customerId: '4',
          date: new Date('2025-01-10'),
          totalValue: 200.00,
          cashbackValueGenerated: 20.00
        },
        {
          id: 'p6',
          customerId: '4',
          date: new Date('2025-05-20'),
          totalValue: 150.00,
          cashbackValueGenerated: 15.00
        }
      ],
      cashbacks: [
        {
          id: 'c6_oldest',
          customerId: '4',
          originPurchaseId: 'p6_oldest',
          createdAt: new Date('2025-01-10'),
          validUntil: new Date('2025-02-10'),
          value: 20.00,
          status: CashbackStatus.EXPIRED,
          minPurchaseValue: 40.00
        },
        {
          id: 'c6',
          customerId: '4',
          originPurchaseId: 'p6',
          createdAt: new Date('2025-05-20'),
          validUntil: new Date('2025-06-20'),
          value: 15.00,
          status: CashbackStatus.EXPIRED,
          minPurchaseValue: 30.00
        }
      ]
    },
    {
      id: '5',
      name: "Paula Costa",
      email: "paula@email.com",
      phone: "(11) 95555-5555",
      cpf: "567.890.123-44",
      city: "João Pessoa",
      state: "Paraíba",
      createdAt: new Date("2023-05-01"),
      dateOfBirth: new Date("1998-09-10"),
      purchasesCount: 2,
      totalActiveCashback: 0.00,
      totalCashbackValueGenerated: 55.00,
      status: CustomerStatus.ABSENT,
      purchases: [
        {
          id: 'p7_old',
          customerId: '5',
          date: new Date('2025-06-15'),
          totalValue: 300.00,
          cashbackValueGenerated: 30.00
        },
        {
          id: 'p7',
          customerId: '5',
          date: new Date('2025-09-10'),
          totalValue: 250.00,
          cashbackValueGenerated: 25.00
        }
      ],
      cashbacks: [
        {
          id: 'c7_old',
          customerId: '5',
          originPurchaseId: 'p7_old',
          createdAt: new Date('2025-06-15'),
          validUntil: new Date('2025-07-15'),
          value: 30.00,
          status: CashbackStatus.EXPIRED,
          minPurchaseValue: 60.00
        },
        {
          id: 'c7',
          customerId: '5',
          originPurchaseId: 'p7',
          createdAt: new Date('2025-09-10'),
          validUntil: new Date('2025-10-10'),
          value: 25.00,
          status: CashbackStatus.EXPIRED,
          minPurchaseValue: 50.00
        }
      ]
    }
  ];

  getCustomers(): Observable<Customer[]> {
    // O operador of da biblioteca RxJS transforma
    // qualquer dado em um Observable
    return of(this.customers);
  }
}
