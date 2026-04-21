import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PlaceService } from '../../services/place.service';
import { Place } from '../../services/place.service';
import { Category } from '../../services/place.service';

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
  username = 'Guest';

  constructor(
    private placeService: PlaceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadPlaces();
    this.isLoggedIn = !!localStorage.getItem('access');
    this.username = localStorage.getItem('username') || 'Guest';
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

  toggleFavorite(place: Place, event: Event) {
  event.stopPropagation();

  this.placeService.toggleFavorite(place.id).subscribe(() => {
    place.is_favorited = !place.is_favorited;
  });
}

  goToDetail(id: number): void {
    this.router.navigate(['/place', id]);
  }

  logout(): void {
    localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('username');
    this.isLoggedIn = false;
    this.username = 'Guest';
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