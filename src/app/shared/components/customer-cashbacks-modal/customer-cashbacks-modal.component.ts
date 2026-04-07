import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer, Cashback, CashbackStatus } from '../../models';
import { CashbackService } from '../../services';
import { CashbackStatusLabelPipe } from '../../pipes/cashback-status-label.pipe';
import { PurchaseDetailsModalComponent } from '../purchase-details-modal/purchase-details-modal.component';

@Component({
  selector: 'app-customer-cashbacks-modal',
  standalone: true,
  imports: [CommonModule, CashbackStatusLabelPipe, PurchaseDetailsModalComponent],
  templateUrl: './customer-cashbacks-modal.component.html',
  styleUrl: './customer-cashbacks-modal.component.css'
})
export class CustomerCashbacksModal implements OnChanges, AfterViewInit, OnDestroy {
  @Input() customer?: Customer;
  selectedPurchaseId: string | null = null;

  statuses = Object.values(CashbackStatus).map(status => ({
    value: status,
    class: this.getFilterClass(status)
  }));
  selectedStatus: Set<CashbackStatus> = new Set();

  allCashbacks: Cashback[] = [];
  filteredCashbacks: Cashback[] = [];
  /** Totais derivados da lista (a listagem da API não traz estes campos no Customer) */
  summary = { earned: 0, active: 0, used: 0 };

  private shouldReopenParent = false;
  private removeDetailsHiddenListener?: () => void;

  constructor(private cashbackService: CashbackService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['customer']) return;

    const ct = this.customer;
    if (!ct?.id) {
      this.allCashbacks = [];
      this.summary = { earned: 0, active: 0, used: 0 };
      this.applyFilters();
      return;
    }

    this.cashbackService.getCashbacksByCustomer(ct.id).subscribe({
      next: (cashbacks) => {
        this.allCashbacks = cashbacks;
        this.recomputeSummary();
        this.applyFilters();
      },
      error: (err) => console.error('Erro ao listar cashbacks do cliente:', err),
    });
  }

  ngAfterViewInit(): void {
    // modal filho: purchaseDetailsModal
    const detailsEl = document.getElementById('purchaseDetailsModal');
    if (!detailsEl) return;

    // função chamada quando o modal filho é fechado
    const onHidden = () => {
      if (!this.shouldReopenParent) return;
      this.shouldReopenParent = false;

      // modal pai: customerCashbacksModal (componente atual)
      const parentEl = document.getElementById('customerCashbacksModal');
      if (!parentEl || !(window as any).bootstrap?.Modal) return;

      const bs = (window as any).bootstrap;
      const parentInstance = bs.Modal.getOrCreateInstance(parentEl);
      parentInstance.show();
    };

    detailsEl.addEventListener('hidden.bs.modal', onHidden);

    // atribuindo a função de remoção do listener à variável da linha 31
    this.removeDetailsHiddenListener = () =>
      detailsEl.removeEventListener('hidden.bs.modal', onHidden);
  }

  // Roda na desmontagem do componente pai, removendo o listener do modal filho
  ngOnDestroy(): void {
    this.removeDetailsHiddenListener?.();
  }

  private recomputeSummary(): void {
    const cashbacks = this.allCashbacks;
    this.summary.earned = cashbacks.reduce((sum, cb) => sum + cb.value, 0);
    this.summary.active = cashbacks
      .filter(cb => cb.status === CashbackStatus.ACTIVE)
      .reduce((sum, cb) => sum + cb.value, 0);
    this.summary.used = cashbacks
      .filter(cb => cb.status === CashbackStatus.USED)
      .reduce((sum, cb) => sum + cb.value, 0);
  }

  toggleStatus(status: CashbackStatus): void {
    if (this.selectedStatus.has(status)) {
      this.selectedStatus.delete(status);
    } else {
      this.selectedStatus.add(status);
    }

    const totalEnumStatusCount = Object.values(CashbackStatus).length;
    if (this.selectedStatus.size === totalEnumStatusCount) {
      this.selectedStatus.clear();
    }

    this.applyFilters();
  }

  getFilterClass(status: CashbackStatus): string {
    switch (status) {
      case CashbackStatus.ACTIVE: return 'filter-available';
      case CashbackStatus.USED: return 'filter-used';
      case CashbackStatus.EXPIRED: return 'filter-expired';
      default: return '';
    }
  }

  getStatusClass(status: CashbackStatus): string {
    switch (status) {
      case CashbackStatus.ACTIVE: return 'status-available';
      case CashbackStatus.USED: return 'status-used';
      case CashbackStatus.EXPIRED: return 'status-expired';
      default: return '';
    }
  }

  applyFilters(): void {
    const cashbacks = this.allCashbacks;
    this.filteredCashbacks =
      this.selectedStatus.size === 0
        ? cashbacks
        : cashbacks.filter(cb => this.selectedStatus.has(cb.status));
  }

  private switchModal(currentModalId: string, nextModalId: string): void {
    const currentEl = document.getElementById(currentModalId);
    const nextEl = document.getElementById(nextModalId);
    if (!currentEl || !nextEl || !(window as any).bootstrap?.Modal) return;
    const bs = (window as any).bootstrap;
    const currentInstance = bs.Modal.getOrCreateInstance(currentEl);
    const nextInstance = bs.Modal.getOrCreateInstance(nextEl);
    const onHidden = () => {
      currentEl.removeEventListener('hidden.bs.modal', onHidden);
      nextInstance.show();
    };
    currentEl.addEventListener('hidden.bs.modal', onHidden);
    currentInstance.hide();
  }

  openPurchaseDetails(purchaseId: string): void {
    this.selectedPurchaseId = purchaseId;
    this.shouldReopenParent = true;
    this.switchModal('customerCashbacksModal', 'purchaseDetailsModal');
  }

  shortPurchaseId(purchaseId: string): string {
    const visibleChars = 8;
    if (purchaseId.length <= visibleChars) return purchaseId;
    return `${purchaseId.slice(0, visibleChars)}...`;
  }
}