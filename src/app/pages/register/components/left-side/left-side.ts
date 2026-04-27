import { formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CreateUserRequest } from '../../../../shared/models/user';
import { UserService, FeedbackService } from '../../../../shared/services';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = (control.value as string | null | undefined) ?? '';
    const cpf = raw.replace(/\D/g, '');

    if (cpf.length !== 11) return { cpfInvalid: true };
    if (/^(\d)\1{10}$/.test(cpf)) return { cpfInvalid: true };

    const nums = cpf.split('').map((d) => parseInt(d, 10));

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += nums[i] * (10 - i);
    let mod = (sum * 10) % 11;
    if (mod === 10 || mod === 11) mod = 0;
    if (mod !== nums[9]) return { cpfInvalid: true };

    sum = 0;
    for (let i = 0; i < 10; i++) sum += nums[i] * (11 - i);
    mod = (sum * 10) % 11;
    if (mod === 10 || mod === 11) mod = 0;
    if (mod !== nums[10]) return { cpfInvalid: true };

    return null;
  };
}

function minAge18Validator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null | undefined;

    if (!value) return null;

    const limit = new Date();
    limit.setFullYear(limit.getFullYear() - 18);
    const limitStr = formatDate(limit, 'yyyy-MM-dd', 'en-US');

    return value <= limitStr ? null : { minAge: true };
  };
}

@Component({
  selector: 'app-left-side',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './left-side.html',
  styleUrl: './left-side.css',
})
export class LeftSide {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly feedback = inject(FeedbackService);
  private readonly router = inject(Router);
  readonly todayDate = this.dateToInputValue(new Date());
  isSubmitting = false;

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    cpf: ['', [Validators.required, cpfValidator()]],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dateOfBirth: ['', [Validators.required, minAge18Validator()]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_PATTERN),
      ],
    ],
    confirmPassword: ['', [Validators.required]],
  });

  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  syncConfirmPasswordMismatch(): void {
    const passwordCtrl = this.form.get('password');
    const confirmCtrl = this.form.get('confirmPassword');
    if (!passwordCtrl || !confirmCtrl) return;

    const password = (passwordCtrl.value as string | null | undefined) ?? '';
    const confirm = (confirmCtrl.value as string | null | undefined) ?? '';

    const shouldCheck =
      confirmCtrl.dirty || confirmCtrl.touched || passwordCtrl.dirty || passwordCtrl.touched;

    if (!shouldCheck) return;

    if (!confirm) {
      this.clearErrorKey(confirmCtrl, 'mismatch');
      return;
    }

    if (password !== confirm) {
      const nextErrors = {
        ...(confirmCtrl.errors ?? {}),
        mismatch: true
      };
      confirmCtrl.setErrors(nextErrors);
    } else {
      this.clearErrorKey(confirmCtrl, 'mismatch');
    }
  }

  onSubmit(): void {
    this.syncConfirmPasswordMismatch();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.feedback.error('Formulário inválido');
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;
    const raw = this.form.getRawValue();

    const body: CreateUserRequest = {
      password: raw.password ?? '',
      name: raw.name?.trim() ?? '',
      phone: (raw.phone ?? '').replace(/\D/g, ''),
      email: raw.email?.trim() || null,
      cpf: (raw.cpf ?? '').replace(/\D/g, ''),
      dateOfBirth: raw.dateOfBirth || null
    }

    this.userService.createUser(body)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/login'], {
            // Esse objeto vai para o history.state da navegação seguinte, é um estado transitório de navegação, bom
            // para toast, flag de origem, etc
            state: {
              registerSuccess: true,
              message: 'Cadastro solicitado com sucesso'
            },
          });
        },
        error: (err) => {
          this.feedback.apiError(
            err,
            'Erro ao tentar registrar usuário',
            { apiStatuses: [400, 409] }
          );
        }
      })
  }

  private clearErrorKey(control: AbstractControl, key: string): void {
    const errors = control.errors;
    if (!errors || !(key in errors)) return;

    const _errors = { ...errors } as Record<string, unknown>;
    delete _errors[key];
    control.setErrors(Object.keys(_errors).length ? _errors : null);
  }

  private dateToInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
