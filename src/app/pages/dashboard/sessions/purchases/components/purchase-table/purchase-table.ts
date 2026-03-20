import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  sortByDate: 'desc' | 'asc' = 'desc';
  @Output() viewDetails = new EventEmitter<Purchase>();
  @Output() deletePurchase = new EventEmitter<Purchase>();
  getInitials: (name: string) => string;

  constructor() {
    this.getInitials = getInitials;
  }

  get sortedPurchases(): Purchase[] {
    return [...this.purchases].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.sortByDate === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }

  toggleSortByDate(): void {
    this.sortByDate = this.sortByDate === 'desc' ? 'asc' : 'desc';
  }

  onViewDetails(purchase: Purchase): void {
    this.viewDetails.emit(purchase);
  }

  onDeletePurchase(purchase: Purchase): void {
    this.deletePurchase.emit(purchase);
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
