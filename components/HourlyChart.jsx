import React, { useMemo } from 'react';
import { formatTime, getWeatherInfo } from '../utils/weatherAPI';

export default function HourlyChart({ hourlyData, currentTemp }) {
  // Take first 24 hours
  const hours = hourlyData.time.slice(0, 24);
  const temperatures = hourlyData.temperature_2m.slice(0, 24);
  const weatherCodes = hourlyData.weathercode.slice(0, 24);

  // Calculate chart dimensions
  const { minTemp, maxTemp, points, viewBox } = useMemo(() => {
    const min = Math.min(...temperatures);
    const max = Math.max(...temperatures);
    const padding = 5;
    const tempRange = max - min;

    // SVG dimensions
    const width = 600;
    const height = 200;
    const chartHeight = height - 40; // Leave space for labels

    // Calculate points for the curve
    const pts = temperatures.map((temp, index) => {
      const x = (index / (temperatures.length - 1)) * width;
      const y = chartHeight - ((temp - min + padding) / (tempRange + padding * 2)) * chartHeight;
      return { x, y, temp };
    });

    return {
      minTemp: min,
      maxTemp: max,
      points: pts,
      viewBox: `0 0 ${width} ${height}`,
    };
  }, [temperatures]);

  // Create SVG path for the curve
  const linePath = useMemo(() => {
    if (points.length === 0) return '';

    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      // Create smooth curve using quadratic bezier
      const cpX = (prev.x + curr.x) / 2;
      path += ` Q ${cpX} ${prev.y}, ${curr.x} ${curr.y}`;
    }

    return path;
  }, [points]);

  // Create area path for gradient fill
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';

    const path = linePath + ` L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`;
    return path;
  }, [linePath, points]);

  return (
    <div className="w-full">
      {/* Temperature Icons */}
      <div className="flex justify-between mb-2 px-4">
        {hours.map((time, index) => {
          if (index % 3 !== 0) return null; // Show every 3rd hour
          const weatherInfo = getWeatherInfo(weatherCodes[index]);
          return (
            <div key={time} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{weatherInfo.icon}</span>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={viewBox}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgb(34, 197, 94)', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: 'rgb(34, 197, 94)', stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#tempGradient)"
          />

          {/* Temperature line */}
          <path
            d={linePath}
            fill="none"
            stroke="rgb(34, 197, 94)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => {
            const isCurrent = index === 0;
            return (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isCurrent ? 6 : 0}
                  fill="white"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-3 px-4 text-slate-400 text-sm">
        {hours.map((time, index) => {
          if (index % 3 !== 0) return null; // Show every 3rd hour
          return (
            <div key={time} className="text-center">
              {formatTime(time)}
            </div>
          );
        })}
      </div>
    </div>
  );
}