'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAtlas } from '../context/AtlasContext';
import { destinations } from '../data/destinations';
import audioSynth from '../utils/audioSynth';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

export const Soundscape: React.FC = () => {
  const {
    activeId,
    isPlayingSound,
    soundVolume,
    toggleSound,
    setSoundVolume,
  } = useAtlas();

  const [activeSoundName, setActiveSoundName] = useState('Atmospheric Wind');
  const [sliderOpen, setSliderOpen] = useState(false);

  // Identify current destination soundscape type
  const activeDest = destinations.find((d) => d.id === activeId);
  const soundType = activeDest ? activeDest.soundType : 'mountain-wind';

  // Keep track of sound type names for visual display
  useEffect(() => {
    if (!activeDest) {
      setActiveSoundName('Genel Ambiyans (Rüzgar)');
    } else {
      const names: Record<string, string> = {
        'mountain-wind': 'Dağ Rüzgarı',
        'temple-bells': 'Tapınak Çanları',
        'desert-drone': 'Sahra Melodisi',
        'forest-birds': 'Orman Fısıltısı',
        'ocean-waves': 'Okyanus Dalgaları',
        'cave-resonance': 'Mağara Akustiği',
      };
      setActiveSoundName(names[activeDest.soundType] || 'Kültürel Ambiyans');
    }
  }, [activeId, activeDest]);

  // Synchronize audio state with synth
  useEffect(() => {
    if (audioSynth) {
      if (isPlayingSound) {
        audioSynth.start(soundType, soundVolume);
      } else {
        audioSynth.stop();
      }
    }
    return () => {
      if (audioSynth) {
        audioSynth.stop();
      }
    };
  }, [isPlayingSound, soundType, soundVolume]);

  return (
    <div
      className="relative flex items-center gap-3 px-3 py-1.5 rounded-full glass-panel hover:border-white/10 transition-all duration-300"
      data-cursor="listen"
    >
      {/* Equalizer-like Audio Waves Animation */}
      <div className="flex items-center gap-0.5 h-3.5 w-4 overflow-hidden">
        {[1, 2, 3, 4].map((bar) => (
          <span
            key={bar}
            className={`w-0.75 bg-pink-400 rounded-full transition-all origin-bottom`}
            style={{
              height: isPlayingSound ? '100%' : '25%',
              animation: isPlayingSound
                ? `bounce 1.${bar}s ease-in-out infinite alternate`
                : 'none',
              animationDelay: `${bar * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Track info (Hidden on small mobile) */}
      <div className="hidden sm:flex flex-col text-left">
        <span className="text-[9px] text-zinc-400 font-medium tracking-widest uppercase">
          AMBİYANS SESLERİ
        </span>
        <span className="text-[11px] text-zinc-200 font-bold font-sans line-clamp-1 w-28 leading-none mt-0.5">
          {activeSoundName}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Play / Pause */}
        <button
          onClick={toggleSound}
          className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors duration-200"
          title={isPlayingSound ? 'Sesi durdur' : 'Sesi başlat'}
        >
          {isPlayingSound ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
        </button>

        {/* Volume & Slide */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => setSliderOpen(true)}
          onMouseLeave={() => setSliderOpen(false)}
        >
          <button
            onClick={() => setSoundVolume(soundVolume === 0 ? 0.3 : 0)}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors duration-200"
          >
            {soundVolume === 0 ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Slider Overlay */}
          <div
            className={`flex items-center h-6 overflow-hidden transition-all duration-300 ease-out bg-[#0a0a0f] rounded-lg border border-white/5 absolute right-full mr-2 px-2 shadow-2xl ${
              sliderOpen ? 'w-24 opacity-100' : 'w-0 opacity-0 pointer-events-none'
            }`}
          >
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.05"
              value={soundVolume}
              onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
              className="w-20 h-1 accent-pink-400 cursor-pointer bg-zinc-800 rounded-lg appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Embedded CSS for bouncing keyframe */}
      <style jsx global>{`
        @keyframes bounce {
          0% {
            transform: scaleY(0.25);
          }
          100% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
};
export default Soundscape;
