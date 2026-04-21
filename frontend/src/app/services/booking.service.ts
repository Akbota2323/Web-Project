import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  id: number;
  place: number;
  place_name: string;
  place_image: string;
  username: string;
  tour_date: string;
  num_people: number;
  status: string;
  notes: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private API = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.API}/bookings/`);
  }

  createBooking(place: number, tour_date: string, num_people: number, notes: string) {
    return this.http.post(`${this.API}/bookings/`, {
      place,
      tour_date,
      num_people,
      notes
    });
  }

  cancelBooking(id: number) {
    return this.http.delete(`${this.API}/bookings/${id}/`);
  }
}