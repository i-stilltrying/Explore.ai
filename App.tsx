import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import TripForm from './components/TripForm';
import ItineraryTimeline from './components/ItineraryTimeline';
import { generateItinerary } from './services/geminiService';
import { Preference, ItineraryDay } from './types';
import { AlertCircle, Key } from 'lucide-react';

const App: React.FC = () => {
  const [days, setDays] = useState<ItineraryDay[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<string>('');
  const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);

  // Check if API Key is selected on mount
  useEffect(() => {
    const checkKey = async () => {
      // Cast window to any to avoid TypeScript conflicts with global declarations
      const win = window as any;
      if (win.aistudio && win.aistudio.hasSelectedApiKey) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      } else {
        // Fallback for environments where window.aistudio might not be present (dev)
        setApiKeySelected(true); 
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    const win = window as any;
    if (win.aistudio && win.aistudio.openSelectKey) {
      await win.aistudio.openSelectKey();
      // Assume success after dialog closes or strictly rely on re-checking
      const hasKey = await win.aistudio.hasSelectedApiKey();
      setApiKeySelected(hasKey);
    }
  };

  const handlePlanTrip = useCallback(async (city: string, preferences: Preference[], numDays: number) => {
    // Double check key before starting heavy operations
    const win = window as any;
    if (win.aistudio && win.aistudio.hasSelectedApiKey) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            setApiKeySelected(false);
            return;
        }
    }

    setLoading(true);
    setError(null);
    setDays(null);
    setCurrentCity(city);

    try {
      const data = await generateItinerary(city, preferences, numDays);
      setDays(data);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Requested entity was not found")) {
         setError("API Key Error: Please select a valid paid API key project.");
         setApiKeySelected(false);
      } else {
         setError("Failed to generate itinerary. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = () => {
    setDays(null);
    setCurrentCity('');
    setError(null);
  };

  if (!apiKeySelected) {
      return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in fade-in duration-500">
                <div className="bg-indigo-100 p-4 rounded-full">
                    <Key className="w-12 h-12 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">API Key Required</h1>
                <p className="text-slate-600 max-w-md mx-auto">
                    To use the advanced image generation features (Gemini 3 Pro), you need to select a billing-enabled Google Cloud API key.
                </p>
                <button 
                    onClick={handleSelectKey}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                    Select API Key
                </button>
                <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:underline"
                >
                    Learn more about billing
                </a>
            </div>
        </Layout>
      );
  }

  return (
    <Layout>
      {!days && (
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Design Your Perfect Trip
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Tell us where you're going and what you love. Our AI will craft the perfect itinerary, optimized for travel time and your vibe.
          </p>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in zoom-in-95">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {!days ? (
        <TripForm onPlanTrip={handlePlanTrip} isLoading={loading} />
      ) : (
        <ItineraryTimeline city={currentCity} days={days} onReset={handleReset} />
      )}
    </Layout>
  );
};

export default App;