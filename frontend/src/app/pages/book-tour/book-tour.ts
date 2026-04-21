import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Place } from '../../services/place.service';
import { PlaceService } from '../../services/place.service';
import { BookingService } from '../../services/booking.service';

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
      },
      error: () => {
        this.errorMessage = 'Booking failed';
        this.loading = false;
      }
    });
  }
}