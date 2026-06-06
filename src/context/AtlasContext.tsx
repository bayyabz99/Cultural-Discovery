'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type TabType = 'home' | 'explorer' | 'compare' | 'bucket-list';
export type MoodType = 'all' | 'nature' | 'mysterious' | 'urban' | 'culinary';

interface AtlasContextProps {
  activeId: string | null;
  prevActiveId: string | null;
  activeTab: TabType;
  moodFilter: MoodType;
  bucketList: string[];
  compareIds: string[];
  isPlayingSound: boolean;
  soundVolume: number;
  isDetailOpen: boolean;
  setActiveId: (id: string | null) => void;
  setActiveTab: (tab: TabType) => void;
  setMoodFilter: (mood: MoodType) => void;
  toggleBucketList: (id: string) => void;
  isInBucketList: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  toggleSound: () => void;
  setSoundVolume: (vol: number) => void;
  setIsDetailOpen: (open: boolean) => void;
}

const AtlasContext = createContext<AtlasContextProps | undefined>(undefined);

export const AtlasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const [prevActiveId, setPrevActiveId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [moodFilter, setMoodFilter] = useState<MoodType>('all');
  const [bucketList, setBucketList] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.3);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Load bucket list from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vagabond_bucket_list');
      if (stored) {
        try {
          setBucketList(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse bucket list', e);
        }
      }
    }
  }, []);

  const setActiveId = (id: string | null) => {
    setPrevActiveId(activeId);
    setActiveIdState(id);
    if (id) {
      setIsDetailOpen(true);
    } else {
      setIsDetailOpen(false);
    }
  };

  const toggleBucketList = (id: string) => {
    setBucketList((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem('vagabond_bucket_list', JSON.stringify(updated));
      return updated;
    });
  };

  const isInBucketList = (id: string) => {
    return bucketList.includes(id);
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        // limit to 2, replace the last one
        return [prev[0], id];
      }
      return [...prev, id];
    });
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  const toggleSound = () => {
    setIsPlayingSound((prev) => !prev);
  };

  return (
    <AtlasContext.Provider
      value={{
        activeId,
        prevActiveId,
        activeTab,
        moodFilter,
        bucketList,
        compareIds,
        isPlayingSound,
        soundVolume,
        isDetailOpen,
        setActiveId,
        setActiveTab,
        setMoodFilter,
        toggleBucketList,
        isInBucketList,
        toggleCompare,
        clearCompare,
        toggleSound,
        setSoundVolume,
        setIsDetailOpen,
      }}
    >
      {children}
    </AtlasContext.Provider>
  );
};

export const useAtlas = () => {
  const context = useContext(AtlasContext);
  if (!context) {
    throw new Error('useAtlas must be used within an AtlasProvider');
  }
  return context;
};
