import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { demoWarranties, demoClaims, demoCustomers } from "@/data/demo-data";
import { useAuth } from "@/contexts/AuthContext";
import { lookupVehicle, type DVLAVehicle } from "@/lib/simulated-apis";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Shield, FileText, Users, ClipboardList, TrendingUp, AlertTriangle,
  Search, Plus, Car, CheckCircle2, Loader2, ArrowRight, Clock
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

function StatCard({ icon: Icon, label, value, sub, accent }: { icon: any; label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent ? "bg-accent/10" : "bg-primary/10"}`}>
          <Icon className={`w-5 h-5 ${accent ? "text-accent" : "text-primary"}`} />
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
  const dealerId = user?.dealerId || "d-1";
  const warranties = demoWarranties.filter(w => w.dealerId === dealerId);
  const claims = demoClaims.filter(c => c.dealerId === dealerId);
  const customers = demoCustomers.filter(c => c.dealerId === dealerId);

  const active = warranties.filter(w => w.status === "active").length;
  const expired = warranties.filter(w => w.status === "expired").length;
  const totalValue = warranties.reduce((s, w) => s + w.cost, 0);
  const openClaims = claims.filter(c => c.status === "pending" || c.status === "under_review").length;
  const resolvedClaims = claims.filter(c => c.status === "approved" || c.status === "rejected").length;

  const [reg, setReg] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState<DVLAVehicle | null>(null);

  const handleQuickLookup = async () => {
    if (!reg.trim()) return;
    setLoading(true);
    const result = await lookupVehicle(reg);
    setVehicle(result);
    setLoading(false);
    if (result) {
      toast.success(`Vehicle found: ${result.make} ${result.model}`);
    }
  };

  const monthlyData = [
    { month: "Sep", warranties: 3, revenue: 1500 },
    { month: "Oct", warranties: 5, revenue: 2800 },
    { month: "Nov", warranties: 4, revenue: 2200 },
    { month: "Dec", warranties: 7, revenue: 3900 },
    { month: "Jan", warranties: 6, revenue: 3400 },
    { month: "Feb", warranties: 8, revenue: 4500 },
  ];

  const statusData = [
    { name: "Active", value: active, color: "hsl(172, 66%, 40%)" },
    { name: "Expired", value: expired || 1, color: "hsl(0, 72%, 51%)" },
    { name: "Cancelled", value: warranties.filter(w => w.status === "cancelled").length || 0, color: "hsl(220, 10%, 46%)" },
  ].filter(d => d.value > 0);

  const recentClaims = claims.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display">
          Dashboard<span className="text-accent">.</span>
        </h1>
        <p className="text-muted-foreground text-sm">Welcome back, {user?.name}</p>
      </div>

      {/* Quick Actions Hero */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Quick Reg Lookup */}
        <div className="lg:col-span-3 bg-teal rounded-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Car className="w-5 h-5 text-accent" />
              <h2 className="font-semibold font-display text-lg">Add New Warranty</h2>
            </div>
            <p className="text-sm text-white/60 mb-4">Enter a registration to get started instantly</p>

            <div className="flex gap-2">
              <Input
                placeholder="Enter reg e.g. AB12 CDE"
                value={reg}
                onChange={e => setReg(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === "Enter" && handleQuickLookup()}
                className="font-mono text-base tracking-widest bg-white/10 border-white/20 h-12 text-lg text-white placeholder:text-white/40 focus-visible:ring-accent"
              />
              <Button onClick={handleQuickLookup} disabled={loading} size="lg" className="h-12 px-6 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5 mr-1" /> Look Up</>}
              </Button>
            </div>

            {vehicle && (
              <div className="mt-4 bg-white/10 border border-white/20 rounded-lg p-4 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-accent text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Vehicle Found
                  </div>
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" onClick={() => navigate("/dealer/warranties/new")}>
                    Continue <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div><span className="text-white/50">Make:</span> <span className="font-medium">{vehicle.make}</span></div>
                  <div><span className="text-white/50">Model:</span> <span className="font-medium">{vehicle.model}</span></div>
                  <div><span className="text-white/50">Year:</span> <span className="font-medium">{vehicle.year}</span></div>
                  <div><span className="text-white/50">Colour:</span> <span className="font-medium">{vehicle.colour}</span></div>
                  <div><span className="text-white/50">Fuel:</span> <span className="font-medium">{vehicle.fuelType}</span></div>
                  <div><span className="text-white/50">Engine:</span> <span className="font-medium">{vehicle.engineSize}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/dealer/warranties/new")}
            className="bg-card rounded-xl p-5 text-left border-2 border-border hover:border-accent/40 transition-all group shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
              <Plus className="w-5 h-5 text-accent" />
            </div>
            <p className="font-semibold font-display">Add Warranty</p>
            <p className="text-xs text-muted-foreground mt-1">Issue a new warranty</p>
          </button>

          <button
            onClick={() => navigate("/dealer/claims")}
            className="bg-card rounded-xl p-5 text-left border-2 border-border hover:border-accent/40 transition-all group shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
              <ClipboardList className="w-5 h-5 text-accent" />
            </div>
            <p className="font-semibold font-display">Claims</p>
            <p className="text-xs text-muted-foreground mt-1">{openClaims} open claims</p>
          </button>

          <button
            onClick={() => navigate("/dealer/customers")}
            className="bg-card rounded-xl p-5 text-left border-2 border-border hover:border-accent/40 transition-all group shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="font-semibold font-display">Customers</p>
            <p className="text-xs text-muted-foreground mt-1">{customers.length} total</p>
          </button>

          <button
            onClick={() => navigate("/dealer/requests")}
            className="bg-card rounded-xl p-5 text-left border-2 border-border hover:border-accent/40 transition-all group shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <p className="font-semibold font-display">Requests</p>
            <p className="text-xs text-muted-foreground mt-1">Customer requests</p>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={FileText} label="Total Warranties" value={warranties.length} />
        <StatCard icon={Shield} label="Active" value={active} sub={`${expired} expired`} accent />
        <StatCard icon={TrendingUp} label="Total Value" value={`£${totalValue.toLocaleString()}`} accent />
        <StatCard icon={ClipboardList} label="Open Claims" value={openClaims} />
        <StatCard icon={AlertTriangle} label="Resolved Claims" value={resolvedClaims} />
        <StatCard icon={Users} label="Customers" value={customers.length} />
      </div>

      {/* Charts + Recent Claims */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="font-semibold font-display mb-4">Monthly Revenue<span className="text-accent">.</span></h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fill: "hsl(195, 15%, 42%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(195, 15%, 42%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}`} />
              <Tooltip contentStyle={{ background: "hsl(192, 100%, 12%)", border: "1px solid hsl(192, 80%, 18%)", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="revenue" fill="hsl(25, 100%, 50%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="font-semibold font-display mb-4">Recent Claims<span className="text-accent">.</span></h3>
          <div className="space-y-3">
            {recentClaims.length === 0 && <p className="text-sm text-muted-foreground">No claims yet</p>}
            {recentClaims.map(claim => (
              <div key={claim.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                onClick={() => navigate("/dealer/claims")}>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  claim.status === "pending" ? "bg-amber-500" :
                  claim.status === "under_review" ? "bg-blue-500" :
                  claim.status === "approved" ? "bg-emerald-500" : "bg-destructive"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{claim.description}</p>
                  <p className="text-xs text-muted-foreground capitalize">{claim.status.replace("_", " ")}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            ))}
          </div>

          {/* Warranty Status Breakdown */}
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-sm font-medium font-display mb-3">Warranty Status</h4>
            <div className="space-y-2.5">
              {statusData.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-secondary mx-2">
                    <div className="h-full rounded-full transition-all" style={{ background: d.color, width: `${(d.value / warranties.length) * 100}%` }} />
                  </div>
                  <span className="font-medium tabular-nums">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
