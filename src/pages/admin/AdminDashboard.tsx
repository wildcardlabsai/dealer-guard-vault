import { useNavigate } from "react-router-dom";
import { useWarrantyStore } from "@/lib/warranty-store";
import { useSignupStore } from "@/lib/signup-store";
import { useSupportStore } from "@/lib/support-store";
import { Building2, FileText, TrendingUp, ClipboardList, Users, DollarSign, AlertCircle, Activity, Trophy } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Dealer } from "@/data/demo-data";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <p className="text-2xl font-bold font-display">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const signupStore = useSignupStore();
  const supportStore = useSupportStore();
  const store = useWarrantyStore();
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loadingDealers, setLoadingDealers] = useState(true);

  const fetchDealers = useCallback(async () => {
    setLoadingDealers(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-data", {
        body: { table: "dealers", action: "select" },
      });
      if (!error && data?.data) {
        setDealers((data.data as any[]).map((d: any) => ({
          id: d.id,
          name: d.name,
          email: d.email,
          phone: d.phone || "",
          fcaNumber: d.fca_number || "",
          address: d.address || "",
          city: d.city || "",
          postcode: d.postcode || "",
          createdAt: d.joined_at || d.created_at,
          status: d.status as "active" | "suspended" | "trial",
          warrantyCount: 0,
          monthlyFee: 0,
        })));
      }
    } catch { /* ignore */ }
    setLoadingDealers(false);
  }, []);

  useEffect(() => { fetchDealers(); }, [fetchDealers]);

  if (loadingDealers) return <DashboardSkeleton statCards={6} />;

  const totalDealers = dealers.length;
  const totalWarranties = store.warranties.length;
  const totalClaims = store.claims.length;
  const activeDealers = dealers.filter(d => d.status === "active").length;

  const warrantyRevenue = totalWarranties * 15;
  const totalRevenue = warrantyRevenue;

  const pendingSignups = signupStore.signupRequests.filter(r => r.status === "pending").length;
  const openTickets = supportStore.tickets.filter(t => t.status === "open" || t.status === "in_progress").length;
  const pendingClaims = store.claims.filter(c => c.status === "pending").length;
  const totalPending = pendingSignups + openTickets + pendingClaims;

  const trialDealers = dealers.filter(d => d.status === "trial").length;
  const suspendedDealers = dealers.filter(d => d.status === "suspended").length;
  const churnRate = totalDealers > 0 ? Math.round((suspendedDealers / totalDealers) * 100) : 0;

  // Dealer leaderboard
  const dealerWarrantyCounts = dealers.map(d => ({
    name: d.name,
    count: store.warranties.filter(w => w.dealerId === (d as any).id || w.dealerId === (d as any).dealer_code).length,
  })).sort((a, b) => b.count - a.count).slice(0, 5);
  const maxWarrantyCount = Math.max(...dealerWarrantyCounts.map(d => d.count), 1);

  // Claims breakdown
  const claimStatuses = [
    { name: "Pending", value: store.claims.filter(c => c.status === "pending").length, color: "hsl(45, 93%, 47%)" },
    { name: "Under Review", value: store.claims.filter(c => c.status === "under_review").length, color: "hsl(210, 80%, 55%)" },
    { name: "Approved", value: store.claims.filter(c => c.status === "approved").length, color: "hsl(172, 66%, 40%)" },
    { name: "Rejected", value: store.claims.filter(c => c.status === "rejected").length, color: "hsl(0, 72%, 51%)" },
  ].filter(s => s.value > 0);

  const recentLogs = store.auditLog.slice(0, 5);

  // Revenue trend from real warranty data
  const monthlyData = (() => {
    const months: Record<string, number> = {};
    store.warranties.forEach(w => {
      const d = new Date(w.createdAt);
      const key = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
      months[key] = (months[key] || 0) + 15;
    });
    return Object.entries(months).map(([month, fees]) => ({ month, fees })).slice(-6);
  })();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform overview</p>
      </div>

      {totalPending > 0 && (
        <div className="glass-card rounded-xl p-4 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <h3 className="font-semibold font-display text-sm">Pending Actions ({totalPending})</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {pendingSignups > 0 && (
              <button onClick={() => navigate("/admin/signup-requests")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors text-sm">
                <span className="font-medium">{pendingSignups} Signup Request{pendingSignups > 1 ? "s" : ""}</span>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs">Review</Badge>
              </button>
            )}
            {openTickets > 0 && (
              <button onClick={() => navigate("/admin/support")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors text-sm">
                <span className="font-medium">{openTickets} Support Ticket{openTickets > 1 ? "s" : ""}</span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">Open</Badge>
              </button>
            )}
            {pendingClaims > 0 && (
              <button onClick={() => navigate("/admin/claims")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors text-sm">
                <span className="font-medium">{pendingClaims} Pending Claim{pendingClaims > 1 ? "s" : ""}</span>
                <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-xs">Pending</Badge>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Building2} label="Dealers" value={totalDealers} sub={`${activeDealers} active`} />
        <StatCard icon={FileText} label="Warranties" value={totalWarranties} />
        <StatCard icon={ClipboardList} label="Claims" value={totalClaims} />
        <StatCard icon={DollarSign} label="Warranty Fees" value={`£${warrantyRevenue}`} sub={`${totalWarranties} × £15`} />
        <StatCard icon={Users} label="Total Revenue" value={`£${totalRevenue}`} />
        <StatCard icon={TrendingUp} label="Churn Rate" value={`${churnRate}%`} sub={`${suspendedDealers} suspended · ${trialDealers} trial`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <h3 className="font-semibold font-display mb-4">Revenue Trend (Pay-Per-Use)</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}`} />
                <Tooltip contentStyle={{ background: "hsl(222, 25%, 10%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8, color: "#fff" }} />
                <Line type="monotone" dataKey="fees" stroke="hsl(172, 66%, 40%)" strokeWidth={2} dot={false} name="Warranty Fees" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">No warranty data yet</div>
          )}
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold font-display mb-4">Claims Breakdown</h3>
          {claimStatuses.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={claimStatuses} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                    {claimStatuses.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(222, 25%, 10%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8, color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {claimStatuses.map(s => (
                  <div key={s.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-muted-foreground flex-1">{s.name}</span>
                    <span className="font-medium tabular-nums">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">No claims yet</div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-primary" />
            <h3 className="font-semibold font-display">Dealer Leaderboard</h3>
          </div>
          <div className="space-y-3">
            {dealerWarrantyCounts.length === 0 && <p className="text-sm text-muted-foreground">No dealer data yet</p>}
            {dealerWarrantyCounts.map((d, i) => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground w-5 tabular-nums">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{d.name}</p>
                  <div className="h-1.5 rounded-full bg-secondary mt-1">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(d.count / maxWarrantyCount) * 100}%` }} />
                  </div>
                </div>
                <span className="text-sm font-bold tabular-nums">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="font-semibold font-display">Platform Activity</h3>
          </div>
          <div className="space-y-3">
            {recentLogs.length === 0 && <p className="text-sm text-muted-foreground">No activity recorded yet</p>}
            {recentLogs.map(entry => (
              <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{entry.details}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(entry.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    {" · "}
                    {new Date(entry.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
