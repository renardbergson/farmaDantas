import { Component, OnInit, ViewChild } from '@angular/core';
import { PurchaseHeader, PurchaseStatsCards, PurchaseSearchbar, PurchaseTable, PurchaseAddNewModal, PurchaseDetailsModal, PurchaseDeleteModal } from './components'
import { Purchase } from '../../../../shared/models';
import { CustomerService, PurchaseService } from '../../../../shared/services';
import { PurchaseFilters } from './components/purchase-searchbar/purchase-searchbar';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-purchases',
  imports: [PurchaseHeader, PurchaseStatsCards, PurchaseSearchbar, PurchaseTable, PurchaseAddNewModal, PurchaseDetailsModal, PurchaseDeleteModal],
  templateUrl: './purchases.html',
  styleUrl: './purchases.css',
})
export class Purchases implements OnInit {
  originalPurchases: Purchase[] = [];
  filteredPurchases: Purchase[] = [];
  selectedPurchase?: Purchase;
  purchaseToDelete: Purchase | null = null;

  @ViewChild(PurchaseStatsCards) purchaseStatsCards!: PurchaseStatsCards;

  constructor(
    private customerService: CustomerService,
    private purchaseService: PurchaseService
  ) { }

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

  onDeletePurchase(purchase: Purchase): void {
    this.purchaseToDelete = purchase;
  }

  /**
   * Orquestra a exclusão da compra entre CustomerService e PurchaseService.
   *
   * Fluxo:
   * 1. getCustomers() emite o array de clientes.
   * 2. switchMap recebe esse array, encontra o cliente e chama deletePurchase(customer, purchase).
   * 3. deletePurchase retorna Observable<Purchase>; switchMap emite esse valor.
   * 4. subscribe recebe a compra removida e atualiza a UI.
   *
   * Foi usado pipe() + switchMap em vez de subscribe aninhado para manter o fluxo linear e evitar
   * callbacks dentro de callbacks. O pipe encadeia os operadores; o subscribe inicia a execução.
   */
  confirmDelete(purchase: Purchase): void {
    this.customerService.getCustomers().pipe(
      switchMap((customers) => {
        const customer = customers.find((c) => c.id === purchase.customerId);
        if (!customer) return of(null);
        return this.purchaseService.deletePurchase(customer, purchase);
      })
    ).subscribe({
      next: (result) => {
        if (result) {
          this.originalPurchases = this.originalPurchases.filter((p) => p.id !== purchase.id);
          this.applyFilters({ term: '', categories: [] });
          this.purchaseStatsCards?.loadStats();
        }
      },
      error: (err) => console.error('Ocorreu um erro ao tentar excluir a compra:', err),
    });
  }
}
