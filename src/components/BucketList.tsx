'use client';

import React from 'react';
import { useAtlas } from '../context/AtlasContext';
import { destinations } from '../data/destinations';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, X, ArrowRight, Compass } from 'lucide-react';

export const BucketList: React.FC = () => {
  const { bucketList, toggleBucketList, setActiveId, setActiveTab } = useAtlas();

  const bookmarkedDests = destinations.filter((d) => bucketList.includes(d.id));

  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-24 pb-12 min-h-screen text-zinc-200">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold tracking-wider text-white flex items-center gap-3">
          <Bookmark className="w-7 h-7 text-pink-400 fill-current" />
          KEŞİF LİSTEM
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Kültürel derinliğine hayran kaldığınız, bir gün mutlaka yerinde deneyimlemek istediğiniz seyahat rotaları.
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {bookmarkedDests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto border border-white/5 flex flex-col items-center justify-center my-12"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 mb-6 shadow-inner">
              <Compass className="w-8 h-8 animate-spin-slow" />
            </div>
            
            <h3 className="text-lg font-bold text-zinc-200 uppercase tracking-wider">
              Listeniz Henüz Boş
            </h3>
            
            <p className="text-zinc-400 text-xs mt-2 leading-relaxed max-w-sm">
              Sitedeki ticari kaygıları unutup, tamamen kültürel dergimizi keşfedin ve beğendiğiniz noktaları bu panoya kaydedin.
            </p>

            <button
              onClick={() => setActiveTab('home')}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-white/5"
            >
              Atlasa Dön ve Keşfet
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {bookmarkedDests.map((dest) => (
              <motion.div
                key={dest.id}
                layoutId={`bucket-card-${dest.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel rounded-2xl overflow-hidden border border-white/5 relative flex flex-col h-80 group hover:border-white/10 transition-all duration-300"
              >
                {/* Remove Button */}
                <button
                  onClick={() => toggleBucketList(dest.id)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-white/5"
                  title="Listeden Kaldır"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Cover Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.place}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                  
                  {/* Category Accent */}
                  <span className="absolute bottom-3 left-4 text-[9px] font-bold tracking-widest text-pink-400 uppercase bg-zinc-950/80 px-2.5 py-1 rounded-full border border-white/5">
                    {dest.place}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white tracking-wider truncate">
                      {dest.title} {dest.title2}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveId(dest.id);
                      setActiveTab('home');
                    }}
                    className="mt-3 flex items-center justify-between w-full px-4 py-2 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-white/15 text-zinc-300 hover:text-white text-xs font-semibold tracking-wide transition-all"
                  >
                    <span>Detayları Keşfet</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
export default BucketList;
