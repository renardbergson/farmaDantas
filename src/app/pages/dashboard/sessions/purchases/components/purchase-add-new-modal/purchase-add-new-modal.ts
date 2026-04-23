import { Component, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerService, PurchaseService, UserService, CashbackService, FeedbackService, AuthService } from '../../../../../../shared/services';
import { Cashback, CreatePurchaseRequest, Customer, PurchaseCategory, PurchaseMode, PaymentMethod, User, UserRole } from '../../../../../../shared/models';
import { CASHBACK_CONFIG } from '../../../../../../shared/constants/cashback.config';
import { NgxCurrencyDirective } from 'ngx-currency';
import { PaymentMethodsLabelPipe, PurchaseModeLabelPipe, PurchaseCategoryLabelPipe } from '../../../../../../shared/pipes';

@Component({
  selector: 'app-purchase-add-new-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule, NgxCurrencyDirective, PaymentMethodsLabelPipe, PurchaseModeLabelPipe, PurchaseCategoryLabelPipe],
  templateUrl: './purchase-add-new-modal.html',
  styleUrl: './purchase-add-new-modal.css',
})
export class PurchaseAddNewModal implements OnInit, AfterViewInit, OnDestroy {
  @Output() purchaseAdded = new EventEmitter<void>();
  @ViewChild('modalRef') modalRef!: ElementRef<HTMLDivElement>;
  @ViewChild('purchaseInfoAlert') purchaseInfoAlert!: ElementRef<HTMLElement>;

  loggedUser: User | null = null;
  private tooltipInstance: any = null;
  readonly todayDate = this.dateToInputValue(new Date());
  private modalShownHandler?: () => void;
  private modalHiddenHandler?: () => void;

  purchaseForm!: FormGroup;

  customers: Customer[] = [];
  users: User[] = [];
  categories: PurchaseCategory[] = Object.values(PurchaseCategory);

  paymentMethods: PaymentMethod[] = Object.values(PaymentMethod);
  selectedPaymentMethods: Set<PaymentMethod> = new Set();
  purchaseModes: PurchaseMode[] = Object.values(PurchaseMode);

