import { Component, OnInit } from '@angular/core';
import { PurchaseHeader, PurchaseStatsCards, PurchaseSearchbar, PurchaseTable, PurchaseAddNewModal, PurchaseDeleteModal } from './components'
import { PurchaseDetailsModalComponent } from '../../../../shared/components/purchase-details-modal/purchase-details-modal.component';
import { Purchase } from '../../../../shared/models';
import { PurchaseService, FeedbackService } from '../../../../shared/services';
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
  isLoading = false;
  currentFilters: PurchaseFilters = { term: '', categories: [] };

  constructor(
    private purchaseService: PurchaseService,
    private feedback: FeedbackService
  ) { }

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.isLoading = true;
    this.purchaseService.getPurchases().subscribe({
      next: (purchases) => {
        this.originalPurchases = purchases;
        this.applyFilters(this.currentFilters);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.feedback.error('Erro ao tentar listar as compras');
        console.error('Erro ao tentar listar as compras:', err);
      }
    })
  }

  onPurchaseAdded(): void {
    this.loadPurchases();
  }

  onFiltersChange(filters: PurchaseFilters): void {
    this.currentFilters = filters;
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

  get hasActiveFilters(): boolean {
    return this.currentFilters.term.trim() !== '' || this.currentFilters.categories.length > 0;
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
      },
      error: (err) => {
        this.feedback.apiError(
          err,
          'Erro ao tentar excluir a compra',
          { apiStatuses: [400] }
        );
        console.error('Erro ao tentar excluir a compra:', err);
      }
    });
  }
}
