import { Component, OnInit, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { getInitials } from '../../../../shared/utils/getInitials';
import { formatNameDisplay } from '../../../../shared/utils/formatNameDisplay';
import { AuthService } from '../../../../shared/services';
import { UserRole } from '../../../../shared/models';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  isCollapsed: boolean = false;

  role: Partial<Record<UserRole, string>> = {
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.EMPLOYEE]: 'Funcionário'
  };

  menuItems = [
    { text: "Dashboard", icon: "bi bi-grid-1x2", route: "/user/dashboard" },
    { text: "Clientes", icon: "bi bi-people", route: "/user/customers" },
    { text: "Compras", icon: "bi bi-cart", route: "/user/purchases" },
    { text: "Cashbacks", icon: "bi bi-gift", route: "/user/cashbacks" }
  ];

  adminMenuItems = [
    { text: "Relatórios", icon: "bi bi-bar-chart", route: "/admin/reports" },
    { text: "Funcionários", icon: "bi bi-person-badge", route: "/admin/employees" },
  ];

  protected readonly getInitials = getInitials;
  protected readonly formatNameDisplay = formatNameDisplay;

  @HostBinding('class.collapsed') get collapsedClass() {
    return this.isCollapsed;
  }

  @Output() collapsedChange = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
      this.isCollapsed = true;
    }
    this.collapsedChange.emit(this.isCollapsed);
  }

  // Getters evitam estado duplicado e sempre retornam
  // os dados mais atuais do AuthService, sendo reavaliados 
  // no change detection do Angular
  get userName(): string {
    return this.authService.getName() || '';
  }

  get userRole(): string {
    const role = this.authService.getRole();
    return role ? this.role[role] as UserRole : '';
  }

  get isAdmin(): boolean {
    return this.authService.getRole() === UserRole.ADMIN;
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    // Salvar estado no localStorage
    localStorage.setItem('sidebarCollapsed', this.isCollapsed.toString());
    this.collapsedChange.emit(this.isCollapsed);
  }

  getCollapseButtonLabel(): string {
    return this.isCollapsed ? 'Expandir menu' : 'Recolher menu';
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
