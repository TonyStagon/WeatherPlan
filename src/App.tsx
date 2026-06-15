import { useEffect, useState } from 'react';
import Navbar, { type Page } from './components/Navbar';
import PremiumModal from './components/PremiumModal';
import Dashboard from './pages/Dashboard';
import TripPlanner from './pages/TripPlanner';
import Templates from './pages/Templates';
import MyTrips from './pages/MyTrips';
import { getOrCreateSession, incrementUsage, activatePremium, getSessionId } from './lib/supabase';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [plannerDest, setPlannerDest] = useState<string | undefined>();
  const [usageCount, setUsageCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getOrCreateSession()
      .then(s => { setUsageCount(s.usage_count); setIsPremium(s.is_premium); })
      .catch(() => {
        const cached = localStorage.getItem('voyage_usage');
        if (cached) setUsageCount(parseInt(cached, 10));
      })
      .finally(() => setReady(true));
  }, []);

  async function handleUsageIncrement() {
    const next = usageCount + 1;
    setUsageCount(next);
    localStorage.setItem('voyage_usage', String(next));
    try { await incrementUsage(getSessionId()); } catch { /* local already updated */ }
  }

  async function handleSubscribe() {
    try { await activatePremium(getSessionId()); } catch { /* optimistic */ }
    setIsPremium(true);
    setShowPremium(false);
    setLimitReached(false);
  }

  function navigate(p: Page, dest?: string) {
    if (p === 'planner' && dest) setPlannerDest(dest);
    else if (p !== 'planner') setPlannerDest(undefined);
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openPremium(reached = false) {
    setLimitReached(reached);
    setShowPremium(true);
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0c4a6e 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-xl shadow-sky-500/30 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <p className="text-white/55 text-sm font-medium">Loading VoyageAI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1a2744 35%, #0c3a5e 65%, #0f172a 100%)' }}>
      <Navbar currentPage={page} onNavigate={navigate} usageCount={usageCount} isPremium={isPremium} onUpgrade={() => openPremium(false)} />

      {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
      {page === 'planner' && (
        <TripPlanner
          key={plannerDest ?? 'planner'}
          usageCount={usageCount}
          isPremium={isPremium}
          onUsageIncrement={handleUsageIncrement}
          onShowPremium={() => openPremium(usageCount >= 5)}
          initialDestination={plannerDest}
        />
      )}
      {page === 'templates' && <Templates isPremium={isPremium} onShowPremium={() => openPremium(false)} />}
      {page === 'trips' && <MyTrips onNavigate={navigate} />}

      {showPremium && (
        <PremiumModal onClose={() => setShowPremium(false)} onSubscribe={handleSubscribe} isLimitReached={limitReached} />
      )}
    </div>
  );
}
