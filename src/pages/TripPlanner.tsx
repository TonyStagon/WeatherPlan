import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Wind, Droplets, Eye, Zap, Shirt, Star, Hotel, ChevronRight, Bookmark, Check, ArrowLeft, Info } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { getDestinationData, WEATHER_ICONS, popularDestinations, type DestinationData, type WeatherCondition, type DailyForecast } from '../lib/mockData';
import { saveTrip, getSessionId } from '../lib/supabase';

const FREE_LIMIT = 5;

type Props = {
  usageCount: number;
  isPremium: boolean;
  onUsageIncrement: () => void;
  onShowPremium: () => void;
  initialDestination?: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
      ))}
      <span className="text-white/50 text-xs ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function WeeklyChart({ weekly }: { weekly: DailyForecast[] }) {
  const temps = weekly.map(d => d.high);
  const min = Math.min(...temps), max = Math.max(...temps), range = max - min || 1;
  const pts = temps.map((t, i) => `${(i / (temps.length - 1)) * 100},${100 - ((t - min) / range) * 70 - 15}`);
  return (
    <div className="relative h-20">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="planChartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(56,189,248)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgb(56,189,248)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M ${pts.join(' L ')} L 100,100 L 0,100 Z`} fill="url(#planChartGrad)" />
        <polyline points={pts.join(' ')} fill="none" stroke="rgb(56,189,248)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {weekly.map((_, i) => {
          const [x, y] = pts[i].split(',').map(Number);
          return <circle key={i} cx={x} cy={y} r="2" fill="rgb(56,189,248)" vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
    </div>
  );
}

type Tab = 'forecast' | 'outfits' | 'spots' | 'hotels';
const tabs: { id: Tab; label: string; icon: typeof Wind }[] = [
  { id: 'forecast', label: 'Forecast', icon: Wind },
  { id: 'outfits', label: 'Outfits', icon: Shirt },
  { id: 'spots', label: 'Top Spots', icon: MapPin },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
];

