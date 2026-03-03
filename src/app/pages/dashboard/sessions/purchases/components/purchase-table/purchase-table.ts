import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Purchase, PurchaseCategory } from '../../../../../../shared/models';
import { getInitials } from '../../../../../../shared/utils/getInitials';

@Component({
  selector: 'app-purchases-table',
  imports: [CommonModule],
  templateUrl: './purchase-table.html',
  styleUrl: './purchase-table.css',
})
export class PurchaseTable {
  @Input() purchases: Purchase[] = [];
  getInitials: (name: string) => string;

  constructor() {
    this.getInitials = getInitials;
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
