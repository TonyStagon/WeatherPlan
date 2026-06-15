import { useState } from 'react';
import { MapPin, Wind, Droplets, Eye, Search, ArrowRight, TrendingUp } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { type Page } from '../components/Navbar';
import { currentLocationWeather, popularDestinations, WEATHER_ICONS, type WeatherCondition, type DailyForecast } from '../lib/mockData';

type Props = { onNavigate: (page: Page, destination?: string) => void };

function WeeklyChart({ weekly }: { weekly: DailyForecast[] }) {
  const temps = weekly.map(d => d.high);
  const min = Math.min(...temps), max = Math.max(...temps), range = max - min || 1;
  const pts = temps.map((t, i) => `${(i / (temps.length - 1)) * 100},${100 - ((t - min) / range) * 70 - 15}`);
  return (
    <div className="relative h-24 mt-1">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="dashChartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(251,191,36)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(251,191,36)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M ${pts.join(' L ')} L 100,100 L 0,100 Z`} fill="url(#dashChartGrad)" />
        <polyline points={pts.join(' ')} fill="none" stroke="rgb(251,191,36)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {weekly.map((_, i) => {
          const [x, y] = pts[i].split(',').map(Number);
          return <circle key={i} cx={x} cy={y} r="1.8" fill="rgb(251,191,36)" vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between pt-8">
        {weekly.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
            <span className="text-white/50 text-[10px]">{d.high}°</span>
            <span className="text-white/25 text-[9px]">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ onNavigate }: Props) {
  const [query, setQuery] = useState('');
  const w = currentLocationWeather;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) onNavigate('planner', query.trim());
  }

  return (
    <div className="min-h-screen pt-16 pb-24 md:pb-8">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: 420 }}>
        <div className="absolute inset-0 opacity-35" style={{ backgroundImage: `url(${w.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — main weather */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span className="text-white/65 text-sm">Current Location</span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-8xl font-black text-white leading-none tracking-tight">{w.currentTemp}°</p>
                  <p className="text-3xl font-light text-white/80 mt-1 capitalize">{w.condition.replace('_', ' ')}</p>
                  <p className="text-white/45 text-sm mt-1 max-w-xs">{w.description}</p>
                </div>
                <span className="text-7xl select-none mt-2">{WEATHER_ICONS[w.condition]}</span>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { icon: Wind, text: `${w.windSpeed} km/h ${w.windDirection}` },
                  { icon: Droplets, text: `${w.humidity}% humidity` },
                  { icon: Eye, text: `${w.visibility} km vis.` },
                  { icon: TrendingUp, text: `UV ${w.uvIndex} · ${w.airQuality}` },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-3 py-2">
                    <Icon className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-white/65 text-xs">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — H/L + weekly chart */}
            <GlassCard className="p-5">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-white/35 text-xs uppercase tracking-widest mb-1">Today</p>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-xl">H {w.high}°</span>
                    <span className="text-white/40 text-xl">L {w.low}°</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/35 text-xs">Feels like</p>
                  <p className="text-white font-semibold text-xl">{w.feelsLike}°</p>
                </div>
              </div>
              <WeeklyChart weekly={w.weekly} />
            </GlassCard>
          </div>

          {/* Hourly strip */}
          <div className="mt-5">
            <GlassCard className="p-5">
              <p className="text-white/35 text-xs uppercase tracking-widest mb-4">Today's Hourly Forecast</p>
              <div className="grid grid-cols-6 gap-2">
                {w.hourly.map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 bg-white/5 rounded-xl p-3">
                    <span className="text-white/40 text-xs">{h.time}</span>
                    <span className="text-2xl">{WEATHER_ICONS[h.condition]}</span>
                    <span className="text-white font-semibold text-sm">{h.temp}°</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Below hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Search */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Plan Your Next Trip</h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/35" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search a destination (e.g. Bali, Paris, Tokyo)..."
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-sky-400/50 focus:bg-white/15 transition-all duration-200"
              />
            </div>
            <button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-sky-500/20 flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>

        {/* Popular destinations */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">Popular Destinations</h2>
            <button onClick={() => onNavigate('planner')} className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors">
              Explore all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularDestinations.map(dest => (
              <GlassCard key={dest.name} hover onClick={() => onNavigate('planner', dest.name)} className="overflow-hidden">
                <div className="h-28 relative" style={{ backgroundImage: `url(${dest.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-white font-semibold text-sm">{dest.name}</p>
                    <p className="text-white/55 text-xs">{dest.country}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-lg px-1.5 py-0.5">
                    <span className="text-xs">{WEATHER_ICONS[dest.condition as WeatherCondition]}</span>
                    <span className="text-white text-xs font-semibold">{dest.temp}°</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* 7-day forecast */}
        <div>
          <h2 className="text-xl font-bold text-white mb-5">7-Day Forecast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {w.weekly.map((day, i) => (
              <GlassCard key={i} className="p-4 text-center">
                <p className="text-white/35 text-xs uppercase tracking-wide">{day.day}</p>
                <p className="text-white/25 text-[10px] mb-2">{day.date}</p>
                <div className="text-3xl mb-2">{WEATHER_ICONS[day.condition]}</div>
                <p className="text-white font-bold">{day.high}°</p>
                <p className="text-white/40 text-sm">{day.low}°</p>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400/60 rounded-full" style={{ width: `${day.precipitation}%` }} />
                </div>
                <p className="text-white/25 text-[10px] mt-1">{day.precipitation}%</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
