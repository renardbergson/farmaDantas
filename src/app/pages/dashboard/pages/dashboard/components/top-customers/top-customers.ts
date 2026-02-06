import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface TopCliente {
  nome: string;
  avatar: string;
  compras: number;
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
   * Estrutura esperada: Array de TopCliente ordenado por quantidade de compras (decrescente)
   * Limite: 5 clientes
   */
  topClientes: TopCliente[] = [
    { nome: 'Maria Silva', avatar: 'MS', compras: 45, cashback: 450.00 },
    { nome: 'João Santos', avatar: 'JS', compras: 38, cashback: 380.00 },
    { nome: 'Ana Oliveira', avatar: 'AO', compras: 32, cashback: 320.00 },
    { nome: 'Carlos Souza', avatar: 'CS', compras: 28, cashback: 280.00 },
    { nome: 'Paula Costa', avatar: 'PC', compras: 25, cashback: 250.00 }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // TODO: Integração com API
    // Chamar loadTopClientes() quando a API estiver disponível
    // this.loadTopClientes();
  }

  verTodosClientes(): void {
    this.router.navigate(['/user/customers']);
  }

  /**
   * Método para atualizar a lista de clientes manualmente
   * Útil para atualizações em tempo real ou quando os dados vierem de outro componente
   * @param newClientes - Nova lista de top clientes (máximo 5)
   */
  updateClientes(newClientes: TopCliente[]): void {
    this.topClientes = [...newClientes];
  }

  /**
   * Método para carregar dados do backend
   * Endpoint sugerido: GET /api/dashboard/top-customers
   * Parâmetros opcionais: ?limit=5&period=month (limite de clientes e período)
   * Resposta esperada: TopCliente[]
   * 
   * Exemplo de implementação:
   * loadTopClientes(): void {
   *   this.customersService.getTopClientes({ limit: 5, period: 'month' }).subscribe({
   *     next: (clientes: TopCliente[]) => {
   *       this.updateClientes(clientes);
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
