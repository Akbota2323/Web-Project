import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../core/models/category';
import { Place } from '../core/models/place';

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
      description: 'A famous hill in Almaty with a beautiful city view and entertainment area.',
      address: 'Kok Tobe, Almaty',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      rating: 4.8,
      price_range: '$$',
      working_hours: '10:00 - 23:00',
      phone: '+7 700 111 1111',
      is_favorited: false,
      category: this.categories[1]
    },
    {
      id: 2,
      name: 'Medeu',
      description: 'A famous mountain sports complex and one of the top places to visit in Almaty.',
      address: 'Medeu, Almaty',
      image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      rating: 4.9,
      price_range: '$$',
      working_hours: '09:00 - 20:00',
      phone: '+7 700 222 2222',
      is_favorited: false,
      category: this.categories[1]
    },
    {
      id: 3,
      name: 'Green Bazaar',
      description: 'A traditional market where tourists can try local food and buy souvenirs.',
      address: 'Zhibek Zholy, Almaty',
      image_url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800',
      rating: 4.5,
      price_range: '$',
      working_hours: '08:00 - 19:00',
      phone: '+7 700 333 3333',
      is_favorited: false,
      category: this.categories[0]
    },
    {
      id: 4,
      name: 'Central State Museum',
      description: 'A good place to learn about Kazakhstan history and culture.',
      address: 'Samal, Almaty',
      image_url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800',
      rating: 4.6,
      price_range: '$',
      working_hours: '10:00 - 18:00',
      phone: '+7 700 444 4444',
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