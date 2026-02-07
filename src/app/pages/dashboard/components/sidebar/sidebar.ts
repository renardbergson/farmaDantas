import { Component, OnInit, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  isCollapsed: boolean = false;
  isAdmin: boolean = true;

  menuItems = [
    { text: "Dashboard", icon: "bi bi-grid-1x2", route: "/user/dashboard" },
    { text: "Clientes", icon: "bi bi-people", route: "/user/customers" },
    { text: "Compras", icon: "bi bi-cart", route: "/user/purchases" },
    { text: "Cashbacks", icon: "bi bi-gift", route: "/user/cashbacks" }
  ];

  adminMenuItems = [
    { text: "Relatórios", icon: "bi bi-bar-chart", route: "/admin/reports" },
    { text: "Funcionários", icon: "bi bi-people", route: "/admin/employees" },
  ];

  userInfo = {
    name: 'João da Silva',
    role: 'Administrador',
    initials: 'JD'
  }

  @HostBinding('class.collapsed') get collapsedClass() {
    return this.isCollapsed;
  }

  @Output() collapsedChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    // Carregar estado salvo do localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
      this.isCollapsed = true;
    }
    this.collapsedChange.emit(this.isCollapsed);
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
}
