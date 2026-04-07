import { Component, OnInit, ViewChild } from '@angular/core';
import { PurchaseHeader, PurchaseStatsCards, PurchaseSearchbar, PurchaseTable, PurchaseAddNewModal, PurchaseDeleteModal } from './components'
import { PurchaseDetailsModalComponent } from '../../../../shared/components/purchase-details-modal/purchase-details-modal.component';
import { Purchase } from '../../../../shared/models';
import { PurchaseService } from '../../../../shared/services';
import { PurchaseFilters } from './components/purchase-searchbar/purchase-searchbar';

@Component({
  selector: 'app-purchases',
  imports: [PurchaseHeader, PurchaseStatsCards, PurchaseSearchbar, PurchaseTable, PurchaseAddNewModal, PurchaseDetailsModalComponent, PurchaseDeleteModal],
  templateUrl: './purchases.html',
  styleUrl: './purchases.css',
})
export class Purchases implements OnInit {
  originalPurchases: Purchase[] = [];
  filteredPurchases: Purchase[] = [];
  selectedPurchaseId: string | null = null;
  purchaseToDelete: Purchase | null = null;

  @ViewChild(PurchaseStatsCards) purchaseStatsCards!: PurchaseStatsCards;

  constructor(
    private purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.purchaseService.getPurchases().subscribe({
      next: (purchases) => {
        this.originalPurchases = purchases;
        this.filteredPurchases = purchases;
      },
      error: (err) => {
        console.error('Ocorreu um erro ao tentar carregar as compras', err);
      }
    })
  }

  onPurchaseAdded(): void {
    this.loadPurchases();
    this.purchaseStatsCards?.loadStats();
  }

  onFiltersChange(filters: PurchaseFilters): void {
    this.applyFilters(filters);
  }

  applyFilters(filters: PurchaseFilters): void {
    const { term, categories } = filters;

    this.filteredPurchases = this.originalPurchases.filter(purchase => {
      const dateStr = new Date(purchase.date).toLocaleDateString('pt-BR');
      const matchesSearchTerm =
        term === '' ||
        purchase.customerName.toLowerCase().includes(term.toLowerCase()) ||
        purchase.userName.toLowerCase().includes(term.toLowerCase()) ||
        dateStr.includes(term)

      const matchesCategory =
        categories.length === 0 ||
        categories.includes(purchase.category)

      return matchesSearchTerm && matchesCategory;
    })
  }

  onViewPurchaseDetails(purchase: Purchase): void {
    this.selectedPurchaseId = purchase.id;
  }

  onDeletePurchase(purchase: Purchase): void {
    this.purchaseToDelete = purchase;
  }

  confirmDelete(purchase: Purchase): void {
    this.purchaseService.deletePurchase(purchase.id).subscribe({
      next: () => {
        this.loadPurchases();
        this.purchaseStatsCards?.loadStats();
      },
      error: (err) => console.error('Ocorreu um erro ao tentar excluir a compra:', err),
    });
  }
}
