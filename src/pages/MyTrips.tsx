import { useEffect, useState } from 'react';
import { Bookmark, Trash2, MapPin, Calendar, ArrowRight, Plus } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { type Page } from '../components/Navbar';
import { getTrips, deleteTrip, getSessionId, type Trip } from '../lib/supabase';
import { WEATHER_ICONS, type WeatherCondition } from '../lib/mockData';

type Props = { onNavigate: (page: Page, destination?: string) => void };

export default function MyTrips({ onNavigate }: Props) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    getTrips(getSessionId())
      .then(setTrips)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    setDeleting(id);
    try { await deleteTrip(id); setTrips(p => p.filter(t => t.id !== id)); }
    catch { /* silent */ }
    finally { setDeleting(null); }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-sky-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p className="text-white/45 text-sm">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500/20 border border-sky-400/30 rounded-xl flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Saved Trips</h1>
              <p className="text-white/45 text-sm">{trips.length} trip{trips.length !== 1 ? 's' : ''} saved</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('planner')}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-sky-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Plan New Trip</span>
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-5">
              <MapPin className="w-8 h-8 text-white/20" />
            </div>
            <h2 className="text-white/45 text-xl font-semibold mb-2">No trips saved yet</h2>
            <p className="text-white/25 text-sm max-w-sm mb-6">Search a destination and click "Save Trip" to keep track of your travel plans here.</p>
            <button onClick={() => onNavigate('planner')} className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-xl">
              Plan your first trip <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map(trip => {
              const condition = (trip.weather_summary?.condition as WeatherCondition) ?? 'partly_cloudy';
              const temp = trip.weather_summary?.temp as number | undefined;
              const createdDate = new Date(trip.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const travelDate = trip.travel_date ? new Date(trip.travel_date + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null;
              return (
                <GlassCard key={trip.id} className="p-5 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/10 border border-white/15 rounded-2xl flex items-center justify-center text-2xl">
                        {WEATHER_ICONS[condition]}
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{trip.destination}</h3>
                        {temp !== undefined && <p className="text-sky-400 font-semibold">{temp}°C</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      disabled={deleting === trip.id}
                      className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-xl text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                    >
                      {deleting === trip.id
                        ? <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    {travelDate && (
                      <div className="flex items-center gap-2 text-white/45 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-sky-400" />
                        <span>Travel: <span className="text-white/65">{travelDate}</span></span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-white/30 text-xs">
                      <MapPin className="w-3.5 h-3.5" /><span>Saved {createdDate}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('planner', trip.destination)}
                    className="w-full flex items-center justify-center gap-2 bg-white/8 hover:bg-white/15 border border-white/15 text-white/65 hover:text-white font-medium py-2.5 rounded-xl transition-all duration-200 text-sm"
                  >
                    View Weather Report <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
