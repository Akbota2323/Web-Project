import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  place_count: number;
}

export interface Place {
  id: number;
  name: string;
  description: string;
  address: string;
  image_url: string;
  rating: number;
  price_range: string;
  working_hours: string;
  is_favorited: boolean;
  category: Category | null;
}

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private API = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API}/categories/`);
  }

  getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(`${this.API}/places/`);
  }

  getPlaceById(id: number): Observable<Place> {
    return this.http.get<Place>(`${this.API}/places/${id}/`);
  }

  searchPlaces(query: string, category: string = '', minRating: number = 0): Observable<Place[]> {
    let url = `${this.API}/places/search/?query=${query}&category=${category}&min_rating=${minRating}`;
    return this.http.get<Place[]>(url);
  }

  toggleFavorite(placeId: number) {
    return this.http.post(`${this.API}/favorites/`, { place_id: placeId });
  }
}