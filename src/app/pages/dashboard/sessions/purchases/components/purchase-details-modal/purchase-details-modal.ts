import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Purchase, PurchaseCategory, CashbackStatus } from '../../../../../../shared/models';
import { getInitials } from '../../../../../../shared/utils/getInitials';

@Component({
  selector: 'app-purchase-details-modal',
  imports: [CommonModule],
  templateUrl: './purchase-details-modal.html',
  styleUrl: './purchase-details-modal.css',
})
export class PurchaseDetailsModal {
  @Input() purchase?: Purchase;
  protected readonly getInitials = getInitials;
  protected readonly CashbackStatus = CashbackStatus;

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

  getPaymentMethodsDisplay(methods?: string[]): string {
    return methods?.length ? methods.join(', ') : '--';
  }
}
