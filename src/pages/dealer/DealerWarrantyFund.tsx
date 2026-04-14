import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWarrantyStore } from "@/lib/warranty-store";
import { useClaimStore } from "@/lib/claim-store";
import { useDealerSettingsStore, SmartContributionMode } from "@/lib/dealer-settings-store";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import {
  Wallet, TrendingUp, TrendingDown, ShieldCheck, AlertTriangle, Activity,
  Sparkles, Loader2, DollarSign, BarChart3, Target, ArrowUpRight, ArrowDownRight,
  Info, Zap, CheckCircle2, Clock, X, Eye, ChevronDown, ChevronUp, Settings2,
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, Area, AreaChart, ReferenceLine } from "recharts";
import { toast } from "sonner";

// ─── Fund Health Score Engine ───────────────────────────────────────
const DEFAULT_CLAIM_RATE = 0.15;
const DEFAULT_AVG_CLAIM_COST = 450;
const RECOMMENDED_MIN = 100;
const RECOMMENDED_MAX = 150;

function getEffectiveMetrics(warrantyCount: number, rawClaimRate: number, rawAvgClaimCost: number) {
  const useFallback = warrantyCount < 5;
  return {
    claimRate: useFallback ? DEFAULT_CLAIM_RATE : rawClaimRate,
    avgClaimCost: useFallback ? DEFAULT_AVG_CLAIM_COST : rawAvgClaimCost,
    usingFallback: useFallback,
  };
}

function calcExposure(activeWarranties: number, claimRate: number, avgClaimCost: number) {
  return activeWarranties * claimRate * avgClaimCost;
}

function calcHealthScore(
  buffer: number,
  exposure: number,
  contributionPerWarranty: number,
  claimRate: number,
  warrantyCount: number,
) {
  // 1. Buffer Strength (40%)
  const bufferRatio = exposure > 0 ? buffer / exposure : (buffer >= 0 ? 1 : -1);
  const bufferPts = bufferRatio > 0.5 ? 40 : bufferRatio >= 0.2 ? 25 : bufferRatio >= 0 ? 10 : 0;

  // 2. Contribution Level (25%)
  const contribPts = contributionPerWarranty >= RECOMMENDED_MIN ? 25
    : contributionPerWarranty >= 75 ? 15 : 5;

  // 3. Claim Rate Health (20%)
  const cr = claimRate * 100;
  const claimPts = cr < 15 ? 20 : cr <= 25 ? 15 : cr <= 35 ? 8 : 0;

  // 4. Data Confidence (15%)
  const dataPts = warrantyCount > 20 ? 15 : warrantyCount >= 10 ? 10 : 5;

  return {
    total: bufferPts + contribPts + claimPts + dataPts,
    breakdown: { bufferPts, contribPts, claimPts, dataPts },
  };
}

function getScoreStatus(score: number) {
  if (score >= 80) return { label: "Healthy", key: "healthy" as const, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: ShieldCheck };
  if (score >= 60) return { label: "Stable", key: "stable" as const, color: "bg-primary/20 text-primary border-primary/30", icon: ShieldCheck };
  if (score >= 40) return { label: "Watch", key: "watch" as const, color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: AlertTriangle };
  return { label: "Risk", key: "risk" as const, color: "bg-destructive/20 text-destructive border-destructive/30", icon: AlertTriangle };
}

function generateInsights(
  buffer: number,
  exposure: number,
  contributionPerWarranty: number,
  claimRate: number,
  warrantyCount: number,
  usingFallback: boolean,
): string[] {
  const insights: string[] = [];
  const bufferRatio = exposure > 0 ? buffer / exposure : 1;

  if (usingFallback) {
    insights.push("You have fewer than 5 warranties, so we're using industry averages for claim rate and cost estimates. These will become more accurate as you add more warranties.");
  }

  if (bufferRatio > 0.5) {
    insights.push("Your fund has a healthy buffer against expected claims. You're in a strong position.");
  } else if (bufferRatio >= 0) {
    insights.push("Your buffer is tight. A few unexpected claims could put pressure on your fund.");
  } else {
    insights.push("Your fund balance is below your estimated exposure. Consider increasing contributions or reviewing claim costs.");
  }

  if (contributionPerWarranty < 75) {
    insights.push("Your contribution level is well below the recommended £100–£150 range. Consider increasing it to build a stronger buffer.");
  } else if (contributionPerWarranty < RECOMMENDED_MIN) {
    insights.push("Your contribution level is slightly below the recommended £100–£150 range.");
  } else if (contributionPerWarranty > RECOMMENDED_MAX) {
    insights.push("Your contribution level is above the typical range — that's a strong position for managing risk.");
  }

  const cr = claimRate * 100;
  if (cr > 35) {
    insights.push("Your claim rate is significantly above average and may increase risk. Review which vehicles are generating the most claims.");
  } else if (cr > 25) {
    insights.push("Your claim rate is above average. Keep an eye on it and consider tightening your warranty terms.");
  } else if (cr < 15) {
    insights.push("Your claim rate is below average — that's a good sign for fund health.");
  }

  return insights;
}

