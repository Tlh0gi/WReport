// Open-Meteo API utilities

const BASE_URL = 'https://api.open-meteo.com/v1';

/**
 * Fetch current weather and forecasts for a location
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {string} timezone - IANA timezone (e.g., 'Africa/Johannesburg')
 * @returns {Promise<Object>} Weather data
 */
export async function getWeatherData(latitude, longitude, timezone = 'auto') {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    timezone,
    // Current weather
    current: [
      'temperature_2m',
      'apparent_temperature',
      'weathercode',
      'windspeed_10m',
      'winddirection_10m',
      'relativehumidity_2m',
      'surface_pressure',
      'precipitation',
    ].join(','),
    // Hourly forecast (next 24 hours)
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'weathercode',
      'precipitation_probability',
      'windspeed_10m',
      'relativehumidity_2m',
      'visibility',
      'uv_index',
    ].join(','),
    // Daily forecast (next 7 days)
    daily: [
      'weathercode',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'precipitation_probability_max',
      'windspeed_10m_max',
      'uv_index_max',
    ].join(','),
    forecast_days: 16,
  });

  //Make the API request with the following parameters
  const response = await fetch(`${BASE_URL}/forecast?${params}`);
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Map WMO weather codes to descriptions and categories
 * @param {number} code - WMO weather code
 * @returns {Object} Weather info
 */

//Match the WMO weather code to the corresponding description.
export function getWeatherInfo(code) {
  const weatherMap = {
    0: { description: 'Clear sky', category: 'clear', icon: '☀️' },
    1: { description: 'Mainly clear', category: 'clear', icon: '🌤️' },
    2: { description: 'Partly cloudy', category: 'cloudy', icon: '⛅' },
    3: { description: 'Overcast', category: 'cloudy', icon: '☁️' },
    45: { description: 'Foggy', category: 'fog', icon: '🌫️' },
    48: { description: 'Depositing rime fog', category: 'fog', icon: '🌫️' },
    51: { description: 'Light drizzle', category: 'drizzle', icon: '🌦️' },
    53: { description: 'Moderate drizzle', category: 'drizzle', icon: '🌦️' },
    55: { description: 'Dense drizzle', category: 'drizzle', icon: '🌧️' },
    56: { description: 'Light freezing drizzle', category: 'drizzle', icon: '🌧️' },
    57: { description: 'Dense freezing drizzle', category: 'drizzle', icon: '🌧️' },
    61: { description: 'Slight rain', category: 'rain', icon: '🌧️' },
    63: { description: 'Moderate rain', category: 'rain', icon: '🌧️' },
    65: { description: 'Heavy rain', category: 'rain', icon: '🌧️' },
    66: { description: 'Light freezing rain', category: 'rain', icon: '🌧️' },
    67: { description: 'Heavy freezing rain', category: 'rain', icon: '🌧️' },
    71: { description: 'Slight snow', category: 'snow', icon: '🌨️' },
    73: { description: 'Moderate snow', category: 'snow', icon: '🌨️' },
    75: { description: 'Heavy snow', category: 'snow', icon: '❄️' },
    77: { description: 'Snow grains', category: 'snow', icon: '❄️' },
    80: { description: 'Slight rain showers', category: 'rain', icon: '🌦️' },
    81: { description: 'Moderate rain showers', category: 'rain', icon: '⛈️' },
    82: { description: 'Violent rain showers', category: 'rain', icon: '⛈️' },
    85: { description: 'Slight snow showers', category: 'snow', icon: '🌨️' },
    86: { description: 'Heavy snow showers', category: 'snow', icon: '❄️' },
    95: { description: 'Thunderstorm', category: 'thunderstorm', icon: '⛈️' },
    96: { description: 'Thunderstorm with slight hail', category: 'thunderstorm', icon: '⛈️' },
    99: { description: 'Thunderstorm with heavy hail', category: 'thunderstorm', icon: '⛈️' },
  };

  return weatherMap[code] || { description: 'Unknown', category: 'clear', icon: '❓' };
}

/**
 * Get wind direction from degrees
 * @param {number} degrees 
 * @returns {string} Direction (N, NE, E, etc.)
 */
export function getWindDirection(degrees) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

/**
 * Format time from ISO string
 * @param {string} isoString 
 * @returns {string} Formatted time
 */
export function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/**
 * Get UV index category
 * @param {number} uvIndex 
 * @returns {string} Category
 */
export function getUVCategory(uvIndex) {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very high';
  return 'Extreme';
}