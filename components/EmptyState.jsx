import React from 'react';

export default function EmptyState({ onAddLocation }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
      {/* Weather Conditions Showcase */}
      <div className="mb-12 w-full max-w-5xl px-4 animate-fade-in">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          <WeatherPreview
            icon="☀️"
            label="Sunny"
            gradient="from-sky-400 to-blue-500"
            delay="0s"
          />
          <WeatherPreview
            icon="⛅"
            label="Partly Cloudy"
            gradient="from-blue-400 to-slate-400"
            delay="0.1s"
          />
          <WeatherPreview
            icon="☁️"
            label="Cloudy"
            gradient="from-slate-400 to-slate-600"
            delay="0.2s"
          />
          <WeatherPreview
            icon="🌧️"
            label="Rainy"
            gradient="from-slate-600 to-slate-800"
            delay="0.3s"
            effect="rain"
          />
          <WeatherPreview
            icon="⛈️"
            label="Storm"
            gradient="from-slate-800 to-slate-900"
            delay="0.4s"
            effect="lightning"
          />
          <WeatherPreview
            icon="❄️"
            label="Snowy"
            gradient="from-slate-300 to-slate-500"
            delay="0.5s"
            effect="snow"
          />
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
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
        @keyframes fall-mini {
          to {
            transform: translateY(100px);
            opacity: 0;
          }
        }
        @keyframes fall-snow-mini {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(60px) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes lightning-flash {
          0%, 100% { 
            background: rgba(255, 255, 255, 0); 
          }
          50% { 
            background: rgba(255, 255, 255, 0.3); 
          }
        }
        .animate-shine {
          animation: shine 2s ease-in-out;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .lightning-flash {
          animation: lightning-flash 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function WeatherPreview({ icon, label, gradient, delay, effect }) {
  return (
    <div 
      className="relative overflow-hidden rounded-2xl aspect-square group cursor-pointer"
      style={{ animationDelay: delay }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-110`}>
        {/* Weather effects */}
        {effect === 'rain' && (
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-4 bg-white/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `fall-mini 1s linear infinite`,
                  animationDelay: `${Math.random() * 1}s`,
                }}
              />
            ))}
          </div>
        )}
        
        {effect === 'snow' && (
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute text-white/60 text-xs"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `fall-snow-mini 3s linear infinite`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              >
                ❄
              </div>
            ))}
          </div>
        )}
        
        {effect === 'lightning' && (
          <div className="absolute inset-0 lightning-flash" />
        )}
      </div>

      {/* Icon and label */}
      <div className="relative h-full flex flex-col items-center justify-center p-3 text-center">
        <span className="text-4xl md:text-5xl mb-2 group-hover:scale-125 transition-transform duration-300">
          {icon}
        </span>
        <span className="text-white text-xs md:text-sm font-medium drop-shadow-lg">
          {label}
        </span>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-colors duration-300" />
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