import React from 'react';
import { Plane, Compass } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Minimalist Professional Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[600]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-xl">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-sm font-black tracking-[0.2em] text-slate-900 uppercase">
              WanderPlan<span className="text-indigo-600">AI</span>
            </h1>
          </div>
          <nav className="flex items-center gap-8">
             <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">Intelligence</a>
             <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">Documentation</a>
          </nav>
        </div>
      </header>

      {/* Optimized Main Content Area */}
      <main className="flex-grow flex flex-col items-center py-12 px-6">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Clean Aesthetic Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
            &copy; 2025 WanderPlan Intelligence System
          </div>
          <div className="flex items-center gap-6">
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Gemini 3 Flash Engine
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;