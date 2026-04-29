import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoleManager } from './components/users-role-manager/users-role-manager';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, UsersRoleManager],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees {
  constructor() { }
}
