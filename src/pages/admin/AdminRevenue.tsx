import { useWarrantyStore } from "@/lib/warranty-store";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Dealer } from "@/data/demo-data";

type Period = "month" | "3months" | "all";

export default function AdminRevenue() {
  const [period, setPeriod] = useState<Period>("all");
  const store = useWarrantyStore();
  const [dealers, setDealers] = useState<Dealer[]>([]);

  const fetchDealers = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-data", {
        body: { table: "dealers", action: "select" },
      });
      if (!error && data?.data) {
        setDealers((data.data as any[]).map((d: any) => ({
          id: d.dealer_code || d.id,
          name: d.name,
          email: d.email,
          phone: d.phone || "",
          fcaNumber: d.fca_number || "",
          address: d.address || "",
          city: d.city || "",
          postcode: d.postcode || "",
          createdAt: d.joined_at || d.created_at,
          status: d.status as any,
          warrantyCount: 0,
          monthlyFee: 0,
        })));
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchDealers(); }, [fetchDealers]);

  const warranties = store.warranties;
  const warrantyFees = warranties.length * 15;

  const dealerRevenue = dealers.map(d => ({
    name: d.name,
    warranties: warranties.filter(w => w.dealerId === d.id).length * 15,
  }));

  // Monthly breakdown from real data
  const allMonthly = (() => {
    const months: Record<string, number> = {};
    warranties.forEach(w => {
      const d = new Date(w.createdAt);
      const key = d.toLocaleDateString("en-GB", { month: "short" });
      months[key] = (months[key] || 0) + 15;
    });
    return Object.entries(months).map(([month, fees]) => ({ month, fees }));
  })();

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
          <p className="text-xs text-muted-foreground">{warranties.length} warranties × £15</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Period Revenue</p>
          <p className="text-2xl font-bold font-display">£{periodTotal}</p>
          <p className="text-xs text-muted-foreground">{monthlyData.length} month{monthlyData.length > 1 ? "s" : ""}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Active Dealers</p>
          <p className="text-2xl font-bold font-display gradient-text">{dealers.filter(d => d.status === "active").length}</p>
          <p className="text-xs text-muted-foreground">Pay-per-use model</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold font-display mb-4">Revenue by Dealer</h3>
        {dealerRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dealerRevenue}>
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}`} />
              <Tooltip contentStyle={{ background: "hsl(222, 25%, 10%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="warranties" fill="hsl(172, 66%, 40%)" radius={[4, 4, 0, 0]} name="Warranty Fees" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">No dealer data yet</div>
        )}
      </div>
    </div>
  );
}
