import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWarrantyStore } from "@/lib/warranty-store";
import { useWarrantyLineStore } from "@/lib/warranty-line-store";
import { useDealerSettingsStore } from "@/lib/dealer-settings-store";
import { useAuth } from "@/contexts/AuthContext";
import { lookupVehicle, type DVLAVehicle } from "@/lib/simulated-apis";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Shield, FileText, Users, ClipboardList, TrendingUp, AlertTriangle,
  Search, Plus, Car, CheckCircle2, Loader2, ArrowRight, Clock, Phone,
  Target, Activity, CalendarClock, PercentCircle, PoundSterling
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color || "bg-primary/10"}`}>
          <Icon className={`w-4 h-4 ${color ? "text-primary-foreground" : "text-primary"}`} />
        </div>
      </div>
      <p className="text-2xl font-bold font-display">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export default function DealerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const store = useWarrantyStore();
  const warrantyLineStore = useWarrantyLineStore();
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

  // Claim approval rate
  const approvedClaims = claims.filter(c => c.status === "approved").length;
  const approvalRate = resolvedClaims > 0 ? Math.round((approvedClaims / resolvedClaims) * 100) : 0;

  // Expiring warranties (within 30 days)
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringWarranties = warranties.filter(w => {
    if (w.status !== "active") return false;
    const end = new Date(w.endDate);
    return end >= now && end <= in30Days;
  }).map(w => {
    const daysLeft = Math.ceil((new Date(w.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return { ...w, daysLeft };
  });

  // Sales target progress
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold font-display">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* Free Warranties Banner */}
      {freeRemaining > 0 ? (
        <div className="glass-card-strong rounded-xl p-5 border-primary/30 bg-primary/5 glow-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <PoundSterling className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold font-display text-sm">Free Warranties Remaining</h3>
                <p className="text-xs text-muted-foreground">Your first {dealerFreeTotal} warranties are on us — no charge</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold font-display text-primary">{freeRemaining}</p>
                <p className="text-xs text-muted-foreground">{freeUsed}/{dealerFreeTotal} used</p>
              </div>
              <Progress value={(freeUsed / dealerFreeTotal) * 100} className="w-24 h-2" />
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-xl p-4 border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center">
              <PoundSterling className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">All {dealerFreeTotal} free warranties used</p>
              <p className="text-xs text-muted-foreground">New warranties are now charged at £19 each via Stripe</p>
            </div>
          </div>
        </div>
      )}

      {/* Expiring Warranties Alert */}
      {expiringWarranties.length > 0 && (
        <div className="glass-card rounded-xl p-4 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock className="w-4 h-4 text-yellow-500" />
            <h3 className="font-semibold font-display text-sm">Expiring Soon ({expiringWarranties.length})</h3>
          </div>
          <div className="space-y-2">
            {expiringWarranties.map(w => (
              <div key={w.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
                onClick={() => navigate("/dealer/warranties")}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">{w.vehicleReg}</span>
                  <span className="text-sm text-muted-foreground">{w.vehicleMake} {w.vehicleModel}</span>
                </div>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  {w.daysLeft} days left
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions Hero Section */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card-strong rounded-xl p-6 glow-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Car className="w-5 h-5 text-primary" />
              <h2 className="font-semibold font-display text-lg">Add New Warranty</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Enter a registration to get started instantly</p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter reg e.g. AB12 CDE"
                value={reg}
                onChange={e => setReg(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === "Enter" && handleQuickLookup()}
                className="font-mono text-base tracking-widest bg-background/60 border-border/80 h-12 text-lg"
              />
              <Button onClick={handleQuickLookup} disabled={loading} size="lg" className="h-12 px-6 glow-primary-sm">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5 mr-1" /> Look Up</>}
              </Button>
            </div>
            {vehicle && (
              <div className="mt-4 bg-primary/5 border border-primary/20 rounded-lg p-4 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Vehicle Found
                  </div>
                  <Button size="sm" onClick={() => navigate("/dealer/warranties/new")} className="glow-primary-sm">
                    Continue <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Make:</span> <span className="font-medium">{vehicle.make}</span></div>
                  <div><span className="text-muted-foreground">Model:</span> <span className="font-medium">{vehicle.model}</span></div>
                  <div><span className="text-muted-foreground">Year:</span> <span className="font-medium">{vehicle.year}</span></div>
                  <div><span className="text-muted-foreground">Colour:</span> <span className="font-medium">{vehicle.colour}</span></div>
                  <div><span className="text-muted-foreground">Fuel:</span> <span className="font-medium">{vehicle.fuelType}</span></div>
                  <div><span className="text-muted-foreground">Engine:</span> <span className="font-medium">{vehicle.engineSize}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate("/dealer/warranties/new")} className="glass-card rounded-xl p-5 text-left hover:border-primary/40 hover:bg-primary/5 transition-all group">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <p className="font-semibold font-display">Add Warranty</p>
            <p className="text-xs text-muted-foreground mt-1">Issue a new warranty</p>
          </button>
          <button onClick={() => navigate("/dealer/claim-assist")} className="glass-card rounded-xl p-5 text-left hover:border-primary/40 hover:bg-primary/5 transition-all group">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <p className="font-semibold font-display">Claim Assist</p>
            <p className="text-xs text-muted-foreground mt-1">{openClaims} open claims</p>
          </button>
          <button onClick={() => navigate("/dealer/customers")} className="glass-card rounded-xl p-5 text-left hover:border-primary/40 hover:bg-primary/5 transition-all group">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="font-semibold font-display">Customers</p>
            <p className="text-xs text-muted-foreground mt-1">{customers} total</p>
          </button>
          <button onClick={() => navigate("/dealer/requests")} className="glass-card rounded-xl p-5 text-left hover:border-primary/40 hover:bg-primary/5 transition-all group">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <p className="font-semibold font-display">Requests</p>
            <p className="text-xs text-muted-foreground mt-1">Customer requests</p>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        <StatCard icon={FileText} label="Total Warranties" value={warranties.length} />
        <StatCard icon={Shield} label="Active" value={active} sub={`${expired} expired`} />
        <StatCard icon={TrendingUp} label="Total Value" value={`£${totalValue.toLocaleString()}`} />
        <StatCard icon={ClipboardList} label="Open Claims" value={openClaims} />
        <StatCard icon={AlertTriangle} label="Resolved Claims" value={resolvedClaims} />
        <StatCard icon={Users} label="Customers" value={customers} />
        <StatCard icon={PercentCircle} label="Approval Rate" value={`${approvalRate}%`} sub={`${approvedClaims}/${resolvedClaims} approved`} />
      </div>

      {/* Sales Target Progress */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="font-semibold font-display text-sm">Monthly Sales Target</h3>
          </div>
          <span className="text-sm text-muted-foreground">{thisMonthWarranties} / {monthlyTarget} warranties</span>
        </div>
        <Progress value={targetProgress} className="h-2.5" />
        <p className="text-xs text-muted-foreground mt-2">
          {thisMonthWarranties >= monthlyTarget ? "🎉 Target reached!" : `${monthlyTarget - thisMonthWarranties} more to reach your target this month`}
        </p>
      </div>

      {/* Charts + Recent Claims + Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <h3 className="font-semibold font-display mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}`} />
              <Tooltip contentStyle={{ background: "hsl(222, 25%, 10%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="revenue" fill="hsl(172, 66%, 40%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold font-display mb-4">Recent Claims</h3>
          <div className="space-y-3">
            {recentClaims.length === 0 && <p className="text-sm text-muted-foreground">No claims yet</p>}
            {recentClaims.map(claim => (
              <div key={claim.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => navigate("/dealer/claims")}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  claim.status === "pending" ? "bg-yellow-500" :
                  claim.status === "under_review" ? "bg-blue-500" :
                  claim.status === "approved" ? "bg-primary" : "bg-destructive"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{claim.description}</p>
                  <p className="text-xs text-muted-foreground capitalize">{claim.status.replace("_", " ")}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border/50">
            <h4 className="text-sm font-medium mb-3">Warranty Status</h4>
            <div className="space-y-2">
              {statusData.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-secondary mx-2">
                    <div className="h-full rounded-full" style={{ background: d.color, width: `${(d.value / (warranties.length || 1)) * 100}%` }} />
                  </div>
                  <span className="font-medium tabular-nums">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="font-semibold font-display">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {recentActivity.length === 0 && <p className="text-sm text-muted-foreground">No activity recorded yet</p>}
          {recentActivity.map(entry => {
            const EntryIcon = activityIcon(entry.action);
            return (
              <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <EntryIcon className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{entry.details}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
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

      {/* Warranty Line Upsell */}
      {!warrantyLine && (
        <div className="glass-card rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-[hsl(var(--cta))]/40 hover:bg-[hsl(var(--cta))]/5 transition-all"
          onClick={() => navigate("/dealer/warranty-line")}>
          <div className="w-11 h-11 rounded-lg bg-[hsl(var(--cta))]/10 flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-[hsl(var(--cta))]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold font-display text-sm">Add a dedicated warranty phone line</p>
            <p className="text-xs text-muted-foreground">Give customers a professional number for claims — £25/month</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </div>
      )}
    </div>
  );
}
