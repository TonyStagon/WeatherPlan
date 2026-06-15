import { Crown, Lock, Check, Sparkles, LayoutGrid } from 'lucide-react';
import GlassCard from '../components/GlassCard';

type Props = { isPremium: boolean; onShowPremium: () => void };

const templates = [
  { id:'minimal', name:'Minimal Clean', desc:'Clean, distraction-free layout focused on temperature and key stats.', img:'https://images.pexels.com/photos/531756/pexels-photo-531756.jpeg', tags:['Minimal','Clean','Business'], premium:false, accent:'text-sky-400', bg:'from-slate-800 to-slate-900' },
  { id:'dark-glass', name:'Dark Glassmorphism', desc:'Premium dark glassmorphism with atmospheric backgrounds and frosted cards.', img:'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg', tags:['Dark','Glass','Modern'], premium:false, accent:'text-blue-400', bg:'from-blue-950 to-slate-950' },
  { id:'aurora', name:'Aurora Borealis', desc:'Vivid aurora-inspired gradients with dynamic color shifting throughout the UI.', img:'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg', tags:['Vibrant','Aurora','Dynamic'], premium:true, accent:'text-emerald-400', bg:'from-emerald-900 to-teal-950' },
  { id:'sunset', name:'Golden Sunset', desc:'Warm amber and orange tones that evoke the feel of a perfect sunset horizon.', img:'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg', tags:['Warm','Amber','Travel'], premium:true, accent:'text-amber-400', bg:'from-amber-900 to-orange-950' },
  { id:'arctic', name:'Arctic White', desc:'Crisp ice-and-white design with cool tones for winter destinations.', img:'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg', tags:['Light','Winter','Minimal'], premium:true, accent:'text-cyan-400', bg:'from-cyan-900 to-blue-950' },
  { id:'tropical', name:'Tropical Escape', desc:'Lush tropical greens and turquoise ocean blues for beach travel planning.', img:'https://images.pexels.com/photos/1544947/pexels-photo-1544947.jpeg', tags:['Tropical','Beach','Vibrant'], premium:true, accent:'text-green-400', bg:'from-green-900 to-teal-950' },
  { id:'urban', name:'Urban Nightscape', desc:'Sleek dark cityscape aesthetic perfect for metropolitan travel planning.', img:'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg', tags:['Urban','Night','City'], premium:true, accent:'text-violet-400', bg:'from-slate-900 to-gray-950' },
  { id:'sakura', name:'Sakura Spring', desc:'Delicate pink and rose tones inspired by Japanese cherry blossom season.', img:'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg', tags:['Spring','Soft','Japan'], premium:true, accent:'text-pink-400', bg:'from-pink-950 to-rose-950' },
];

function Preview({ t, locked }: { t: typeof templates[0]; locked: boolean }) {
  return (
    <div className={`relative h-44 rounded-t-2xl overflow-hidden bg-gradient-to-br ${t.bg}`}>
      <div className={`absolute inset-0 ${locked ? 'opacity-25' : 'opacity-45'}`} style={{ backgroundImage: `url(${t.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
      {/* Mock widget */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
            <p className="text-white/50 text-xs mb-0.5">Destination</p>
            <p className="text-white font-semibold text-sm">Bali, Indonesia</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
            <p className={`text-3xl font-black ${t.accent}`}>28°</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['Mon','Tue','Wed','Thu','Fri'].map((d, i) => (
            <div key={d} className="flex-1 bg-black/30 backdrop-blur-sm rounded-lg py-1.5 text-center border border-white/10">
              <p className="text-white/35 text-[9px]">{d}</p>
              <p className="text-white text-xs font-semibold">{[28,26,27,30,29][i]}°</p>
            </div>
          ))}
        </div>
      </div>
      {locked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-amber-500/20 border border-amber-400/40 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-amber-300 text-xs font-semibold">Premium Template</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Templates({ isPremium, onShowPremium }: Props) {
  const free = templates.filter(t => !t.premium);
  const premium = templates.filter(t => t.premium);

  return (
    <div className="min-h-screen pt-16 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-sky-500/20 border border-sky-400/30 rounded-xl flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Layout Templates</h1>
            <p className="text-white/45 text-sm">Choose a design style for your trip weather reports</p>
          </div>
        </div>

        {!isPremium && (
          <div className="mb-8 relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="relative bg-amber-500/15 border border-amber-400/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">Unlock All Premium Templates</h2>
                  <p className="text-white/55 text-sm">Get access to 6 exclusive templates for just $2/month.</p>
                </div>
              </div>
              <button onClick={onShowPremium} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 whitespace-nowrap flex-shrink-0">
                Upgrade — $2/mo
              </button>
            </div>
          </div>
        )}

        {/* Free */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xl font-bold text-white">Free Templates</h2>
            <span className="bg-emerald-500/15 border border-emerald-400/25 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-lg">{free.length} included</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {free.map(t => (
              <GlassCard key={t.id} className="overflow-hidden">
                <Preview t={t} locked={false} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="text-white font-semibold text-lg">{t.name}</h3>
                    <span className="bg-emerald-500/15 border border-emerald-400/25 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-lg ml-2 flex-shrink-0">Free</span>
                  </div>
                  <p className="text-white/45 text-sm mb-3">{t.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {t.tags.map(tag => <span key={tag} className="text-xs bg-white/8 border border-white/10 text-white/45 rounded-lg px-2 py-0.5">{tag}</span>)}
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium py-2.5 rounded-xl transition-all duration-200">
                    <Check className="w-4 h-4 text-emerald-400" /> Apply Template
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Premium */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xl font-bold text-white">Premium Templates</h2>
            <span className="bg-amber-500/15 border border-amber-400/25 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1">
              <Crown className="w-3 h-3" /> {premium.length} exclusive
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {premium.map(t => (
              <GlassCard key={t.id} className="overflow-hidden">
                <Preview t={t} locked={!isPremium} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-white font-semibold">{t.name}</h3>
                    <span className="bg-amber-500/15 border border-amber-400/25 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 ml-2 flex-shrink-0">
                      <Crown className="w-2.5 h-2.5" /> Pro
                    </span>
                  </div>
                  <p className="text-white/35 text-xs mb-3">{t.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {t.tags.map(tag => <span key={tag} className="text-xs bg-white/5 border border-white/10 text-white/35 rounded-lg px-2 py-0.5">{tag}</span>)}
                  </div>
                  {isPremium ? (
                    <button className="w-full flex items-center justify-center gap-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/25 text-amber-300 font-medium py-2.5 rounded-xl transition-all duration-200">
                      <Sparkles className="w-4 h-4" /> Apply Template
                    </button>
                  ) : (
                    <button onClick={onShowPremium} className="w-full flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/20 text-amber-300 font-medium py-2.5 rounded-xl transition-all duration-200">
                      <Lock className="w-4 h-4" /> Unlock with Premium
                    </button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
