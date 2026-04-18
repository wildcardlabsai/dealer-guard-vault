import { demoDealers, demoWarranties } from "@/data/demo-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Period = "month" | "3months" | "all";

export default function AdminRevenue() {
  const [period, setPeriod] = useState<Period>("all");

  const warrantyFees = demoWarranties.length * 15;

  const dealerRevenue = demoDealers.map(d => ({
    name: d.name,
    warranties: demoWarranties.filter(w => w.dealerId === d.id).length * 15,
  }));

  // Simulated monthly breakdown for period filtering
  const allMonthly = [
    { month: "Oct", fees: 45 },
    { month: "Nov", fees: 60 },
    { month: "Dec", fees: 75 },
    { month: "Jan", fees: 90 },
    { month: "Feb", fees: 105 },
    { month: "Mar", fees: 90 },
  ];

  const monthlyData = period === "month"
    ? allMonthly.slice(-1)
    : period === "3months"
    ? allMonthly.slice(-3)
    : allMonthly;

  const periodTotal = monthlyData.reduce((sum, m) => sum + m.fees, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold font-display">Revenue</h1>
        <div className="flex gap-2">
          {([["month", "This Month"], ["3months", "Last 3 Months"], ["all", "All Time"]] as [Period, string][]).map(([key, label]) => (
            <Button key={key} variant={period === key ? "default" : "outline"} size="sm" onClick={() => setPeriod(key)}>
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Warranty Fees</p>
          <p className="text-2xl font-bold font-display">£{warrantyFees}</p>
          <p className="text-xs text-muted-foreground">{demoWarranties.length} warranties × £15</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Period Revenue</p>
          <p className="text-2xl font-bold font-display">£{periodTotal}</p>
          <p className="text-xs text-muted-foreground">{monthlyData.length} month{monthlyData.length > 1 ? "s" : ""}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Active Dealers</p>
          <p className="text-2xl font-bold font-display gradient-text">{demoDealers.filter(d => d.status === "active").length}</p>
          <p className="text-xs text-muted-foreground">Pay-per-use model</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold font-display mb-4">Revenue by Dealer</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dealerRevenue}>
            <XAxis dataKey="name" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}`} />
            <Tooltip contentStyle={{ background: "hsl(222, 25%, 10%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8, color: "#fff" }} />
            <Bar dataKey="warranties" fill="hsl(172, 66%, 40%)" radius={[4, 4, 0, 0]} name="Warranty Fees" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
