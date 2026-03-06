# Utilities Documentation

A comprehensive guide to understanding the core utility functions that power the Weather Report App. This document explains **what** these utilities do, **why** they exist, and **how** they work together to create a seamless weather experience.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Weather API Utility](#weather-api-utility-weatherapijs)
  - [Purpose and Responsibilities](#purpose-and-responsibilities)
  - [Core Functions](#core-functions)
  - [Data Processing](#data-processing)
- [Location API Utility](#location-api-utility-locationapijs)
  - [Purpose and Responsibilities](#purpose-and-responsibilities-1)
  - [Core Functions](#core-functions-1)
  - [Search Strategy](#search-strategy)
- [Storage Utility](#storage-utility-storagejs)
  - [Purpose and Responsibilities](#purpose-and-responsibilities-2)
  - [Core Functions](#core-functions-2)
  - [Data Persistence Strategy](#data-persistence-strategy)
- [How They Work Together](#how-they-work-together)
- [Best Practices](#best-practices)

---

## Overview

The Weather Report App is built on three fundamental utility modules that handle all external interactions and data persistence. Think of these as the **backbone** of the application:

```
┌─────────────────────────────────────────────────────────┐
│                    React Components                      │
│            (UI Layer - What users see)                   │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ▼           ▼           ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│  Weather   │ │  Location  │ │  Storage   │
│  API Util  │ │  API Util  │ │    Util    │
└─────┬──────┘ └─────┬──────┘ └─────┬──────┘
      │              │              │
      ▼              ▼              ▼
┌─────────────────────────────────────────┐
│          External Services              │
│  • Open-Meteo API                       │
│  • Geocoding API                        │
│  • Browser LocalStorage                 │
└─────────────────────────────────────────┘
```

**Key Principle:** Each utility has a **single, focused responsibility**:
- **weatherApi.js** - Fetches and processes weather data
- **locationApi.js** - Searches and manages location information
- **storage.js** - Persists and retrieves user data locally

This separation makes the code easier to understand, test, and maintain.

---

## Weather API Utility (`weatherApi.js`)

**Location:** `/utils/weatherApi.js`

### Purpose and Responsibilities

The Weather API utility is the **data provider** for all weather information in the app. Its job is to:

1. **Communicate with Open-Meteo API** - Make HTTP requests to fetch weather data
2. **Transform raw data** - Convert API responses into formats the app can use
3. **Provide helper functions** - Make sense of weather codes, directions, and other data

**Think of it as:** A translator that speaks both "API language" and "application language"

### Why This Utility Exists

Without this utility, every component would need to:
- Know the exact API URL and parameters
- Handle the complexity of HTTP requests
- Understand WMO weather codes
- Parse ISO datetime strings
- Calculate wind directions

Instead, components just call simple functions like:
```javascript
const weather = await getWeatherData(latitude, longitude);
const info = getWeatherInfo(weatherCode);
```

### Core Functions

#### 1. **`getWeatherData(latitude, longitude, timezone)` - The Main Function** ⭐

**What it does:**
This is the **most important function** in this file. It fetches comprehensive weather information for any location on Earth.

**Why it's crucial:**
- This is called **every time** a user selects a location
- Returns ALL weather data: current, hourly (24h), and daily (16 days)
- Powers the entire weather display in the app

**How it works:**
1. Takes geographic coordinates (where on Earth)
2. Builds a URL with specific parameters (what data we want)
3. Makes an HTTP request to Open-Meteo API
4. Returns a complete weather package

**What it returns:**
```javascript
{
  current: {
    temperature_2m: 21.5,        // Current temperature
    weathercode: 3,               // Weather condition code
    windspeed_10m: 12,           // Wind speed
    // ... 5 more metrics
  },
  hourly: {
    time: ["2024-01-15T00:00", ...],      // 24 hour timestamps
    temperature_2m: [20, 21, 22, ...],    // 24 temperatures
    weathercode: [3, 3, 2, ...],          // 24 conditions
    // ... 5 more arrays
  },
  daily: {
    time: ["2024-01-15", ...],            // 16 day dates
    temperature_2m_max: [25, 26, ...],    // 16 high temps
    temperature_2m_min: [15, 16, ...],    // 16 low temps
    // ... 7 more arrays
  }
}
```

**Real-world example:**
When you search for "London" and select it, this function is called with London's coordinates (51.5074, -0.1278) and returns everything needed to show London's weather.

---

#### 2. **`getWeatherInfo(code)` - The Code Translator** ⭐

**What it does:**
Converts mysterious WMO weather codes (0-99) into human-readable information.

**Why it's crucial:**
- Weather APIs use standard codes (e.g., 61 = rain)
- Users need to see "Slight rain" and a 🌧️ icon
- Used throughout the app to display weather conditions

**How it works:**
Takes a number (weather code) and returns a descriptive object:

**Example:**
```javascript
// Input: code 61
getWeatherInfo(61)

// Output:
{
  description: "Slight rain",
  category: "rain",           // Used to select background animation
  icon: "🌧️"                  // Displayed to user
}
```

**Real-world usage:**
- **Main view:** Shows the weather icon (☀️, 🌧️, ❄️)
- **Background:** Determines which animation to play (rain, snow, etc.)
- **Hourly chart:** Displays icons for each hour

---

#### 3. **`getWindDirection(degrees)` - The Compass Reader**

**What it does:**
Converts wind direction from degrees (0-360) to cardinal directions (N, NE, E, SE, S, SW, W, NW).

**Why it's useful:**
- APIs give wind direction as numbers (e.g., 180)
- Users understand "South wind" better than "180 degrees"

**How it works:**
- Divides the compass into 8 sections (45° each)
- Matches degrees to the nearest direction

**Example:**
```javascript
getWindDirection(0)    // Returns "N" (North)
getWindDirection(90)   // Returns "E" (East)
getWindDirection(180)  // Returns "S" (South)
getWindDirection(270)  // Returns "W" (West)
```

---

#### 4. **`formatTime(isoString)` - The Time Formatter**

**What it does:**
Converts ISO 8601 timestamps (API format) to readable time strings.

**Why it's useful:**
- APIs return times like "2024-01-15T14:30:00"
- Users want to see "14:30"

**Example:**
```javascript
formatTime("2024-01-15T14:30:00")  // Returns "14:30"
```

**Where it's used:**
- Hourly chart time labels
- Sunrise/sunset times

---

#### 5. **`getUVCategory(uvIndex)` - The UV Index Classifier**

**What it does:**
Categorizes UV index numbers into safety levels.

**Why it's useful:**
- A UV index of "8" doesn't mean much to most people
- "Very high - wear sunscreen!" is actionable

**How it works:**
Assigns categories based on ranges:

```javascript
getUVCategory(1)   // Returns "Low"
getUVCategory(4)   // Returns "Moderate"
getUVCategory(8)   // Returns "Very high"
getUVCategory(12)  // Returns "Extreme"
```

**Where it's used:**
Daily weather view to show UV safety level

---

### Data Processing

**What happens to the data:**

```
Raw API Response (JSON)
        ↓
getWeatherData() fetches it
        ↓
Components receive structured data
        ↓
Helper functions (getWeatherInfo, etc.) 
transform codes into readable info
        ↓
UI displays beautiful, understandable weather
```

**Key insight:** This utility acts as a **protective layer** between the unpredictable external API and your app's components. If Open-Meteo changes their API slightly, you only update this one file instead of every component.

---

## Location API Utility (`locationApi.js`)

**Location:** `/utils/locationApi.js`

### Purpose and Responsibilities

The Location API utility handles everything related to **finding places on Earth**. Its job is to:

1. **Search for cities** - Find locations by name ("Paris", "New York")
2. **Get current location** - Use the browser to detect where the user is
3. **Convert coordinates to places** - Turn lat/lon into readable location names

**Think of it as:** Your app's GPS and address book combined

### Why This Utility Exists

Location search is complex because:
- The world has millions of places with similar names (50+ cities named "Springfield")
- Users type partial or misspelled names
- Geographic coordinates need to be converted to usable location data
- Browser geolocation requires permission handling

This utility **simplifies** all of that into easy function calls.

### Core Functions

#### 1. **`searchLocations(query)` - The Location Finder** ⭐

**What it does:**
This is the **heart of the location search feature**. It takes what the user types and finds matching cities worldwide.

**Why it's crucial:**
- Called every time a user types in the location search box
- Returns the list of cities shown in the dropdown
- Makes the location selection feature possible

**How it works:**
1. User types "Par"
2. Function waits (debounced) for user to stop typing
3. Sends search to Open-Meteo Geocoding API
4. Receives up to 10 matching cities
5. Formats them for easy display

**What it returns:**
Array of location objects, each containing:
```javascript
[
  {
    id: 2988507,                                    // Unique identifier
    name: "Paris",                                  // City name
    country: "France",                              // Country
    countryCode: "FR",                              // Country code
    admin1: "Île-de-France",                       // State/Region
    latitude: 48.8566,                             // Exact coordinates
    longitude: 2.3522,
    timezone: "Europe/Paris",                       // Time zone
    population: 2138551,                            // Population
    displayName: "Paris, Île-de-France, France"    // Formatted for UI
  },
  {
    // Paris, Texas, USA would be next...
  }
]
```

**Real-world example:**
When you type "London" in the search:
1. Function is called with query="London"
2. Returns multiple Londons (UK, Canada, USA, etc.)
3. You see a list to choose from

**Smart features:**
- **Minimum 2 characters:** Doesn't search for single letters
- **Debouncing:** Waits 500ms after typing stops before searching
- **Error handling:** Returns empty array if search fails
- **Formatted names:** Automatically creates "City, State, Country" format

---

#### 2. **`getCurrentLocation()` - The Position Detector** ⭐

**What it does:**
Uses the browser's built-in GPS/location services to detect where the user is right now.

**Why it's crucial:**
- Enables the "Use Current Location" button
- Provides instant weather without typing
- Improves user experience significantly

**How it works:**
1. Asks browser for user's permission
2. Browser asks user "Allow location access?"
3. If allowed, gets GPS coordinates
4. Returns latitude and longitude

**What it returns:**
```javascript
{
  latitude: 51.5074,    // User's current latitude
  longitude: -0.1278    // User's current longitude
}
```

**Real-world flow:**
```
User clicks "Use Current Location"
        ↓
getCurrentLocation() called
        ↓
Browser shows permission dialog
        ↓
User clicks "Allow"
        ↓
Function gets coordinates
        ↓
App fetches weather for those coordinates
        ↓
User sees their local weather instantly
```

**Error handling:**
Handles three failure cases:
- **User denies permission** - Returns error message
- **Location services disabled** - Returns error message
- **Timeout (5 seconds)** - Returns error if taking too long

---

#### 3. **`reverseGeocode(latitude, longitude)` - The Coordinate Translator**

**What it does:**
Takes geographic coordinates and converts them into a location name.

**Why it exists:**
When using "Current Location", we get coordinates (51.5074, -0.1278) but need to show a name like "London".

**Current implementation:**
Creates a placeholder location object with the coordinates displayed.

**Future enhancement:**
Could integrate with a reverse geocoding service to get actual city names from coordinates.

**What it returns:**
```javascript
{
  latitude: 51.5074,
  longitude: -0.1278,
  displayName: "Location (51.5074, -0.1278)",
  name: "Current Location",
  timezone: "Europe/London"  // Detected from browser
}
```

---

### Search Strategy

**The smart search process:**

```
User Types in Search Box
        ↓
"P" → (waits, < 2 chars, no search)
        ↓
"Pa" → (waits 500ms)
        ↓
"Par" → (still waiting...)
        ↓
User stops typing
        ↓
500ms passes ← DEBOUNCE DELAY
        ↓
searchLocations("Par") called
        ↓
API returns results
        ↓
User sees: Paris (France), Paris (USA), etc.
```

**Why debouncing matters:**
Without it, typing "Paris" would trigger 5 API calls (P, Pa, Par, Pari, Paris). With debouncing, only 1 call happens after the user finishes typing.

**Benefits:**
- ⚡ Faster perceived performance
- 💰 Fewer API calls
- 🌐 Less network traffic
- 😊 Better user experience

---

## Storage Utility (`storage.js`)

**Location:** `/utils/storage.js`

### Purpose and Responsibilities

The Storage utility manages **data persistence** - making sure your location and preferences survive page refreshes, browser restarts, and even days later.

**Its responsibilities:**
1. **Save user's current location** - Remember the last city they viewed
2. **Manage saved locations** - Store a list of favorite places (future feature)
3. **Store preferences** - Temperature units, time format, etc.
4. **Handle errors gracefully** - Don't crash if storage is full or unavailable

**Think of it as:** Your app's memory system

### Why This Utility Exists

Without persistent storage:
- User selects "London" → sees weather
- Refreshes page → back to empty state ❌
- Has to search for "London" again 😞

With storage:
- User selects "London" → sees weather
- Refreshes page → still shows London ✅
- Weather loads automatically 😊

**Privacy note:** All data stays on the user's device. Nothing is sent to any server.

### Core Functions

#### 1. **`saveCurrentLocation(location)` - The Location Saver** ⭐

**What it does:**
Saves the user's currently selected location so it persists across sessions.

**Why it's crucial:**
- **Most important storage function**
- Called every time user selects a new location
- Enables the app to "remember" the last viewed city
- Makes the app feel more like a native application

**How it works:**
1. Takes a location object (city data)
2. Converts it to JSON string
3. Saves to browser's LocalStorage
4. Handles errors if storage fails

**What it saves:**
```javascript
saveCurrentLocation({
  name: "London",
  displayName: "London, England, United Kingdom",
  latitude: 51.5074,
  longitude: -0.1278,
  timezone: "Europe/London",
  country: "United Kingdom"
})
```

**Stored in LocalStorage as:**
```
Key: "weather_current_location"
Value: '{"name":"London","latitude":51.5074,...}'
```

**Real-world impact:**
```
Day 1, 10:00 AM:
  User searches "Tokyo" → sees Tokyo weather
        ↓
  saveCurrentLocation(tokyo) called
        ↓
  Tokyo saved to LocalStorage

Day 1, 10:05 AM:
  User refreshes page
        ↓
  getCurrentLocation() retrieves Tokyo
        ↓
  Tokyo weather loads automatically ✨

Day 2, 9:00 AM:
  User opens browser
        ↓
  Tokyo STILL saved!
        ↓
  Automatic weather display
```

---

#### 2. **`getCurrentLocation()` - The Location Retriever** ⭐

**What it does:**
Retrieves the previously saved location from storage.

**Why it's crucial:**
- Called when app starts up
- Determines whether to show empty state or weather
- Makes the app feel instant and responsive

**How it works:**
1. Looks for saved location in LocalStorage
2. Parses the JSON string back into an object
3. Returns null if nothing saved (new user)
4. Handles errors if data is corrupted

**Return values:**
```javascript
// If location was saved:
{
  name: "London",
  latitude: 51.5074,
  // ... full location object
}

// If nothing saved (new user):
null
```

**App startup flow:**
```
App loads
    ↓
getCurrentLocation() called
    ↓
Has saved location? 
    ↓           ↓
  YES          NO
    ↓           ↓
Load weather   Show empty state
    ↓           ↓
Main view      "Add Location" button
```

---

#### 3. **`savePreferences(preferences)` - The Settings Saver**

**What it does:**
Saves user preferences like temperature units and time format.

**Why it's useful:**
- User sets preference once
- Remembered forever
- Applies to all future weather displays

**How it works:**
- Merges new preferences with existing ones
- Stores as JSON in LocalStorage
- Returns quietly if it fails (graceful degradation)

**Example usage:**
```javascript
// User switches to Fahrenheit
savePreferences({
  temperatureUnit: 'fahrenheit'
})

// User prefers 12-hour time
savePreferences({
  timeFormat: '12h'
})
```

---

#### 4. **`getPreferences()` - The Settings Retriever**

**What it does:**
Retrieves user preferences with sensible defaults.

**Default preferences:**
```javascript
{
  temperatureUnit: 'celsius',    // °C or °F
  windSpeedUnit: 'kmh',          // km/h or mph
  timeFormat: '24h'               // 24h or 12h
}
```

**Smart behavior:**
- Returns defaults for new users
- Returns saved preferences for returning users
- Never crashes, always returns something useful

---

#### 5. **Additional Location Functions**

**`addSavedLocation(location)`**
- Adds a location to a favorites list
- Prevents duplicates
- Prepares for "multiple locations" feature

**`getSavedLocations()`**
- Returns array of saved favorite locations
- Returns empty array for new users

**`removeSavedLocation(latitude, longitude)`**
- Removes a location from favorites
- Uses coordinates to identify which one to remove

**`clearAllData()`**
- Nuclear option: erases everything
- Useful for "reset app" functionality

---

### Data Persistence Strategy

**Storage keys organization:**
```javascript
LocalStorage Contents:
├── "weather_current_location"    // The active city
├── "weather_saved_locations"     // Favorite cities list
└── "weather_preferences"          // User settings
```

**Why prefixed with "weather_":**
- Avoids conflicts with other apps on same domain
- Makes it easy to find all app data
- Professional naming convention

**Data flow:**
```
User Action
    ↓
Component calls storage function
    ↓
storage.js accesses LocalStorage
    ↓
Data saved/retrieved
    ↓
Component updates UI
```

**Error handling philosophy:**
```javascript
try {
  // Try to save
  localStorage.setItem(key, value)
} catch (error) {
  // If it fails:
  // - Log error (for developers)
  // - Don't crash app (for users)
  // - Continue working (graceful degradation)
  console.error('Storage failed:', error)
}
```

**Benefits of this approach:**
- ✅ App never crashes from storage errors
- ✅ Works even if LocalStorage is full
- ✅ Works in private browsing mode (no storage available)
- ✅ Degrades gracefully (just won't remember preferences)

---

## How They Work Together

### The Complete User Journey

**Scenario:** User searches for and selects "Paris"

```
1. User types "Paris" in search box
        ↓
   LocationModal Component
        ↓
   Calls: searchLocations("Paris")    ← locationApi.js
        ↓
   Displays: List of Paris cities
        ↓
2. User clicks "Paris, France"
        ↓
   App Component
        ↓
   Calls: saveCurrentLocation(paris)  ← storage.js
        ↓
   Calls: getWeatherData(48.8566, 2.3522)  ← weatherApi.js
        ↓
   Receives weather data
        ↓
3. Display components receive data
        ↓
   Call: getWeatherInfo(code)         ← weatherApi.js
   Call: getWindDirection(degrees)    ← weatherApi.js
   Call: formatTime(timestamp)        ← weatherApi.js
        ↓
4. User sees beautiful Paris weather! ☀️
        ↓
5. User refreshes page
        ↓
   App loads
        ↓
   Calls: getCurrentLocation()        ← storage.js
        ↓
   Returns saved Paris location
        ↓
   Calls: getWeatherData()            ← weatherApi.js
        ↓
   Paris weather appears instantly! ✨
```

### Dependency Map

```
React Components
    ↓ needs weather data
weatherApi.js ──────────→ Open-Meteo API
    ↑
    │ returns formatted data
    │
React Components
    ↓ needs location search
locationApi.js ─────────→ Geocoding API
    ↑
    │ returns location list
    │
React Components
    ↓ needs to save/load data
storage.js ─────────────→ Browser LocalStorage
    ↑
    │ returns saved data
    │
React Components ←──────┘
```

### Data Flow Example

**When app starts:**
```
1. storage.js:    getCurrentLocation()
2. storage.js:    Returns {name: "London", ...}
3. weatherApi.js: getWeatherData(51.5074, -0.1278)
4. weatherApi.js: Returns full weather data
5. weatherApi.js: getWeatherInfo(3) → "Cloudy"
6. Component:     Displays London weather with clouds
```

**When searching:**
```
1. locationApi.js: searchLocations("Tokyo")
2. locationApi.js: Returns [{name: "Tokyo", ...}]
3. User:           Clicks Tokyo from list
4. storage.js:     saveCurrentLocation(tokyo)
5. weatherApi.js:  getWeatherData(35.6762, 139.6503)
6. Component:      Displays Tokyo weather
```

---

## Best Practices

### For Developers Using These Utilities

#### 1. **Always Handle Errors**

```javascript
// Good ✅
try {
  const weather = await getWeatherData(lat, lon);
  setWeatherData(weather);
} catch (error) {
  setError("Couldn't load weather");
  console.error(error);
}

// Bad ❌
const weather = await getWeatherData(lat, lon);
// Crashes if API is down!
```

#### 2. **Don't Call APIs Too Often**

```javascript
// Good ✅ - Debounce search
useEffect(() => {
  const timer = setTimeout(() => {
    searchLocations(query);
  }, 500);
  return () => clearTimeout(timer);
}, [query]);

// Bad ❌ - Calls API on every keystroke
useEffect(() => {
  searchLocations(query);
}, [query]);
```

#### 3. **Check for Null/Undefined**

```javascript
// Good ✅
const savedLocation = getCurrentLocation();
if (savedLocation) {
  fetchWeather(savedLocation);
} else {
  showEmptyState();
}

// Bad ❌
const savedLocation = getCurrentLocation();
fetchWeather(savedLocation);  // Crashes if null!
```

#### 4. **Use Helper Functions**

```javascript
// Good ✅ - Readable and maintainable
const weatherInfo = getWeatherInfo(weatherCode);
display.textContent = weatherInfo.description;

// Bad ❌ - Hard to maintain
if (weatherCode === 0) {
  display.textContent = "Clear sky";
} else if (weatherCode === 1) {
  // ... 98 more conditions
}
```

### For Future Enhancements

#### Adding More Weather Data

To add a new metric (e.g., cloudcover):

1. **Update weatherApi.js:**
   - Add 'cloudcover' to API parameters
   - Document what it returns

2. **Use in components:**
   ```javascript
   const weather = await getWeatherData(lat, lon);
   console.log(weather.current.cloudcover);  // Now available!
   ```

#### Adding More Storage

To save new data (e.g., favorite locations):

1. **Add new storage key:**
   ```javascript
   const FAVORITE_LOCATIONS = 'weather_favorites';
   ```

2. **Create save/load functions:**
   ```javascript
   export function saveFavorites(locations) {
     localStorage.setItem(FAVORITE_LOCATIONS, JSON.stringify(locations));
   }
   ```

---

## Summary

### What Each Utility Does

| Utility | Main Job | Key Functions | External Service |
|---------|----------|---------------|------------------|
| **weatherApi.js** | Get weather data | `getWeatherData()`, `getWeatherInfo()` | Open-Meteo Weather API |
| **locationApi.js** | Find places | `searchLocations()`, `getCurrentLocation()` | Open-Meteo Geocoding API |
| **storage.js** | Remember data | `saveCurrentLocation()`, `getCurrentLocation()` | Browser LocalStorage |

### Why This Architecture Works

1. **Separation of Concerns**
   - Each utility has ONE job
   - Easy to understand
   - Easy to modify

2. **Reusability**
   - Functions used by multiple components
   - No code duplication
   - Consistent behavior everywhere

3. **Maintainability**
   - Change API? Update one file
   - Add feature? Clear where to add it
   - Fix bug? Know exactly where to look

4. **Testability**
   - Each function can be tested independently
   - Mock API responses easily
   - Test error handling thoroughly

### Quick Reference

**Need to:**
- ❓ Get weather? → `weatherApi.js` → `getWeatherData()`
- ❓ Search cities? → `locationApi.js` → `searchLocations()`
- ❓ Save location? → `storage.js` → `saveCurrentLocation()`
- ❓ Load saved location? → `storage.js` → `getCurrentLocation()`
- ❓ Understand weather code? → `weatherApi.js` → `getWeatherInfo()`
- ❓ Format timestamp? → `weatherApi.js` → `formatTime()`

---

**Last Updated:** 2024  
**For More Info:** See full API documentation in `docs/API.md`