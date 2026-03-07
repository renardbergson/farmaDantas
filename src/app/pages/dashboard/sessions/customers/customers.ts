import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerHeader, CustomerAddNewModal, CustomerDeleteModal, CustomerDetailsModal, CustomerSearchbar, CustomerTable, CustomerStatusChart } from './components';
import { CustomerCashbacksModal } from '../../../../shared/components';
import { Customer } from '../../../../shared/models';
import { CustomerService, CashbackService, PurchaseService } from '../../../../shared/services';
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
  selectedCustomer?: Customer;
  customerToEdit?: Customer;
  customerToDelete: Customer | null = null;

  @ViewChild(CustomerAddNewModal) customerAddNewModal?: CustomerAddNewModal;
  /*  
    1. ViewChild permite ao componente pai obter uma referência ao filho (componente, diretiva ou elemento DOM) declarado no template.
    2. Com isso é possível:
      - Chamar métodos do filho 
      - Ler propriedades do filho
      - Acessar o elemento DOM quando for um elemento nativo
      * Importante: a referência só fica disponível depois que a view for inicializada (nfAfterViewInit)
    3. @Input() / @Output() X ViewChild()
      3.1. @Input() / @Output() 
        - permite comunicação reativa e desacoplada
        - quando o @Input() muda, o Angular atualiza o filho automaticamente
        - facilita testes
        - o componente pode ser usado em mais de um contexto
      3.2. ViewChild()
        - a comunicação é unidirecional: de pai para o filho
        - deixa o código mais acoplado
        - o pai precisa chamar métodos manualmente
  */

  constructor(
    private customerService: CustomerService,
    private cashbackService: CashbackService,
    private purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        const withPurchaseStats = this.purchaseService.getPurchaseStatsByCustomer(customers);
        const withCashbackStats = this.cashbackService.getCashbackStatsByCustomer(customers);

        const enriched = customers.map((customer, index) => {
          return {
            ...customer,
            ...withPurchaseStats[index],
            ...withCashbackStats[index]
          } satisfies Customer;
        })

        this.originalCustomers = enriched;
        this.filteredCustomers = enriched;
      },
      error: (err) => console.error('Ocorreu um erro ao tentar carregar os clientes e suas estatísticas:', err),
    })
  }

  onFiltersChange(filters: CustomerFilters): void {
    this.applyFilters(filters);
  }

  applyFilters(filters: CustomerFilters): void {
    const { term, statuses } = filters;

    this.filteredCustomers = this.originalCustomers.filter(customer => {
      /*  
        Por que este método pode ser chamado também na hora de excluir um cliente?
        - "".toLowerCase() → "" 
        - "qualquer texto".includes("") → true (string vazia está em qualquer string)
        - ou seja: todos os clientes passam no filtro de busca
      */
      const matchesSearchTerm =
        // verifica se o nome, cpf ou e-mail bate com a busca
        term === '' ||
        customer.person.name.toLowerCase().includes(term.toLowerCase()) ||
        customer.person.cpf.includes(term) ||
        customer.person.email?.toLowerCase().includes(term.toLowerCase())

      const matchesStatusSearch =
        // verifica se o status do cliente bate com os filtros selecionados
        statuses.length === 0 ||
        statuses.includes(customer.status);

      // retorno do filter
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
    // this.filteredCustomers = this.filteredCustomers.filter(c => c.id !== customer.id);
    this.customerService.deleteCustomer(customer).subscribe({
      next: (data) => {
        this.originalCustomers = this.originalCustomers.filter(c => c.id !== data.id)
        this.applyFilters({ term: '', statuses: [] }); // ver comentários acima
      },
      error: (err) => console.error('Ocorreu um erro ao tentar excluir o cliente:', err),
    })
  }
}
