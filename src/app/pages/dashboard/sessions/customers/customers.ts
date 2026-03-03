import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerHeader, CustomerAddNewModal, CustomerDeleteModal, CustomerDetailsModal, CustomerSearchCard, CustomerTable, CustomerStatusChart } from './components';
import { CustomerCashbacksModal } from '../../../../shared/components';
import { Customer, CustomerStatus } from '../../../../shared/models';
import { CustomerService } from '../../../../shared/services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    CustomerHeader,
    CustomerSearchCard,
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
  // Lista original de clientes
  originalCustomers: Customer[] = [];
  // Lista filtrada de clientes
  filteredCustomers: Customer[] = [];
  // Filtros de clientes
  searchTerm: string = '';
  customerStatusFilters: CustomerStatus[] = [];
  // Cliente selecionado na tabela
  selectedCustomer?: Customer;
  // Cliente para editar
  customerToEdit?: Customer;
  // Cliente para excluir
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

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.originalCustomers = data;
        this.filteredCustomers = data;
      },
      error: (err) => console.error(err),
    })
  }

  // Filtra os clientes com base no termo de busca
  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  // Filtra is clientes com base nos status selecionados
  onFilterCustomerStatus(statuses: CustomerStatus[]): void {
    this.customerStatusFilters = statuses;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCustomers = this.originalCustomers.filter(customer => {
      /*  
        Por que este método pode ser chamado também na hora de excluir um cliente?
        - "".toLowerCase() → "" 
        - "qualquer texto".includes("") → true (string vazia está em qualquer string)
        - ou seja: todos os clientes passam no filtro de busca
      */
      const matchesSearchTerm =
        // verifica se o nome, cpf ou e-mail bate com a busca
        customer.person.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.person.cpf.includes(this.searchTerm) ||
        customer.person.email?.toLowerCase().includes(this.searchTerm)

      const matchesStatusSearch =
        // verifica se o status do cliente bate com os filtros selecionados
        this.customerStatusFilters.length === 0 ||
        this.customerStatusFilters.includes(customer.status);

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
        this.applyFilters(); // ver comentários acima
      },
      error: (err) => console.error('Ocorreu um erro ao tentar excluir o cliente:', err),
    })
  }
}
