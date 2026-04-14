import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

async function dbCall(body: Record<string, unknown>) {
  try {
    const { data } = await supabase.functions.invoke("admin-data", { body });
    return data?.data || null;
  } catch (err) {
    console.error("DealerSettings DB call failed:", err);
    return null;
  }
}

const defaultSettings: DealerSettings = {
  monthlySalesTarget: 10,
  maxLabourRate: 75,
  maxPerClaimLimit: 2500,
  freeWarrantiesTotal: 5,
  freeWarrantiesUsed: 0,
  smartContributionMode: "recommend",
  lastRecommendationDate: null,
  dismissedRecommendationUntil: null,
};

function rowToSettings(r: any): DealerSettings {
  return {
    monthlySalesTarget: r.monthly_sales_target ?? 10,
    maxLabourRate: r.max_labour_rate ?? 75,
    maxPerClaimLimit: r.max_per_claim_limit ?? 2500,
    freeWarrantiesTotal: r.free_warranties_total ?? 5,
    freeWarrantiesUsed: r.free_warranties_used ?? 0,
    smartContributionMode: r.smart_contribution_mode || "recommend",
    lastRecommendationDate: r.last_recommendation_date || null,
    dismissedRecommendationUntil: r.dismissed_recommendation_until || null,
  };
}

// --- Global state ---
const settingsMap: Record<string, DealerSettings> = {};
const settingsDbIds: Record<string, string> = {};
const listeners: Array<() => void> = [];
const notify = () => listeners.forEach(l => l());

async function fetchSettings(dealerId: string): Promise<DealerSettings> {
  if (settingsMap[dealerId]) return settingsMap[dealerId];
  const rows = await dbCall({ table: "dealer_settings", action: "select", filters: { dealer_id: dealerId } });
  if (rows && rows.length > 0) {
    settingsMap[dealerId] = rowToSettings(rows[0]);
    settingsDbIds[dealerId] = rows[0].id;
  } else {
    settingsMap[dealerId] = { ...defaultSettings };
    // Create in DB
    const row = await dbCall({
      table: "dealer_settings", action: "insert",
      updates: {
        dealer_id: dealerId,
        monthly_sales_target: defaultSettings.monthlySalesTarget,
        max_labour_rate: defaultSettings.maxLabourRate,
        max_per_claim_limit: defaultSettings.maxPerClaimLimit,
        free_warranties_total: defaultSettings.freeWarrantiesTotal,
        free_warranties_used: defaultSettings.freeWarrantiesUsed,
        smart_contribution_mode: defaultSettings.smartContributionMode,
      },
    });
    if (row) settingsDbIds[dealerId] = row.id;
  }
  return settingsMap[dealerId];
}

function getSettings(dealerId: string): DealerSettings {
  if (!settingsMap[dealerId]) {
    // Return defaults synchronously, trigger async load
    settingsMap[dealerId] = { ...defaultSettings };
    fetchSettings(dealerId).then(() => notify());
  }
  return settingsMap[dealerId];
}

async function saveSettings(dealerId: string) {
  const s = settingsMap[dealerId];
  if (!s) return;
  const dbId = settingsDbIds[dealerId];
  if (dbId) {
    await dbCall({
      table: "dealer_settings", action: "update", id: dbId,
      updates: {
        monthly_sales_target: s.monthlySalesTarget,
        max_labour_rate: s.maxLabourRate,
        max_per_claim_limit: s.maxPerClaimLimit,
        free_warranties_total: s.freeWarrantiesTotal,
        free_warranties_used: s.freeWarrantiesUsed,
        smart_contribution_mode: s.smartContributionMode,
        last_recommendation_date: s.lastRecommendationDate,
        dismissed_recommendation_until: s.dismissedRecommendationUntil,
      },
    });
  }
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
    async updateSettings(dealerId: string, updates: Partial<DealerSettings>) {
      settingsMap[dealerId] = { ...getSettings(dealerId), ...updates };
      notify();
      await saveSettings(dealerId);
    },
    async useFreeWarranty(dealerId: string): Promise<boolean> {
      const s = getSettings(dealerId);
      if (s.freeWarrantiesUsed < s.freeWarrantiesTotal) {
        settingsMap[dealerId] = { ...s, freeWarrantiesUsed: s.freeWarrantiesUsed + 1 };
        notify();
        await saveSettings(dealerId);
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
    syncFreeWarrantyCount(dealerId: string, totalWarrantyCount: number) {
      const s = getSettings(dealerId);
      const correctUsed = Math.min(totalWarrantyCount, s.freeWarrantiesTotal);
      if (s.freeWarrantiesUsed !== correctUsed) {
        settingsMap[dealerId] = { ...s, freeWarrantiesUsed: correctUsed };
        saveSettings(dealerId);
      }
    },
  };
}
