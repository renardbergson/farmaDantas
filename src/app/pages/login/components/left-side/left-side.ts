import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-left-side',
  imports: [FormsModule],
  templateUrl: './left-side.html',
  styleUrl: './left-side.css',
  host: {
    'class': 'form-side'
  }
})
export class LeftSide {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Implementar lógica de login aqui
    console.log('Login attempt:', { email: this.email, password: this.password });
    // TODO: Implementar toasts para mensagens de erro/sucesso
  }
}
