import { useState, useEffect } from "react";

interface DealerSettings {
  monthlySalesTarget: number;
  maxLabourRate: number;
  maxPerClaimLimit: number;
}

const settingsMap: Record<string, DealerSettings> = {};
const listeners: Array<() => void> = [];
const notify = () => listeners.forEach(l => l());

function getSettings(dealerId: string): DealerSettings {
  if (!settingsMap[dealerId]) {
    settingsMap[dealerId] = { monthlySalesTarget: 10, maxLabourRate: 75, maxPerClaimLimit: 2500 };
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
  };
}
