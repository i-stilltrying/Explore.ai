import React, { useState } from 'react';
import { Preference } from '../types';
import { PREFERENCE_OPTIONS } from '../constants';
import { MapPin, Sparkles, Loader2, Calendar } from 'lucide-react';

interface TripFormProps {
  onPlanTrip: (city: string, preferences: Preference[], days: number) => void;
  isLoading: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ onPlanTrip, isLoading }) => {
  const [city, setCity] = useState('');
  const [days, setDays] = useState(1);
  const [selectedPreferences, setSelectedPreferences] = useState<Preference[]>([]);

  const togglePreference = (pref: Preference) => {
    setSelectedPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onPlanTrip(city, selectedPreferences, days);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* City Input */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="city" className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Destination
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg font-medium"
                placeholder="e.g., Kyoto, Paris"
                required
              />
            </div>
          </div>

          {/* Days Input */}
          <div className="space-y-2">
            <label htmlFor="days" className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Duration
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <select
                id="days"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg font-medium appearance-none"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <option key={num} value={num}>{num} Day{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
            Trip Vibe (Select multiple)
          </label>
          <div className="flex flex-wrap gap-3">
            {PREFERENCE_OPTIONS.map((option) => {
              const isSelected = selectedPreferences.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => togglePreference(option.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 font-medium
                    ${isSelected 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm transform scale-105' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}
                  `}
                >
                  <span className="text-xl">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading || !city.trim()}
          className={`
            w-full flex items-center justify-center gap-3 py-4 rounded-xl text-white font-bold text-lg shadow-lg
            transition-all duration-300 transform
            ${isLoading || !city.trim() 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-200 hover:-translate-y-0.5'}
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Planning your perfect trip...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-6 w-6" />
              <span>Generate Itinerary</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TripForm;