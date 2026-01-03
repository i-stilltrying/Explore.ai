import React, { useState } from 'react';
import { Preference, Pace, Budget, Companion } from '../types';
import { PREFERENCE_OPTIONS, PACE_OPTIONS, BUDGET_OPTIONS, COMPANION_OPTIONS } from '../constants';
import { MapPin, Sparkles, Loader2, Calendar, Gauge, Wallet, Users, CheckCircle2, Search } from 'lucide-react';

interface TripFormProps {
  onPlanTrip: (
    city: string, 
    preferences: Preference[], 
    days: number,
    pace: Pace,
    budget: Budget,
    companions: Companion
  ) => void;
  isLoading: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ onPlanTrip, isLoading }) => {
  const [city, setCity] = useState('');
  const [days, setDays] = useState(1);
  const [selectedPreferences, setSelectedPreferences] = useState<Preference[]>([]);
  const [pace, setPace] = useState<Pace>(Pace.BALANCED);
  const [budget, setBudget] = useState<Budget>(Budget.MID_RANGE);
  const [companions, setCompanions] = useState<Companion>(Companion.COUPLE);

  const togglePreference = (pref: Preference) => {
    setSelectedPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onPlanTrip(city, selectedPreferences, days, pace, budget, companions);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-12 border border-white/60">
      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* Main Search Input */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            Destination
          </label>
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-16 pr-8 py-6 bg-white rounded-3xl text-2xl font-semibold text-slate-900 border border-slate-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-200"
              placeholder="Where should we go?"
              required
            />
          </div>
        </div>

        {/* Triple Parameter Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Days</label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full px-4 py-4 bg-white border border-slate-100 rounded-2xl text-slate-700 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
            >
              {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} Day{num > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Pace</label>
            <select
              value={pace}
              onChange={(e) => setPace(e.target.value as Pace)}
              className="w-full px-4 py-4 bg-white border border-slate-100 rounded-2xl text-slate-700 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
            >
              {PACE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Budget</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as Budget)}
              className="w-full px-4 py-4 bg-white border border-slate-100 rounded-2xl text-slate-700 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
            >
              {BUDGET_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Travelers</label>
            <select
              value={companions}
              onChange={(e) => setCompanions(e.target.value as Companion)}
              className="w-full px-4 py-4 bg-white border border-slate-100 rounded-2xl text-slate-700 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
            >
              {COMPANION_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        {/* Preferences Grid */}
        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            Trip Identity
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PREFERENCE_OPTIONS.map((option) => {
              const isSelected = selectedPreferences.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => togglePreference(option.id)}
                  className={`
                    group relative flex flex-col p-5 rounded-3xl border-2 transition-all duration-300 text-left overflow-hidden
                    ${isSelected 
                      ? 'bg-slate-900 border-slate-900 shadow-xl scale-[1.02]' 
                      : 'bg-white border-slate-50 hover:border-indigo-100 hover:shadow-lg'}
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${isSelected ? 'brightness-125' : ''}`}>
                      {option.icon}
                    </span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                  </div>
                  <h3 className={`font-bold text-sm mb-1 ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {option.label}
                  </h3>
                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <button
          type="submit"
          disabled={isLoading || !city.trim()}
          className={`
            group relative w-full flex items-center justify-center gap-3 py-6 rounded-[2rem] text-white font-bold text-lg overflow-hidden
            transition-all duration-500 shadow-2xl
            ${isLoading || !city.trim() 
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/40'}
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          {isLoading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="tracking-tight">Synthesizing Travel Intelligence...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span className="tracking-tight">Generate Itinerary</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TripForm;