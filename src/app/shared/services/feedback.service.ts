import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

type ValidationErrors = Record<string, string | unknown>;
type SpecificApiErrors = { apiStatuses?: number[] };

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private toastr: ToastrService) { }

  success(message: string): void {
    this.toastr.success(message);
  }

  warning(message: string): void {
    this.toastr.warning(message);
  }

  info(message: string): void {
    this.toastr.info(message);
  }

  error(message: string): void {
    this.toastr.error(message);
  }

  apiError(
    err: unknown,
    fallbackMessage: string,
    options?: SpecificApiErrors
  ): void {
    const message = this.extractApiMessage(err, options);
    this.toastr.error(message ?? fallbackMessage);
  }

  private extractApiMessage(
    err: unknown,
    options?: SpecificApiErrors
  ): string | null {
    // se não for um erro de requisição HTTP, retorna null (mensagem de fallback)
    if (!(err instanceof HttpErrorResponse)) return null;

    // se o status de erro retornado pela API não estiver dentro do array passado 
    // em "options" SpecificApiErrors), retorna null (mensagem de fallback)
    if (
      options?.apiStatuses?.length &&
      !options.apiStatuses.includes(err.status)
    ) {
      return null;
    }

    // padrão principal: { message: "..." }
    if (typeof err.error?.message === 'string' && err.error.message.trim()) {
      return err.error.message;
    }

    // validação por campo: { errors: { campo: "mensagem" } }
    const fieldErrors = err.error?.errors as ValidationErrors | undefined;

    if (fieldErrors && typeof fieldErrors === 'object') {
      const firstMessage = Object.values(fieldErrors).find(
        (value): value is string => typeof value === 'string' && value.trim().length > 0
      );
      if (firstMessage) return firstMessage;
    }

    return null;
  }
}