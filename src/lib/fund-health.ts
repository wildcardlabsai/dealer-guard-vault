import { ShieldCheck, AlertTriangle } from "lucide-react";

export const DEFAULT_CLAIM_RATE = 0.15;
export const DEFAULT_AVG_CLAIM_COST = 450;
export const RECOMMENDED_MIN = 100;
export const RECOMMENDED_MAX = 150;

export function getEffectiveMetrics(warrantyCount: number, rawClaimRate: number, rawAvgClaimCost: number) {
  const useFallback = warrantyCount < 5;
  return {
    claimRate: useFallback ? DEFAULT_CLAIM_RATE : rawClaimRate,
    avgClaimCost: useFallback ? DEFAULT_AVG_CLAIM_COST : rawAvgClaimCost,
    usingFallback: useFallback,
  };
}

export function calcExposure(activeWarranties: number, claimRate: number, avgClaimCost: number) {
  return activeWarranties * claimRate * avgClaimCost;
}

export function calcHealthScore(
  buffer: number,
  exposure: number,
  contributionPerWarranty: number,
  claimRate: number,
  warrantyCount: number,
) {
  const bufferRatio = exposure > 0 ? buffer / exposure : (buffer >= 0 ? 1 : -1);
  const bufferPts = bufferRatio > 0.5 ? 40 : bufferRatio >= 0.2 ? 25 : bufferRatio >= 0 ? 10 : 0;
  const contribPts = contributionPerWarranty >= RECOMMENDED_MIN ? 25 : contributionPerWarranty >= 75 ? 15 : 5;
  const cr = claimRate * 100;
  const claimPts = cr < 15 ? 20 : cr <= 25 ? 15 : cr <= 35 ? 8 : 0;
  const dataPts = warrantyCount > 20 ? 15 : warrantyCount >= 10 ? 10 : 5;

  return {
    total: bufferPts + contribPts + claimPts + dataPts,
    breakdown: { bufferPts, contribPts, claimPts, dataPts },
  };
}

export function getScoreStatus(score: number) {
  if (score >= 80) return { label: "Healthy", key: "healthy" as const, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: ShieldCheck };
  if (score >= 60) return { label: "Stable", key: "stable" as const, color: "bg-primary/20 text-primary border-primary/30", icon: ShieldCheck };
  if (score >= 40) return { label: "Watch", key: "watch" as const, color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: AlertTriangle };
  return { label: "Risk", key: "risk" as const, color: "bg-destructive/20 text-destructive border-destructive/30", icon: AlertTriangle };
}

export function getScoreRingColor(score: number): string {
  if (score >= 80) return "hsl(160, 60%, 45%)";
  if (score >= 60) return "hsl(172, 66%, 40%)";
  if (score >= 40) return "hsl(38, 92%, 50%)";
  return "hsl(0, 72%, 51%)";
}
