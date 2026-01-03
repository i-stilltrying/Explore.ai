# WanderPlan AI 🌍✨
> **Intelligence-Driven Travel Planning for the Modern Explorer.**

WanderPlan AI is a premium, high-fidelity city itinerary generator powered by the **Gemini 3 Flash** engine. It synthesizes user preferences, travel pace, and budget into a perfectly optimized, multi-day journey complete with an interactive map and real-world verified photography.

![Project Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%20|%20Tailwind%20|%20Gemini-indigo?style=for-the-badge)

---

## 🚀 Key Features

### 🧠 Intelligent Itinerary Synthesis
Utilizing **Gemini 3 Flash**, the system generates structured JSON data that respects geographical proximity and logical travel flow. It doesn't just list places; it crafts a "theme" for each day.

### 🗺️ Dynamic Map Engine
Integrated with **Leaflet.js**, our interactive map features:
- **Custom Sequential Waypoints**: Numbered pins that track your journey.
- **Path Visualization**: Visual connectors showing the logical flow of travel.
- **Smart Fly-To Transitions**: Smooth cinematic camera movements when selecting locations.

### 📸 Real-World Grounding (Verified Photos)
Unlike standard AI apps that use generic stock images, WanderPlan AI uses **Google Search Grounding** to:
- Find **authentic, real-world photographs** of specific landmarks via Wikimedia Commons and official sources.
- Provide **Source Attribution** links directly in the UI.
- Display a "Verified Photo" badge for high-confidence visual representation.

### 📄 Professional Export
Download your complete plan as a beautifully formatted, portable `.txt` document containing:
- Full schedules and descriptions.
- "Vibe Check" reasoning for every stop.
- Direct Google Maps navigation links for every waypoint.

---

## 🛠️ Technical Architecture

### Core Tech Stack
- **Framework**: React 19 (ESM)
- **Styling**: Tailwind CSS (Glassmorphism & Modern UI)
- **AI Model**: `gemini-3-flash-preview`
- **Maps**: Leaflet.js with CartoDB Light Tiles
- **Icons**: Lucide React

### Engineering Highlights
- **Rate-Limited Task Queue**: A custom `RateLimitedQueue` manages grounding searches to ensure high-density itineraries don't overwhelm the Gemini API during image retrieval.
- **Schema-Driven Generation**: Strict OpenAPI schema definitions ensure the AI always returns valid, type-safe itinerary structures.
- **Responsive Fluidity**: The interface is designed as a "Mobile-First Desktop" experience, utilizing sophisticated backdrop blurs and CSS transitions for a "Native App" feel.

---

## 🚦 Getting Started

### Prerequisites
- A Google AI Studio API Key (with billing enabled for high-fidelity grounding features).

### Installation
1. Clone the repository.
2. Ensure you have the necessary environment variables:
   ```env
   API_KEY=your_gemini_api_key_here
   ```
3. Open `index.html` in a modern browser or serve via a local dev server.

---

## 🎨 UI/UX Philosophy
WanderPlan AI adheres to a **"Digital Luxury"** aesthetic:
- **Glassmorphism**: Using `backdrop-filter` for a layered, breathable interface.
- **Typography**: Utilizing *Inter* for maximum legibility and professional character.
- **Feedback Loops**: Micro-animations on hover and active states to provide tactile visual feedback.

---

## 📄 License
Generated with intelligence by **WanderPlan AI Systems (2025)**. This project is intended for demonstration of high-level Gemini API integration and professional frontend engineering.

---

*“The world is a book, and those who do not travel read only one page.”* – WanderPlan AI makes reading the next chapter effortless.