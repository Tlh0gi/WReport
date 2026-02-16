import React, { useState, useEffect } from 'react';
import { searchLocations, getCurrentLocation } from '../utils/locationAPI';

export default function LocationModal({ isOpen, onClose, onSelectLocation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Search locations as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const results = await searchLocations(searchQuery);
        setSearchResults(results);
      } catch (err) {
        setError('Failed to search locations. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSelectLocation = (location) => {
    onSelectLocation(location);
    onClose();
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleUseCurrentLocation = async () => {
    setIsGettingLocation(true);
    setError(null);

    try {
      const coords = await getCurrentLocation();
      
      // Create a location object with current coordinates
      const location = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        displayName: 'Current Location',
        name: 'Current Location',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      onSelectLocation(location);
      onClose();
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      setError('Unable to get your location. Please search manually.');
      console.error(err);
    } finally {
      setIsGettingLocation(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Add Location</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city..."
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Current Location Button */}
        <div className="p-4 border-b border-slate-700">
          <button
            onClick={handleUseCurrentLocation}
            disabled={isGettingLocation}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium"
          >
            {isGettingLocation ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Getting location...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Use Current Location
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/20 border-l-4 border-red-500">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="divide-y divide-slate-700">
              {searchResults.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelectLocation(location)}
                  className="w-full px-6 py-4 text-left hover:bg-slate-700/50 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                        {location.name}
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        {location.admin1 && `${location.admin1}, `}
                        {location.country}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.trim() && !isLoading ? (
            <div className="p-8 text-center text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>No locations found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : !searchQuery.trim() ? (
            <div className="p-8 text-center text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>Start typing to search for a city</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}