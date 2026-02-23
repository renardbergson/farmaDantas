import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerService } from '../../../../../../shared/services/customer.service';
import { Customer, Purchase, PurchaseCategory } from '../../../../../../shared/models';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-purchase-add-new-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, NgxCurrencyDirective],
  templateUrl: './purchase-add-new-modal.html',
  styleUrl: './purchase-add-new-modal.css',
})
export class PurchaseAddNewModal implements OnInit {
  @Input() purchase?: Purchase;
  customers: Customer[] = [];
  customer: Customer | null = null;
  employee: { id: number; name: string } | null = null;
  total = 0;
  categories: PurchaseCategory[] = Object.values(PurchaseCategory);
  cashbackPercent = 10;
  purchaseDate: Date = new Date(); // inicializa com a data atual

  /** Converte o valor em string para o input type="date" (YYYY-MM-DD). */
  get purchaseDateStr(): string {
    return this.dateToInputValue(this.purchaseDate);
  }

  /** Se o usuário alterar a data da compra, atualiza a data da compra e converte para o tipo Date. */
  set purchaseDateStr(value: string) {
    this.purchaseDate = this.inputValueToDate(value);
  }

  private dateToInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private inputValueToDate(value: string): Date {
    if (!value) return new Date();
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  employees: { id: number; name: string }[] = [
    { id: 1, name: 'Fernanda Lima' },
    { id: 2, name: 'Roberto Alves' },
    { id: 3, name: 'Juliana Mendes' },
    { id: 4, name: 'Marcos Pereira' },
  ];

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (error) => {
        console.error('Erro ao listar clientes:', error);
      }
    })
  }

  get cashbackValueFormatted(): string {
    const cashback = (this.total * this.cashbackPercent) / 100;
    return this.formatCurrency(cashback);
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
