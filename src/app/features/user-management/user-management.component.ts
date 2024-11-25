import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserRole } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  UserRole = UserRole; // pro použití v templatu
  roles = Object.values(UserRole);

  selectedUser: User | null = null;
  editForm: FormGroup;
  createUserForm: FormGroup;
  showCreateModal = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['']
    });

    this.createUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [UserRole.MEMBER, Validators.required],
      phone: [''],
      specialization: [''],
      hourlyRate: [null]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = 'Nepodařilo se načíst uživatele.';
        this.loading = false;
      }
    });
  }

  updateRole(userId: number, role: UserRole) {
    this.userService.setRole(userId, role).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating role:', error);
        this.error = 'Nepodařilo se změnit roli uživatele.';
      }
    });
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.editForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone
    });
  }

  closeModal() {
    this.selectedUser = null;
    this.editForm.reset();
  }

  saveUser() {
    if (this.editForm.valid && this.selectedUser) {
      const updatedUser = {
        ...this.selectedUser,
        ...this.editForm.value
      };

      this.userService.update(this.selectedUser.id, updatedUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.error = 'Nepodařilo se upravit uživatele.';
        }
      });
    }
  }

  // Nové metody pro vytvoření uživatele
  openCreateUserModal() {
    this.showCreateModal = true;
    this.createUserForm.reset({
      role: UserRole.MEMBER
    });
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.createUserForm.reset();
  }

  onSubmitCreate() {
    if (this.createUserForm.valid) {
      this.loading = true;
      const userData = this.createUserForm.value;

      if (userData.role === UserRole.COACH) {
        userData.specialization = userData.specialization.split(',').map((s: string) => s.trim());
      } else {
        delete userData.specialization;
        delete userData.hourlyRate;
      }

      this.userService.create(userData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeCreateModal();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.error = 'Nepodařilo se vytvořit uživatele.';
          this.loading = false;
        }
      });
    }
  }
}
