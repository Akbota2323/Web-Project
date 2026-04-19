import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Place } from '../../core/models/place';
import { PlaceService } from '../../services/place.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-book-tour',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './book-tour.html',
  styleUrl: './book-tour.css'
})
export class BookTourComponent implements OnInit {
  place?: Place;

  tourDate = '';
  today = new Date().toISOString().split('T')[0];
  numPeople = 1;
  notes = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placeService: PlaceService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.placeService.getPlaceById(id).subscribe((p: Place | undefined) => {
      this.place = p;
    });
  }

  submitBooking(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.place) {
      this.errorMessage = 'Place not found';
      return;
    }

    if (!this.tourDate) {
      this.errorMessage = 'Please select a tour date';
      return;
    }

    this.loading = true;

    this.bookingService.createBooking(
      this.place,
      this.tourDate,
      this.numPeople,
      this.notes
    ).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Booking successful!';

        setTimeout(() => {
          this.router.navigate(['/my-bookings']);
        }, 800);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Booking failed';
      }
    });
  }
}