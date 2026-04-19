import { Category } from './category';

export interface Place {
  id: number;
  name: string;
  description: string;
  address: string;
  image_url: string;
  rating: number;
  price_range: string;
  working_hours: string;
  phone?: string;
  is_favorited?: boolean;
  category?: Category;
}