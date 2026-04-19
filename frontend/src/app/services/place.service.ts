import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Place } from '../core/models/place';
import { Category } from '../core/models/category';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private categories: Category[] = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Nature' },
    { id: 3, name: 'Culture' },
    { id: 4, name: 'Entertainment' }
  ];

  private places: Place[] = [
    {
      id: 1,
      name: 'Kok Tobe',
      description: 'Beautiful hill with a panoramic city view and attractions.',
      address: 'Kok Tobe, Almaty',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900',
      rating: 4.8,
      price_range: '$$',
      working_hours: '10:00 - 23:00',
      is_favorited: false,
      category: this.categories[1]
    },
    {
      id: 2,
      name: 'Medeu',
      description: 'Famous mountain sports complex and one of the symbols of Almaty.',
      address: 'Medeu, Almaty',
      image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900',
      rating: 4.9,
      price_range: '$$',
      working_hours: '09:00 - 20:00',
      is_favorited: false,
      category: this.categories[1]
    },
    {
      id: 3,
      name: 'Green Bazaar',
      description: 'Traditional market with local food, fruits and souvenirs.',
      address: 'Zhibek Zholy, Almaty',
      image_url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900',
      rating: 4.5,
      price_range: '$',
      working_hours: '08:00 - 19:00',
      is_favorited: false,
      category: this.categories[0]
    },
    {
      id: 4,
      name: 'Central State Museum',
      description: 'A cultural place to learn more about Kazakhstan history.',
      address: 'Samal, Almaty',
      image_url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=900',
      rating: 4.6,
      price_range: '$',
      working_hours: '10:00 - 18:00',
      is_favorited: false,
      category: this.categories[2]
    }
  ];

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  getPlaces(): Observable<Place[]> {
    return of(this.places);
  }

  getPlaceById(id: number): Observable<Place | undefined> {
  return of(this.places.find(place => place.id === id));
}

  toggleFavorite(place: Place): Observable<Place> {
    place.is_favorited = !place.is_favorited;
    return of(place);
  }
}