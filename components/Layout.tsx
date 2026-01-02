import React from 'react';
import { Plane } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 bg-opacity-80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Plane className="h-6 w-6 transform -rotate-45" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">WanderPlan<span className="text-indigo-600">AI</span></h1>
          </div>
          <nav>
             <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">About</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            Powered by Google Gemini 2.5 • Built for explorers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;