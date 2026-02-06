import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { DashboardWrapper } from './pages/dashboard/dashboardWrapper';
import { Dashboard, Customers, Cashbacks, Purchases } from './pages/dashboard/pages/index';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'user',
    component: DashboardWrapper,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'customers', component: Customers },
      { path: 'purchases', component: Purchases },
      { path: 'cashbacks', component: Cashbacks },
    ]
  }
];
