import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Customer} from '../../customerModel';

@Component({
  selector: 'app-customer-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-delete-modal.component.html',
  styleUrl: './customer-delete-modal.component.css'
})
export class CustomerDeleteModal {
  @Input() customer: Customer | null = null;
  @Output() confirmDelete = new EventEmitter<Customer>();

  onConfirm(): void {
    if(this.customer) {
      this.confirmDelete.emit(this.customer);
    }
  }
}
