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

    this.placeService.getPlaceById(id).subscribe(place => {
      if (place) {
        this.place = place;
      }
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
      this.errorMessage = 'Please choose a date';
      return;
    }

    this.loading = true;

    this.bookingService.createBooking(
      this.place,
      this.tourDate,
      this.numPeople,
      this.notes
    ).subscribe(() => {
      this.loading = false;
      this.successMessage = 'Booking successful!';
      setTimeout(() => {
        this.router.navigate(['/my-bookings']);
      }, 1000);
    });
  }
}