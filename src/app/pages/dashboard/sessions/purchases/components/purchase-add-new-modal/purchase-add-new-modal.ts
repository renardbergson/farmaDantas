import { Component, OnInit, AfterViewInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerService, PurchaseService, UserService } from '../../../../../../shared/services';
import { Customer, Purchase, PurchaseCategory, PurchaseMode, PaymentMethod, User, Cashback, CashbackStatus } from '../../../../../../shared/models';
import { CASHBACK_CONFIG } from '../../../../../../shared/constants/cashback.config';
import { NgxCurrencyDirective } from 'ngx-currency';
import { parseDateToLocalDate } from '../../../../../../shared/utils/parseDateToLocalDate';

@Component({
  selector: 'app-purchase-add-new-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule, NgxCurrencyDirective],
  templateUrl: './purchase-add-new-modal.html',
  styleUrl: './purchase-add-new-modal.css',
})
export class PurchaseAddNewModal implements OnInit, AfterViewInit, OnDestroy {
  @Input() purchase?: Purchase;
  @Output() purchaseAdded = new EventEmitter<void>();
  @ViewChild('modalRef') modalRef!: ElementRef<HTMLDivElement>;
  @ViewChild('purchaseInfoAlert') purchaseInfoAlert!: ElementRef<HTMLElement>;

  private tooltipInstance: any = null;
  private modalShownHandler?: () => void;

  purchaseForm!: FormGroup;

  /* Clientes, funcionários e categorias */
  customers: Customer[] = [];
  employees: User[] = [];
  categories: PurchaseCategory[] = Object.values(PurchaseCategory);

  /* Pagamento */
  paymentMethods: PaymentMethod[] = Object.values(PaymentMethod);
  selectedPaymentMethods: Set<PaymentMethod> = new Set();
  purchaseModes: PurchaseMode[] = Object.values(PurchaseMode);

  /* Cashback */
  activeCashbacksList: Cashback[] = [];

  /* Utilitários */
  private dateToInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private userService: UserService,
    private purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setupCustomerChangeListener();
    this.syncTotalAndFinalValue();
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

  ngAfterViewInit(): void {
    const modalEl = this.modalRef?.nativeElement;
    const alertEl = this.purchaseInfoAlert?.nativeElement;
    const Bootstrap = (window as any).bootstrap;

    if (!modalEl || !alertEl || !Bootstrap?.Tooltip) return;

    this.modalShownHandler = () => {
      this.disposeTooltip();
      this.tooltipInstance = new Bootstrap.Tooltip(alertEl, {
        container: 'body',
        customClass: 'purchase-info-tooltip'
      });
    };

    modalEl.addEventListener('shown.bs.modal', this.modalShownHandler);
  }

  private disposeTooltip(): void {
    if (this.tooltipInstance) {
      this.tooltipInstance.dispose();
      this.tooltipInstance = null;
    }
  }

  ngOnDestroy(): void {
    this.disposeTooltip();
    const modalEl = this.modalRef?.nativeElement;
    if (modalEl && this.modalShownHandler) {
      modalEl.removeEventListener('shown.bs.modal', this.modalShownHandler);
    }
  }

  initForm(): void {
    this.purchaseForm = this.fb.group({
      customer: [null, Validators.required],
      purchaseDate: [this.dateToInputValue(new Date()), Validators.required],
      employee: [null, Validators.required],
      purchaseValue: [null, [Validators.required, (c: AbstractControl) => (!c.value && c.value !== 0) || c.value <= 0 ? { required: true } : null]],
      totalValue: [{ value: 0, disabled: true }],
      finalValue: [{ value: 0, disabled: true }],
      selectedCashback: [null],
      generateCashback: [true],
      category: ['', Validators.required],
      paymentMethods: [[], (c: AbstractControl) => (!c.value || c.value.length === 0) ? { required: true } : null],
      mode: [PurchaseMode.IN_STORE, Validators.required],
      observations: ['']
    });
    this.setupValueSyncListeners();
  }

