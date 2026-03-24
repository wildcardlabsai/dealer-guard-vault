import { demoWarranties, demoClaims, demoCustomers } from "@/data/demo-data";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, FileText, Users, ClipboardList, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color || "bg-primary/10"}`}>
          <Icon className={`w-4 h-4 ${color ? "text-foreground" : "text-primary"}`} />
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
  const dealerId = user?.dealerId || "d-1";
  const warranties = demoWarranties.filter(w => w.dealerId === dealerId);
  const claims = demoClaims.filter(c => c.dealerId === dealerId);
  const customers = demoCustomers.filter(c => c.dealerId === dealerId);

  const active = warranties.filter(w => w.status === "active").length;
  const expired = warranties.filter(w => w.status === "expired").length;
  const totalValue = warranties.reduce((s, w) => s + w.cost, 0);
  const openClaims = claims.filter(c => c.status === "pending" || c.status === "under_review").length;
  const resolvedClaims = claims.filter(c => c.status === "approved" || c.status === "rejected").length;

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={FileText} label="Total Warranties" value={warranties.length} />
        <StatCard icon={Shield} label="Active" value={active} sub={`${expired} expired`} />
        <StatCard icon={TrendingUp} label="Total Value" value={`£${totalValue.toLocaleString()}`} />
        <StatCard icon={ClipboardList} label="Open Claims" value={openClaims} />
        <StatCard icon={AlertTriangle} label="Resolved Claims" value={resolvedClaims} />
        <StatCard icon={Users} label="Customers" value={customers.length} />
      </div>

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
          <h3 className="font-semibold font-display mb-4">Warranty Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(222, 25%, 10%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8, color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {statusData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="ml-auto font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
