import React from 'react';

/**
 * Animated weather backgrounds based on weather condition
 */
export default function WeatherBackground({ weatherCategory }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {weatherCategory === 'clear' && <ClearSky />}
      {weatherCategory === 'cloudy' && <CloudySky />}
      {weatherCategory === 'rain' && <RainEffect />}
      {weatherCategory === 'drizzle' && <DrizzleEffect />}
      {weatherCategory === 'snow' && <SnowEffect />}
      {weatherCategory === 'thunderstorm' && <ThunderstormEffect />}
      {weatherCategory === 'fog' && <FogEffect />}
    </div>
  );
}

// Clear/Sunny Background
function ClearSky() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600">
      <div className="absolute inset-0 opacity-30">
        <div className="sun-rays" />
      </div>
      <style jsx>{`
        .sun-rays {
          position: absolute;
          top: 20%;
          right: 20%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          animation: pulse 4s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

// Cloudy Background
function CloudySky() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600">
      <div className="clouds-container">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="cloud"
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${30 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        .clouds-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .cloud {
          position: absolute;
          width: 200px;
          height: 60px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 100px;
          animation: float-cloud linear infinite;
        }
        .cloud::before {
          content: '';
          position: absolute;
          width: 100px;
          height: 80px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 100px;
          top: -40px;
          left: 30px;
        }
        .cloud::after {
          content: '';
          position: absolute;
          width: 120px;
          height: 70px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 100px;
          top: -30px;
          right: 30px;
        }
        @keyframes float-cloud {
          from { transform: translateX(-200px); }
          to { transform: translateX(calc(100vw + 200px)); }
        }
      `}</style>
    </div>
  );
}

// Rain Effect
function RainEffect() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800">
      <div className="rain-container">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="raindrop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        .rain-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .raindrop {
          position: absolute;
          width: 2px;
          height: 50px;
          background: linear-gradient(to bottom, rgba(174, 194, 224, 0), rgba(174, 194, 224, 0.8));
          animation: fall linear infinite;
        }
        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
}

// Drizzle/Light Rain Effect
function DrizzleEffect() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700">
      <div className="drizzle-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="drizzle-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 1}s`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        .drizzle-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .drizzle-drop {
          position: absolute;
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, rgba(174, 194, 224, 0), rgba(174, 194, 224, 0.5));
          animation: fall-slow linear infinite;
        }
        @keyframes fall-slow {
          to {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
}

// Snow Effect
function SnowEffect() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500">
      <div className="snow-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              fontSize: `${10 + Math.random() * 10}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>
      <style jsx>{`
        .snow-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .snowflake {
          position: absolute;
          color: rgba(255, 255, 255, 0.8);
          animation: fall-snow linear infinite;
        }
        @keyframes fall-snow {
          0% {
            transform: translateY(-10px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

// Thunderstorm Effect
function ThunderstormEffect() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-black">
      <div className="rain-container">
        {[...Array(120)].map((_, i) => (
          <div
            key={i}
            className="raindrop-heavy"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1}s`,
              animationDuration: `${0.3 + Math.random() * 0.3}s`,
            }}
          />
        ))}
      </div>
      <div className="lightning" />
      <style jsx>{`
        .rain-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .raindrop-heavy {
          position: absolute;
          width: 2px;
          height: 60px;
          background: linear-gradient(to bottom, rgba(174, 194, 224, 0), rgba(174, 194, 224, 0.9));
          animation: fall-heavy linear infinite;
        }
        .lightning {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0);
          animation: flash 5s infinite;
        }
        @keyframes fall-heavy {
          to {
            transform: translateY(100vh);
          }
        }
        @keyframes flash {
          0%, 100% { background: rgba(255, 255, 255, 0); }
          10% { background: rgba(255, 255, 255, 0.7); }
          10.5% { background: rgba(255, 255, 255, 0); }
          11% { background: rgba(255, 255, 255, 0.9); }
          11.5% { background: rgba(255, 255, 255, 0); }
        }
      `}</style>
    </div>
  );
}

// Fog Effect
function FogEffect() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600">
      <div className="fog-container">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="fog-layer"
            style={{
              top: `${i * 20}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + i * 5}s`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        .fog-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .fog-layer {
          position: absolute;
          width: 200%;
          height: 100px;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0)
          );
          animation: drift-fog linear infinite;
        }
        @keyframes drift-fog {
          from { transform: translateX(-50%); }
          to { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
}