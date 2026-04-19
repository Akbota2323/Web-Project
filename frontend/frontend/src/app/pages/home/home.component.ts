import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Category } from '../../core/models/category';
import { Place } from '../../core/models/place';
import { PlaceService } from '../../services/place.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  places: Place[] = [];
  allPlaces: Place[] = [];

  searchQuery = '';
  selectedCategory = '';
  minRating = 0;

  loading = false;
  errorMessage = '';

  isLoggedIn = false;
  username = '';

  constructor(
    private placeService: PlaceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.username = typeof window !== 'undefined' ? localStorage.getItem('username') || '' : '';

    this.loadCategories();
    this.loadPlaces();
  }

  loadCategories(): void {
    this.placeService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadPlaces(): void {
    this.loading = true;
    this.placeService.getPlaces().subscribe({
      next: (data) => {
        this.allPlaces = data;
        this.places = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load places';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.places = this.allPlaces.filter(place => {
      const matchesSearch =
        place.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory =
        this.selectedCategory === '' || place.category?.name === this.selectedCategory;

      const matchesRating = place.rating >= this.minRating;

      return matchesSearch && matchesCategory && matchesRating;
    });
  }

  filterByCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.onSearch();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.minRating = 0;
    this.places = this.allPlaces;
  }

  toggleFavorite(place: Place, event: Event): void {
    event.stopPropagation();
    this.placeService.toggleFavorite(place).subscribe();
  }

  goToDetail(id: number): void {
    this.router.navigate(['/place', id]);
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.username = '';
    this.router.navigate(['/login']);
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
}