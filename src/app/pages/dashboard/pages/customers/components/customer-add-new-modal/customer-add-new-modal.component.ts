import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-customer-add-new-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './customer-add-new-modal.component.html',
  styleUrl: './customer-add-new-modal.component.css',
})
export class CustomerAddNewModal {
  // Gerenciamento dinâmico de telefones
  phones: string[] = [''];

  addPhone(): void {
    if (this.phones.length < 3) {
      this.phones.push('');
    }
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.splice(index, 1);
    }
  }
}
