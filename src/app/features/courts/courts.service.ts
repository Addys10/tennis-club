import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class CourtService {
  constructor(private http: HttpClient) {}

  getCourts() {
    return this.http.get(`${environment.apiUrl}/api/courts`);
  }
}
