import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Place } from '../../core/models/place';
import { PlaceService } from '../../services/place.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './place-detail.html',
  styleUrl: './place-detail.css'
})
export class PlaceDetailComponent implements OnInit {
  place?: Place;
  loading = false;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placeService: PlaceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;

    this.placeService.getPlaceById(id).subscribe((data: Place | undefined) => {
      this.place = data;
      this.loading = false;
    });
  }

  getCategoryEmoji(categoryName: string): string {
    const name = categoryName.toLowerCase();

    if (name.includes('food')) return '🍽️';
    if (name.includes('nature')) return '🏔️';
    if (name.includes('culture')) return '🏛️';
    if (name.includes('entertainment')) return '🎉';

    return '📍';
  }

  getStars(rating: number): string {
    return '⭐'.repeat(Math.round(rating));
  }

  bookTour(): void {
    if (this.place) {
      this.router.navigate(['/book-tour', this.place.id]);
    }
  }

  toggleFavorite(): void {
    if (this.place) {
      this.placeService.toggleFavorite(this.place).subscribe();
    }
  }
}