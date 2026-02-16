import React from 'react';
import { getWeatherInfo, formatTime } from '../utils/weatherAPI';

export default function MainWeatherView({ weatherData, location, onShowDetails }) {
  if (!weatherData) return null;

  const { current, hourly, daily } = weatherData;
  const weatherInfo = getWeatherInfo(current.weathercode);
  
  // Get today's high and low
  const todayHigh = daily.temperature_2m_max[0];
  const todayLow = daily.temperature_2m_min[0];

  // Get next few hours of weather (show 6 hours)
  const nextHours = hourly.time.slice(0, 6).map((time, index) => ({
    time,
    temp: hourly.temperature_2m[index],
    weathercode: hourly.weathercode[index],
  }));

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{location.name || location.displayName}</h1>
          <p className="text-slate-300 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Main Weather Display - Clickable */}
      <button
        onClick={onShowDetails}
        className="flex-1 flex flex-col items-center justify-center px-6 pb-12 hover:scale-[1.02] transition-transform duration-300"
      >
        {/* Weather Icon */}
        <div className="text-9xl mb-6 animate-float">
          {weatherInfo.icon}
        </div>

        {/* Temperature */}
        <div className="text-8xl font-bold text-white mb-2 tracking-tight">
          {Math.round(current.temperature_2m)}°
        </div>

        {/* Weather Description */}
        <p className="text-2xl text-slate-200 mb-1">{weatherInfo.description}</p>
        
        {/* High/Low */}
        <p className="text-lg text-slate-300">
          H: {Math.round(todayHigh)}° L: {Math.round(todayLow)}°
        </p>
      </button>

      {/* Hourly Preview */}
      <div className="px-6 pb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20">
          <h3 className="text-white font-semibold mb-4 px-2">Hourly Forecast</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {nextHours.map((hour, index) => {
              const hourWeather = getWeatherInfo(hour.weathercode);
              const time = index === 0 ? 'Now' : formatTime(hour.time);
              
              return (
                <div
                  key={hour.time}
                  className="flex flex-col items-center gap-2 min-w-[60px]"
                >
                  <span className="text-slate-200 text-sm">{time}</span>
                  <span className="text-3xl">{hourWeather.icon}</span>
                  <span className="text-white font-medium">{Math.round(hour.temp)}°</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tap to view details hint */}
        <div className="flex items-center justify-center gap-2 mt-4 text-slate-300 text-sm">
          <span>Tap anywhere to view details</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}