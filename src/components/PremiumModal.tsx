import { X, Crown, Check } from 'lucide-react';

type Props = {
  onClose: () => void;
  onSubscribe: () => void;
  isLimitReached?: boolean;
};

const features = [
  'Unlimited trip weather plans',
  'All 6 premium design templates',
  '30-day extended weather forecasts',
  'Priority hotel & attraction recommendations',
  'Downloadable trip PDF reports',
];

export default function PremiumModal({ onClose, onSubscribe, isLimitReached = false }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={isLimitReached ? undefined : onClose} />
      <div className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        {!isLimitReached && (
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="p-8">
          <div className="text-center mb-7">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
              <Crown className="w-8 h-8 text-white" />
            </div>
            {isLimitReached ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">You've used all 5 free plans</h2>
                <p className="text-white/55 text-sm leading-relaxed">Upgrade to Premium to keep exploring destinations with unlimited trip weather reports.</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Unlock Premium</h2>
                <p className="text-white/55 text-sm leading-relaxed">Get unlimited access to trip planning, premium templates, and advanced weather insights.</p>
              </>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-center">
            <div className="flex items-end justify-center gap-1 mb-1">
              <span className="text-white/40 text-lg mb-1">$</span>
              <span className="text-5xl font-black text-white">2</span>
              <span className="text-white/40 text-sm mb-2">/month</span>
            </div>
            <p className="text-white/35 text-xs">Cancel anytime · No hidden fees · Instant access</p>
          </div>

          <ul className="space-y-3 mb-7">
            {features.map(f => (
              <li key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-emerald-500/20 border border-emerald-400/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-white/75 text-sm">{f}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={onSubscribe}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Premium — $2/month
          </button>

          {isLimitReached && (
            <button onClick={onClose} className="w-full mt-3 text-white/35 hover:text-white/55 text-sm py-2 transition-colors">
              Maybe later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
