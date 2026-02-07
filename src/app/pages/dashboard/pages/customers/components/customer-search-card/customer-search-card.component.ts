import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-customer-search-card',
  standalone: true,
  imports: [],
  templateUrl: './customer-search-card.component.html',
  styleUrl: './customer-search-card.component.css',
})
export class CustomerSearchCard {
  @Output() search = new EventEmitter<string>();

  // Notifica o componente pai quando o termo de busca é alterado
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search.emit(input.value);
  }
}