// ─── Smart Contribution Recommendation Engine ──────────────────────
const SAFETY_MARGIN_LOW = 0.20;
const SAFETY_MARGIN_HIGH = 0.35;
const CONTRIB_FLOOR = 80;
const CONTRIB_CAP = 180;
const MIN_WARRANTIES_FOR_REC = 10;
const CHANGE_THRESHOLD_ABS = 10;
const CHANGE_THRESHOLD_PCT = 0.08;
const COOLDOWN_DAYS = 14;

interface ContribRecommendation {
  suggested: number;
  current: number;
  diff: number;
  reason: string;
  impactScoreBefore: number;
  impactScoreAfter: number;
  projected3MonthBuffer: number;
  exposureImpact: string;
}

function calcRecommendedContribution(avgClaimCost: number, claimRate: number): number {
  const base = avgClaimCost * claimRate;
  const withMargin = base * (1 + (SAFETY_MARGIN_LOW + SAFETY_MARGIN_HIGH) / 2);
  return Math.round(Math.min(CONTRIB_CAP, Math.max(CONTRIB_FLOOR, withMargin)));
}

function isChangeSignificant(current: number, suggested: number): boolean {
  const absDiff = Math.abs(suggested - current);
  const pctDiff = current > 0 ? absDiff / current : 1;
  return absDiff >= CHANGE_THRESHOLD_ABS || pctDiff >= CHANGE_THRESHOLD_PCT;
}

function shouldShowRecommendation(
  lastDate: string | null,
  dismissedUntil: string | null,
  healthStatus: string,
): boolean {
  const now = new Date();
  if (dismissedUntil && new Date(dismissedUntil) > now) return false;
  if (healthStatus === "watch" || healthStatus === "risk") return true;
  if (!lastDate) return true;
  const daysSince = (now.getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24);
  return daysSince >= COOLDOWN_DAYS;
}

function generateRecommendationReason(
  current: number,
  suggested: number,
  claimRate: number,
  avgClaimCost: number,
  buffer: number,
  exposure: number,
): string {
  if (suggested > current) {
    if (claimRate > 0.25) return "Your claim rate is above your previous trend — increasing your contribution helps absorb future claims.";
    if (avgClaimCost > 400) return "Your average claim cost has increased — a higher contribution keeps your buffer healthy.";
    if (buffer < exposure * 0.2) return "Your fund buffer is getting tight — this change would strengthen your safety net.";
    return "Based on your claim patterns, a small increase would improve your fund's resilience.";
  }
  if (buffer > exposure * 1.5) return "Your fund has a strong surplus — you could reduce contributions while staying safe.";
  return "Based on your current data, a slight adjustment could optimise your fund efficiency.";
}



function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color || "text-primary"}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold font-display">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

type FundInsight = {
  summary: string;
  recommendedMin: number;
  recommendedMax: number;
  riskAssessment: string;
  benchmarkInsight: string;
  actionItems: string[];
};

// ─── Main Component ─────────────────────────────────────────────────

