import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Place } from '../../services/place.service';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../services/booking.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = false;
  errorMessage = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.errorMessage = '';

    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load bookings';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    if (status === 'confirmed') return 'status-confirmed';
    if (status === 'cancelled') return 'status-cancelled';
    return 'status-pending';
  }

  cancelBooking(id: number): void {
    this.bookingService.cancelBooking(id).subscribe({
      next: () => {
        this.bookings = this.bookings.map((booking) =>
          booking.id === id ? { ...booking, status: 'cancelled' } : booking
        );
      },
      error: () => {
        this.errorMessage = 'Could not cancel booking';
      }
    });
  }
}