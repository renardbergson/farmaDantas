import { CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';

export const roleGuard: CanActivateChildFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // vem de algo como: data: { roles: [UserRole.ADMIN] }
  const allowedRoles = route.data?.['roles'] as UserRole[] | undefined;
  const userRole = auth.getRole();

  if (!allowedRoles || (userRole && allowedRoles.includes(userRole))) {
    /*  
      Libera acesso se:
        - não há restrições de roles OU
        - há restrições e o papel do usuário está na lista
    */
    return true;
  }

  router.navigate(['/user/dashboard']);
  return false;
}