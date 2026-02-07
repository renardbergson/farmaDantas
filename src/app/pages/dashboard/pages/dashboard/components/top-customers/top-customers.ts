import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface TopCustomer {
  name: string;
  avatar: string;
  purchases: number;
  cashback: number;
}

@Component({
  selector: 'app-top-customers',
  imports: [CommonModule],
  templateUrl: './top-customers.html',
  styleUrl: './top-customers.css',
})
export class TopCustomers implements OnInit {
  /**
   * Lista dos top 5 clientes com mais compras
   * TODO: Substituir por dados do backend
   * Estrutura esperada: Array de TopCustomer ordenado por quantidade de compras (decrescente)
   * Limite: 5 clientes
   */
  topCustomers: TopCustomer[] = [
    { name: 'Maria Silva', avatar: 'MS', purchases: 45, cashback: 450.00 },
    { name: 'João Santos', avatar: 'JS', purchases: 38, cashback: 380.00 },
    { name: 'Ana Oliveira', avatar: 'AO', purchases: 32, cashback: 320.00 },
    { name: 'Carlos Souza', avatar: 'CS', purchases: 28, cashback: 280.00 },
    { name: 'Paula Costa', avatar: 'PC', purchases: 25, cashback: 250.00 }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // TODO: Integração com API
    // Chamar loadTopClientes() quando a API estiver disponível
    // this.loadTopClientes();
  }

  viewAllCustomers(): void {
    this.router.navigate(['/user/customers']);
  }

  /**
   * Método para atualizar a lista de clientes manualmente
   * Útil para atualizações em tempo real ou quando os dados vierem de outro componente
   * @param newCustomers - Nova lista de top clientes (máximo 5)
   */
  updateCustomers(newCustomers: TopCustomer[]): void {
    this.topCustomers = [...newCustomers];
  }

  /**
   * Método para carregar dados do backend
   * Endpoint sugerido: GET /api/dashboard/top-customers
   * Parâmetros opcionais: ?limit=5&period=month (limite de clientes e período)
   * Resposta esperada: TopCustomer[]
   *
   * Exemplo de implementação:
   * loadTopClientes(): void {
   *   this.customersService.getTopClientes({ limit: 5, period: 'month' }).subscribe({
   *     next: (clientes: TopCustomer[]) => {
   *       this.updateCustomers(clientes);
   *     },
   *     error: (error) => {
   *       console.error('Erro ao carregar top clientes:', error);
   *       // Manter dados mockados em caso de erro
   *     }
   *   });
   * }
   */
  // loadTopClientes(): void {
  //   // Implementar chamada HTTP aqui
  // }
}
