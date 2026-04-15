import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlaceService } from '../../services/place.service';
import { AuthService } from '../../services/auth.service';
import { Place } from '../../core/models/place.model';

@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './place-detail.html',
  styleUrl: './place-detail.css'
})
export class PlaceDetailComponent implements OnInit {
  place: Place | null = null;
  loading = true;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placeService: PlaceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(v => this.isLoggedIn = v);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.placeService.getPlace(id).subscribe({
      next: data => { this.place = data; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/home']); }
    });
  }

  toggleFavorite() {
    if (!this.isLoggedIn) { this.router.navigate(['/login']); return; }
    if (!this.place) return;
    this.placeService.toggleFavorite(this.place.id).subscribe({
      next: (res: any) => { if (this.place) this.place.is_favorited = res.favorited; }
    });
  }

  bookTour() {
    if (!this.isLoggedIn) { this.router.navigate(['/login']); return; }
    this.router.navigate(['/book', this.place?.id]);
  }

  getStars(rating: number): string {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  }

  getCategoryEmoji(name: string): string {
    const map: any = { food: '🍽️', nature: '🏔️', culture: '🏛️', entertainment: '🎭' };
    return map[name] || '📍';
  }
}