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
  category: Category;
  latitude: number;
  longitude: number;
  image_url: string;
  rating: number;
  price_range: string;
  working_hours: string;
  is_favorited: boolean;
}

export interface Booking {
  id: number;
  place: number;
  place_name: string;
  tour_date: string;
  num_people: number;
  status: string;
  notes: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  username?: string;
}