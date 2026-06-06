'use client';

import React from 'react';
import { useAtlas } from '../context/AtlasContext';
import { destinations, Destination } from '../data/destinations';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ArrowLeftRight, Check, AlertTriangle } from 'lucide-react';

export const CompareSection: React.FC = () => {
  const { compareIds, toggleCompare, clearCompare } = useAtlas();

  const selectedDests = destinations.filter((d) => compareIds.includes(d.id));

  // Determine standard months to render a clean calendar label
  const getMonthNames = (months: number[]) => {
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months.map(m => monthNames[m - 1]).join(', ');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pt-24 pb-12 min-h-screen text-zinc-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-wider text-white">
            KÜLTÜRLERİ KARŞILAŞTIRIN
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            İki farklı coğrafyanın yaşam ritmini, mutfak kültürünü ve yazılmamış kurallarını yan yana kıyaslayın.
          </p>
        </div>
        {compareIds.length > 0 && (
          <button
            onClick={clearCompare}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-xs font-semibold tracking-wide transition-all"
          >
            Seçimleri Temizle
          </button>
        )}
      </div>

      {/* STEP 1: If 2 destinations are not yet selected, show destination grid picker */}
      {selectedDests.length < 2 && (
        <div className="mb-12">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-pink-500/10 p-2.5 rounded-xl text-pink-400">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-zinc-100 uppercase tracking-wider">
                  Kıyaslama Listeniz ({selectedDests.length}/2)
                </h2>
                <p className="text-zinc-500 text-xs mt-0.5">
                  Karşılaştırmak istediğiniz iki bölgeyi aşağıdaki kartlardan seçin.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              {/* Selected Placeholders */}
              {[0, 1].map((index) => {
                const dest = selectedDests[index];
                return (
                  <div
                    key={index}
                    className={`w-32 h-16 rounded-xl border flex flex-col justify-center px-3 relative overflow-hidden transition-all duration-300 ${
                      dest
                        ? 'bg-zinc-900/60 border-pink-500/20'
                        : 'bg-zinc-950/40 border-white/5 border-dashed justify-center items-center'
                    }`}
                  >
                    {dest ? (
                      <>
                        <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest truncate">
                          {dest.place.split(' ')[0]}
                        </span>
                        <span className="text-xs font-semibold text-white truncate">
                          {dest.title}
                        </span>
                        <button
                          onClick={() => toggleCompare(dest.id)}
                          className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">
                        + Ekle
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => {
              const isSelected = compareIds.includes(dest.id);
              return (
                <div
                  key={dest.id}
                  onClick={() => toggleCompare(dest.id)}
                  className={`group relative h-48 rounded-2xl overflow-hidden border cursor-pointer transition-all duration-500 ${
                    isSelected
                      ? 'border-pink-500 shadow-[0_0_25px_rgba(244,114,182,0.15)] scale-[1.02]'
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  {/* Image Background */}
                  <img
                    src={dest.image}
                    alt={dest.place}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                  {/* Highlight bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
                    style={{ backgroundColor: dest.colorTheme.primary }}
                  />

                  {/* Card Content */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] tracking-widest font-bold text-pink-400 uppercase block mb-1">
                        {dest.place}
                      </span>
                      <h3 className="font-display text-lg font-bold text-white tracking-wider">
                        {dest.title} {dest.title2}
                      </h3>
                    </div>

                    <div className={`p-2 rounded-full transition-all duration-300 ${
                      isSelected ? 'bg-pink-500 text-white' : 'bg-black/60 border border-white/10 group-hover:bg-white group-hover:text-zinc-950'
                    }`}>
                      {isSelected ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: If 2 destinations are selected, show side-by-side comparison matrix */}
      {selectedDests.length === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {selectedDests.map((dest, i) => {
            return (
              <div
                key={dest.id}
                className="glass-panel rounded-3xl overflow-hidden border border-white/5 relative flex flex-col"
              >
                {/* Close/Remove button */}
                <button
                  onClick={() => toggleCompare(dest.id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-white/5"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Hero Header */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.place}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  
                  {/* Top accent color bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ backgroundColor: dest.colorTheme.primary }}
                  />

                  {/* Title overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[11px] tracking-[0.2em] font-bold text-pink-400 uppercase block mb-1">
                      {dest.place}
                    </span>
                    <h2 className="font-display text-3xl font-extrabold text-white tracking-widest uppercase">
                      {dest.title} <span className="block text-xl text-zinc-300 font-semibold">{dest.title2}</span>
                    </h2>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 flex-1 flex flex-col gap-6">
                  {/* Storytelling Quote */}
                  <div className="border-l-2 pl-4 py-1" style={{ borderColor: dest.colorTheme.primary }}>
                    <p className="italic text-zinc-300 text-sm font-medium">
                      {dest.localsStory.quote}
                    </p>
                    <span className="text-[10px] text-zinc-500 font-bold block mt-1">
                      — {dest.localsStory.author}, {dest.localsStory.role}
                    </span>
                  </div>

                  {/* Cultural Etiquette & Rules */}
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      Kültürel Kurallar & Görgü
                    </h4>
                    <div className="flex flex-col gap-3">
                      {dest.bentoWidgets.etiquette.map((rule, idx) => (
                        <div key={idx} className="bg-white/[0.01] border border-white/5 p-3.5 rounded-xl">
                          <h5 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dest.colorTheme.primary }} />
                            {rule.rule}
                          </h5>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed pl-3.5">
                            {rule.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Street Food */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="text-3xl bg-white/[0.03] w-12 h-12 rounded-xl flex items-center justify-center">
                      {dest.bentoWidgets.food.image}
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-500">
                        Popüler Sokak Lezzeti
                      </span>
                      <h4 className="text-xs font-bold text-zinc-200 mt-0.5">
                        {dest.bentoWidgets.food.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                        {dest.bentoWidgets.food.desc}
                      </p>
                    </div>
                  </div>

                  {/* Travel Calendar */}
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-500 block mb-1">
                      İdeal Seyahat Takvimi
                    </span>
                    <p className="text-xs font-semibold text-zinc-200">
                      {getMonthNames(dest.calendar.bestMonths)}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      {dest.calendar.reason}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
export default CompareSection;
