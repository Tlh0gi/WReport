// Location search utilities using Open-Meteo Geocoding API (free, no key needed)

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Search for locations by name
 * @param {string} query - Location search query
 * @returns {Promise<Array>} Array of location results
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    name: query.trim(),
    count: 10,
    language: 'en',
    format: 'json',
  });

  try {
    const response = await fetch(`${GEOCODING_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.results) {
      return [];
    }

    // Format results for easier use
    return data.results.map(location => ({
      id: location.id,
      name: location.name,
      country: location.country,
      countryCode: location.country_code,
      admin1: location.admin1, // State/Province
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone,
      population: location.population,
      // Create display name
      displayName: `${location.name}${location.admin1 ? `, ${location.admin1}` : ''}, ${location.country}`,
    }));
  } catch (error) {
    console.error('Location search error:', error);
    throw error;
  }
}

/**
 * Get user's current location using browser geolocation
 * @returns {Promise<Object>} Location coordinates
 */
export async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Reverse geocode coordinates to location name
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Location info
 */

//Add a function to reverse geocode coordinates to a location name using the same API