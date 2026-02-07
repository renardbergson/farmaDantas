import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  imports: [],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css',
})
export class DashboardHeader {
  constructor(private router: Router) { }

  /**
   * Navega para a página de nova compra
   * Rota: /user/purchases
   * TODO: Se necessário, passar parâmetros ou estado para a página de destino
   */
  newPurchase(): void {
    this.router.navigate(['/user/purchases']);
  }
}
