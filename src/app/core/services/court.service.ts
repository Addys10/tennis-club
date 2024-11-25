// services/courts.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {Court, CourtAvailability} from '../models/court.model';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class CourtsService {
  private apiUrl = `${environment.apiUrl}/courts`;

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Court[]> {
    return this.http.get<Court[]>(this.apiUrl).pipe(
      tap(courts => console.log('Raw courts data:', courts)),
      map(courts => courts.map(court => ({
        ...court,
        isActive: court.isActive ?? court.isAvailable ?? true
      }))),
      tap(courts => console.log('Processed courts data:', courts))
    );
  }

  getCourt(id: number): Observable<Court> {
    return this.http.get<Court>(`${this.apiUrl}/${id}`);
  }

  updateCourt(id: number, court: Partial<Court>): Observable<Court> {
    return this.http.patch<Court>(`${this.apiUrl}/${id}`, court);
  }

  createCourt(court: Omit<Court, 'id'>): Observable<Court> {
    return this.http.post<Court>(this.apiUrl, court);
  }

  updateCourtAvailability(id: number, availability: boolean): Observable<Court> {
    return this.http.patch<Court>(`${this.apiUrl}/${id}/availability`, {isAvailable: availability});
  }

  getCourtAvailability(id: number, date: string): Observable<CourtAvailability> {
    return this.http.get<CourtAvailability>(`${this.apiUrl}/${id}/availability?date=${date}`);
  }
}
