import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, FeedbackService } from '../../../../shared/services';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { finalize } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-left-side',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective, RouterLink],
  providers: [provideNgxMask()],
  templateUrl: './left-side.html',
  styleUrl: './left-side.css',
  host: {
    'class': 'form-side'
  }
})
export class LeftSide implements OnInit {
  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private feedback: FeedbackService
  ) { }

  ngOnInit(): void {
    const navState = this.location.getState() as
      { registerSuccess?: boolean; message?: string };

    if (navState?.registerSuccess) {
      this.feedback.success(navState.message ?? 'Cadastro solicitado com sucesso');
      this.feedback.info('Aguarde a validação de um administrador para liberar seu acesso.');

      // Evita repetir o toast ao recarregar / voltar
      this.location.replaceState(this.router.url);
    }
  }

  cpf: string = '';
  password: string = '';
  showPassword: boolean = false;
  isSubmitting = signal(false);

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);

    const flatCpf = this.cpf.replace(/\D/g, '');

    this.authService.login({ cpf: flatCpf, password: this.password })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          const userName = this.authService.getName() ?? 'usuário';
          const firstName = userName.split(/\s+/)[0] || 'usuário';
          this.router.navigate(['/user/dashboard'])
          this.feedback.success(`Bem vindo, ${firstName}!`);
        },
        error: (err) => {
          if (err?.status === 403) {
            this.feedback.info('Usuário aguardando aprovação do administrador.');
            return;
          }
          this.feedback.apiError(
            err,
            'CPF ou senha inválidos',
            { apiStatuses: [400, 401] }
          );
        }
      })
  }
}