  activeCashbacksList: Cashback[] = [];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private userService: UserService,
    private purchaseService: PurchaseService,
    private cashbackService: CashbackService,
    private feedback: FeedbackService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setCustomerChangeListener();
    this.syncTotalAndFinalValue();

    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (error) => {
        this.feedback.error('Erro ao tentar listar clientes')
        console.error('Erro ao tentar listar clientes:', error);
      },
    });

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.setEmployeeField(users);
      },
      error: (error) => {
        this.feedback.error('Erro ao tentar listar funcionários')
        console.error('Erro ao tentar listar funcionários:', error);
      },
    });
  }

  ngAfterViewInit(): void {
    // MODAL
    const modalEl = this.modalRef?.nativeElement;
    const alertEl = this.purchaseInfoAlert?.nativeElement;
    const Bootstrap = (window as any).bootstrap;

    if (!modalEl) return;

    this.modalHiddenHandler = () => {
      this.disposeTooltip();
      this.resetForm();
    };

    modalEl.addEventListener('hidden.bs.modal', this.modalHiddenHandler);

    // TOOLTIP
    if (alertEl && Bootstrap?.Tooltip) {
      this.modalShownHandler = () => {
        this.disposeTooltip();
        this.tooltipInstance = new Bootstrap.Tooltip(alertEl, {
          placement: 'bottom',
          fallbackPlacements: ['top'],
          container: 'body',
          customClass: 'purchase-info-tooltip'
        });
      };

      modalEl.addEventListener('shown.bs.modal', this.modalShownHandler);
    }
  }

  ngOnDestroy(): void {
    this.disposeTooltip();
    const modalEl = this.modalRef?.nativeElement;

    if (modalEl && this.modalShownHandler) {
      modalEl.removeEventListener('shown.bs.modal', this.modalShownHandler);
    }

    if (modalEl && this.modalHiddenHandler) {
      modalEl.removeEventListener('hidden.bs.modal', this.modalHiddenHandler);
    }
  }

  /* GETTERS */
  get isAdmin(): boolean {
    return this.authService.getRole() === UserRole.ADMIN;
  }

  get purchaseInputValue(): number {
    const value = this.purchaseForm?.get('purchaseValue')?.value;
    return value != null ? Number(value) : 0;
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
    this.setValueAndCashbackListeners();
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

  onSubmit(): void {
    if (this.purchaseForm.valid) {
      const raw = this.purchaseForm.getRawValue();
      const generateNewCashback = raw.generateCashback;

      const purchase: CreatePurchaseRequest = {
        customerId: raw.customer.id,
        userId: raw.employee.id,
        mode: raw.mode as PurchaseMode,
        date: raw.purchaseDate,
        category: raw.category as PurchaseCategory,
        paymentMethods: raw.paymentMethods as PaymentMethod[],
        totalValue: Number(raw.totalValue),
        finalValue: Number(raw.finalValue),
        generateCashback: generateNewCashback,
        observations: raw.observations || null,
        usedCashbackId: (raw.selectedCashback as Cashback | null)?.id ?? null,
        ...(generateNewCashback // equivale a um if (generateNewCashback)
          ? {
            cashbackValidityDays: 30,
            cashbackGenerationRate: Math.round(CASHBACK_CONFIG.cashbackGenerationRate * 100),
            cashbackRedemptionRate: Math.round(CASHBACK_CONFIG.cashbackRedemptionRate * 100),
          }
          : {}
        ),
      };

      this.purchaseService.addPurchase(purchase).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => {
          // front-end já trata os demais erros possíveis na UI
          this.feedback.apiError(err, 'Erro ao tentar registrar compra')
          console.error('Erro ao tentar registrar compra:', err);
        }
      });
    } else {
      this.purchaseForm.markAllAsTouched();
      this.feedback.warning('Formulário inválido');
      console.warn('Formulário inválido');
    }
  }

  private setEmployeeField(users: User[]) {
    const loggedUserId = this.authService.getUserId();
    this.loggedUser = users.find((user) => user.id === loggedUserId) ?? null;

    if (!this.loggedUser) {
      this.users = [];
      this.purchaseForm.patchValue({ employee: null });
      return;
    }

    this.users = this.isAdmin ? users : [this.loggedUser];
    this.purchaseForm.patchValue({ employee: this.loggedUser });

    if (this.isAdmin) {
      this.purchaseForm.get('employee')?.enable({ emitEvent: false });
    } else {
      this.purchaseForm.get('employee')?.disable({ emitEvent: false });
    }
  }

  private setValueAndCashbackListeners(): void {
    this.purchaseForm.get('purchaseValue')?.valueChanges.subscribe(() => this.syncTotalAndFinalValue());
    this.purchaseForm.get('selectedCashback')?.valueChanges.subscribe(() => this.syncTotalAndFinalValue());
  }

  private setCustomerChangeListener(): void {
    this.purchaseForm.get('customer')?.valueChanges.subscribe((customer: Customer | null) => {
      this.purchaseForm.patchValue({ selectedCashback: null }, { emitEvent: false });
      this.activeCashbacksList = [];

      if (!customer?.id) return;

      this.cashbackService.getAvailableCashbacksForCustomer(customer.id).subscribe({
        next: (list) => { this.activeCashbacksList = list; },
        error: (err) => {
          this.feedback.error('Erro ao tentar listar vouchers ativos do cliente')
          console.error('Erro ao tentar listar vouchers ativos do cliente:', err);
        },
      });
    });
  }

  private syncTotalAndFinalValue(): void {
    const total = this.purchaseInputValue;
    const cashback = this.purchaseForm.get('selectedCashback')?.value as Cashback | null;
    const final = cashback !== null && total >= (cashback.minPurchaseValue ?? 0)
      ? total - cashback.value
      : total;
    this.purchaseForm.patchValue({ totalValue: total, finalValue: final }, { emitEvent: false });
  }

  private handleSuccess(): void {
    this.purchaseAdded.emit();

    const modalElement = this.modalRef?.nativeElement;
    if (modalElement) {
      const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modalElement);
      modalInstance?.hide(); // já chama resetForm()
    }
  }

  private resetForm(): void {
    this.selectedPaymentMethods.clear();
    this.activeCashbacksList = [];
    this.purchaseForm.reset({
      customer: null,
      purchaseDate: this.dateToInputValue(new Date()),
      employee: this.loggedUser,
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
  }

  private disposeTooltip(): void {
    if (this.tooltipInstance) {
      this.tooltipInstance.dispose();
      this.tooltipInstance = null;
    }
  }

  private dateToInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /* HELPERS DE TEMPLATE */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.purchaseForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  customerSearchFn(term: string, item: Customer): boolean {
    const normalizedTerm = term.trim().toLowerCase();
    if (!normalizedTerm) return true;

    return (
      item.name.toLowerCase().includes(normalizedTerm) ||
      item.cpf.includes(normalizedTerm)
    );
  }
}