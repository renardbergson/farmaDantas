import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-customer-header',
  standalone: true,
  imports: [],
  templateUrl: './customer-header.component.html',
  styleUrl: './customer-header.component.css',
})
export class CustomerHeader {
  @Output() addCustomer = new EventEmitter<void>();

  // Notifica o componente pai para abrir o modal de novo cliente
  onNewCustomer(): void {
    this.addCustomer.emit();
  }
}
