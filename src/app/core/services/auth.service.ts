import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { User, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('token', response.access_token);
    this.currentUserSubject.next(response.user);
  }

  private loadUserFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Implementovat získání user profilu z BE
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/register`, userData)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }
}
