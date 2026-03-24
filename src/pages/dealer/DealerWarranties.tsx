import { useState } from "react";
import { demoWarranties } from "@/data/demo-data";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Plus, Search, Eye } from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-primary/10 text-primary border-primary/20",
  expired: "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-muted text-muted-foreground border-border",
};

export default function DealerWarranties() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "d-1";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const warranties = demoWarranties
    .filter(w => w.dealerId === dealerId)
    .filter(w => statusFilter === "all" || w.status === statusFilter)
    .filter(w =>
      w.customerName.toLowerCase().includes(search.toLowerCase()) ||
      w.vehicleReg.toLowerCase().includes(search.toLowerCase()) ||
      w.vehicleMake.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Warranties</h1>
          <p className="text-sm text-muted-foreground">{warranties.length} warranties found</p>
        </div>
        <Button className="glow-primary-sm" asChild>
          <Link to="/dealer/warranties/new"><Plus className="w-4 h-4 mr-2" /> Add Warranty</Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, reg or make..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {["all", "active", "expired", "cancelled"].map(s => (
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)} className="capitalize">
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Vehicle</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Reg</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Duration</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Cost</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warranties.map(w => (
                <tr key={w.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">{w.customerName}</td>
                  <td className="p-4 text-muted-foreground">{w.vehicleMake} {w.vehicleModel}</td>
                  <td className="p-4 hidden lg:table-cell"><code className="text-xs bg-secondary/50 px-2 py-1 rounded">{w.vehicleReg}</code></td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{w.duration} months</td>
                  <td className="p-4 font-medium">£{w.cost}</td>
                  <td className="p-4">
                    <Badge variant="outline" className={`capitalize ${statusColors[w.status]}`}>{w.status}</Badge>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
