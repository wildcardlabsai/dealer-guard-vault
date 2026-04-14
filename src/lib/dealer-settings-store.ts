import { useState, useEffect } from "react";

export type SmartContributionMode = "off" | "recommend" | "auto";

export interface DealerSettings {
  monthlySalesTarget: number;
  maxLabourRate: number;
  maxPerClaimLimit: number;
  freeWarrantiesTotal: number;
  freeWarrantiesUsed: number;
  smartContributionMode: SmartContributionMode;
  lastRecommendationDate: string | null;
  dismissedRecommendationUntil: string | null;
}

const STORAGE_KEY = "wv_dealer_settings";

function loadSettingsMap(): Record<string, DealerSettings> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveSettingsMap() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsMap));
  } catch {}
}

const settingsMap: Record<string, DealerSettings> = loadSettingsMap();
const listeners: Array<() => void> = [];
const notify = () => { saveSettingsMap(); listeners.forEach(l => l()); };

function getSettings(dealerId: string): DealerSettings {
  if (!settingsMap[dealerId]) {
    settingsMap[dealerId] = {
      monthlySalesTarget: 10,
      maxLabourRate: 75,
      maxPerClaimLimit: 2500,
      freeWarrantiesTotal: 5,
      freeWarrantiesUsed: 0,
      smartContributionMode: "recommend",
      lastRecommendationDate: null,
      dismissedRecommendationUntil: null,
    };
  }
  return settingsMap[dealerId];
}

export function useDealerSettingsStore() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const fn = () => setTick(t => t + 1);
    listeners.push(fn);
    return () => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); };
  }, []);

  return {
    getSettings,
    updateSettings(dealerId: string, updates: Partial<DealerSettings>) {
      settingsMap[dealerId] = { ...getSettings(dealerId), ...updates };
      notify();
    },
    useFreeWarranty(dealerId: string): boolean {
      const s = getSettings(dealerId);
      if (s.freeWarrantiesUsed < s.freeWarrantiesTotal) {
        settingsMap[dealerId] = { ...s, freeWarrantiesUsed: s.freeWarrantiesUsed + 1 };
        notify();
        return true;
      }
      return false;
    },
    hasFreeWarranties(dealerId: string): boolean {
      const s = getSettings(dealerId);
      return s.freeWarrantiesUsed < s.freeWarrantiesTotal;
    },
    freeWarrantiesRemaining(dealerId: string): number {
      const s = getSettings(dealerId);
      return Math.max(0, s.freeWarrantiesTotal - s.freeWarrantiesUsed);
    },
    // Sync free warranty usage with actual warranty count
    syncFreeWarrantyCount(dealerId: string, totalWarrantyCount: number) {
      const s = getSettings(dealerId);
      const correctUsed = Math.min(totalWarrantyCount, s.freeWarrantiesTotal);
      if (s.freeWarrantiesUsed !== correctUsed) {
        settingsMap[dealerId] = { ...s, freeWarrantiesUsed: correctUsed };
        saveSettingsMap();
        // Don't trigger notify here to avoid render loops — caller re-renders anyway
      }
    },
  };
}
