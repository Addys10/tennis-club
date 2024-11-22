import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Training } from '../models/training.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private apiUrl = `${environment.apiUrl}/trainings`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiUrl);
  }

  getById(id: number): Observable<Training> {
    return this.http.get<Training>(`${this.apiUrl}/${id}`);
  }

  getByCoach(coachId: number): Observable<Training[]> {
    return this.http.get<Training[]>(`${this.apiUrl}/coach/${coachId}`);
  }

  getByPlayer(playerId: number): Observable<Training[]> {
    return this.http.get<Training[]>(`${this.apiUrl}/player/${playerId}`);
  }

  create(training: Partial<Training>): Observable<Training> {
    return this.http.post<Training>(this.apiUrl, training);
  }
}
