import { Preference } from './types';

export const APP_NAME = "WanderPlan AI";
export const GEMINI_MODEL = "gemini-3-flash-preview";

export const PREFERENCE_OPTIONS = [
  { id: Preference.FAMILY, label: "Family Friendly", icon: "👨‍👩‍👧‍👦" },
  { id: Preference.FRIENDS, label: "Friends Trip", icon: "👯‍♀️" },
  { id: Preference.CHILL, label: "Chill / Quiet", icon: "🍃" },
  { id: Preference.FOOD, label: "Foodie Heaven", icon: "🍜" },
  { id: Preference.ADVENTURE, label: "Adventure", icon: "🏃‍♂️" },
];