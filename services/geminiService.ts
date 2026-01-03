import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ItineraryDay, Preference, Pace, Budget, Companion } from "../types";
import { GEMINI_MODEL } from "../constants";

const itinerarySchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      day: { type: Type.NUMBER },
      theme: { type: Type.STRING, description: "Short theme for the day, e.g., 'Historical Center' or 'Food & Culture'" },
      activities: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            placeName: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING, enum: ["Sightseeing", "Food", "Adventure", "Relax", "Nature", "Culture"] },
            rating: { type: Type.NUMBER },
            latitude: { type: Type.NUMBER },
            longitude: { type: Type.NUMBER },
            bestTime: { type: Type.STRING, enum: ["Morning", "Afternoon", "Evening"] },
            imageKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            durationMinutes: { type: Type.NUMBER },
            crowdLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            distanceFromPrev: { type: Type.STRING, description: "Distance from previous location (e.g. '1.2 km' or '0 km' for start)" },
            travelTimeMinutes: { type: Type.NUMBER, description: "Estimated travel time from previous location in minutes. 0 for the first location." },
            nearbyFood: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Max 2 food suggestions nearby" },
            whyItFits: { type: Type.STRING, description: "1 line on why this fits the user's selected vibe" },
            pin_number: { type: Type.NUMBER, description: "Sequential number of the stop (1, 2, 3...)" },
            hover_card_priority: { type: Type.STRING, enum: ["high", "normal"] }
          },
          required: ["placeName", "description", "category", "rating", "latitude", "longitude", "bestTime", "imageKeywords", "durationMinutes", "crowdLevel", "whyItFits", "pin_number", "travelTimeMinutes"],
        },
      },
    },
    required: ["day", "theme", "activities"],
  },
};

class RateLimitedQueue {
  private queue: (() => Promise<void>)[] = [];
  private processing = false;
  private delayMs = 1200; // Increased delay to ensure search grounding stability

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing) return;
    if (this.queue.length === 0) return;

    this.processing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
        if (this.queue.length > 0) {
            await new Promise(resolve => setTimeout(resolve, this.delayMs));
        }
      }
    }
    this.processing = false;
  }
}

const imageQueue = new RateLimitedQueue();

const formatTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  const displayM = m < 10 ? `0${m}` : m;
  return `${displayH}:${displayM} ${ampm}`;
};

export const generateItinerary = async (
  city: string, 
  preferences: Preference[], 
  days: number,
  pace: Pace,
  budget: Budget,
  companions: Companion
): Promise<ItineraryDay[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const preferencesString = preferences.length > 0 ? preferences.join(", ") : "Balanced mix of sightseeing and culture";
  const duration = `${days} Day${days > 1 ? 's' : ''}`;

  const prompt = `
    You are an advanced AI travel planner. Your task is to generate a perfectly planned city trip.
    INPUT: ${city} for ${duration}. Vibe: ${preferencesString}. Travelers: ${companions}.
    Rules: Optimized route, sequential pin_numbers, and realistic travel times.
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.4, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const data = JSON.parse(text) as ItineraryDay[];
    data.forEach(day => {
      let currentMinutes = 9 * 60;
      day.activities.forEach((activity, index) => {
        if (index > 0) currentMinutes += (activity.travelTimeMinutes || 15);
        activity.startTime = formatTime(currentMinutes);
        currentMinutes += activity.durationMinutes;
        activity.endTime = formatTime(currentMinutes);
      });
    });

    return data;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};

export interface RealImageResult {
  url: string;
  sourceUrl: string;
}

export const generateLocationImage = async (placeName: string, city: string): Promise<RealImageResult | null> => {
  return imageQueue.add(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview'; 
      
      const prompt = `Find a REAL direct image URL for "${placeName}" in "${city}". 
      STRATEGY: Search Wikimedia Commons or Official Tourism sites. 
      Output ONLY the raw image file URL.`;

      try {
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }], 
            responseMimeType: "text/plain"
          },
        });

        const text = response.text?.trim();
        const urlMatch = text?.match(/https?:\/\/[^\s)"'>\]]+/);
        
        // Extract grounding source URL for attribution
        const sourceUrl = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.[0]?.web?.uri || "https://commons.wikimedia.org";

        if (urlMatch) {
            return {
                url: urlMatch[0].replace(/[.,;!]$/, ''),
                sourceUrl: sourceUrl
            };
        }
        return null;
      } catch (error: any) {
        console.warn(`Error fetching image for ${placeName}:`, error.message);
        return null;
      }
  });
};