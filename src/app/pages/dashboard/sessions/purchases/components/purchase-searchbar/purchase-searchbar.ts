import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseCategory } from '../../../../../../shared/models';

export interface PurchaseFilters {
  term: string;
  categories: PurchaseCategory[];
}

@Component({
  selector: 'app-purchases-searchbar',
  imports: [CommonModule],
  templateUrl: './purchase-searchbar.html',
  styleUrl: './purchase-searchbar.css',
})
export class PurchaseSearchbar {
  @Output() filtersChange = new EventEmitter<PurchaseFilters>();

  searchTerm: string = '';
  selectedCategories: Set<PurchaseCategory> = new Set();

  constructor() { }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.emitFilters();
  }

  // Mapeamento de categoria para classes CSS
  categoryStyles: Record<PurchaseCategory, string> = {
    [PurchaseCategory.ANTIBIOTIC]: 'filter-antibiotic',
    [PurchaseCategory.CONTRACEPTIVE]: 'filter-contraceptive',
    [PurchaseCategory.CONTINUOUS]: 'filter-continuous',
    [PurchaseCategory.CONTROLLED]: 'filter-controlled',
    [PurchaseCategory.KIDS]: 'filter-kids',
    [PurchaseCategory.SUPPLEMENTS]: 'filter-supplements',
    [PurchaseCategory.ELDERLY]: 'filter-elderly',
  };
  categories = Object.values(PurchaseCategory).map(category => ({
    value: category,
    class: this.categoryStyles[category]
  }));

  // Adicionar ou remover filtro de categoria
  toggleCategory(category: PurchaseCategory) {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }

    const totalEnumStatusCount = Object.values(PurchaseCategory).length;
    if (this.selectedCategories.size === totalEnumStatusCount) {
      this.selectedCategories = new Set();
    }

    this.emitFilters();
  }

  private emitFilters(): void {
    this.filtersChange.emit({
      term: this.searchTerm,
      categories: Array.from(this.selectedCategories)
    });
  }
}
