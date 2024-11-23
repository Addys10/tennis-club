import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Training, TrainingStatus} from '../models/training.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private apiUrl = `${environment.apiUrl}/trainings`;

  constructor(private http: HttpClient) {
  }

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

  cancel(id: number): Observable<Training> {
    return this.http.patch<Training>(`${this.apiUrl}/${id}/cancel`, {
      status: TrainingStatus.CANCELLED
    });
  }

  update(id: number, training: Partial<Training>): Observable<Training> {
    return this.http.patch<Training>(`${this.apiUrl}/${id}`, training);
  }

  // Metoda pro změnu statusu
  updateStatus(id: number, status: TrainingStatus): Observable<Training> {
    return this.http.patch<Training>(`${this.apiUrl}/${id}/status`, {status});
  }

  // Případně metoda pro získání aktuálních tréninků
  getCurrentTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(`${this.apiUrl}/current`);
  }

  // Metoda pro získání budoucích tréninků
  getFutureTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(`${this.apiUrl}/future`);
  }

  // Metoda pro získání historie tréninků
  getTrainingHistory(): Observable<Training[]> {
    return this.http.get<Training[]>(`${this.apiUrl}/history`);
  }
}
