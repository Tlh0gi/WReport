import React, { useState, useEffect } from 'react';
import EmptyState from './components/EmptyState';
import LocationModal from './components/LocationModal';
import MainWeatherView from './components/MainWeatherView';
import DetailedWeatherView from './components/DetailedWeatherView';
import WeatherBackground from './components/WeatherBackground';
import { getWeatherData, getWeatherInfo } from './utils/weatherAPI';
import { 
  getCurrentLocation, 
  saveCurrentLocation, 
  savePreferences, 
  getPreferences 
} from './utils/storage';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = getCurrentLocation();
    if (savedLocation) {
      setCurrentLocation(savedLocation);
      fetchWeatherData(savedLocation);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch weather data for a location
  const fetchWeatherData = async (location) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getWeatherData(
        location.latitude,
        location.longitude,
        location.timezone || 'auto'
      );
      
      setWeatherData(data);
      setCurrentLocation(location);
      saveCurrentLocation(location);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle location selection from modal
  const handleSelectLocation = (location) => {
    fetchWeatherData(location);
    setIsDetailView(false);
  };

  // Get weather category for background
  const weatherCategory = weatherData 
    ? getWeatherInfo(weatherData.current.weathercode).category 
    : 'clear';

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Weather Background */}
      {currentLocation && <WeatherBackground weatherCategory={weatherCategory} />}

      {/* Main Content */}
      <div className="relative z-10">
        {isLoading ? (
          <LoadingScreen />
        ) : error ? (
          <ErrorScreen error={error} onRetry={() => fetchWeatherData(currentLocation)} />
        ) : !currentLocation ? (
          <EmptyState onAddLocation={() => setIsLocationModalOpen(true)} />
        ) : isDetailView ? (
          <DetailedWeatherView
            weatherData={weatherData}
            location={currentLocation}
            onBack={() => setIsDetailView(false)}
          />
        ) : (
          <MainWeatherView
            weatherData={weatherData}
            location={currentLocation}
            onShowDetails={() => setIsDetailView(true)}
          />
        )}
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={handleSelectLocation}
      />

      {/* Floating Add Location Button (when location exists) */}
      {currentLocation && !isDetailView && (
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 transition-all duration-300 z-20"
          aria-label="Change location"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Loading Screen Component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
      <div className="relative">
        {/* Animated weather icon */}
        <div className="text-8xl mb-6 animate-pulse">☁️</div>
        
        {/* Loading spinner */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      
      <p className="text-slate-300 mt-6 text-lg">Loading weather data...</p>
    </div>
  );
}

// Error Screen Component
function ErrorScreen({ error, onRetry }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
      <div className="text-8xl mb-6">⚠️</div>
      <h2 className="text-2xl font-bold text-white mb-3">Oops! Something went wrong</h2>
      <p className="text-slate-300 text-center mb-6 max-w-md">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}