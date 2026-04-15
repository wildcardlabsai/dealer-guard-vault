import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, FileText, ClipboardList, DollarSign, Calendar, Mail, Phone, MapPin } from "lucide-react";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const statusColors: Record<string, string> = {
  active: "bg-primary/10 text-primary border-primary/20",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
  trial: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function AdminDealerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dealer, setDealer] = useState<any>(null);
  const [warranties, setWarranties] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [dealerRes, warrantyRes, claimRes] = await Promise.all([
        supabase.functions.invoke("admin-data", { body: { table: "dealers", action: "select" } }),
        supabase.functions.invoke("admin-data", { body: { table: "warranties", action: "select" } }),
        supabase.functions.invoke("admin-data", { body: { table: "claims", action: "select" } }),
      ]);

      const d = (dealerRes.data?.data as any[])?.find((d: any) => d.id === id);
      setDealer(d);

      const dealerCode = d?.dealer_code || d?.id;
      setWarranties((warrantyRes.data?.data as any[] || []).filter((w: any) => w.dealer_id === dealerCode || w.dealer_id === id));
      setClaims((claimRes.data?.data as any[] || []).filter((c: any) => c.dealer_id === dealerCode || c.dealer_id === id));
    } catch { /* ignore */ }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <DashboardSkeleton statCards={4} />;
  if (!dealer) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Dealer not found</p>
      <Button variant="outline" onClick={() => navigate("/admin/dealers")} className="mt-4">Back to Dealers</Button>
    </div>
  );

  const activeWarranties = warranties.filter(w => w.status === "active").length;
  const totalRevenue = warranties.length * 15;
  const approvedClaims = claims.filter(c => c.status === "approved").length;
  const pendingClaims = claims.filter(c => c.status === "pending").length;

  const warrantyStatuses = [
    { name: "Active", value: warranties.filter(w => w.status === "active").length, color: "hsl(172, 66%, 40%)" },
    { name: "Expired", value: warranties.filter(w => w.status === "expired").length, color: "hsl(215, 15%, 55%)" },
    { name: "Cancelled", value: warranties.filter(w => w.status === "cancelled").length, color: "hsl(0, 72%, 51%)" },
  ].filter(s => s.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/dealers")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-display">{dealer.name}</h1>
            <Badge className={statusColors[dealer.status] || ""}>{dealer.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Dealer Profile</p>
        </div>
      </div>

      {/* Info card */}
      <div className="glass-card rounded-xl p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" /> {dealer.email}
          </div>
          {dealer.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-4 h-4" /> {dealer.phone}</div>}
          {dealer.city && <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /> {dealer.city}{dealer.postcode ? `, ${dealer.postcode}` : ""}</div>}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" /> Joined {new Date(dealer.joined_at || dealer.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: "Warranties", value: warranties.length, sub: `${activeWarranties} active` },
          { icon: ClipboardList, label: "Claims", value: claims.length, sub: `${approvedClaims} approved` },
          { icon: DollarSign, label: "Revenue", value: `£${totalRevenue}`, sub: `${warranties.length} × £15` },
          { icon: Building2, label: "Pending", value: pendingClaims, sub: "claims awaiting" },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <s.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold font-display">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            {s.sub && <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Warranty breakdown */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold font-display mb-4">Warranty Breakdown</h3>
          {warrantyStatuses.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={warrantyStatuses} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                    {warrantyStatuses.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(222, 25%, 10%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8, color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {warrantyStatuses.map(s => (
                  <div key={s.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-muted-foreground flex-1">{s.name}</span>
                    <span className="font-medium tabular-nums">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No warranties issued yet</p>
          )}
        </div>

        {/* Recent warranties */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold font-display mb-4">Recent Warranties</h3>
          <div className="space-y-3">
            {warranties.length === 0 && <p className="text-sm text-muted-foreground">No warranties yet</p>}
            {warranties.slice(0, 8).map((w: any) => (
              <div key={w.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{w.vehicle_reg} — {w.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{w.vehicle_make} {w.vehicle_model}</p>
                </div>
                <Badge variant="outline" className={w.status === "active" ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground"}>{w.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent claims */}
      {claims.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold font-display mb-4">Claims History</h3>
          <div className="space-y-3">
            {claims.slice(0, 10).map((c: any) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.reference} — {c.issue_title}</p>
                  <p className="text-xs text-muted-foreground">{c.vehicle_reg} · {c.customer_name}</p>
                </div>
                <Badge variant="outline">{c.status?.replace(/_/g, " ")}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
