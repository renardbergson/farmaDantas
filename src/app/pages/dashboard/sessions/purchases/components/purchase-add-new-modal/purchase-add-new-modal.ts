import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerService } from '../../../../../../shared/services/customer.service';
import { UserService } from '../../../../../../shared/services/user.service';
import { Customer, Purchase, PurchaseCategory, PurchaseMode, PaymentMethod, User, Cashback, CashbackStatus } from '../../../../../../shared/models';
import { CASHBACK_CONFIG } from '../../../../../../shared/constants/cashback.config';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-purchase-add-new-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, NgxCurrencyDirective],
  templateUrl: './purchase-add-new-modal.html',
  styleUrl: './purchase-add-new-modal.css',
})
export class PurchaseAddNewModal implements OnInit {
  @Input() purchase?: Purchase;

  /* Dados da compra */
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  purchaseDate: Date = new Date();
  employees: User[] = [];
  selectedEmployee: User | null = null;
  purchaseInputValue = 0;
  categories: PurchaseCategory[] = Object.values(PurchaseCategory);
  selectedCategory: PurchaseCategory | null = null;

  /* Pagamento */
  paymentMethods: PaymentMethod[] = Object.values(PaymentMethod);
  selectedPaymentMethods: Set<PaymentMethod> = new Set();
  purchaseModes: PurchaseMode[] = Object.values(PurchaseMode);
  selectedMode: PurchaseMode = PurchaseMode.IN_STORE;

  /* Cashback */
  activeCashbacksList: Cashback[] = [];
  selectedCashback: Cashback | null = null;
  readonly cashbackPercent = CASHBACK_CONFIG.admin_cashbackPercent; // **** mockado por enquanto ****
  readonly cashbackMinPurchaseValue = CASHBACK_CONFIG.temp_cashbackMinPurchaseValue; // **** mockado por enquanto ****

  /* Observações */
  observations = '';

  /* Utilitários */
  private dateToInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private inputValueToDate(value: string): Date {
    if (!value) return new Date();
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  constructor(
    private customerService: CustomerService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (error) => {
        console.error('Erro ao listar clientes:', error);
      },
    });

    this.userService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error) => {
        console.error('Erro ao listar funcionários:', error);
      },
    });
  }

  /** Converte o valor em string para o input type="date" (YYYY-MM-DD). */
  get purchaseDateStr(): string {
    return this.dateToInputValue(this.purchaseDate);
  }

  /** Se o usuário alterar a data da compra, atualiza a data da compra e converte para o tipo Date. */
  set purchaseDateStr(value: string) {
    this.purchaseDate = this.inputValueToDate(value);
  }

  get generatedCashbackValue(): number {
    return (this.finalValue * this.cashbackPercent) / 100;
  }

  get isCashbackApplicable(): boolean {
    if (!this.selectedCashback) return false;
    return this.purchaseInputValue >= this.selectedCashback.minPurchaseValue;
  }

  get finalValue(): number {
    if (this.isCashbackApplicable && this.selectedCashback) {
      return this.purchaseInputValue - this.selectedCashback.value;
    }
    return this.purchaseInputValue;
  }

  /** Limpa o cashback e atualiza a lista ao trocar de cliente. */
  onCustomerChange(): void {
    this.selectedCashback = null;
    this.activeCashbacksList = this.selectedCustomer?.cashbacks?.filter(
      (cb) => cb.status === CashbackStatus.ACTIVE
    ) ?? [];
  }

  togglePaymentMethod(method: PaymentMethod): void {
    if (this.selectedPaymentMethods.has(method)) {
      this.selectedPaymentMethods.delete(method);
    } else {
      this.selectedPaymentMethods.add(method);
    }
  }
}
