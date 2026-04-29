import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, FeedbackService } from '../../../../shared/services';
import { UserRole } from '../../../../shared/models';
import { getInitials } from '../../../../shared/utils/getInitials';

type SettingsTab = 'profile' | 'security' | 'cashback' | 'notifications';

@Component({
  selector: 'app-configs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configs.html',
  styleUrl: './configs.css',
})
export class Configs {
  activeTab: SettingsTab = 'profile';

  profile = {
    name: 'João da Silva',
    email: 'joao@pharmacia.com',
    phone: '(11) 99999-1111',
  };

  security = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  /** Percentuais exibidos como número inteiro (10 = 10%). */
  cashback = {
    generationPercent: 10,
    validityDays: 30,
    redemptionPercent: 10,
    maxCashbackPerPurchase: 100,
    autoCashback: true,
    smsOnGenerate: false,
  };

  notifications = {
    emailDigest: true,
    newCustomer: true,
    cashbackExpiring: true,
    weeklyReport: false,
  };

  readonly UserRole = UserRole;
  protected readonly getInitials = getInitials;

  constructor(
    private auth: AuthService,
    private feedback: FeedbackService,
  ) {}

  get isAdmin(): boolean {
    return this.auth.getRole() === UserRole.ADMIN;
  }

  get profileRoleLabel(): string {
    const r = this.auth.getRole();
    if (r === UserRole.ADMIN) return 'Administrador';
    if (r === UserRole.EMPLOYEE) return 'Funcionário';
    return '—';
  }

  setTab(tab: SettingsTab): void {
    this.activeTab = tab;
  }

  saveProfile(): void {
    this.feedback.success('Perfil salvo (dados estáticos).');
  }

  saveSecurity(): void {
    this.feedback.success('Senha atualizada (simulação).');
    this.security = {
      ...this.security,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  cancelSecurity(): void {
    this.security.currentPassword = '';
    this.security.newPassword = '';
    this.security.confirmPassword = '';
  }

  saveCashback(): void {
    this.feedback.success('Configurações de cashback salvas (simulação).');
  }

  saveNotifications(): void {
    this.feedback.success('Preferências de notificação salvas (simulação).');
  }
}
