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
  @HostBinding('class.collapsed') get collapsedClass() {
    return this.isCollapsed;
  }

  @Output() collapsedChange = new EventEmitter<boolean>();

  isCollapsed: boolean = false;

  // Dados mockados do usuário
  userName: string = 'João da Silva';
  userRole: string = 'Administrador';
  userInitials: string = 'JD';
  isAdmin: boolean = true;

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
