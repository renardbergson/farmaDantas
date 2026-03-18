import { Component, OnInit, ViewChild } from '@angular/core';
import { PurchaseHeader, PurchaseStatsCards, PurchaseSearchbar, PurchaseTable, PurchaseAddNewModal, PurchaseDetailsModal } from './components'
import { Purchase } from '../../../../shared/models';
import { CustomerService } from '../../../../shared/services';
import { PurchaseFilters } from './components/purchase-searchbar/purchase-searchbar';

@Component({
  selector: 'app-purchases',
  imports: [PurchaseHeader, PurchaseStatsCards, PurchaseSearchbar, PurchaseTable, PurchaseAddNewModal, PurchaseDetailsModal],
  templateUrl: './purchases.html',
  styleUrl: './purchases.css',
})
export class Purchases implements OnInit {
  originalPurchases: Purchase[] = [];
  filteredPurchases: Purchase[] = [];
  selectedPurchase?: Purchase;

  @ViewChild(PurchaseStatsCards) purchaseStatsCards!: PurchaseStatsCards;

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.originalPurchases = data.flatMap(customer => customer.purchases ?? []);
        this.filteredPurchases = this.originalPurchases;
      },
      error: (err) => {
        console.error('Ocorreu um erro ao tentar carregar as compras', err);
      }
    })
  }

  /** 
   * Quando uma compra é adicionada, atualiza a tabela de compras e também os cards de estatísticas.
  */
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
      const matchesSearchTerm =
        term === '' ||
        purchase.customerName.toLowerCase().includes(term.toLowerCase()) ||
        purchase.employeeName.toLowerCase().includes(term.toLowerCase()) ||
        purchase.date.toLocaleDateString('pt-BR').includes(term)

      const matchesCategory =
        categories.length === 0 ||
        categories.includes(purchase.category)

      return matchesSearchTerm && matchesCategory;
    })
  }

  onViewPurchaseDetails(purchase: Purchase): void {
    this.selectedPurchase = purchase;
  }

  onEditPurchase(purchase: Purchase): void {
    // TODO: abrir modal de edição da compra
  }

  onDeletePurchase(purchase: Purchase): void {
    // TODO: abrir modal de exclusão da compra
  }
}
