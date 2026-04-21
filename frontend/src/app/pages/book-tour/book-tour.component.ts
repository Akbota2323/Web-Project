import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { PlaceService, Place } from '../../services/place.service';

@Component({
  selector: 'app-book-tour',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-tour.html',
  styleUrl: './book-tour.css'
})
export class BookTourComponent implements OnInit {
  place!: Place;

  tourDate = '';
  numPeople = 1;
  notes = '';

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private placeService: PlaceService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.placeService.getPlaceById(id).subscribe({
      next: (data) => {
        this.place = data;
      },
      error: () => {
        this.errorMessage = 'Could not load place';
      }
    });
  }

  bookTour(): void {
    if (!this.tourDate) {
      this.errorMessage = 'Please select a date';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.bookingService.createBooking(
      this.place.id,
      this.tourDate,
      this.numPeople,
      this.notes
    ).subscribe({
      next: () => {
        this.successMessage = 'Booking successful 🎉';
        this.loading = false;
        this.notes = '';
        this.numPeople = 1;
      },
      error: () => {
        this.errorMessage = 'Booking failed';
        this.loading = false;
      }
    });
  }
}