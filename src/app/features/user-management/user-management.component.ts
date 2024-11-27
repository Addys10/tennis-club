import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User, UserRole} from '@core/models/user.model';
import {UserService} from '@core/services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  roles = Object.values(UserRole);
  selectedUser: User | null = null;
  editForm!: FormGroup;
  createForm!: FormGroup;
  showCreateModal = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.initForms();
  }

  private initForms(): void {
    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
      phone: ['']
    });

    this.createForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [UserRole.MEMBER],
      phone: [''],
      specialization: [''],
      hourlyRate: [null]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.error = 'Nepodařilo se načíst uživatele';
        this.loading = false;
      }
    });
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.editForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone
    });
  }

  onSubmitEdit(): void {
    if (this.editForm.valid && this.selectedUser) {
      this.loading = true;
      const userData = {
        ...this.selectedUser,
        ...this.editForm.value
      };

      this.userService.update(this.selectedUser.id, userData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeEditModal();
        },
        error: () => {
          this.error = 'Nepodařilo se upravit uživatele';
          this.loading = false;
        }
      });
    }
  }

  onSubmitCreate(): void {
    if (this.createForm.valid) {
      this.loading = true;
      const userData = this.createForm.value;

      if (userData.role === UserRole.COACH) {
        userData.specialization = userData.specialization.split(',').map((s: string) => s.trim());
      }

      this.userService.create(userData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeCreateModal();
        },
        error: () => {
          this.error = 'Nepodařilo se vytvořit uživatele';
          this.loading = false;
        }
      });
    }
  }

  closeEditModal(): void {
    this.selectedUser = null;
    this.editForm.reset();
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.createForm.reset();
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      ADMIN: 'Administrátor',
      COACH: 'Trenér',
      PLAYER: 'Hráč',
      MEMBER: 'Člen'
    };
    return labels[role] || role;
  }
}
