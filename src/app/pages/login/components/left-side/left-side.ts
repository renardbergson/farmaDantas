import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-left-side',
  imports: [FormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './left-side.html',
  styleUrl: './left-side.css',
  host: {
    'class': 'form-side'
  }
})
export class LeftSide {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

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
        next: () => this.router.navigate(['/user/dashboard']),
        error: (err) => {
          this.toastr.error("CPF ou senha inválidos", undefined, {
            positionClass: 'toast-bottom-left',
          });
        }
      })
  }
}
