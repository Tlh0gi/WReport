import React from 'react';

export default function EmptyState({ onAddLocation }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
      {/* Weather Icon Animation */}
      <div className="mb-8 relative">
        <div className="weather-icon-container">
          <span className="text-8xl block animate-bounce-slow">⛅</span>
          <div className="absolute -top-4 -right-4 text-5xl animate-spin-slow">☀️</div>
          <div className="absolute -bottom-2 -left-4 text-4xl animate-float">🌧️</div>
        </div>
      </div>

      {/* Title and Description */}
      <h1 className="text-3xl font-bold text-white mb-3 text-center">
        No Location Selected
      </h1>
      <p className="text-slate-300 text-center mb-8 max-w-md">
        Get started by adding a location to see weather forecasts, hourly updates, and detailed metrics.
      </p>

      {/* Add Location Button */}
      <button
        onClick={onAddLocation}
        className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
      >
        <span className="flex items-center gap-3">
          <svg 
            className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Location
        </span>
        
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
        </div>
      </button>

      {/* Features List */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
        <FeatureCard
          icon="📊"
          title="Hourly Forecasts"
          description="Track temperature changes throughout the day"
        />
        <FeatureCard
          icon="📅"
          title="Daily Weather"
          description="Plan ahead with 16-day forecasts"
        />
        <FeatureCard
          icon="🌤️"
          title="Live Conditions"
          description="Real-time weather updates and alerts"
        />
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes shine {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        .animate-shine {
          animation: shine 2s ease-in-out;
        }
        .weather-icon-container {
          position: relative;
          width: 150px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
      <span className="text-5xl block mb-3">{icon}</span>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}