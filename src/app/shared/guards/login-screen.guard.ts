import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const loginScreenGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // se o usuário não está autenticado, libera acesso
  if (!auth.isAuthenticated()) return true;

  router.navigate(['/user/dashboard']);
  return false;
}