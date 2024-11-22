import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private http: HttpClient) {}

  getMyBookings() {
    return this.http.get(`${environment.apiUrl}/api/bookings/my`);
  }

  createBooking(bookingData: any) {
    return this.http.post(`${environment.apiUrl}/api/bookings`, bookingData);
  }
}
