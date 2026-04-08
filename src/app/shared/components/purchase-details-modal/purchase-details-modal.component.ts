import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, PercentPipe } from '@angular/common';
import {
  PurchaseCategory,
  type PurchaseDetailsResponse,
} from '../../models';
import { PurchaseService } from '../../services';
import { getInitials } from '../../utils/getInitials';
import { PaymentMethodsLabelPipe, PurchaseCategoryLabelPipe, PurchaseModeLabelPipe } from '../../pipes';

@Component({
  selector: 'app-purchase-details-modal',
  imports: [CommonModule, PurchaseCategoryLabelPipe, PercentPipe, PurchaseModeLabelPipe, PaymentMethodsLabelPipe],
  templateUrl: './purchase-details-modal.component.html',
  styleUrl: './purchase-details-modal.component.css',
})
export class PurchaseDetailsModalComponent implements OnChanges {
  @Input() purchaseId: string | null = null;
  purchaseDetails: PurchaseDetailsResponse | null = null;
  isLoading = false;
  hasError = false;
  protected readonly getInitials = getInitials;

  constructor(private purchaseService: PurchaseService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['purchaseId']) return;

    if (!this.purchaseId) {
      this.purchaseDetails = null;
      this.isLoading = false;
      this.hasError = false;
      return;
    }

    this.loadPurchaseDetails(this.purchaseId);
  }

  private loadPurchaseDetails(purchaseId: string): void {
    this.isLoading = true;
    this.hasError = false;
    this.purchaseDetails = null;

    this.purchaseService.getPurchaseDetails(purchaseId).subscribe({
      next: (details) => {
        this.purchaseDetails = details;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ocorreu um erro ao tentar carregar os detalhes da compra', err);
        this.hasError = true;
        this.isLoading = false;
      }
    })
  }

  getCategoryBadgeClass(category: PurchaseCategory): string {
    switch (category) {
      case PurchaseCategory.ANTIBIOTIC: return 'badge-antibiotic';
      case PurchaseCategory.CONTRACEPTIVE: return 'badge-contraceptive';
      case PurchaseCategory.CONTINUOUS: return 'badge-continuous';
      case PurchaseCategory.CONTROLLED: return 'badge-controlled';
      case PurchaseCategory.KIDS: return 'badge-kids';
      case PurchaseCategory.SUPPLEMENTS: return 'badge-supplements';
      case PurchaseCategory.ELDERLY: return 'badge-elderly';
      default: return '';
    }
  }
}