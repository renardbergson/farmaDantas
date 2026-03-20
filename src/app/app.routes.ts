import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { DashboardWrapper } from './pages/dashboard/dashboardWrapper';
import { Dashboard, Customers, Cashbacks, Purchases, Reports, Employees, Configs } from './pages/dashboard/sessions/index';

export const routes: Routes = [
  // 1. Rota raiz: redireciona "/" para "/login"
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // 2. Rota de login: "/login" renderiza a tela de login (sem sidebar)
  {
    path: 'login',
    component: Login
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
        children: [
          { path: '', redirectTo: 'reports', pathMatch: 'full' },
          { path: 'reports', component: Reports },
          { path: 'employees', component: Employees },
        ]
      },
    ]
  }
];
