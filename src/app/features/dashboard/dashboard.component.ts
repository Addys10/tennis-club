import {Component, OnInit} from '@angular/core';
import {User} from '@core/models/auth.model';
import {AuthService} from '@core/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(
      user => this.currentUser = user
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
