import React, { useState } from 'react';
import HourlyChart from './HourlyChart';
import { getWeatherInfo, getWindDirection, getUVCategory, formatTime } from '../utils/weatherAPI';

export default function DetailedWeatherView({ weatherData, location, onBack }) {
  const [activeTab, setActiveTab] = useState('hourly'); // 'hourly', 'daily', 'multiday'
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (!weatherData) return null;

  const { current, hourly, daily } = weatherData;
  const weatherInfo = getWeatherInfo(current.weathercode);

  return (
    <div className="min-h-screen bg-slate-900/50 backdrop-blur-lg">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-800/80 backdrop-blur-md border-b border-slate-700">
        <div className="p-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{location.name || location.displayName}</h1>
            <p className="text-slate-400 text-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 pb-3">
          <button
            onClick={() => setActiveTab('hourly')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
              activeTab === 'hourly'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Hourly weather
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
              activeTab === 'daily'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Daily weather
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {activeTab === 'hourly' && (
          <HourlyView
            current={current}
            hourly={hourly}
            daily={daily}
            weatherInfo={weatherInfo}
          />
        )}

        {activeTab === 'daily' && (
          <DailyView
            current={current}
            daily={daily}
            selectedDayIndex={selectedDayIndex}
            onSelectDay={setSelectedDayIndex}
          />
        )}
      </div>
    </div>
  );
}

// Hourly Tab View
function HourlyView({ current, hourly, daily, weatherInfo }) {
  const [metricTab, setMetricTab] = useState('temp'); // 'temp', 'uv', 'feels', 'wind'

  return (
    <>
      {/* Current Weather Card */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-6xl">{weatherInfo.icon}</span>
            <div>
              <div className="text-5xl font-bold text-white">
                {Math.round(current.temperature_2m)}°
              </div>
              <p className="text-slate-300 mt-1">
                {Math.round(daily.temperature_2m_max[0])}° / {Math.round(daily.temperature_2m_min[0])}°
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'temp', label: 'Actual temperature', icon: '🌡️' },
          { id: 'uv', label: 'UV index', icon: '☀️' },
          { id: 'feels', label: 'Feels like', icon: '🌡️' },
          { id: 'wind', label: 'Wind', icon: '💨' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMetricTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
              metricTab === tab.id
                ? 'bg-slate-700 text-white'
                : 'bg-slate-800/40 text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hourly Chart */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
        <HourlyChart hourlyData={hourly} currentTemp={current.temperature_2m} />
      </div>

      {/* Daily Comparison */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Daily comparison</h3>
        
        {daily.temperature_2m_max.length > 1 && (
          <>
            <p className="text-slate-300 text-sm mb-4">
              {Math.round(daily.temperature_2m_max[0]) > Math.round(daily.temperature_2m_max[1])
                ? 'Significantly higher temperature than yesterday.'
                : Math.round(daily.temperature_2m_max[0]) < Math.round(daily.temperature_2m_max[1])
                ? 'Significantly lower temperature than yesterday.'
                : 'Similar temperature to yesterday.'}
            </p>

            <div className="space-y-3">
              <TemperatureBar
                label="Today"
                min={Math.round(daily.temperature_2m_min[0])}
                max={Math.round(daily.temperature_2m_max[0])}
                current={Math.round(current.temperature_2m)}
              />
              <TemperatureBar
                label="Yesterday"
                min={Math.round(daily.temperature_2m_min[1])}
                max={Math.round(daily.temperature_2m_max[1])}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

// Daily Tab View
function DailyView({ current, daily, selectedDayIndex, onSelectDay }) {
  const selectedDay = {
    date: daily.time[selectedDayIndex],
    weathercode: daily.weathercode[selectedDayIndex],
    tempMax: daily.temperature_2m_max[selectedDayIndex],
    tempMin: daily.temperature_2m_min[selectedDayIndex],
    feelsMax: daily.apparent_temperature_max[selectedDayIndex],
    feelsMin: daily.apparent_temperature_min[selectedDayIndex],
    sunrise: daily.sunrise[selectedDayIndex],
    sunset: daily.sunset[selectedDayIndex],
    precipProb: daily.precipitation_probability_max[selectedDayIndex],
    windSpeed: daily.windspeed_10m_max[selectedDayIndex],
    uvIndex: daily.uv_index_max[selectedDayIndex],
  };

  const weatherInfo = getWeatherInfo(selectedDay.weathercode);
  const date = new Date(selectedDay.date);

  return (
    <>
      {/* Day Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onSelectDay(Math.max(0, selectedDayIndex - 1))}
          disabled={selectedDayIndex === 0}
          className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <p className="text-white font-semibold text-lg">
            {date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })}
          </p>
        </div>

        <button
          onClick={() => onSelectDay(Math.min(daily.time.length - 1, selectedDayIndex + 1))}
          disabled={selectedDayIndex === daily.time.length - 1}
          className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Summary Card */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 text-center">
        <span className="text-7xl block mb-4">{weatherInfo.icon}</span>
        <p className="text-4xl font-bold text-white mb-2">
          {Math.round(selectedDay.tempMin)}°~{Math.round(selectedDay.tempMax)}°
        </p>
        <p className="text-slate-300 mb-2">{weatherInfo.description}</p>
        <p className="text-slate-400 text-sm">
          {getWindDirection(0)} {Math.round(selectedDay.windSpeed)} km/h
        </p>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          label="Chance of precipitation"
          value={`${Math.round(selectedDay.precipProb)}%`}
        />
        <MetricCard
          label="Feels like"
          value={`${Math.round(selectedDay.feelsMin)}°~${Math.round(selectedDay.feelsMax)}°`}
        />
        <MetricCard
          label={getUVCategory(selectedDay.uvIndex)}
          sublabel="UV"
          value={Math.round(selectedDay.uvIndex)}
        />
        <MetricCard
          label="Humidity"
          value="50%"
        />
        <MetricCard
          label="Sunset"
          value={formatTime(selectedDay.sunset)}
        />
        <MetricCard
          label="Pressure"
          value={`${Math.round(current.surface_pressure)}hPa`}
        />
        <MetricCard
          label="Visibility"
          value="4km"
        />
      </div>
    </>
  );
}

// Helper Components
function TemperatureBar({ label, min, max, current }) {
  const range = 40; // Assume 40 degree range for visualization
  const minPos = ((min + 20) / range) * 100;
  const maxPos = ((max + 20) / range) * 100;
  const currentPos = current ? ((current + 20) / range) * 100 : null;

  return (
    <div className="flex items-center gap-4">
      <span className="text-white font-medium w-20">{label}</span>
      <span className="text-slate-400 w-10 text-right text-sm">{min}°</span>
      <div className="flex-1 h-2 bg-slate-700 rounded-full relative overflow-hidden">
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-orange-400"
          style={{
            left: `${minPos}%`,
            width: `${maxPos - minPos}%`,
          }}
        />
        {currentPos && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-green-500"
            style={{ left: `${currentPos}%`, transform: 'translate(-50%, -50%)' }}
          />
        )}
      </div>
      <span className="text-slate-400 w-10 text-sm">{max}°</span>
    </div>
  );
}

function MetricCard({ label, sublabel, value }) {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-slate-400 text-sm">{sublabel || label}</p>
      {sublabel && <p className="text-slate-500 text-xs">{label}</p>}
    </div>
  );
}