
import { Preference, Pace, Budget, Companion } from './types';

export const APP_NAME = "WanderPlan AI";
export const GEMINI_MODEL = "gemini-3-flash-preview";

export const PREFERENCE_OPTIONS = [
  { 
    id: Preference.FOOD, 
    label: "Food & Cafés", 
    icon: "🍽",
    description: "Local eats, cafés, and must-try spots"
  },
  { 
    id: Preference.RELAXED, 
    label: "Relaxed & Quiet", 
    icon: "🌿",
    description: "Less crowds, slower pace, peaceful places"
  },
  { 
    id: Preference.SCENIC, 
    label: "Scenic & Instagrammable", 
    icon: "📸",
    description: "Photo-worthy views and aesthetics"
  },
  { 
    id: Preference.CULTURE, 
    label: "Culture & History", 
    icon: "🏛",
    description: "Museums, landmarks, and local stories"
  },
  { 
    id: Preference.ADVENTURE, 
    label: "Adventure & Outdoors", 
    icon: "🎢",
    description: "Hiking, activities, and nature"
  },
  { 
    id: Preference.FAMILY, 
    label: "Family-Friendly", 
    icon: "👨‍👩‍👧",
    description: "Safe, accessible, kid-friendly places"
  },
];

export const PACE_OPTIONS = [
  { id: Pace.RELAXED, label: "Relaxed" },
  { id: Pace.BALANCED, label: "Balanced" },
  { id: Pace.PACKED, label: "Packed" },
];

export const BUDGET_OPTIONS = [
  { id: Budget.BUDGET, label: "Budget" },
  { id: Budget.MID_RANGE, label: "Mid-range" },
  { id: Budget.PREMIUM, label: "Premium" },
];

export const COMPANION_OPTIONS = [
  { id: Companion.SOLO, label: "Solo" },
  { id: Companion.COUPLE, label: "Couple" },
  { id: Companion.FRIENDS, label: "Friends" },
  { id: Companion.FAMILY, label: "Family w/ Kids" },
  { id: Companion.ELDERLY, label: "Elderly Parents" },
];
