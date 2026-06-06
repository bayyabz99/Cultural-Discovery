'use client';

import React from 'react';
import { useAtlas, TabType } from '../context/AtlasContext';
import { Soundscape } from './Soundscape';
import { Globe, RefreshCw, Bookmark } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, bucketList } = useAtlas();

  const navItems = [
    { id: 'home' as TabType, label: 'Dijital Atlas', icon: Globe },
    { id: 'compare' as TabType, label: 'Kültür Kıyaslama', icon: RefreshCw },
    { id: 'bucket-list' as TabType, label: 'Keşif Listem', icon: Bookmark, badge: bucketList.length },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/[0.04] bg-[#050507]/40 backdrop-blur-md">
      {/* Brand logo */}
      <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setActiveTab('home')}>
        <span className="font-display text-xl font-bold tracking-[0.25em] text-white">
          VAGABOND
        </span>
        <span className="hidden sm:inline-block font-sans text-[8px] tracking-[0.3em] font-medium text-zinc-500 border border-zinc-800 rounded px-1.5 py-0.5 leading-none">
          CULTURAL ATLAS
        </span>
      </div>

      {/* Center Tabs */}
      <nav className="flex items-center gap-1 sm:gap-2 bg-zinc-950/60 p-1 rounded-full border border-white/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                isActive
                  ? 'bg-white text-zinc-950 shadow-lg'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center ${
                  isActive ? 'bg-zinc-950 text-white' : 'bg-pink-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Ambient Audio controller */}
      <div className="flex items-center">
        <Soundscape />
      </div>
    </header>
  );
};
export default Navbar;
