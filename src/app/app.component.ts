import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { User } from './core/models/auth.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;
  isNavbarCollapsed = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(
      user => this.currentUser = user
    );
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
