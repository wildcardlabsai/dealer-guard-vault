import { demoDealers, demoWarranties } from "@/data/demo-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminRevenue() {
  const subscriptionRevenue = demoDealers.filter(d => d.status === "active").length * 50;
  const warrantyFees = demoWarranties.length * 15;

  const dealerRevenue = demoDealers.map(d => ({
    name: d.name,
    subscription: d.status === "active" ? 50 : 0,
    warranties: demoWarranties.filter(w => w.dealerId === d.id).length * 15,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">Revenue</h1>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Subscription Revenue</p>
          <p className="text-2xl font-bold font-display">£{subscriptionRevenue}/mo</p>
          <p className="text-xs text-muted-foreground">{demoDealers.filter(d => d.status === "active").length} active dealers × £50</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Warranty Fees</p>
          <p className="text-2xl font-bold font-display">£{warrantyFees}</p>
          <p className="text-xs text-muted-foreground">{demoWarranties.length} warranties × £15</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Platform Revenue</p>
          <p className="text-2xl font-bold font-display gradient-text">£{subscriptionRevenue + warrantyFees}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold font-display mb-4">Revenue by Dealer</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dealerRevenue}>
            <XAxis dataKey="name" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}`} />
            <Tooltip contentStyle={{ background: "hsl(222, 25%, 10%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8, color: "#fff" }} />
            <Bar dataKey="subscription" fill="hsl(172, 66%, 40%)" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="warranties" fill="hsl(190, 80%, 50%)" radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
