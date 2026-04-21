import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Interceptará toda requisição HTTP do Angular
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // se não tem token, passa a requisição normalmente
  // rotas públicas (api/auth/login) não precisam de token
  if (!token) return next(request);

  // Por que clonar? Em Angular, HttpRequest é imutável, 
  // assim, aqui criamos uma nova request com o header extra,
  // preservando a requisição original
  const cloned = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    },
  });

  return next(cloned);
}