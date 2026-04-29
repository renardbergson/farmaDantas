import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { DashboardWrapper } from './pages/dashboard/dashboardWrapper';
import { Dashboard, Customers, Cashbacks, Purchases, Reports, Employees, Configs } from './pages/dashboard/sessions/index';
import { authGuard } from './shared/guards/auth.guard';
import { loginScreenGuard } from './shared/guards/login-screen.guard';
import { roleGuard } from './shared/guards/role.guard';
import { UserRole } from './shared/models';

export const routes: Routes = [
  // 1. Rota raiz: redireciona "/" para "/login"
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // 2. Rotas de login e registro: "/login" e "/register"
  {
    path: 'login',
    component: Login,
    canActivate: [loginScreenGuard]
  },

  {
    path: 'register',
    component: Register,
    canActivate: [loginScreenGuard]
  },

  // 3. Rota com layout (sidebar + conteúdo): "/user/*" e "/admin/*"
  //    path: '' com pathMatch: 'prefix' = "caso com qualquer URL que não casou nas rotas acima"
  //    Assim, /user/*, /admin/* renderizam o DashboardWrapper
  //    mantendo-o montado ao trocar entre user e admin, evitando blink na sidebar, ao trocar entre os paths: user e admin
  {
    path: '',
    component: DashboardWrapper,
    pathMatch: 'prefix',
    children: [
      {
        path: 'user',
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: Dashboard },
          { path: 'customers', component: Customers },
          { path: 'purchases', component: Purchases },
          { path: 'cashbacks', component: Cashbacks },
          { path: 'configs', component: Configs },
        ]
      },
      {
        path: 'admin',
        canActivate: [authGuard],
        canActivateChild: [roleGuard],
        data: { roles: [UserRole.ADMIN] },
        children: [
          { path: '', redirectTo: 'reports', pathMatch: 'full' },
          { path: 'reports', component: Reports },
          { path: 'employees', component: Employees },
        ]
      },
    ]
  }
];
