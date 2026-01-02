import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ItineraryDay, Preference } from "../types";
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
            category: { type: Type.STRING, enum: ["Sightseeing", "Food", "Adventure", "Relax"] },
            rating: { type: Type.NUMBER },
            latitude: { type: Type.NUMBER },
            longitude: { type: Type.NUMBER },
            bestTime: { type: Type.STRING, enum: ["Morning", "Afternoon", "Evening"] },
            imageKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            durationMinutes: { type: Type.NUMBER },
          },
          required: ["placeName", "description", "category", "rating", "latitude", "longitude", "bestTime", "imageKeywords", "durationMinutes"],
        },
      },
    },
    required: ["day", "theme", "activities"],
  },
};

// Queue implementation to rate limit API calls
class RateLimitedQueue {
  private queue: (() => Promise<void>)[] = [];
  private processing = false;
  private delayMs = 600; // 0.6s delay ~ 100 requests per minute. Flash model has higher limits.

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

export const generateItinerary = async (city: string, preferences: Preference[], days: number): Promise<ItineraryDay[]> => {
  // Initialize the AI client inside the function to ensure we use the latest API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const preferencesString = preferences.join(", ");
  
  const prompt = `
    You are a travel planning AI.
    Your task is to generate a perfectly planned ${days}-day trip to ${city}.

    INPUT:
    - City name: ${city}
    - Duration: ${days} day(s)
    - Trip preferences: ${preferencesString}

    INSTRUCTIONS:
    1. Organize the trip into ${days} daily itineraries.
    2. For EACH day, select 3-5 distinct must-visit locations based on the selected preferences.
    3. Optimize the order logically for each day to minimize travel distance (cluster nearby locations).
    4. Provide a short "theme" for each day (e.g., "Downtown Exploration", "Nature & Parks").
    5. Avoid tourist traps if "Chill / less crowded" is selected.
    6. Prioritize safety, accessibility, and food options if "Family-friendly" is selected.
    7. Ensure variety across the days.

    Provide accurate latitude and longitude for mapping. 
    Ensure the output is valid JSON matching the provided schema.
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
    if (!text) {
        throw new Error("No response from AI");
    }
    
    // Parse JSON
    const data = JSON.parse(text) as ItineraryDay[];
    return data;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};

export const generateLocationImage = async (placeName: string, city: string, category: string): Promise<string | null> => {
  return imageQueue.add(async () => {
      // Always create a new instance to capture the latest API Key if it changed
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Use gemini-3-flash-preview (faster, cheaper) to FIND an image URL instead of generating one.
      const model = 'gemini-3-flash-preview'; 
      
      // Prompt updated to specifically request photos associated with the location name, explicitly mentioning Google Maps Photos context to guide the search tool.
      const prompt = `Find a direct, high-quality public image URL (jpg, png, webp) for the specific place "${placeName}" in "${city}". 
      Search for photos that appear in Google Maps listings, travel guides, or official websites for this exact location.
      Return ONLY the raw URL string. Do not use Markdown. If no good URL is found, return "null".`;

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
        if (text && text.toLowerCase() !== "null" && text.startsWith("http")) {
            return text;
        }
        return null;
      } catch (error: any) {
        console.warn(`Error fetching image URL for ${placeName}:`, error.message);
        return null;
      }
  });
};