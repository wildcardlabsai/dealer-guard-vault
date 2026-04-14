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

const settingsMap: Record<string, DealerSettings> = {};
const listeners: Array<() => void> = [];
const notify = () => listeners.forEach(l => l());

function getSettings(dealerId: string): DealerSettings {
  if (!settingsMap[dealerId]) {
    settingsMap[dealerId] = {
      monthlySalesTarget: 10,
      maxLabourRate: 75,
      maxPerClaimLimit: 2500,
      freeWarrantiesTotal: 5,
      freeWarrantiesUsed: 0,
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
  };
}