  /**
   * Configura o listener de mudança do campo cliente. Executado sempre que o usuário
   * seleciona ou troca o cliente no formulário de adição de compra.
   *
   * Passos:
   * 1. Limpa o cashback selecionado (emitEvent: false evita disparar valueChanges).
   * 2. Filtra os cashbacks do cliente para exibir apenas os disponíveis para uso:
   *    - status ACTIVE;
   *    - validUntil >= hoje (não expirados).
   * 3. Atualiza activeCashbacksList, usada no select "Aplicar cashback".
   */
  private setupCustomerChangeListener(): void {
    this.purchaseForm.get('customer')?.valueChanges.subscribe((customer: Customer | null) => {
      this.purchaseForm.patchValue({ selectedCashback: null }, { emitEvent: false });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.activeCashbacksList = customer?.cashbacks?.filter((cb) => {
        if (cb.status !== CashbackStatus.ACTIVE) return false;

        const validUntil = new Date(cb.validUntil);
        validUntil.setHours(0, 0, 0, 0);

        return validUntil >= today;
      }) ?? [];
    });
  }

  private setupValueSyncListeners(): void {
    this.purchaseForm.get('purchaseValue')?.valueChanges.subscribe(() => this.syncTotalAndFinalValue());
    this.purchaseForm.get('selectedCashback')?.valueChanges.subscribe(() => this.syncTotalAndFinalValue());
  }

  private syncTotalAndFinalValue(): void {
    const total = this.purchaseInputValue;
    const cashback = this.purchaseForm.get('selectedCashback')?.value as Cashback | null;
    const final = cashback && total >= (cashback.minPurchaseValue ?? 0)
      ? total - cashback.value
      : total;
    this.purchaseForm.patchValue({ totalValue: total, finalValue: final }, { emitEvent: false });
  }

  togglePaymentMethod(method: PaymentMethod): void {
    if (this.selectedPaymentMethods.has(method)) {
      this.selectedPaymentMethods.delete(method);
    } else {
      this.selectedPaymentMethods.add(method);
    }
    this.purchaseForm.patchValue({ paymentMethods: Array.from(this.selectedPaymentMethods) });
    this.purchaseForm.get('paymentMethods')?.updateValueAndValidity();
  }

  get purchaseInputValue(): number {
    const val = this.purchaseForm?.get('purchaseValue')?.value;
    return val != null ? Number(val) : 0;
  }

  get generateCashback(): boolean {
    return this.purchaseForm?.get('generateCashback')?.value ?? true;
  }

  get generatedCashbackValue(): number | null {
    if (!this.generateCashback) return null;
    return this.finalValue * CASHBACK_CONFIG.cashbackGenerationRate;
  }

  get cashbackPercent(): number {
    return CASHBACK_CONFIG.cashbackGenerationRate * 100;
  }

  get selectedCashback(): Cashback | null {
    return this.purchaseForm?.get('selectedCashback')?.value ?? null;
  }

  get isCashbackApplicable(): boolean {
    const cb = this.selectedCashback;
    if (!cb) return false;
    return this.purchaseInputValue >= cb.minPurchaseValue;
  }

  get finalValue(): number {
    return Number(this.purchaseForm?.get('finalValue')?.value) ?? this.purchaseInputValue;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.purchaseForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  onSubmit(): void {
    if (this.purchaseForm.valid) {
      const raw = this.purchaseForm.getRawValue();

      const purchase: Omit<Purchase, 'id' | 'generatedCashback'> & { generatedCashbackValue: number | null } = {
        mode: raw.mode as PurchaseMode,
        date: parseDateToLocalDate(raw.purchaseDate),
        totalValue: Number(raw.totalValue),
        finalValue: Number(raw.finalValue),
        category: raw.category as PurchaseCategory,
        customerId: raw.customer.id,
        customerName: raw.customer.person.name,
        employeeId: raw.employee.id,
        employeeName: raw.employee.person.name,
        paymentMethods: raw.paymentMethods as PaymentMethod[],
        usedCashbackGenerationRate: raw.generateCashback ? CASHBACK_CONFIG.cashbackGenerationRate : null,
        observations: raw.observations || null,
        usedCashback: raw.selectedCashback as Cashback || null,
        generatedCashbackValue: this.generatedCashbackValue || null,
      };

      this.purchaseService.addPurchase(raw.customer, purchase).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => console.error('Erro ao registrar compra:', err)
      });
    } else {
      this.purchaseForm.markAllAsTouched();
    }
  }

  private handleSuccess(): void {
    this.purchaseAdded.emit();
    this.selectedPaymentMethods.clear();
    this.purchaseForm.reset({
      customer: null,
      purchaseDate: this.dateToInputValue(new Date()),
      employee: null,
      purchaseValue: null,
      totalValue: 0,
      finalValue: 0,
      selectedCashback: null,
      generateCashback: true,
      category: '',
      paymentMethods: [],
      mode: PurchaseMode.IN_STORE,
      observations: ''
    });

    const modalElement = this.modalRef?.nativeElement;
    if (modalElement) {
      const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
}
