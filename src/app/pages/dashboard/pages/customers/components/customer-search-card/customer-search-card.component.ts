import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerStatus } from '../../customerModel';

@Component({
  selector: 'app-customer-search-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-search-card.component.html',
  styleUrl: './customer-search-card.component.css',
})
export class CustomerSearchCard {
  @Output() search = new EventEmitter<string>();
  @Output() statusFilter = new EventEmitter<CustomerStatus[]>();

  constructor() {}

  statuses = [
    { value: CustomerStatus.NEW, label: 'Novo', class: 'filter-new' },
    { value: CustomerStatus.ACTIVE, label: 'Ativo', class: 'filter-active' },
    { value: CustomerStatus.ABSENT, label: 'Ausente', class: 'filter-absent' },
    { value: CustomerStatus.INACTIVE, label: 'Inativo', class: 'filter-inactive' }
  ];

  selectedStatuses: Set<CustomerStatus> = new Set();
  // No TS/JS, um Set é uma coleção de valores únicos.
  // Diferente de um Array comum, o Set não permite itens duplicados.
  // Por que usar Set aqui? Porque facilita muito verificar se um status
  // já está selecionado e garante que não adicionaremos o mesmo status
  // duas vezes por engano.

  // Notifica o componente pai quando o termo de busca é alterado
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search.emit(input.value);
  }

  toggleStatus(status: CustomerStatus): void {
    // 1. Verifica status individualmente
    if (this.selectedStatuses.has(status)) {
      // Se o status JÁ ESTÁ no conjunto, o usuário clicou para REMOVER o filtro.
      this.selectedStatuses.delete(status);
    } else {
      // Se o status NÃO ESTÁ no conjunto, o usuário clicou para ADICIONAR o filtro.
      this.selectedStatuses.add(status);
    }

    // 2. Se todos os filtros de status forem selecionados, removemos todos
    const totalEnumStatusCount = Object.values(CustomerStatus).length;
    if(this.selectedStatuses.size === totalEnumStatusCount) {
      this.selectedStatuses.clear();
    }

    // Notifica o pai
    this.statusFilter.emit(Array.from(this.selectedStatuses));
  }

  statusMustBeChecked(status: CustomerStatus): boolean {
    return this.selectedStatuses.has(status);
  }
}
