import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getAllCoaches(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/coaches`);
  }

  create(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(id: number, userData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, userData);
  }

  setRole(id: number, role: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/role`, { role });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