export default function TripPlanner({ usageCount, isPremium, onUsageIncrement, onShowPremium, initialDestination }: Props) {
  const [input, setInput] = useState(initialDestination ?? '');
  const [travelDate, setTravelDate] = useState('');
  const [report, setReport] = useState<DestinationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('forecast');

  const remaining = Math.max(0, FREE_LIMIT - usageCount);
  const isLimited = !isPremium && usageCount >= FREE_LIMIT;

  useEffect(() => {
    if (initialDestination) generate(initialDestination);
  }, []);

  async function generate(dest?: string) {
    const destination = (dest ?? input).trim();
    if (!destination) return;
    if (isLimited) { onShowPremium(); return; }
    setLoading(true); setSavedId(null); setReport(null);
    await new Promise(r => setTimeout(r, 800));
    setReport(getDestinationData(destination));
    setTab('forecast');
    setLoading(false);
    onUsageIncrement();
  }

  async function handleSave() {
    if (!report) return;
    try {
      const t = await saveTrip(getSessionId(), report.weather.destination, travelDate || null, { condition: report.weather.condition, temp: report.weather.currentTemp });
      setSavedId(t.id);
    } catch { /* silent */ }
  }

  return (
    <div className="min-h-screen pt-16 pb-24 md:pb-8 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Trip Weather Planner</h1>
          <p className="text-white/45">Search any destination to get a full weather report, outfit tips, and travel recommendations.</p>
        </div>

        {/* Usage bar */}
        {!isPremium && (
          <div className={`mb-6 flex items-center gap-3 p-4 rounded-2xl border ${isLimited ? 'bg-red-500/10 border-red-400/30' : remaining <= 2 ? 'bg-amber-500/10 border-amber-400/30' : 'bg-white/5 border-white/10'}`}>
            <Zap className={`w-4 h-4 flex-shrink-0 ${isLimited ? 'text-red-400' : remaining <= 2 ? 'text-amber-400' : 'text-sky-400'}`} />
            {isLimited ? (
              <p className="text-red-300 text-sm flex-1">You've used all 5 free plans. <button onClick={onShowPremium} className="text-red-200 underline">Upgrade to Premium</button> to continue.</p>
            ) : (
              <p className="text-white/55 text-sm flex-1">
                <span className={`font-semibold ${remaining <= 2 ? 'text-amber-300' : 'text-white'}`}>{remaining}</span> free plan{remaining !== 1 ? 's' : ''} remaining.
                {remaining <= 2 && <button onClick={onShowPremium} className="ml-1 text-amber-300 underline">Upgrade for unlimited</button>}
              </p>
            )}
            <div className="flex gap-1">
              {Array.from({ length: FREE_LIMIT }).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < usageCount ? 'bg-red-400' : 'bg-white/15'}`} />
              ))}
            </div>
          </div>
        )}

        {/* Search form */}
        <form onSubmit={e => { e.preventDefault(); generate(); }} className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/35" />
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter destination (e.g. Bali, Tokyo, Paris)..."
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-sky-400/50 focus:bg-white/15 transition-all duration-200"
            />
          </div>
          <div className="relative sm:w-52">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 pointer-events-none" />
            <input
              type="date"
              value={travelDate}
              onChange={e => setTravelDate(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pl-10 pr-4 py-4 text-white/65 focus:outline-none focus:border-sky-400/50 transition-all duration-200 [color-scheme:dark]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-sky-500/20 whitespace-nowrap"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Analyzing...
              </span>
            ) : 'Generate Report'}
          </button>
        </form>

        {/* Quick picks */}
        {!report && !loading && (
          <div>
            <p className="text-white/35 text-sm mb-3 flex items-center gap-2"><Info className="w-3.5 h-3.5" /> Quick picks</p>
            <div className="flex flex-wrap gap-2">
              {popularDestinations.map(d => (
                <button key={d.name} onClick={() => { setInput(d.name); generate(d.name); }}
                  className="flex items-center gap-2 bg-white/8 hover:bg-white/15 border border-white/15 rounded-xl px-4 py-2 text-white/65 hover:text-white text-sm transition-all duration-200">
                  <span>{WEATHER_ICONS[d.condition as WeatherCondition]}</span>{d.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
              <svg className="animate-spin w-8 h-8 text-sky-400" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            </div>
            <p className="text-white/55 text-sm">Fetching weather data for <span className="text-white font-semibold">{input}</span>...</p>
          </div>
        )}

        {/* Report */}
        {report && !loading && (
          <div className="space-y-6">
            {/* Hero */}
            <div className="relative rounded-3xl overflow-hidden" style={{ minHeight: 280 }}>
              <div className="absolute inset-0" style={{ backgroundImage: `url(${report.weather.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="relative p-8 flex items-end justify-between" style={{ minHeight: 280 }}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <span className="text-white/65 text-sm">{report.weather.destination}{report.weather.country ? `, ${report.weather.country}` : ''}</span>
                    {travelDate && <><span className="text-white/25">·</span><Calendar className="w-3.5 h-3.5 text-white/45" /><span className="text-white/45 text-sm">{new Date(travelDate + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></>}
                  </div>
                  <div className="flex items-end gap-4">
                    <span className="text-8xl font-black text-white leading-none">{report.weather.currentTemp}°</span>
                    <div className="mb-2">
                      <p className="text-2xl font-light text-white/80 capitalize">{report.weather.condition.replace('_', ' ')}</p>
                      <p className="text-white/45 text-sm mt-1 max-w-sm">{report.weather.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {[{ icon: Wind, t: `${report.weather.windSpeed} km/h` }, { icon: Droplets, t: `${report.weather.humidity}%` }, { icon: Eye, t: `UV ${report.weather.uvIndex}` }].map(({ icon: Icon, t }) => (
                      <div key={t} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/15">
                        <Icon className="w-3.5 h-3.5 text-sky-400" /><span className="text-white/65 text-xs">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="text-8xl hidden sm:block select-none">{WEATHER_ICONS[report.weather.condition as WeatherCondition]}</span>
              </div>
              <div className="absolute top-4 right-4">
                <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${savedId ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300' : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'}`}>
                  {savedId ? <><Check className="w-4 h-4" /> Saved</> : <><Bookmark className="w-4 h-4" /> Save Trip</>}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${tab === id ? 'bg-sky-500/20 border border-sky-400/40 text-sky-300' : 'bg-white/5 border border-white/10 text-white/45 hover:text-white hover:bg-white/10'}`}>
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === 'forecast' && (
              <div className="space-y-4">
                <GlassCard className="p-5">
                  <p className="text-white/35 text-xs uppercase tracking-widest mb-4">Hourly Forecast</p>
                  <div className="grid grid-cols-6 gap-2">
                    {report.weather.hourly.map((h, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 bg-white/5 rounded-xl p-3">
                        <span className="text-white/40 text-xs">{h.time}</span>
                        <span className="text-2xl">{WEATHER_ICONS[h.condition]}</span>
                        <span className="text-white font-semibold">{h.temp}°</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
                <GlassCard className="p-5">
                  <p className="text-white/35 text-xs uppercase tracking-widest mb-3">7-Day Forecast</p>
                  <WeeklyChart weekly={report.weather.weekly} />
                  <div className="space-y-2 mt-3">
                    {report.weather.weekly.map((day, i) => (
                      <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                        <span className="text-white/45 text-sm w-8">{day.day}</span>
                        <span className="text-white/25 text-xs w-16">{day.date}</span>
                        <span className="text-xl">{WEATHER_ICONS[day.condition]}</span>
                        <span className="text-white/50 text-xs flex-1 hidden sm:block truncate">{day.description}</span>
                        <div className="flex items-center gap-3 ml-auto">
                          <div className="flex items-center gap-1 text-xs text-blue-300">
                            <Droplets className="w-3 h-3" />{day.precipitation}%
                          </div>
                          <span className="text-white font-semibold text-sm w-10 text-right">{day.high}°</span>
                          <span className="text-white/40 text-sm w-8 text-right">{day.low}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}

            {tab === 'outfits' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.outfits.map((o, i) => (
                  <GlassCard key={i} className="p-5">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-xl mb-4">
                      {WEATHER_ICONS[report.weather.condition as WeatherCondition]}
                    </div>
                    <h3 className="text-white font-semibold mb-3">{o.occasion}</h3>
                    <ul className="space-y-1.5 mb-4">
                      {o.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-white/55">
                          <div className="w-1.5 h-1.5 bg-sky-400 rounded-full mt-1.5 flex-shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                    <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-3">
                      <p className="text-amber-300 text-xs leading-relaxed">💡 {o.tip}</p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {tab === 'spots' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.attractions.map((spot, i) => (
                  <GlassCard key={i} className="overflow-hidden">
                    <div className="h-40 relative" style={{ backgroundImage: `url(${spot.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
                        <span className="text-white/65 text-xs">{spot.type}</span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
                        <Stars rating={spot.rating} />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">{spot.name}</h3>
                      <p className="text-white/45 text-sm leading-relaxed mb-3">{spot.description}</p>
                      <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-400/20 rounded-lg px-3 py-1.5 w-fit">
                        <span>Best time:</span><span className="font-semibold">{spot.bestTime}</span>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {tab === 'hotels' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.hotels.map((hotel, i) => (
                  <GlassCard key={i} className="overflow-hidden">
                    <div className="h-40 relative" style={{ backgroundImage: `url(${hotel.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-0.5">
                        {Array.from({ length: hotel.stars }).map((_, j) => <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="bg-black/50 backdrop-blur-sm text-white/75 text-xs px-2 py-1 rounded-lg">{hotel.neighborhood}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-semibold text-sm">{hotel.name}</h3>
                        <div className="text-right ml-2 flex-shrink-0">
                          <p className="text-white font-bold">${hotel.pricePerNight}</p>
                          <p className="text-white/35 text-xs">/night</p>
                        </div>
                      </div>
                      <Stars rating={hotel.rating} />
                      <p className="text-white/30 text-xs mt-0.5 mb-3">{hotel.reviews.toLocaleString()} reviews</p>
                      <div className="flex flex-wrap gap-1.5">
                        {hotel.amenities.slice(0, 4).map(a => (
                          <span key={a} className="text-xs bg-white/8 border border-white/10 text-white/55 rounded-lg px-2 py-0.5">{a}</span>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button onClick={() => { setReport(null); setInput(''); setSavedId(null); }} className="flex items-center gap-2 text-white/45 hover:text-white text-sm transition-colors">
                <ArrowLeft className="w-4 h-4" /> Search another destination
              </button>
              {!isPremium && remaining === 0 && (
                <button onClick={onShowPremium} className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
                  Upgrade for unlimited <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
