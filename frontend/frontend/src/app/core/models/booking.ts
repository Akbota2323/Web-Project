import { Place } from './place';

export interface Booking {
  id: number;
  place: Place;
  date: string;
  people_count: number;
  notes: string;
  status: string;
}