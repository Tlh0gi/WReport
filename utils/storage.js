// LocalStorage utilities for persisting user data

const STORAGE_KEYS = {
  CURRENT_LOCATION: 'weather_current_location',
  SAVED_LOCATIONS: 'weather_saved_locations',
  PREFERENCES: 'weather_preferences',
};

/**
 * Save the current active location
 * @param {Object} location - Location object
 */
export function saveCurrentLocation(location) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_LOCATION, JSON.stringify(location));
  } catch (error) {
    console.error('Error saving current location:', error);
  }
}

/**
 * Get the current active location
 * @returns {Object|null} Location object or null
 */
export function getCurrentLocation() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_LOCATION);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
}

/**
 * Save a location to saved locations list
 * @param {Object} location - Location object
 */
export function addSavedLocation(location) {
  try {
    const saved = getSavedLocations();
    
    // Check if location already exists (by coordinates)
    const exists = saved.some(
      loc => loc.latitude === location.latitude && loc.longitude === location.longitude
    );
    
    if (!exists) {
      saved.push(location);
      localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(saved));
    }
  } catch (error) {
    console.error('Error adding saved location:', error);
  }
}

/**
 * Get all saved locations
 * @returns {Array} Array of location objects
 */
export function getSavedLocations() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_LOCATIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting saved locations:', error);
    return [];
  }
}

/**
 * Remove a saved location
 * @param {number} latitude 
 * @param {number} longitude 
 */
export function removeSavedLocation(latitude, longitude) {
  try {
    const saved = getSavedLocations();
    const filtered = saved.filter(
      loc => !(loc.latitude === latitude && loc.longitude === longitude)
    );
    localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing saved location:', error);
  }
}

/**
 * Clear all saved locations
 */
export function clearSavedLocations() {
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVED_LOCATIONS);
  } catch (error) {
    console.error('Error clearing saved locations:', error);
  }
}

/**
 * Save user preferences
 * @param {Object} preferences - Preferences object
 */
export function savePreferences(preferences) {
  try {
    const current = getPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

/**
 * Get user preferences
 * @returns {Object} Preferences object
 */
export function getPreferences() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data ? JSON.parse(data) : {
      temperatureUnit: 'celsius', // 'celsius' or 'fahrenheit'
      windSpeedUnit: 'kmh', // 'kmh' or 'mph'
      timeFormat: '24h', // '24h' or '12h'
    };
  } catch (error) {
    console.error('Error getting preferences:', error);
    return {
      temperatureUnit: 'celsius',
      windSpeedUnit: 'kmh',
      timeFormat: '24h',
    };
  }
}

/**
 * Clear all data
 */
export function clearAllData() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
}