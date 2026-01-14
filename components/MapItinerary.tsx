import React, { useState, useEffect, useRef } from 'react';
import { ItineraryItem, ItineraryDay, LocationCategory } from '../types';
import { generateLocationImage, RealImageResult } from '../services/geminiService';
import { MapPin, Clock, Star, ExternalLink, Coffee, Mountain, Camera, Footprints, Image as ImageIcon, Loader2, Users, ArrowLeft, Download, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import L from 'leaflet';

interface MapItineraryProps {
  city: string;
  days: ItineraryDay[];
  onReset: () => void;
}

const CategoryIcon = ({ category }: { category: LocationCategory }) => {
  switch (category) {
    case LocationCategory.FOOD: return <Coffee className="w-3.5 h-3.5" />;
    case LocationCategory.ADVENTURE: return <Mountain className="w-3.5 h-3.5" />;
    case LocationCategory.SIGHTSEEING: return <Camera className="w-3.5 h-3.5" />;
    case LocationCategory.RELAX: return <Footprints className="w-3.5 h-3.5" />;
    default: return <MapPin className="w-3.5 h-3.5" />;
  }
};

const SelectedPinCard = ({ 
  item, 
  city, 
  onClose,
  onNext,
  onPrev 
}: { 
  item: ItineraryItem, 
  city: string, 
  onClose: () => void,
  onNext: () => void,
  onPrev: () => void
}) => {
  const [imageResult, setImageResult] = useState<RealImageResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      const result = await generateLocationImage(item.placeName, city);
      if (mounted) {
        setImageResult(result);
        setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [item.placeName, city]);

  return (
    <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-8 md:bottom-auto md:top-24 md:w-[22rem] bg-white rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] border border-slate-100/50 overflow-hidden z-[2000] animate-in fade-in slide-in-from-right-12 duration-500 ease-out">
      <div className="relative h-48 bg-slate-100 group">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full p-2.5 z-30 transition-all border border-white/20"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        
        {/* Navigation Buttons */}
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 hover:scale-110 text-white rounded-full p-2 z-30 transition-all backdrop-blur-md border border-white/10"
          title="Previous Location"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 hover:scale-110 text-white rounded-full p-2 z-30 transition-all backdrop-blur-md border border-white/10"
           title="Next Location"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute top-4 left-4 z-30 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md text-indigo-600 text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm border border-white/40">
            <CheckCircle className="w-3 h-3" />
            Verified Photo
          </div>
        </div>
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-300 z-10">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
        
        {imageResult?.url ? (
          <img 
            src={imageResult.url} 
            alt={item.placeName} 
            className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`} 
          />
        ) : !loading && (
          <div className="flex items-center justify-center h-full text-slate-200">
            <ImageIcon className="w-10 h-10" />
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent p-6 pt-20 z-20">
           <div className="flex items-center gap-2 mb-2">
             <span className="bg-indigo-600/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-[0.2em] text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-indigo-500/20">
               <CategoryIcon category={item.category} /> {item.category}
             </span>
             <span className="flex items-center gap-1 text-white text-[11px] font-bold bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg"><Star className="w-3 h-3 fill-amber-400 text-amber-400"/> {item.rating}</span>
           </div>
           <h3 className="text-white font-bold text-xl leading-tight tracking-tight">{item.placeName}</h3>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{item.description}</p>
          {imageResult?.sourceUrl && (
            <a 
              href={imageResult.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] text-indigo-400 hover:text-indigo-600 font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
            >
              Source: {new URL(imageResult.sourceUrl).hostname} <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
        
        {item.startTime && item.endTime && (
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
            <div className="flex-1">
              <span className="text-[8px] text-slate-400 uppercase font-black tracking-[0.2em] block mb-1">Arrival</span>
              <div className="font-bold text-slate-800 text-sm tracking-tight">{item.startTime}</div>
            </div>
            <div className="h-px bg-slate-200 flex-1 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(79,70,229,0.6)]" />
            </div>
            <div className="flex-1 text-right">
               <span className="text-[8px] text-slate-400 uppercase font-black tracking-[0.2em] block mb-1">Departure</span>
               <div className="font-bold text-slate-800 text-sm tracking-tight">{item.endTime}</div>
            </div>
          </div>
        )}

        <div className="bg-indigo-50/50 p-4 rounded-3xl border border-indigo-100/50">
           <p className="text-[12px] text-indigo-700 font-semibold flex gap-2 leading-relaxed italic">
             <span className="text-xl leading-none text-indigo-300">“</span>
             {item.whyItFits}
             <span className="text-xl leading-none text-indigo-300 self-end">”</span>
           </p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">
           <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-300" />
              <span>{item.durationMinutes} Min Visit</span>
           </div>
           <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-300" />
              <span>{item.crowdLevel} Density</span>
           </div>
        </div>

        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.placeName + " " + city)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-slate-900 text-white text-center py-4.5 rounded-[1.5rem] text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group active:scale-[0.98]"
        >
          <span>Get Directions</span>
          <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>
  );
};

const MapItinerary: React.FC<MapItineraryProps> = ({ city, days, onReset }) => {
  const [activeDay, setActiveDay] = useState(0);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const polylineRef = useRef<L.Polyline | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([0, 0], 2);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
    }
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Fix: Explicitly cast to L.Marker[] to avoid "unknown" type error on markers when calling remove()
    (Object.values(markersRef.current) as L.Marker[]).forEach(m => m.remove());
    markersRef.current = {};
    if (polylineRef.current) polylineRef.current.remove();
    
    const currentActivities = days[activeDay].activities;
    const points: L.LatLngExpression[] = [];
    
    currentActivities.forEach((item) => {
      const latLng: L.LatLngExpression = [item.latitude, item.longitude];
      points.push(latLng);

      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="pin-marker" id="pin-${item.pin_number}">${item.pin_number}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(latLng, { icon }).addTo(map);
      marker.on('click', () => setSelectedItem(item));

      marker.bindTooltip(`
        <div class="p-2 min-w-[120px]">
          <div class="text-[9px] font-black uppercase text-indigo-500 mb-0.5 tracking-[0.1em]">${item.startTime || 'Scheduled'}</div>
          <div class="font-bold text-slate-800 text-sm leading-tight">${item.placeName}</div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -15],
        opacity: 1,
        className: 'bg-white border-none shadow-2xl rounded-2xl p-0 overflow-hidden'
      });

      markersRef.current[item.placeName] = marker;
    });

    if (points.length > 1) {
      polylineRef.current = L.polyline(points, {
        color: '#4f46e5',
        weight: 4,
        opacity: 0.3,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '8, 12'
      }).addTo(map);
    }

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [100, 100], maxZoom: 16 });
    }
  }, [days, activeDay]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !selectedItem) {
      document.querySelectorAll('.pin-marker.active').forEach(el => el.classList.remove('active'));
      return;
    }

    document.querySelectorAll('.pin-marker.active').forEach(el => el.classList.remove('active'));
    const activeEl = document.getElementById(`pin-${selectedItem.pin_number}`);
    if (activeEl) activeEl.classList.add('active');

    map.flyTo([selectedItem.latitude, selectedItem.longitude], 15, { 
      duration: 1.2, 
      easeLinearity: 0.2 
    });
  }, [selectedItem]);

  const handleNext = () => {
    if (!selectedItem) return;
    const currentActivities = days[activeDay].activities;
    const currentIndex = currentActivities.findIndex(item => item.pin_number === selectedItem.pin_number);
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % currentActivities.length;
    setSelectedItem(currentActivities[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedItem) return;
    const currentActivities = days[activeDay].activities;
    const currentIndex = currentActivities.findIndex(item => item.pin_number === selectedItem.pin_number);
    if (currentIndex === -1) return;

    const prevIndex = (currentIndex - 1 + currentActivities.length) % currentActivities.length;
    setSelectedItem(currentActivities[prevIndex]);
  };

  const handleDownloadItinerary = () => {
    let content = `WanderPlan AI: Your Trip to ${city}\n`;
    content += `==========================================\n\n`;

    days.forEach(day => {
      content += `DAY ${day.day}: ${day.theme.toUpperCase()}\n`;
      content += `------------------------------------------\n`;
      day.activities.forEach((activity, idx) => {
        content += `${activity.startTime} - ${activity.placeName}\n`;
        content += `Category: ${activity.category} | Rating: ${activity.rating}⭐\n`;
        content += `Description: ${activity.description}\n`;
        content += `Vibe Check: ${activity.whyItFits}\n`;
        content += `Maps Link: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.placeName + " " + city)}\n`;
        if (activity.nearbyFood && activity.nearbyFood.length > 0) {
          content += `Local Eats: ${activity.nearbyFood.join(', ')}\n`;
        }
        content += `\n`;
      });
      content += `\n`;
    });

    content += `Generated with Intelligence by WanderPlan AI (2025)\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${city.replace(/\s+/g, '-')}-Itinerary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-[88vh] relative bg-slate-50 rounded-[3.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.18)] border border-slate-200/50 flex flex-col">
      
      <div className="absolute top-0 left-0 right-0 z-[1000] p-6 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/60 rounded-[2.5rem] p-4.5 flex flex-wrap items-center justify-between gap-6 pointer-events-auto max-w-6xl mx-auto">
          
          <div className="flex items-center gap-5">
             <button 
              onClick={onReset} 
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-[1.25rem] text-slate-400 hover:text-slate-900 transition-all border border-slate-100 active:scale-95"
              title="New Search"
             >
               <ArrowLeft className="w-5 h-5" />
             </button>
             <div className="h-10 w-px bg-slate-100 hidden sm:block" />
             <div>
               <h2 className="font-black text-slate-400 leading-tight tracking-[0.2em] uppercase text-[9px] mb-1">Live Itinerary</h2>
               <div className="flex items-center gap-2">
                 <span className="font-bold text-slate-900 tracking-tight">{city}</span>
                 <span className="text-slate-200">•</span>
                 <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-100/50">{days[activeDay].theme}</span>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50/50 p-1.5 rounded-[1.5rem] border border-slate-100/50">
              {days.map((d, i) => (
                <button
                  key={i}
                  onClick={() => {
                      setActiveDay(i);
                      setSelectedItem(null);
                  }}
                  className={`px-5 py-2.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${activeDay === i ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:text-slate-600 hover:bg-white'}`}
                >
                  Day {d.day}
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleDownloadItinerary}
              className="flex items-center gap-2.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-lg shadow-indigo-100 active:scale-95 group"
            >
              <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              <span className="hidden sm:inline">Export Plan</span>
            </button>
          </div>
        </div>
      </div>

      <div ref={mapContainer} className="flex-grow z-0 relative" />

      {selectedItem && (
        <SelectedPinCard 
          item={selectedItem} 
          city={city} 
          onClose={() => setSelectedItem(null)} 
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}

      {!selectedItem && (
        <div className="absolute bottom-10 left-10 z-[1000] pointer-events-none hidden md:block">
           <div className="bg-slate-900/95 backdrop-blur shadow-2xl text-white px-6 py-4 rounded-[1.75rem] flex items-center gap-4 animate-in fade-in slide-in-from-left-6 duration-700">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping absolute inset-0" />
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 relative" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90">Select a waypoint to explore</span>
           </div>
        </div>
      )}

    </div>
  );
};

export default MapItinerary;