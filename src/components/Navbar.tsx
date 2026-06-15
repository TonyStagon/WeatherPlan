import { Compass, LayoutGrid, Map, Bookmark, Crown, Zap } from 'lucide-react';

export type Page = 'dashboard' | 'planner' | 'templates' | 'trips';

type Props = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  usageCount: number;
  isPremium: boolean;
  onUpgrade: () => void;
};

const FREE_LIMIT = 5;

const navItems: { id: Page; label: string; icon: typeof Compass }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Compass },
  { id: 'planner', label: 'Plan Trip', icon: Map },
  { id: 'trips', label: 'My Trips', icon: Bookmark },
  { id: 'templates', label: 'Templates', icon: LayoutGrid },
];

export default function Navbar({ currentPage, onNavigate, usageCount, isPremium, onUpgrade }: Props) {
  const remaining = Math.max(0, FREE_LIMIT - usageCount);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Voyage<span className="text-sky-400">AI</span></span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${currentPage === id ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {!isPremium && (
              <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5 border border-white/20">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-white/70"><span className="text-white font-semibold">{remaining}</span> plans left</span>
              </div>
            )}
            {isPremium ? (
              <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-xl px-3 py-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-amber-300 font-semibold">Premium</span>
              </div>
            ) : (
              <button
                onClick={onUpgrade}
                className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-sky-500/30"
              >
                <Crown className="w-3.5 h-3.5" />
                Upgrade
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${currentPage === id ? 'text-sky-400' : 'text-white/50 hover:text-white'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
