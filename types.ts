
export enum Preference {
  FAMILY = "Family-friendly",
  FRIENDS = "Friends trip",
  CHILL = "Chill / less crowded",
  FOOD = "Best food & cafes",
  ADVENTURE = "Adventurous / outdoor"
}

export enum LocationCategory {
  SIGHTSEEING = "Sightseeing",
  FOOD = "Food",
  ADVENTURE = "Adventure",
  RELAX = "Relax"
}

export enum BestTime {
  MORNING = "Morning",
  AFTERNOON = "Afternoon",
  EVENING = "Evening"
}

export interface ItineraryItem {
  placeName: string;
  description: string;
  category: LocationCategory;
  rating: number;
  latitude: number;
  longitude: number;
  bestTime: BestTime;
  imageKeywords: string[];
  durationMinutes: number;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  activities: ItineraryItem[];
}

export interface TripPlan {
  city: string;
  days: ItineraryDay[];
}
