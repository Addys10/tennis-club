import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {Court} from '@core/models/court.model';

@Injectable({
  providedIn: 'root'
})
export class CourtService {
  private apiUrl = `${environment.apiUrl}/courts`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Court[]> {
    return this.http.get<Court[]>(this.apiUrl);
  }

  getById(id: number): Observable<Court> {
    return this.http.get<Court>(`${this.apiUrl}/${id}`);
  }

  create(court: Partial<Court>): Observable<Court> {
    return this.http.post<Court>(this.apiUrl, court);
  }

  update(id: number, court: Partial<Court>): Observable<Court> {
    return this.http.patch<Court>(`${this.apiUrl}/${id}`, court);
  }
}
