import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateUserAccessRequest, UserRole, UserStatus } from '../../../../../../shared/models';
import { UserService, FeedbackService, AuthService } from '../../../../../../shared/services';
import { User } from '../../../../../../shared/models';
import { OnInit } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';

type EmployeesTab = 'activeAndInactive' | 'dismissed';

@Component({
  selector: 'app-users-role-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-role-manager.html',
  styleUrl: './users-role-manager.css',
})
export class UsersRoleManager implements OnInit {
  currentUserId: string | null = null;
  users: User[] = [];
  activeTab: EmployeesTab = 'activeAndInactive';
  private originalById = new Map<
    string, {
      role: UserRole;
      status: UserStatus
    }
  >();
  private pendingById = new Map<
    string, {
      roleChanged: boolean;
      statusChanged: boolean;
      role: UserRole;
      status: UserStatus
    }
  >();
  isSaving = false;

  readonly roleOptions: { value: UserRole; label: string }[] = [
    { value: UserRole.ADMIN, label: 'Administrador' },
    { value: UserRole.EMPLOYEE, label: 'Funcionário' },
    { value: UserRole.NONE, label: 'Sem função' },
  ];

  readonly statusOptions: { value: UserStatus; label: string }[] = [
    { value: UserStatus.ACTIVE, label: 'Ativo' },
    { value: UserStatus.INACTIVE, label: 'Inativo' },
    { value: UserStatus.DISMISSED, label: 'Demitido' },
  ];

  constructor(
    private userService: UserService,
    private feedback: FeedbackService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUserId = this.auth.getUserId();
    this.loadUsers();
  }

  get usersByTab(): User[] {
    return this.users.filter((us) => {
      const effectiveStatus = this.getEffectiveStatus(us);

      if (this.activeTab === 'dismissed') {
        return effectiveStatus === UserStatus.DISMISSED;
      }

      return (
        effectiveStatus === UserStatus.ACTIVE ||
        effectiveStatus === UserStatus.INACTIVE
      );
    })
  }

  isCurrentUser(userId: string): boolean {
    return this.currentUserId === userId;
  }

  getEffectiveRole(user: User): UserRole {
    const original = this.originalById.get(user.id);
    const pending = this.pendingById.get(user.id);

    // Enquanto houver alteração pendente, mantém o usuário na aba do status original
    // (evita "pular" de aba antes de salvar). Sem pendência, usa a função atual.
    if (original && pending?.roleChanged) {
      return original.role;
    }

    return user.role;
  }

  getRoleBadgeClass(user: User): string {
    return this.getEffectiveRole(user) === UserRole.ADMIN ? 'role-badge-admin' : 'role-badge-employee';
  }

  getRoleIconClass(user: User): string {
    return this.getEffectiveRole(user) === UserRole.ADMIN ? 'bi-shield-lock-fill' : 'bi-person-badge-fill';
  }

  getEffectiveStatus(user: User): UserStatus {
    const original = this.originalById.get(user.id);
    const pending = this.pendingById.get(user.id);

    // Enquanto houver alteração pendente, mantém o usuário na aba do status original
    // (evita "pular" de aba antes de salvar). Sem pendência, usa o status atual.
    if (original && pending?.statusChanged) {
      return original.status;
    }

    return user.status;
  }

  getStatusBadgeClass(user: User): string {
    const status = this.getEffectiveStatus(user);

    if (status === UserStatus.ACTIVE) return 'status-badge-active';
    if (status === UserStatus.INACTIVE) return 'status-badge-inactive';
    return 'status-badge-dismissed';
  }

  getStatusLabel(user: User): string {
    const status = this.getEffectiveStatus(user);
    const statusOption = this.statusOptions.find((opt) => opt.value === status);
    return statusOption?.label ?? '—';
  }

  setTab(tab: EmployeesTab): void {
    this.activeTab = tab;
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        const currentUser = this.currentUserId;
        this.users = [...users].sort((a, b) => {
          // Regra do sort:
          // -1 => "a" deve ficar antes de "b"
          //  1 => "a" deve ficar depois de "b"
          //  0 => não altera a ordem entre "a" e "b"
          if (a.id === currentUser) return -1;
          if (b.id === currentUser) return 1;
          return 0;
        });

        this.originalById.clear();
        this.pendingById.clear();
        for (const user of this.users) {
          this.originalById.set(
            user.id, { role: user.role, status: user.status }
          );
        }
      },
      error: (error) => {
        this.feedback.error('Erro ao tentar listar usuários');
        console.error('Erro ao tentar listar usuários:', error);
      }
    })
  }

  onUserChange(user: User): void {
    const original = this.originalById.get(user.id);
    if (!original) return;

    const roleChanged = user.role !== original.role;
    const statusChanged = user.status !== original.status;

    if (!roleChanged && !statusChanged) {
      this.pendingById.delete(user.id);
      return;
    };

    this.pendingById.set(
      user.id, {
      roleChanged,
      statusChanged,
      role: user.role,
      status: user.status,
    }
    )
  }

  onSubmit(): void {
    if (this.pendingById.size === 0) {
      this.feedback.info('Nenhuma alteração para salvar.');
      return;
    }

    this.isSaving = true;

    const requests = Array.from(this.pendingById.entries()).map(
      ([userId, change]) => {
        const payload: UpdateUserAccessRequest = {
          role: change.role,
          status: change.status,
        };

        return this.userService.updateUserAccess(userId, payload);
      }
    );

    // forkJoin serve para executar várias requisições observables 
    forkJoin(requests)
      .pipe(finalize(() => { this.isSaving = false; }))
      .subscribe({
        next: () => {
          this.feedback.success('Alterações salvas com sucesso.');
          this.loadUsers();
        },
        error: (err) => {
          this.feedback.apiError(err, 'Erro ao tentar salvar alterações.');
          console.error('Erro ao tentar salvar alterações:', err);
        }
      });
  }
}
