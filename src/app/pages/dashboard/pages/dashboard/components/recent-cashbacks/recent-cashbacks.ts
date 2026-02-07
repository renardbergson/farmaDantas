import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface RecentCashback {
  customer: string;
  expiresIn: string;
  status: 'active' | 'expired';
  value: number;
}

@Component({
  selector: 'app-recent-cashbacks',
  imports: [CommonModule],
  templateUrl: './recent-cashbacks.html',
  styleUrl: './recent-cashbacks.css',
})
export class RecentCashbacks implements OnInit {
  /**
   * Lista dos últimos 4 cashbacks gerados
   * TODO: Substituir por dados do backend
   * Estrutura esperada: Array de RecentCashback ordenado por data de criação (decrescente)
   * Limite: 4 cashbacks
   * Status: 'ativo' ou 'expirado'
   */
  recentCashbacks: RecentCashback[] = [
    { customer: 'Maria Silva', expiresIn: '5 dias', status: 'active', value: 15.00 },
    { customer: 'João Santos', expiresIn: '12 dias', status: 'active', value: 22.50 },
    { customer: 'Ana Oliveira', expiresIn: '28 dias', status: 'active', value: 8.00 },
    { customer: 'Carlos Souza', expiresIn: '-', status: 'expired', value: 35.00 }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // TODO: Integração com API
    // Chamar loadRecentCashbacks() quando a API estiver disponível
    // this.loadRecentCashbacks();
  }

  viewAllCashbacks(): void {
    this.router.navigate(['/user/cashbacks']);
  }

  /**
   * Método para atualizar a lista de cashbacks manualmente
   * Útil para atualizações em tempo real ou quando os dados vierem de outro componente
   * @param newCashbacks - Nova lista de cashbacks recentes (máximo 4)
   */
  updateCashbacks(newCashbacks: RecentCashback[]): void {
    this.recentCashbacks = [...newCashbacks];
  }

  /**
   * Método para carregar dados do backend
   * Endpoint sugerido: GET /api/dashboard/recent-cashbacks
   * Parâmetros opcionais: ?limit=4 (limite de cashbacks)
   * Resposta esperada: RecentCashback[]
   *
   * Exemplo de implementação:
   * loadRecentCashbacks(): void {
   *   this.cashbackService.getRecentCashbacks({ limit: 4 }).subscribe({
   *     next: (cashbacks: RecentCashback[]) => {
   *       this.updateCashbacks(cashbacks);
   *     },
   *     error: (error) => {
   *       console.error('Erro ao carregar cashbacks recentes:', error);
   *       // Manter dados mockados em caso de erro
   *     }
   *   });
   * }
   */
  // loadRecentCashbacks(): void {
  //   // Implementar chamada HTTP aqui
  // }
}
