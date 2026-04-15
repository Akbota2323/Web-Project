import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Booking } from '../core/models/booking';
import { Place } from '../core/models/place';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookings: Booking[] = [];

  register(username: string, email: string, password: string, confirmPassword: string): Observable<any> {
  if (username.trim() && email.trim() && password.trim() && confirmPassword.trim() && password === confirmPassword) {
    return of({
      message: 'Registered successfully'
    });
  }

    return of(null);
}

  createBooking(place: Place, date: string, peopleCount: number, notes: string): Observable<Booking> {
    const booking: Booking = {
      id: Date.now(),
      place,
      date,
      people_count: peopleCount,
      notes,
      status: 'Confirmed'
    };

    this.bookings.push(booking);
    return of(booking);
  }

  getMyBookings(): Observable<Booking[]> {
    return of(this.bookings);
  }
}