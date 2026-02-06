import { Component, HostBinding } from '@angular/core';
import { Sidebar } from './components/sidebar/sidebar';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-dashboard-wrapper',
  imports: [Sidebar, RouterModule],
  templateUrl: './dashboardWrapper.html',
  styleUrl: './dashboardWrapper.css',
})
export class DashboardWrapper {
  @HostBinding('class.sidebar-collapsed') sidebarCollapsed: boolean = false;

  onSidebarCollapsedChange(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }
}
