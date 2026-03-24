import { demoDealers, demoWarranties, demoClaims } from "@/data/demo-data";
import { Building2, FileText, TrendingUp, ClipboardList, Users, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <p className="text-2xl font-bold font-display">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const totalDealers = demoDealers.length;
  const totalWarranties = demoWarranties.length;
  const totalClaims = demoClaims.length;
  const subscriptionRevenue = demoDealers.filter(d => d.status === "active").length * 50;
  const warrantyRevenue = totalWarranties * 15;
  const totalRevenue = subscriptionRevenue + warrantyRevenue;

  const monthlyData = [
    { month: "Oct", subscriptions: 100, warranties: 45 },
    { month: "Nov", subscriptions: 100, warranties: 60 },
    { month: "Dec", subscriptions: 150, warranties: 75 },
    { month: "Jan", subscriptions: 150, warranties: 90 },
    { month: "Feb", subscriptions: 150, warranties: 105 },
    { month: "Mar", subscriptions: 150, warranties: 90 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Building2} label="Dealers" value={totalDealers} />
        <StatCard icon={FileText} label="Warranties" value={totalWarranties} />
        <StatCard icon={ClipboardList} label="Claims" value={totalClaims} />
        <StatCard icon={DollarSign} label="Sub Revenue" value={`£${subscriptionRevenue}`} />
        <StatCard icon={TrendingUp} label="Warranty Fees" value={`£${warrantyRevenue}`} />
        <StatCard icon={Users} label="Total Revenue" value={`£${totalRevenue}`} />
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold font-display mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <XAxis dataKey="month" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}`} />
            <Tooltip contentStyle={{ background: "hsl(222, 25%, 10%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8, color: "#fff" }} />
            <Line type="monotone" dataKey="subscriptions" stroke="hsl(172, 66%, 40%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="warranties" stroke="hsl(190, 80%, 50%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
