import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWarrantyStore } from "@/lib/warranty-store";
import { useWarrantyLineStore } from "@/lib/warranty-line-store";
import { useDealerSettingsStore } from "@/lib/dealer-settings-store";
import { useAuth } from "@/contexts/AuthContext";
import { useSimpleMode } from "@/components/layouts/DealerLayout";
import { lookupVehicle, type DVLAVehicle } from "@/lib/simulated-apis";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Shield, FileText, Users, ClipboardList, TrendingUp, AlertTriangle,
  Search, Plus, Car, CheckCircle2, Loader2, ArrowRight, Clock, Phone,
  Target, Activity, CalendarClock, PercentCircle, PoundSterling, Sparkles, Wallet
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { calcHealthScore, calcExposure, getEffectiveMetrics, getScoreStatus, getScoreRingColor } from "@/lib/fund-health";
import { toast } from "sonner";

function SectionHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-white/25">{title}</h2>
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, accent }: { icon: any; label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border transition-all duration-200 hover:-translate-y-0.5 ${
      accent
        ? "bg-[hsl(222_28%_12%)] border-primary/20 shadow-[0_0_16px_-6px_hsl(172,66%,40%,0.12)]"
        : "bg-[hsl(222_28%_10%)] border-white/[0.06] hover:border-white/[0.1]"
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? "bg-primary/15" : "bg-white/[0.04]"}`}>
          <Icon className={`w-3.5 h-3.5 ${accent ? "text-primary" : "text-white/40"}`} />
        </div>
      </div>
      <p className="text-xl font-bold font-display text-white/90">{value}</p>
      <p className="text-xs text-white/35 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-white/20 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function DealerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const store = useWarrantyStore();
  const warrantyLineStore = useWarrantyLineStore();
  const { simple } = useSimpleMode();
  const dealerId = user?.dealerId || "d-1";
  const warrantyLine = warrantyLineStore.getLine(dealerId);
  store.ensureExpiryCheck(dealerId);
  const warranties = store.warranties.filter(w => w.dealerId === dealerId);
  const claims = store.claims.filter(c => c.dealerId === dealerId);
  const customers = new Set(warranties.map(w => w.customerId)).size;
  const dealerAuditLog = store.auditLog.filter(a => a.dealerId === dealerId);

  const active = warranties.filter(w => w.status === "active").length;
  const expired = warranties.filter(w => w.status === "expired").length;
  const totalValue = warranties.reduce((s, w) => s + w.cost, 0);
  const openClaims = claims.filter(c => c.status === "pending" || c.status === "under_review").length;
  const resolvedClaims = claims.filter(c => c.status === "approved" || c.status === "rejected").length;
  const approvedClaims = claims.filter(c => c.status === "approved").length;
  const approvalRate = resolvedClaims > 0 ? Math.round((approvedClaims / resolvedClaims) * 100) : 0;

  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringWarranties = warranties.filter(w => {
    if (w.status !== "active") return false;
    const end = new Date(w.endDate);
    return end >= now && end <= in30Days;
  }).map(w => ({ ...w, daysLeft: Math.ceil((new Date(w.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) }));

  const dealerSettingsStore = useDealerSettingsStore();
  const dealerSettings = dealerSettingsStore.getSettings(dealerId);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyTarget = dealerSettings.monthlySalesTarget;
  const thisMonthWarranties = warranties.filter(w => {
    const d = new Date(w.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;
  const targetProgress = Math.min((thisMonthWarranties / monthlyTarget) * 100, 100);

  const [reg, setReg] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState<DVLAVehicle | null>(null);

  const handleQuickLookup = async () => {
    if (!reg.trim()) return;
    setLoading(true);
    const result = await lookupVehicle(reg);
    setVehicle(result);
    setLoading(false);
    if (result) toast.success(`Vehicle found: ${result.make} ${result.model}`);
  };

  const monthlyData = [
    { month: "Sep", revenue: 1500 },
    { month: "Oct", revenue: 2800 },
    { month: "Nov", revenue: 2200 },
    { month: "Dec", revenue: 3900 },
    { month: "Jan", revenue: 3400 },
    { month: "Feb", revenue: 4500 },
  ];

  const statusData = [
    { name: "Active", value: active, color: "hsl(172, 66%, 40%)" },
    { name: "Expired", value: expired || 1, color: "hsl(0, 72%, 51%)" },
    { name: "Cancelled", value: warranties.filter(w => w.status === "cancelled").length || 0, color: "hsl(220, 10%, 46%)" },
  ].filter(d => d.value > 0);

  const recentClaims = claims.slice(0, 4);
  const recentActivity = dealerAuditLog.slice(0, 5);

  const activityIcon = (action: string) => {
    if (action.includes("warranty")) return Shield;
    if (action.includes("claim")) return ClipboardList;
    if (action.includes("customer")) return Users;
    return Activity;
  };

  const freeRemaining = dealerSettingsStore.freeWarrantiesRemaining(dealerId);
  const dealerFreeTotal = dealerSettings.freeWarrantiesTotal;
  const freeUsed = dealerSettings.freeWarrantiesUsed;

  // Fund calculations
  const contributions = warranties.reduce((s, w) => s + w.cost, 0);
  const claimsPaid = claims.filter(c => c.status === "approved").reduce((s, c) => s + (c.amount || 0), 0);
  const fundBalance = contributions - claimsPaid;

  // Fund health score
  const activeCount = active;
  const rawClaimRate = warranties.length > 0 ? claims.length / warranties.length : 0;
  const rawAvgClaimCost = claimsPaid > 0 ? claimsPaid / claims.filter(c => c.status === "approved").length : 0;
  const effectiveMetrics = getEffectiveMetrics(warranties.length, rawClaimRate, rawAvgClaimCost);
  const exposure = calcExposure(activeCount, effectiveMetrics.claimRate, effectiveMetrics.avgClaimCost);
  const buffer = fundBalance - exposure;
  const contributionPerWarranty = warranties.length > 0 ? contributions / warranties.length : 0;
  const healthScore = calcHealthScore(buffer, exposure, contributionPerWarranty, effectiveMetrics.claimRate, warranties.length);
  const healthStatus = getScoreStatus(healthScore.total);
  const ringColor = getScoreRingColor(healthScore.total);
  const HealthIcon = healthStatus.icon;

  // Onboarding check
  const isNewDealer = warranties.length === 0;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white/90">Dashboard</h1>
        <p className="text-sm text-white/30">Welcome back, {user?.name}</p>
      </div>

      {/* ── NEW DEALER ONBOARDING ── */}
      {isNewDealer && (
        <div className="rounded-xl p-6 border border-primary/20 bg-[hsl(222_28%_10%)] shadow-[0_0_20px_-8px_hsl(172,66%,40%,0.1)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold font-display text-base text-white/80">Get started with WarrantyVault</h2>
              <p className="text-xs text-white/30">Complete these steps to set up your account</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { step: 1, label: "Add your first warranty", desc: "Enter a vehicle reg to get started", path: "/dealer/warranties/new", icon: Shield },
              { step: 2, label: "Set up your warranty fund", desc: "Track contributions and claims", path: "/dealer/warranty-fund", icon: Wallet },
              { step: 3, label: "Try DisputeIQ", desc: "AI-powered complaint handling", path: "/dealer/disputeiq", icon: Sparkles },
            ].map(item => (
              <div key={item.step} className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-all hover:-translate-y-0.5 border border-white/[0.04] hover:border-white/[0.08]"
                onClick={() => navigate(item.path)}>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{item.step}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white/70">{item.label}</p>
                  <p className="text-[11px] text-white/25">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ACTIONS ── */}
      <section>
        <SectionHeader title="Actions" />

        {/* Free Warranties Banner */}
        {freeRemaining > 0 && (
          <div className="rounded-xl p-4 border border-primary/20 bg-primary/[0.04] mb-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.06] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                  <PoundSterling className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold font-display text-sm text-white/80">Free Warranties Remaining</h3>
                  <p className="text-[11px] text-white/30">Your first {dealerFreeTotal} warranties are on us</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xl font-bold font-display text-primary">{freeRemaining}</p>
                  <p className="text-[10px] text-white/25">{freeUsed}/{dealerFreeTotal} used</p>
                </div>
                <Progress value={(freeUsed / dealerFreeTotal) * 100} className="w-20 h-1.5" />
              </div>
            </div>
          </div>
        )}

        {/* Expiring Alert */}
        {expiringWarranties.length > 0 && (
          <div className="rounded-xl p-4 border border-yellow-500/20 bg-yellow-500/[0.03] mb-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarClock className="w-4 h-4 text-yellow-500/80" />
              <h3 className="font-semibold font-display text-sm text-white/70">Expiring Soon ({expiringWarranties.length})</h3>
            </div>
            <div className="space-y-1.5">
              {expiringWarranties.map(w => (
                <div key={w.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-colors"
                  onClick={() => navigate("/dealer/warranties")}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-white/60">{w.vehicleReg}</span>
                    <span className="text-xs text-white/30">{w.vehicleMake} {w.vehicleModel}</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500/80 border-yellow-500/15 text-[10px]">
                    {w.daysLeft}d left
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Primary action row */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Add Warranty — Primary card */}
          <div className="rounded-xl p-6 border border-primary/15 bg-[hsl(222_28%_10%)] shadow-[0_0_20px_-8px_hsl(172,66%,40%,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-primary/[0.04] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <Car className="w-5 h-5 text-primary" />
                <h2 className="font-semibold font-display text-base text-white/80">Add New Warranty</h2>
              </div>
              <p className="text-xs text-white/30 mb-4">Enter a registration to get started</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter reg e.g. AB12 CDE"
                  value={reg}
                  onChange={e => setReg(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === "Enter" && handleQuickLookup()}
                  className="font-mono text-sm tracking-widest bg-white/[0.03] border-white/[0.08] h-11"
                />
                <Button onClick={handleQuickLookup} disabled={loading} className="h-11 px-5 btn-cta shadow-[0_0_12px_-3px_hsl(24,100%,50%,0.2)]">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4 mr-1" /> Look Up</>}
                </Button>
              </div>
              {vehicle && (
                <div className="mt-3 bg-primary/[0.05] border border-primary/15 rounded-lg p-3 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-primary text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Vehicle Found
                    </div>
                    <Button size="sm" className="h-7 text-xs btn-cta" onClick={() => navigate("/dealer/warranties/new", { state: { reg: vehicle.registration, vehicle } })}>
                      Continue <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <div><span className="text-white/30">Make:</span> <span className="text-white/70">{vehicle.make}</span></div>
                    <div><span className="text-white/30">Model:</span> <span className="text-white/70">{vehicle.model}</span></div>
                    <div><span className="text-white/30">Year:</span> <span className="text-white/70">{vehicle.year}</span></div>
                    <div><span className="text-white/30">Colour:</span> <span className="text-white/70">{vehicle.colour}</span></div>
                    <div><span className="text-white/30">Fuel:</span> <span className="text-white/70">{vehicle.fuelType}</span></div>
                    <div><span className="text-white/30">Engine:</span> <span className="text-white/70">{vehicle.engineSize}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick stats — simple mode shows fewer */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Shield} label="Active Warranties" value={active} accent />
            <StatCard icon={ClipboardList} label="Open Claims" value={openClaims} sub={openClaims > 0 ? `${openClaims} need attention` : undefined} accent={openClaims > 0} />
            {!simple && (
              <>
                <StatCard icon={Wallet} label="Fund Balance" value={`£${fundBalance.toLocaleString()}`} accent />
                <StatCard icon={Users} label="Customers" value={customers} />
              </>
            )}
            {simple && (
              <>
                <button onClick={() => navigate("/dealer/disputeiq")} className="rounded-xl p-4 border border-[hsl(var(--cta))]/15 bg-[hsl(var(--cta))]/[0.04] text-left transition-all hover:-translate-y-0.5 hover:border-[hsl(var(--cta))]/25 group">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(var(--cta))]/10 flex items-center justify-center mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--cta))]" />
                  </div>
                  <p className="text-sm font-semibold text-white/70">DisputeIQ</p>
                  <p className="text-[10px] text-white/30 mt-0.5">Handle complaints</p>
                </button>
                <StatCard icon={Wallet} label="Fund Balance" value={`£${fundBalance.toLocaleString()}`} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── PERFORMANCE ── (hidden in simple mode) */}
      {!simple && (
        <section>
          <SectionHeader title="Performance" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            <StatCard icon={FileText} label="Total Warranties" value={warranties.length} />
            <StatCard icon={TrendingUp} label="Total Value" value={`£${totalValue.toLocaleString()}`} />
            <StatCard icon={AlertTriangle} label="Resolved Claims" value={resolvedClaims} />
            <StatCard icon={PercentCircle} label="Approval Rate" value={`${approvalRate}%`} sub={`${approvedClaims}/${resolvedClaims}`} />
            <StatCard icon={Shield} label="Expired" value={expired} />
          </div>

          {/* Sales Target */}
          <div className="rounded-xl p-4 border border-white/[0.06] bg-[hsl(222_28%_10%)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-primary" />
                <h3 className="font-semibold font-display text-xs text-white/50">Monthly Sales Target</h3>
              </div>
              <span className="text-xs text-white/30">{thisMonthWarranties} / {monthlyTarget}</span>
            </div>
            <Progress value={targetProgress} className="h-1.5" />
            <p className="text-[10px] text-white/20 mt-1.5">
              {thisMonthWarranties >= monthlyTarget ? "🎉 Target reached!" : `${monthlyTarget - thisMonthWarranties} more needed`}
            </p>
          </div>
        </section>
      )}

      {/* ── CLAIMS ── */}
      {!simple && (
        <section>
          <SectionHeader title="Claims">
            {openClaims > 0 && <span className="text-[10px] text-[hsl(var(--cta))] font-medium">{openClaims} need attention</span>}
          </SectionHeader>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-xl p-5 border border-white/[0.06] bg-[hsl(222_28%_10%)]">
              <h3 className="font-semibold font-display text-sm text-white/60 mb-4">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fill: "hsl(215, 15%, 35%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(215, 15%, 35%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}`} />
                  <Tooltip contentStyle={{ background: "hsl(222, 28%, 12%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                  <Bar dataKey="revenue" fill="hsl(172, 66%, 40%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl p-5 border border-white/[0.06] bg-[hsl(222_28%_10%)]">
              <h3 className="font-semibold font-display text-sm text-white/60 mb-3">Recent Claims</h3>
              <div className="space-y-2">
                {recentClaims.length === 0 && <p className="text-xs text-white/25">No claims yet</p>}
                {recentClaims.map(claim => {
                  const daysSince = Math.floor((Date.now() - new Date(claim.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                  const isOverdue = (claim.status === "pending" || claim.status === "under_review") && daysSince > 7;
                  return (
                    <div key={claim.id} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                      onClick={() => navigate("/dealer/claims")}>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        claim.status === "pending" ? "bg-yellow-500" :
                        claim.status === "under_review" ? "bg-blue-400" :
                        claim.status === "approved" ? "bg-primary" : "bg-destructive"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white/60 truncate">{claim.description}</p>
                        <p className="text-[10px] text-white/25 capitalize">{claim.status.replace("_", " ")}</p>
                      </div>
                      {isOverdue ? (
                        <Badge variant="outline" className="bg-destructive/15 text-destructive border-destructive/25 text-[9px] px-1.5 py-0">
                          {daysSince}d overdue
                        </Badge>
                      ) : (claim.status === "pending" || claim.status === "under_review") ? (
                        <span className="text-[9px] text-[hsl(var(--cta))] font-medium">Review</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.04]">
                <h4 className="text-xs font-medium text-white/40 mb-2">Warranty Status</h4>
                <div className="space-y-1.5">
                  {statusData.map(d => (
                    <div key={d.name} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-white/30 w-16">{d.name}</span>
                      <div className="flex-1 h-1 rounded-full bg-white/[0.04]">
                        <div className="h-full rounded-full" style={{ background: d.color, width: `${(d.value / (warranties.length || 1)) * 100}%` }} />
                      </div>
                      <span className="text-white/50 font-medium tabular-nums w-6 text-right">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ACTIVITY ── (hidden in simple mode) */}
      {!simple && (
        <section>
          <SectionHeader title="Activity" />
          <div className="rounded-xl p-5 border border-white/[0.06] bg-[hsl(222_28%_10%)]">
            <div className="space-y-2">
              {recentActivity.length === 0 && <p className="text-xs text-white/25">No activity recorded yet</p>}
              {recentActivity.map(entry => {
                const EntryIcon = activityIcon(entry.action);
                return (
                  <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <EntryIcon className="w-3 h-3 text-white/30" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/60">{entry.details}</p>
                      <p className="text-[10px] text-white/20 mt-0.5">
                        {new Date(entry.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        {" · "}
                        {new Date(entry.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* DisputeIQ Widget */}
      {!simple && (
        <div className="rounded-xl p-5 border border-[hsl(var(--cta))]/15 bg-[hsl(var(--cta))]/[0.03] flex items-center gap-4 cursor-pointer hover:border-[hsl(var(--cta))]/25 hover:bg-[hsl(var(--cta))]/[0.05] transition-all hover:-translate-y-0.5"
          onClick={() => navigate("/dealer/disputeiq")}>
          <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cta))]/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[hsl(var(--cta))]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold font-display text-sm text-white/70">Not sure how to handle a complaint?</p>
            <p className="text-[11px] text-white/30">DisputeIQ gives you the right response — fast</p>
          </div>
          <Button size="sm" className="btn-cta rounded-lg h-8 text-xs px-4 shadow-[0_0_12px_-3px_hsl(24,100%,50%,0.2)]">
            Use DisputeIQ <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      )}

      {/* Warranty Fund Health Ring Widget (hidden in simple) */}
      {!simple && !isNewDealer && (
        <div className="rounded-xl p-5 border border-primary/15 bg-[hsl(222_28%_10%)] shadow-[0_0_16px_-6px_hsl(172,66%,40%,0.08)] flex items-center gap-5 cursor-pointer hover:-translate-y-0.5 transition-all"
          onClick={() => navigate("/dealer/warranty-fund")}>
          {/* Health Score Ring */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(222, 20%, 16%)" strokeWidth="5" />
              <circle
                cx="32" cy="32" r="26" fill="none"
                stroke={ringColor}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - healthScore.total / 100)}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold font-display text-white/90">{healthScore.total}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-white/30 mb-0.5">Warranty Fund</p>
            <p className="text-2xl font-bold font-display text-white/90">£{fundBalance.toLocaleString()}</p>
          </div>
          <Badge variant="outline" className={`${healthStatus.color} text-[10px]`}>
            <HealthIcon className="w-3 h-3 mr-1" />
            {healthStatus.label}
          </Badge>
          <Button variant="outline" size="sm" className="h-7 text-xs border-white/[0.08] text-white/40 bg-transparent hover:bg-white/[0.04]">
            View Details <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      )}

      {/* Warranty Line Upsell */}
      {!simple && !warrantyLine && (
        <div className="rounded-xl p-4 border border-white/[0.06] bg-[hsl(222_28%_10%)] flex items-center gap-3 cursor-pointer hover:border-white/[0.1] hover:bg-[hsl(222_28%_11%)] transition-all"
          onClick={() => navigate("/dealer/warranty-line")}>
          <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
            <Phone className="w-4 h-4 text-white/40" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-xs text-white/50">Add a dedicated warranty phone line</p>
            <p className="text-[10px] text-white/20">Professional claims number — £25/month</p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-white/20" />
        </div>
      )}
    </div>
  );
}
