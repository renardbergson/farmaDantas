import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerHeader, CustomerAddNewModal, CustomerDeleteModal, CustomerDetailsModal, CustomerSearchbar, CustomerTable, CustomerStatusChart } from './components';
import { CustomerCashbacksModal } from '../../../../shared/components';
import { Customer } from '../../../../shared/models';
import { CustomerService, FeedbackService } from '../../../../shared/services';
import { CustomerFilters } from './components/customer-searchbar/customer-searchbar';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    CustomerHeader,
    CustomerSearchbar,
    CustomerTable,
    CustomerAddNewModal,
    CustomerDeleteModal,
    CustomerDetailsModal,
    CustomerCashbacksModal,
    CustomerStatusChart
  ],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit {
  originalCustomers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  currentFilters: CustomerFilters = { term: '', statuses: [] };
  selectedCustomer?: Customer;
  customerToEdit?: Customer;
  customerToDelete: Customer | null = null;

  @ViewChild(CustomerAddNewModal) customerAddNewModal?: CustomerAddNewModal;

  constructor(
    private customerService: CustomerService,
    private feedback: FeedbackService
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.originalCustomers = customers;
        this.applyFilters(this.currentFilters);
      },
      error: (err) => {
        this.feedback.error('Erro ao tentar listar os clientes')
        console.error('Erro ao tentar listar os clientes:', err);
      }
    })
  }

  onFiltersChange(filters: CustomerFilters): void {
    this.currentFilters = filters;
    this.applyFilters(filters);
  }

  get hasActiveFilters(): boolean {
    return this.currentFilters.term.trim() !== '' || this.currentFilters.statuses.length > 0;
  }

  applyFilters(filters: CustomerFilters): void {
    const { term, statuses } = filters;

    this.filteredCustomers = this.originalCustomers.filter(customer => {
      const matchesSearchTerm =
        // verifica se o nome, cpf ou e-mail bate com a busca
        term === '' ||
        customer.name.toLowerCase().includes(term.toLowerCase()) ||
        customer.cpf.includes(term) ||
        customer.email?.toLowerCase().includes(term.toLowerCase())

      const matchesStatusSearch =
        // verifica se o status do cliente bate com os filtros selecionados
        statuses.length === 0 ||
        statuses.includes(customer.status);

      // retorno interno do filter
      return matchesSearchTerm && matchesStatusSearch;
    });
  }

  // Abre o modal de novo cliente
  onAddCustomer(): void {
    // abertura de modal gerenciada pelo bootstrap ***
    this.customerToEdit = undefined;
    this.customerAddNewModal?.customerForm.reset(); // limpa o formulário do modal
  }

  // Atribui o cliente selecionado ao modal de detalhes
  onSelectCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
  }

  onEditCustomer(customer: Customer): void {
    this.customerToEdit = customer;
  }

  onDeleteCustomer(customer: Customer): void {
    this.customerToDelete = customer;
  }

  confirmDelete(customer: Customer): void {
    this.customerService.deleteCustomer(customer).subscribe({
      next: () => {
        this.loadCustomers();
        this.feedback.success('Cliente excluído com sucesso');
      },
      error: (err) => {
        this.feedback.error('Erro ao tentar excluir o cliente')
        console.error('Erro ao tentar excluir o cliente:', err);
      }
    })
  }
}
