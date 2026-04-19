import { useState } from "react";
import { useClaimStore } from "@/lib/claim-store";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { claimStatusConfig, claimPriorityConfig } from "@/data/claim-data";
import { Search, ClipboardList, Building2, BarChart3 } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const fallbackStatus = { label: "Unknown", color: "bg-muted text-muted-foreground border-border" };
const fallbackPriority = { label: "—", color: "bg-muted text-muted-foreground border-border" };

export default function AdminClaims() {
  const claimStore = useClaimStore();
  const allClaims = claimStore.claims;
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClaims = allClaims.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.reference.toLowerCase().includes(q) || c.customerName.toLowerCase().includes(q) ||
        c.vehicleReg.toLowerCase().includes(q) || c.dealerName.toLowerCase().includes(q);
    }
    return true;
  });

  const rejected = allClaims.filter(c => c.status === "rejected");
  const reasonCounts: Record<string, number> = {};
  rejected.forEach(c => {
    const reason = c.decision?.reason || "Other";
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <SEOHead title="All Claims | WarrantyVault Admin" description="Admin view of all claims across dealers." noindex />
      <div>
        <h1 className="text-2xl font-bold font-display">All Claims</h1>
        <p className="text-sm text-muted-foreground">{allClaims.length} claims across all dealers</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4">
          <ClipboardList className="w-4 h-4 text-primary mb-2" />
          <p className="text-2xl font-bold font-display">{allClaims.length}</p>
          <p className="text-sm text-muted-foreground">Total Claims</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <Building2 className="w-4 h-4 text-primary mb-2" />
          <p className="text-2xl font-bold font-display">{new Set(allClaims.map(c => c.dealerId)).size}</p>
          <p className="text-sm text-muted-foreground">Dealers with Claims</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <BarChart3 className="w-4 h-4 text-destructive mb-2" />
          <p className="text-2xl font-bold font-display">{rejected.length}</p>
          <p className="text-sm text-muted-foreground">Rejected</p>
        </div>
      </div>

      {Object.keys(reasonCounts).length > 0 && (
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold font-display text-sm mb-3">Rejection Reason Trends</h3>
          <div className="space-y-2">
            {Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]).map(([reason, count]) => (
              <div key={reason} className="flex items-center gap-3 text-sm">
                <span className="flex-1 text-muted-foreground">{reason}</span>
                <div className="w-24 h-2 rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-destructive" style={{ width: `${(count / rejected.length) * 100}%` }} />
                </div>
                <span className="font-medium w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search claims..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(claimStatusConfig).map(([key, val]) => (
              <SelectItem key={key} value={key}>{val.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ref</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Dealer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Vehicle</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map(claim => {
                const s = claimStatusConfig[claim.status] || fallbackStatus;
                const p = claimPriorityConfig[claim.priority] || fallbackPriority;
                return (
                  <tr key={claim.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{claim.reference}</td>
                    <td className="px-4 py-3 font-medium">{claim.customerName}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{claim.dealerName}</td>
                    <td className="px-4 py-3 font-mono hidden lg:table-cell">{claim.vehicleReg}</td>
                    <td className="px-4 py-3"><Badge variant="outline" className={s.color}>{s.label}</Badge></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><Badge variant="outline" className={p.color}>{p.label}</Badge></td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{claim.createdAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredClaims.length === 0 && <div className="p-8 text-center text-muted-foreground">No claims found</div>}
      </div>
    </div>
  );
}
