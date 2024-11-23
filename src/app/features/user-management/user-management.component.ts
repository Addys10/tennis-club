import {Component} from '@angular/core';
import {User} from '@core/models/user.model';
import {UserService} from '@core/services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  constructor(private userService: UserService) {
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

  updateRole(userId: number, role: string) {
    this.userService.setRole(userId, role).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating role:', error);
      }
    });
  }

  updateUser(user: any) {
    this.userService.update(user.id, user).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }
}