export default function DealerWarrantyFund() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "d-1";
  const { warranties } = useWarrantyStore();
  const claimStore = useClaimStore();
  const dealerSettingsStore = useDealerSettingsStore();
  const dealerSettings = dealerSettingsStore.getSettings(dealerId);

  const dealerWarranties = warranties.filter(w => w.dealerId === dealerId);
  const allWarranties = warranties;
  const dealerClaims = claimStore.getClaimsForDealer(dealerId);
  const allClaims = claimStore.claims;

  // ── Core calculations ──
  const contributions = dealerWarranties.reduce((s, w) => s + w.cost, 0);
  const approvedClaims = dealerClaims.filter(c => ["approved", "partially_approved"].includes(c.status));
  const claimsPaid = approvedClaims.reduce((s, c) => s + (c.decision?.payoutAmount || 0), 0);
  const balance = contributions - claimsPaid;
  const rawAvgClaimCost = approvedClaims.length > 0 ? claimsPaid / approvedClaims.length : 0;
  const rawClaimRate = dealerWarranties.length > 0 ? dealerClaims.length / dealerWarranties.length : 0;
  const activeWarranties = dealerWarranties.filter(w => w.status === "active").length;
  const contributionPerWarranty = dealerWarranties.length > 0 ? contributions / dealerWarranties.length : 0;

  // Apply fallback logic
  const { claimRate, avgClaimCost, usingFallback } = getEffectiveMetrics(dealerWarranties.length, rawClaimRate, rawAvgClaimCost);

  // Exposure & buffer
  const exposure = calcExposure(activeWarranties, claimRate, avgClaimCost);
  const buffer = balance - exposure;

  // Fund Health Score
  const healthScore = useMemo(() =>
    calcHealthScore(buffer, exposure, contributionPerWarranty, claimRate, dealerWarranties.length),
    [buffer, exposure, contributionPerWarranty, claimRate, dealerWarranties.length]
  );
  const scoreStatus = getScoreStatus(healthScore.total);

  // Generated insights
  const localInsights = useMemo(() =>
    generateInsights(buffer, exposure, contributionPerWarranty, claimRate, dealerWarranties.length, usingFallback),
    [buffer, exposure, contributionPerWarranty, claimRate, dealerWarranties.length, usingFallback]
  );

  // Market benchmarks
  const marketContributions = allWarranties.reduce((s, w) => s + w.cost, 0);
  const marketWarrantyCount = allWarranties.length;
  const marketAvgContribution = marketWarrantyCount > 0 ? marketContributions / marketWarrantyCount : 0;
  const marketApprovedClaims = allClaims.filter(c => ["approved", "partially_approved"].includes(c.status));
  const marketClaimsPaid = marketApprovedClaims.reduce((s, c) => s + (c.decision?.payoutAmount || 0), 0);
  const marketAvgClaimCost = marketApprovedClaims.length > 0 ? marketClaimsPaid / marketApprovedClaims.length : 0;
  const marketClaimRate = marketWarrantyCount > 0 ? allClaims.length / marketWarrantyCount : 0;

  // Monthly trend data
  const monthlyData = useMemo(() => {
    const months: Record<string, { revenue: number; claims: number }> = {};
    dealerWarranties.forEach(w => {
      const m = w.createdAt.slice(0, 7);
      if (!months[m]) months[m] = { revenue: 0, claims: 0 };
      months[m].revenue += w.cost;
    });
    approvedClaims.forEach(c => {
      const m = c.createdAt.slice(0, 7);
      if (!months[m]) months[m] = { revenue: 0, claims: 0 };
      months[m].claims += c.decision?.payoutAmount || 0;
    });
    return Object.entries(months).sort().slice(-6).map(([month, d]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
      Revenue: d.revenue,
      Claims: d.claims,
      Profit: d.revenue - d.claims,
    }));
  }, [dealerWarranties, approvedClaims]);

  // Profit
  const totalProfit = contributions - claimsPaid;
  const profitPerWarranty = dealerWarranties.length > 0 ? totalProfit / dealerWarranties.length : 0;

  // ── Scenario simulator ──
  const [scenarioClaims, setScenarioClaims] = useState(1);
  const scenarioClaimsCost = scenarioClaims * avgClaimCost;
  const scenarioBalance = balance - scenarioClaimsCost;
  const scenarioExposure = calcExposure(activeWarranties, claimRate, avgClaimCost);
  const scenarioBuffer = scenarioBalance - scenarioExposure;
  const scenarioScore = calcHealthScore(scenarioBuffer, scenarioExposure, contributionPerWarranty, claimRate, dealerWarranties.length);
  const scenarioScoreStatus = getScoreStatus(scenarioScore.total);

  // Contribution slider
  const [sliderValue, setSliderValue] = useState([Math.round(contributionPerWarranty) || 100]);

  // Smart Contribution Recommendation
  const [showReviewLogic, setShowReviewLogic] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const recommendation = useMemo<ContribRecommendation | null>(() => {
    if (dealerSettings.smartContributionMode === "off") return null;
    if (dealerWarranties.length < MIN_WARRANTIES_FOR_REC) return null;
    if (!shouldShowRecommendation(dealerSettings.lastRecommendationDate, dealerSettings.dismissedRecommendationUntil, scoreStatus.key)) return null;

    const suggested = calcRecommendedContribution(avgClaimCost, claimRate);
    const current = Math.round(contributionPerWarranty);
    if (!isChangeSignificant(current, suggested)) return null;

    const afterScore = calcHealthScore(buffer, exposure, suggested, claimRate, dealerWarranties.length);
    const monthlyNewWarranties = Math.max(1, Math.round(dealerWarranties.length / 6));
    const projected3MonthBuffer = buffer + (suggested - current) * monthlyNewWarranties * 3 - (exposure * 0.25);

    return {
      suggested,
      current,
      diff: suggested - current,
      reason: generateRecommendationReason(current, suggested, claimRate, avgClaimCost, buffer, exposure),
      impactScoreBefore: healthScore.total,
      impactScoreAfter: afterScore.total,
      projected3MonthBuffer: Math.round(projected3MonthBuffer),
      exposureImpact: suggested > current ? "Stronger buffer against future claims" : "Optimised contributions with maintained safety",
    };
  }, [dealerWarranties.length, dealerSettings, scoreStatus.key, avgClaimCost, claimRate, contributionPerWarranty, buffer, exposure, healthScore.total]);

  // Projection chart data (3 months)
  const projectionData = useMemo(() => {
    const monthlyNewWarranties = Math.max(1, Math.round(dealerWarranties.length / 6));
    const monthlyClaimsCost = monthlyNewWarranties * claimRate * avgClaimCost;
    const currentContrib = Math.round(contributionPerWarranty) || 100;
    const suggestedContrib = recommendation?.suggested || currentContrib;
    const months = ["Now", "Month 1", "Month 2", "Month 3"];
    let currentPath = balance;
    let adjustedPath = balance;
    return months.map((month, i) => {
      if (i > 0) {
        currentPath += (currentContrib * monthlyNewWarranties) - monthlyClaimsCost;
        adjustedPath += (suggestedContrib * monthlyNewWarranties) - monthlyClaimsCost;
      }
      return {
        month,
        Current: Math.round(currentPath),
        Adjusted: Math.round(adjustedPath),
      };
    });
  }, [balance, contributionPerWarranty, recommendation, dealerWarranties.length, claimRate, avgClaimCost]);

  const [recApplied, setRecApplied] = useState(false);

  const handleApplyRecommendation = () => {
    if (!recommendation) return;
    dealerSettingsStore.updateSettings(dealerId, { lastRecommendationDate: new Date().toISOString() });
    setSliderValue([recommendation.suggested]);
    setRecApplied(true);
    toast.success(`Contribution updated to £${recommendation.suggested} per warranty`);
  };

  const handleDismiss = () => {
    dealerSettingsStore.updateSettings(dealerId, { lastRecommendationDate: new Date().toISOString() });
  };

  const handleRemindLater = () => {
    const remind = new Date();
    remind.setDate(remind.getDate() + 7);
    dealerSettingsStore.updateSettings(dealerId, { dismissedRecommendationUntil: remind.toISOString() });
    toast.info("We'll remind you in 7 days");
  };

  // AI insight
  const [insight, setInsight] = useState<FundInsight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const fetchInsight = async () => {
    setLoadingInsight(true);
    try {
      const { data, error } = await supabase.functions.invoke("warranty-fund-insight", {
        body: {
          contributions, claimsPaid, balance, avgClaimCost: Math.round(avgClaimCost),
          claimRate, activeWarranties, warrantyCount: dealerWarranties.length,
          contributionPerWarranty: Math.round(contributionPerWarranty),
          marketAvgContribution: Math.round(marketAvgContribution),
          marketAvgClaimRate: marketClaimRate,
          marketAvgClaimCost: Math.round(marketAvgClaimCost),
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setInsight(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to get AI insight");
    } finally {
      setLoadingInsight(false);
    }
  };

  // Benchmark helper
  const BenchmarkRow = ({ label, yours, market, unit = "£" }: { label: string; yours: number; market: number; unit?: string }) => {
    const diff = yours - market;
    const pctDiff = market > 0 ? (diff / market) * 100 : 0;
    const isAbove = diff > 0;
    const badge = Math.abs(pctDiff) < 10 ? "On Par" : isAbove ? "Above" : "Below";
    const badgeColor = badge === "On Par" ? "bg-emerald-500/20 text-emerald-400" : badge === "Above" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400";
    const format = (v: number) => unit === "%" ? `${(v * 100).toFixed(1)}%` : `${unit}${Math.round(v)}`;
    return (
      <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold">{format(yours)}</p>
            <p className="text-xs text-muted-foreground">vs {format(market)}</p>
          </div>
          <Badge variant="outline" className={`text-[10px] ${badgeColor}`}>
            {badge === "On Par" ? null : isAbove ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {badge}
          </Badge>
        </div>
      </div>
    );
  };

  // Score color helper
  const scoreColor = healthScore.total >= 80 ? "text-emerald-400" : healthScore.total >= 60 ? "text-primary" : healthScore.total >= 40 ? "text-amber-400" : "text-destructive";
  const scoreProgressColor = healthScore.total >= 80 ? "[&>div]:bg-emerald-500" : healthScore.total >= 60 ? "[&>div]:bg-primary" : healthScore.total >= 40 ? "[&>div]:bg-amber-500" : "[&>div]:bg-destructive";
  const borderColor = healthScore.total >= 80 ? "hsl(142 76% 36%)" : healthScore.total >= 60 ? "hsl(var(--primary))" : healthScore.total >= 40 ? "#f59e0b" : "hsl(var(--destructive))";

  const [activeTab, setActiveTab] = useState<"fund" | "profit">("fund");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Warranty Fund</h1>
          <p className="text-sm text-muted-foreground">Financial overview of your self-funded warranty programme</p>
        </div>
        <div className="flex gap-1 bg-muted/30 rounded-lg p-1">
          <button className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "fund" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setActiveTab("fund")}>Fund</button>
          <button className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "profit" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setActiveTab("profit")}>Profit</button>
        </div>
      </div>

      {activeTab === "fund" && (
        <div className="space-y-6">
          {/* Hero: Fund Health Score */}
          <div className="glass-card rounded-xl p-6 border-l-4" style={{ borderLeftColor: borderColor }}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Fund Health Score</p>
                <div className="flex items-baseline gap-3 mb-2">
                  <p className={`text-5xl font-bold font-display ${scoreColor}`}>{healthScore.total}</p>
                  <span className="text-lg text-muted-foreground font-medium">/ 100</span>
                </div>
                <Progress value={healthScore.total} className={`h-2 mb-3 ${scoreProgressColor}`} />
                <Badge variant="outline" className={`${scoreStatus.color} flex items-center gap-1.5 text-sm px-3 py-1.5 w-fit`}>
                  <scoreStatus.icon className="w-4 h-4" />
                  {scoreStatus.label}
                </Badge>
              </div>
              <div className="sm:text-right">
                <p className="text-sm text-muted-foreground mb-1">Fund Balance</p>
                <p className="text-3xl font-bold font-display">£{balance.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Buffer: <span className={buffer < 0 ? "text-destructive font-medium" : ""}>£{Math.round(buffer).toLocaleString()}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Exposure: £{Math.round(exposure).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold font-display mb-4">Score Breakdown</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Buffer Strength", pts: healthScore.breakdown.bufferPts, max: 40, desc: exposure > 0 ? `Ratio: ${(buffer / exposure).toFixed(2)}` : "No exposure" },
                { label: "Contribution Level", pts: healthScore.breakdown.contribPts, max: 25, desc: `£${Math.round(contributionPerWarranty)} per warranty` },
                { label: "Claim Rate", pts: healthScore.breakdown.claimPts, max: 20, desc: `${(claimRate * 100).toFixed(1)}%` },
                { label: "Data Confidence", pts: healthScore.breakdown.dataPts, max: 15, desc: `${dealerWarranties.length} warranties` },
              ].map(item => (
                <div key={item.label} className="p-4 rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-semibold">{item.pts}/{item.max}</span>
                  </div>
                  <Progress value={(item.pts / item.max) * 100} className={`h-1.5 ${scoreProgressColor}`} />
                  <p className="text-xs text-muted-foreground mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard icon={TrendingUp} label="Total Contributions" value={`£${contributions.toLocaleString()}`} />
            <StatCard icon={TrendingDown} label="Claims Paid" value={`£${claimsPaid.toLocaleString()}`} color="text-destructive" />
            <StatCard icon={Activity} label="Active Warranties" value={activeWarranties.toString()} />
            <StatCard icon={BarChart3} label="Claim Rate" value={`${(claimRate * 100).toFixed(1)}%`} sub={usingFallback ? "Industry estimate" : undefined} />
            <StatCard icon={DollarSign} label="Avg Claim Cost" value={`£${Math.round(avgClaimCost).toLocaleString()}`} sub={usingFallback ? "Industry estimate" : undefined} />
          </div>

          {/* Fallback notice */}
          {usingFallback && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-300/90">
                With fewer than 5 warranties, we're using industry averages (15% claim rate, £450 avg cost) for estimates. These will update automatically as you sell more warranties.
              </p>
            </div>
          )}

          {/* Insights */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold font-display mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Insights
            </h2>
            <div className="space-y-3">
              {localInsights.map((text, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ Smart Contribution Adjustment — Premium Section ═══ */}
          <div className="relative mt-10 -mx-2 sm:-mx-4 lg:-mx-6">
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card/80 to-card overflow-hidden shadow-2xl shadow-primary/5">
              {/* Top accent line */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              <div className="p-6 sm:p-8 lg:p-10">
                {/* Header — full width */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-display">Smart Contribution Adjustment</h2>
                      <p className="text-sm text-muted-foreground">AI-powered recommendation based on your claims, fund performance, and risk level</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {recommendation && !recApplied ? (
                      <Badge className="bg-primary/15 text-primary border-primary/30 shadow-sm shadow-primary/20 animate-fade-in px-3 py-1">
                        <Zap className="w-3 h-3 mr-1" /> New Recommendation
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground border-border/40 px-3 py-1">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Up to date
                      </Badge>
                    )}
                    <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-lg hover:bg-muted/40 transition-colors" title="Smart settings">
                      <Settings2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Settings Panel (collapsible) */}
                {showSettings && (
                  <div className="mb-8 p-5 rounded-xl bg-muted/10 border border-border/20 animate-fade-in">
                    <p className="text-sm font-semibold mb-3">Smart Contribution Mode</p>
                    <RadioGroup
                      value={dealerSettings.smartContributionMode}
                      onValueChange={(v) => dealerSettingsStore.updateSettings(dealerId, { smartContributionMode: v as SmartContributionMode })}
                      className="gap-3"
                    >
                      {[
                        { value: "off", label: "Off", desc: "No recommendations shown" },
                        { value: "recommend", label: "Recommend Only", desc: "Show suggestions — you decide" },
                        { value: "auto", label: "Auto Apply", desc: "Apply automatically with a confirm prompt" },
                      ].map(opt => (
                        <div key={opt.value} className="flex items-start gap-3">
                          <RadioGroupItem value={opt.value} id={`scm-${opt.value}`} className="mt-0.5" />
                          <Label htmlFor={`scm-${opt.value}`} className="cursor-pointer">
                            <span className="text-sm font-medium">{opt.label}</span>
                            <p className="text-xs text-muted-foreground">{opt.desc}</p>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Content States */}
                {dealerSettings.smartContributionMode === "off" ? (
                  <div className="text-center py-12">
                    <Settings2 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Smart recommendations are turned off.</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowSettings(true)}>Enable Recommendations</Button>
                  </div>
                ) : dealerWarranties.length < MIN_WARRANTIES_FOR_REC ? (
                  <div className="text-center py-12">
                    <Clock className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="font-medium">We need more warranty data before making a recommendation.</p>
                    <p className="text-sm text-muted-foreground mt-1">You have {dealerWarranties.length} warranties — we need at least {MIN_WARRANTIES_FOR_REC}.</p>
                    <Progress value={(dealerWarranties.length / MIN_WARRANTIES_FOR_REC) * 100} className="h-1.5 max-w-xs mx-auto mt-4 [&>div]:bg-primary" />
                  </div>
                ) : recommendation && !recApplied ? (
                  <div className="grid lg:grid-cols-5 gap-8">
                    {/* LEFT SIDE (60%) */}
                    <div className="lg:col-span-3 space-y-6">
                      {/* 1. Contribution Comparison */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0">
                        <div className="flex-1 p-5 rounded-xl bg-muted/15 border border-border/20 text-center">
                          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Current</p>
                          <p className="text-4xl font-bold font-display">£{recommendation.current}</p>
                          <p className="text-xs text-muted-foreground mt-1">per warranty</p>
                        </div>
                        <div className="flex sm:flex-col items-center justify-center px-4 py-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${recommendation.diff > 0 ? "bg-primary/15 text-primary" : "bg-emerald-500/15 text-emerald-400"}`}>
                            {recommendation.diff > 0 ? "+" : ""}£{Math.abs(recommendation.diff)}
                          </div>
                        </div>
                        <div className="flex-1 p-5 rounded-xl bg-primary/[0.08] border border-primary/25 text-center ring-1 ring-primary/10">
                          <p className="text-xs text-primary mb-1 uppercase tracking-wider font-medium">Recommended</p>
                          <p className="text-4xl font-bold font-display text-primary">£{recommendation.suggested}</p>
                          <p className="text-xs text-muted-foreground mt-1">per warranty</p>
                        </div>
                      </div>

                      {/* 2. Impact Preview */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 rounded-xl bg-muted/10 border border-border/15">
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Fund Health</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-2xl font-bold">{recommendation.impactScoreBefore}</span>
                            <ArrowUpRight className="w-4 h-4 text-primary" />
                            <span className="text-2xl font-bold text-primary">{recommendation.impactScoreAfter}</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-muted/10 border border-border/15">
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">3-Month Buffer</p>
                          <p className={`text-2xl font-bold ${recommendation.projected3MonthBuffer >= 0 ? "text-primary" : "text-destructive"}`}>
                            +£{Math.abs(recommendation.projected3MonthBuffer).toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-muted/10 border border-border/15">
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Risk Level</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold">{scoreStatus.label}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                            <span className="text-sm font-semibold text-primary">{getScoreStatus(recommendation.impactScoreAfter).label}</span>
                          </div>
                        </div>
                      </div>

                      {/* 3. Reasoning Block */}
                      <div className="p-5 rounded-xl bg-muted/[0.07] border border-border/15 space-y-3">
                        <p className="text-sm font-semibold flex items-center gap-2">
                          <Info className="w-4 h-4 text-primary" /> Why this is recommended
                        </p>
                        <div className="space-y-2">
                          {[
                            recommendation.reason,
                            claimRate > 0.15 ? `Your claim rate is ${(claimRate * 100).toFixed(0)}%, above the 15% baseline` : null,
                            avgClaimCost > 400 ? `Average claim cost (£${Math.round(avgClaimCost)}) is above your recent baseline` : null,
                            contributionPerWarranty < RECOMMENDED_MIN ? "Your current contribution is below the recommended range" : null,
                          ].filter(Boolean).map((text, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                              <span className="text-muted-foreground">{text}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground/70 pt-1 border-t border-border/10">
                          Most UK dealers set aside £100–£150 per warranty
                        </p>
                      </div>

                      {/* Review Logic (expandable) */}
                      {showReviewLogic && (
                        <div className="p-4 rounded-xl bg-muted/[0.05] border border-border/10 space-y-2 text-sm animate-fade-in">
                          <p className="font-medium flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> Calculation breakdown</p>
                          <p className="text-muted-foreground">Recommended = (Avg Claim Cost × Claim Rate) + Safety Margin</p>
                          <p className="text-muted-foreground">= (£{Math.round(avgClaimCost)} × {(claimRate * 100).toFixed(1)}%) + ~27.5% margin</p>
                          <p className="text-muted-foreground">= £{Math.round(avgClaimCost * claimRate)} + £{Math.round(avgClaimCost * claimRate * 0.275)} = £{recommendation.suggested}</p>
                          <p className="text-xs text-muted-foreground/60 mt-2">Clamped to £{CONTRIB_FLOOR}–£{CONTRIB_CAP}. Threshold: ≥£{CHANGE_THRESHOLD_ABS} or ≥{CHANGE_THRESHOLD_PCT * 100}%.</p>
                        </div>
                      )}

                      {/* 4. Actions */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button onClick={handleApplyRecommendation} size="lg" className="bg-[hsl(var(--cta))] hover:bg-[hsl(var(--cta))]/90 text-[hsl(var(--cta-foreground))] shadow-lg shadow-[hsl(var(--cta))]/20">
                          <CheckCircle2 className="w-4 h-4 mr-1.5" /> Apply Recommendation
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowReviewLogic(!showReviewLogic)}>
                          <Eye className="w-4 h-4 mr-1" /> {showReviewLogic ? "Hide" : "Review"} Logic
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleRemindLater}>
                          <Clock className="w-4 h-4 mr-1" /> Remind Me Later
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-muted-foreground">
                          <X className="w-4 h-4 mr-1" /> Dismiss
                        </Button>
                      </div>
                    </div>

                    {/* RIGHT SIDE (40%) — Chart + Summary */}
                    <div className="lg:col-span-2 space-y-5">
                      {/* Projection Chart */}
                      <div className="p-5 rounded-xl bg-muted/[0.06] border border-border/15">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Fund Balance Projection</p>
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projectionData}>
                              <defs>
                                <linearGradient id="adjustedGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
                                  <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `£${v}`} axisLine={false} tickLine={false} width={55} />
                              <RechartsTooltip
                                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))", fontSize: 12 }}
                                formatter={(value: number, name: string) => [`£${value.toLocaleString()}`, name === "Current" ? "Current path" : "Adjusted path"]}
                              />
                              <Area type="monotone" dataKey="Current" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="6 3" fill="url(#currentGrad)" dot={false} />
                              <Area type="monotone" dataKey="Adjusted" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#adjustedGrad)" dot={{ r: 3, fill: "hsl(var(--primary))", strokeWidth: 0 }} />
                              {projectionData.some(d => d.Current < 0 || d.Adjusted < 0) && (
                                <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeDasharray="3 3" strokeOpacity={0.5} />
                              )}
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5"><span className="w-4 h-[2px] bg-muted-foreground inline-block" style={{ borderTop: "2px dashed" }} /> Current path</span>
                          <span className="flex items-center gap-1.5"><span className="w-4 h-[2px] bg-primary inline-block rounded-full" /> Adjusted path</span>
                        </div>
                      </div>

                      {/* Summary Box */}
                      <div className="p-5 rounded-xl bg-muted/[0.06] border border-border/15 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">3-Month Projection</p>
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Balance (current path)</span>
                            <span className="text-sm font-semibold">£{projectionData[3]?.Current.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Balance (adjusted path)</span>
                            <span className="text-sm font-bold text-primary">£{projectionData[3]?.Adjusted.toLocaleString()}</span>
                          </div>
                          <div className="h-px bg-border/20" />
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Difference</span>
                            <span className="text-sm font-bold text-primary">
                              +£{((projectionData[3]?.Adjusted || 0) - (projectionData[3]?.Current || 0)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-muted-foreground/50 text-center">
                        Projections based on current claim patterns • Updated dynamically
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Up to date state */
                  <div className="text-center py-12">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    </div>
                    <p className="font-semibold text-lg">Your contribution level looks good right now.</p>
                    <p className="text-sm text-muted-foreground mt-1">We'll notify you when adjustments could help.</p>
                  </div>
                )}
              </div>
            </div>
          </div>


          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> AI Fund Advice
              </h2>
              <Button size="sm" onClick={fetchInsight} disabled={loadingInsight}>
                {loadingInsight ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
                {insight ? "Refresh" : "Get AI Advice"}
              </Button>
            </div>
            {insight ? (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed">{insight.summary}</p>
                <div className="flex items-center gap-3 text-sm">
                  <Badge variant="outline" className={
                    insight.riskAssessment === "low" ? "bg-emerald-500/20 text-emerald-400" :
                    insight.riskAssessment === "medium" ? "bg-amber-500/20 text-amber-400" :
                    "bg-destructive/20 text-destructive"
                  }>
                    Risk: {insight.riskAssessment}
                  </Badge>
                  <span className="text-muted-foreground">Recommended: £{insight.recommendedMin}–£{insight.recommendedMax} per warranty</span>
                </div>
                {insight.actionItems.length > 0 && (
                  <div className="space-y-1.5">
                    {insight.actionItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Target className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Click "Get AI Advice" for personalised fund analysis and recommendations.</p>
            )}
          </div>

          {/* Contribution Control */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold font-display mb-1">Contribution Control</h2>
            <p className="text-xs text-muted-foreground mb-4">Most UK dealers set aside £100–£150 per warranty</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contribution per warranty</span>
                <span className="text-2xl font-bold font-display">£{sliderValue[0]}</span>
              </div>
              <Slider min={50} max={300} step={10} value={sliderValue} onValueChange={setSliderValue} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>£50</span>
                <span className="text-primary font-medium">Recommended: £{RECOMMENDED_MIN}–£{RECOMMENDED_MAX}</span>
                <span>£300</span>
              </div>
            </div>
          </div>

          {/* Scenario Simulator */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold font-display mb-1">Scenario Simulator</h2>
            <p className="text-sm text-muted-foreground mb-4">What happens if you receive more claims?</p>
            <div className="flex gap-3 mb-6">
              {[1, 3, 5].map(n => (
                <Button key={n} variant={scenarioClaims === n ? "default" : "outline"} size="sm" onClick={() => setScenarioClaims(n)}>
                  {n} claim{n > 1 ? "s" : ""}
                </Button>
              ))}
            </div>
            <div className="grid sm:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/20">
                <p className="text-xs text-muted-foreground mb-1">Claims Cost</p>
                <p className="text-2xl font-bold font-display">£{Math.round(scenarioClaimsCost).toLocaleString()}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/20">
                <p className="text-xs text-muted-foreground mb-1">New Balance</p>
                <p className={`text-2xl font-bold font-display ${scenarioBalance < 0 ? "text-destructive" : ""}`}>
                  £{Math.round(scenarioBalance).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/20">
                <p className="text-xs text-muted-foreground mb-1">New Buffer</p>
                <p className={`text-2xl font-bold font-display ${scenarioBuffer < 0 ? "text-destructive" : ""}`}>
                  £{Math.round(scenarioBuffer).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/20">
                <p className="text-xs text-muted-foreground mb-1">Health Score</p>
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-2xl font-bold font-display ${scenarioScore.total >= 60 ? "" : scenarioScore.total >= 40 ? "text-amber-400" : "text-destructive"}`}>
                    {scenarioScore.total}
                  </span>
                  <Badge variant="outline" className={`text-[10px] ${scenarioScoreStatus.color}`}>
                    {scenarioScoreStatus.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Market Comparison */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold font-display mb-4">Market Comparison</h2>
            <p className="text-xs text-muted-foreground mb-4">Anonymised comparison against similar dealers</p>
            <BenchmarkRow label="Contribution per warranty" yours={contributionPerWarranty} market={marketAvgContribution} />
            <BenchmarkRow label="Claim rate" yours={claimRate} market={marketClaimRate} unit="%" />
            <BenchmarkRow label="Avg claim cost" yours={avgClaimCost} market={marketAvgClaimCost} />
            {insight?.benchmarkInsight && (
              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> {insight.benchmarkInsight}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "profit" && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-6 text-center">
              <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-3xl font-bold font-display">£{contributions.toLocaleString()}</p>
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <TrendingDown className="w-6 h-6 text-destructive mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Claims Cost</p>
              <p className="text-3xl font-bold font-display">£{claimsPaid.toLocaleString()}</p>
            </div>
            <div className="glass-card rounded-xl p-6 text-center border-l-4" style={{ borderLeftColor: totalProfit >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}>
              <Wallet className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
              <p className={`text-3xl font-bold font-display ${totalProfit < 0 ? "text-destructive" : ""}`}>
                £{totalProfit.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profit per warranty</p>
              <p className="text-2xl font-bold font-display">£{Math.round(profitPerWarranty).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">You are making £{Math.round(profitPerWarranty)} per warranty on average</p>
            </div>
          </div>

          {monthlyData.length > 0 && (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold font-display mb-4">Monthly Trend</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `£${v}`} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
                    <Legend />
                    <Bar dataKey="Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Claims" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Profit" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
