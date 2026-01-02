import React, { useState, useEffect } from 'react';
import { ItineraryItem, ItineraryDay, LocationCategory } from '../types';
import { generateLocationImage } from '../services/geminiService';
import { MapPin, Clock, Star, ExternalLink, Navigation, Coffee, Mountain, Camera, Footprints, Image as ImageIcon, Loader2, Calendar } from 'lucide-react';

interface ItineraryTimelineProps {
  city: string;
  days: ItineraryDay[];
  onReset: () => void;
}

const CategoryIcon = ({ category }: { category: LocationCategory }) => {
  switch (category) {
    case LocationCategory.FOOD: return <Coffee className="w-4 h-4" />;
    case LocationCategory.ADVENTURE: return <Mountain className="w-4 h-4" />;
    case LocationCategory.SIGHTSEEING: return <Camera className="w-4 h-4" />;
    case LocationCategory.RELAX: return <Footprints className="w-4 h-4" />;
    default: return <MapPin className="w-4 h-4" />;
  }
};

const ItineraryCard = ({ item, index, city }: { item: ItineraryItem, index: number, city: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchImage = async () => {
      setLoading(true);
      setImageError(false);
      // Use the place name and category to fetch an image URL
      const img = await generateLocationImage(item.placeName, city, item.category);
      if (mounted) {
        setImageUrl(img);
        setLoading(false);
      }
    };
    fetchImage();
    return () => { mounted = false; };
  }, [item.placeName, item.category, city]);

  const handleImageError = () => {
    setImageError(true);
    setImageUrl(null);
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-6 group animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards" style={{ animationDelay: `${index * 100}ms` }}>
      {/* Time / Number Indicator */}
      <div className="flex-shrink-0 md:w-16 flex flex-col items-center md:items-end pt-2 z-10">
        <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md ring-4 ring-white">
          {index + 1}
        </div>
        <div className="mt-2 text-xs font-bold uppercase tracking-wider text-indigo-500 hidden md:block">
          {item.bestTime}
        </div>
      </div>

      {/* Card */}
      <div className="flex-grow bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col md:flex-row">
          
          {/* Image Section */}
          <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden bg-slate-100 flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-2 text-slate-400 p-4 text-center">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs font-medium">Finding photo...</span>
              </div>
            ) : imageUrl && !imageError ? (
              <>
                <img 
                  src={imageUrl} 
                  alt={item.placeName} 
                  onError={handleImageError}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out animate-in fade-in duration-500"
                />
                 <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white/90 font-medium">
                  Web Image
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <ImageIcon className="w-8 h-8 opacity-50" />
                <span className="text-xs">No photo found</span>
              </div>
            )}
            
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1 z-10">
              <CategoryIcon category={item.category} />
              {item.category}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:w-2/3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-800">{item.placeName}</h3>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-yellow-700">{item.rating}</span>
                </div>
              </div>
              
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {item.imageKeywords.slice(0, 3).map((keyword, i) => (
                  <span key={i} className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{item.durationMinutes} min</span>
                </div>
              </div>
              
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.placeName + " " + city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <span>Maps</span>
                <Navigation className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ city, days, onReset }) => {
  const [activeDay, setActiveDay] = useState(0);

  // If we only have 1 day, it's simpler
  const isMultiDay = days.length > 1;

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{city} Itinerary</h2>
          <p className="text-slate-500 mt-1">
             {days.length} Day{days.length > 1 ? 's' : ''} • Curated specifically for your style
          </p>
        </div>
        <button 
          onClick={onReset}
          className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors underline decoration-slate-300 hover:decoration-indigo-600 underline-offset-4"
        >
          Plan Another Trip
        </button>
      </div>

      {isMultiDay && (
        <div className="flex overflow-x-auto pb-4 mb-6 gap-3 no-scrollbar">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => setActiveDay(index)}
              className={`
                flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all duration-300
                ${activeDay === index 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}
              `}
            >
              <Calendar className="w-4 h-4" />
              <span>Day {day.day}</span>
            </button>
          ))}
        </div>
      )}

      {/* Theme Header for the Day */}
      <div className="bg-indigo-50/50 rounded-xl p-4 mb-8 border border-indigo-100 flex items-start gap-3">
         <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mt-0.5">
           <MapPin className="w-5 h-5" />
         </div>
         <div>
            <h3 className="font-bold text-indigo-900 text-lg">
              Day {days[activeDay].day}: {days[activeDay].theme}
            </h3>
            <p className="text-indigo-700/80 text-sm">
              Explore the highlights selected for this day.
            </p>
         </div>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-4 bottom-8 w-0.5 bg-indigo-100 hidden md:block"></div>

        <div className="space-y-8 min-h-[400px]">
          {days[activeDay].activities.map((item, index) => (
            <ItineraryCard key={`${activeDay}-${index}`} item={item} index={index} city={city} />
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-indigo-50 rounded-2xl border border-indigo-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">Ready to explore?</h3>
          <p className="text-indigo-700 mb-6 max-w-lg mx-auto">
            This daily plan is optimized for travel time. Open these locations in Google Maps.
          </p>
          <a 
            href={`https://www.google.com/maps/dir/${days[activeDay].activities.map(i => `${encodeURIComponent(i.placeName + " " + city)}`).join('/')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <ExternalLink className="w-4 h-4" />
            Open Day {days[activeDay].day} Route
          </a>
        </div>

      </div>
    </div>
  );
};

export default ItineraryTimeline;