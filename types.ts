
export enum Preference {
  FOOD = "Food & Cafés",
  RELAXED = "Relaxed & Quiet",
  SCENIC = "Scenic & Instagrammable",
  CULTURE = "Culture & History",
  ADVENTURE = "Adventure & Outdoors",
  FAMILY = "Family-Friendly"
}

export enum LocationCategory {
  SIGHTSEEING = "Sightseeing",
  FOOD = "Food",
  ADVENTURE = "Adventure",
  RELAX = "Relax",
  NATURE = "Nature",
  CULTURE = "Culture"
}

export enum BestTime {
  MORNING = "Morning",
  AFTERNOON = "Afternoon",
  EVENING = "Evening"
}

export enum Pace {
  RELAXED = "Relaxed",
  BALANCED = "Balanced",
  PACKED = "Packed"
}

export enum Budget {
  BUDGET = "Budget",
  MID_RANGE = "Mid-range",
  PREMIUM = "Premium"
}

export enum Companion {
  SOLO = "Solo",
  COUPLE = "Couple",
  FRIENDS = "Friends",
  FAMILY = "Family with Kids",
  ELDERLY = "Elderly Parents"
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
  crowdLevel: "Low" | "Medium" | "High";
  distanceFromPrev?: string; 
  travelTimeMinutes?: number;
  startTime?: string;
  endTime?: string;
  nearbyFood?: string[];
  whyItFits: string;
  // Map specific fields
  pin_number: number;
  hover_card_priority?: "high" | "normal";
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
