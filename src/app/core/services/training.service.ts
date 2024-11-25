import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Training, TrainingStatus} from '../models/training.model';
import {environment} from '@env/environment';
import {ITrainingFormData} from '@features/trainings/training-form/training.form';

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

  create(data: ITrainingFormData): Observable<any> {
    // Formátování dat před odesláním
    const formattedData = {
      ...data,
      // Opravené typování - dateString je již string
      startTime: this.formatDateForBackend(String(data.startTime)),
      endTime: this.formatDateForBackend(String(data.endTime)),
      playerIds: Array.isArray(data.playerIds) ? data.playerIds : [],
      price: Number(data.price),
      maxPlayers: Number(data.maxPlayers),
      status: "planned"
    };

    console.log('Formatted training data:', formattedData);

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.apiUrl, formattedData, {headers});
  }

  private formatDateForBackend(dateString: string): string {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 19).replace('T', ' ');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
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
