import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(private router: Router) { }

  /**
   * Navega para a página de nova compra
   * Rota: /user/purchases
   * TODO: Se necessário, passar parâmetros ou estado para a página de destino
   */
  novaCompra(): void {
    this.router.navigate(['/user/purchases']);
  }
}
