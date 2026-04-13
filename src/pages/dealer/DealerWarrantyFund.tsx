import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWarrantyStore } from "@/lib/warranty-store";
import { useClaimStore } from "@/lib/claim-store";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Wallet, TrendingUp, TrendingDown, ShieldCheck, AlertTriangle, Activity,
  Sparkles, Loader2, DollarSign, BarChart3, Target, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";

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

export default function DealerWarrantyFund() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "d-1";
  const { warranties } = useWarrantyStore();
  const claimStore = useClaimStore();

  const dealerWarranties = warranties.filter(w => w.dealerId === dealerId);
  const allWarranties = warranties;
  const dealerClaims = claimStore.getClaimsForDealer(dealerId);
  const allClaims = claimStore.claims;

  // Core calculations
  const contributions = dealerWarranties.reduce((s, w) => s + w.cost, 0);
  const approvedClaims = dealerClaims.filter(c => ["approved", "partially_approved"].includes(c.status));
  const claimsPaid = approvedClaims.reduce((s, c) => s + (c.decision?.payoutAmount || 0), 0);
  const balance = contributions - claimsPaid;
  const avgClaimCost = approvedClaims.length > 0 ? claimsPaid / approvedClaims.length : 0;
  const claimRate = dealerWarranties.length > 0 ? dealerClaims.length / dealerWarranties.length : 0;
  const activeWarranties = dealerWarranties.filter(w => w.status === "active").length;
  const riskFactor = 0.15;
  const estimatedLiability = activeWarranties * avgClaimCost * riskFactor;
  const buffer = balance - estimatedLiability;
  const bufferPct = contributions > 0 ? (buffer / contributions) * 100 : 100;
  const contributionPerWarranty = dealerWarranties.length > 0 ? contributions / dealerWarranties.length : 0;

  // Status
  const fundStatus = bufferPct > 25 ? "healthy" : bufferPct > 10 ? "watch" : "risk";
  const statusConfig = {
    healthy: { label: "Healthy", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: ShieldCheck },
    watch: { label: "Watch", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: AlertTriangle },
    risk: { label: "Risk", color: "bg-destructive/20 text-destructive border-destructive/30", icon: AlertTriangle },
  };
  const currentStatus = statusConfig[fundStatus];

  // Market benchmarks (all dealers)
  const marketContributions = allWarranties.reduce((s, w) => s + w.cost, 0);
  const marketWarrantyCount = allWarranties.length;
  const marketAvgContribution = marketWarrantyCount > 0 ? marketContributions / marketWarrantyCount : 0;
  const marketApprovedClaims = allClaims.filter(c => ["approved", "partially_approved"].includes(c.status));
  const marketClaimsPaid = marketApprovedClaims.reduce((s, c) => s + (c.decision?.payoutAmount || 0), 0);
  const marketAvgClaimCost = marketApprovedClaims.length > 0 ? marketClaimsPaid / marketApprovedClaims.length : 0;
  const marketClaimRate = marketWarrantyCount > 0 ? allClaims.length / marketWarrantyCount : 0;

  // Monthly trend data
  const monthlyData = (() => {
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
  })();

  // Profit calculations
  const totalProfit = contributions - claimsPaid;
  const profitPerWarranty = dealerWarranties.length > 0 ? totalProfit / dealerWarranties.length : 0;

  // Scenario simulator
  const [scenarioClaims, setScenarioClaims] = useState(1);
  const scenarioBalance = balance - (scenarioClaims * avgClaimCost);
  const scenarioBuffer = scenarioBalance - estimatedLiability;
  const scenarioBufferPct = contributions > 0 ? (scenarioBuffer / contributions) * 100 : 100;
  const scenarioStatus = scenarioBufferPct > 25 ? "healthy" : scenarioBufferPct > 10 ? "watch" : "risk";

  // Contribution slider
  const [sliderValue, setSliderValue] = useState([Math.round(contributionPerWarranty) || 100]);

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

  // Benchmark comparison helper
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

  // Active tab
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
          {/* Hero Card */}
          <div className="glass-card rounded-xl p-6 border-l-4" style={{ borderLeftColor: fundStatus === "healthy" ? "hsl(var(--primary))" : fundStatus === "watch" ? "#f59e0b" : "hsl(var(--destructive))" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Warranty Fund Balance</p>
                <p className="text-4xl font-bold font-display">£{balance.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Buffer: £{Math.round(buffer).toLocaleString()}</p>
              </div>
              <Badge variant="outline" className={`${currentStatus.color} flex items-center gap-1.5 text-sm px-3 py-1.5`}>
                <currentStatus.icon className="w-4 h-4" />
                {currentStatus.label}
              </Badge>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard icon={TrendingUp} label="Total Contributions" value={`£${contributions.toLocaleString()}`} />
            <StatCard icon={TrendingDown} label="Claims Paid" value={`£${claimsPaid.toLocaleString()}`} color="text-destructive" />
            <StatCard icon={Activity} label="Active Warranties" value={activeWarranties.toString()} />
            <StatCard icon={BarChart3} label="Claim Rate" value={`${(claimRate * 100).toFixed(0)}%`} />
            <StatCard icon={DollarSign} label="Avg Claim Cost" value={`£${Math.round(avgClaimCost).toLocaleString()}`} />
          </div>

          {/* AI Insight */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Fund Insight
              </h2>
              <Button size="sm" onClick={fetchInsight} disabled={loadingInsight}>
                {loadingInsight ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
                {insight ? "Refresh" : "Get AI Insight"}
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
              <p className="text-sm text-muted-foreground">Click "Get AI Insight" for personalised fund analysis and recommendations.</p>
            )}
          </div>

          {/* Contribution Slider */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold font-display mb-4">Contribution Control</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contribution per warranty</span>
                <span className="text-2xl font-bold font-display">£{sliderValue[0]}</span>
              </div>
              <Slider min={50} max={300} step={10} value={sliderValue} onValueChange={setSliderValue} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>£50</span>
                {insight && <span className="text-primary font-medium">Recommended: £{insight.recommendedMin}–£{insight.recommendedMax}</span>}
                <span>£300</span>
              </div>
            </div>
          </div>

          {/* Scenario Simulator */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold font-display mb-4">Scenario Simulator</h2>
            <p className="text-sm text-muted-foreground mb-4">What happens if you receive more claims?</p>
            <div className="flex gap-3 mb-6">
              {[1, 3, 5].map(n => (
                <Button key={n} variant={scenarioClaims === n ? "default" : "outline"} size="sm" onClick={() => setScenarioClaims(n)}>
                  {n} claim{n > 1 ? "s" : ""}
                </Button>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/20">
                <p className="text-xs text-muted-foreground mb-1">Projected Balance</p>
                <p className={`text-2xl font-bold font-display ${scenarioBalance < 0 ? "text-destructive" : ""}`}>
                  £{Math.round(scenarioBalance).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/20">
                <p className="text-xs text-muted-foreground mb-1">Cost of Claims</p>
                <p className="text-2xl font-bold font-display">£{Math.round(scenarioClaims * avgClaimCost).toLocaleString()}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/20">
                <p className="text-xs text-muted-foreground mb-1">New Status</p>
                <Badge variant="outline" className={`text-sm ${statusConfig[scenarioStatus].color}`}>
                  {statusConfig[scenarioStatus].label}
                </Badge>
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
          {/* Profit hero cards */}
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

          {/* Profit per warranty callout */}
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

          {/* Monthly trend chart */}
          {monthlyData.length > 0 && (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold font-display mb-4">Monthly Trend</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `£${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
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
