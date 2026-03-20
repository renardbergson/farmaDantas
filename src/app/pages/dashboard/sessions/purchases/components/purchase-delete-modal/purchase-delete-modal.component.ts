import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Purchase } from '../../../../../../shared/models';
import { getInitials } from '../../../../../../shared/utils/getInitials';

@Component({
  selector: 'app-purchase-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-delete-modal.component.html',
  styleUrl: './purchase-delete-modal.component.css'
})
export class PurchaseDeleteModal {
  @Input() purchase: Purchase | null = null;
  @Output() confirmDelete = new EventEmitter<Purchase>();

  protected readonly getInitials = getInitials;

  onConfirm(): void {
    if (this.purchase) {
      this.confirmDelete.emit(this.purchase);
    }
  }
}
