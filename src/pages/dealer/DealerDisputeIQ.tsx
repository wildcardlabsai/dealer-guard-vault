import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDisputeIQStore, type DisputeCase, type CaseStatus } from "@/lib/disputeiq-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield, Plus, Search, Clock, CheckCircle2, FileText, AlertTriangle,
  Sparkles, ArrowRight, Trash2
} from "lucide-react";

const statusConfig: Record<CaseStatus, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground" },
  assessed: { label: "Assessed", color: "bg-primary/10 text-primary" },
  responded: { label: "Responded", color: "bg-green-500/10 text-green-600" },
  closed: { label: "Closed", color: "bg-secondary text-secondary-foreground" },
};

const riskColors: Record<string, string> = {
  low: "text-green-600 bg-green-500/10",
  medium: "text-[hsl(var(--cta))] bg-[hsl(var(--cta))]/10",
  high: "text-destructive bg-destructive/10",
};

export default function DealerDisputeIQ() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dealerId = user?.dealerId || "d-1";
  const store = useDisputeIQStore();
  const cases = store.getCasesForDealer(dealerId);
  const [search, setSearch] = useState("");

  const filtered = cases.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.customerName.toLowerCase().includes(q) || c.vehicleReg.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold font-display">DisputeIQ</h1>
            <Badge variant="outline" className="text-xs">AI-Powered</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Customer Complaint Helper — guided responses & AI reasoning</p>
        </div>
        <Button className="btn-cta rounded-full" onClick={() => navigate("/dealer/disputeiq/new")}>
          <Plus className="w-4 h-4 mr-2" /> Start New Assessment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Cases", value: cases.length, icon: FileText },
          { label: "Active", value: cases.filter(c => c.status === "draft" || c.status === "assessed").length, icon: Clock },
          { label: "Responded", value: cases.filter(c => c.status === "responded").length, icon: CheckCircle2 },
          { label: "High Risk", value: cases.filter(c => c.aiRiskLevel === "high").length, icon: AlertTriangle },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-xl font-bold font-display">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by customer, reg, or case ID..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Cases */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Sparkles className="w-10 h-10 mx-auto text-primary/30 mb-4" />
          <h3 className="font-semibold font-display mb-2">No cases yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Start your first assessment to handle a complaint with confidence.</p>
          <Button className="btn-cta rounded-full" onClick={() => navigate("/dealer/disputeiq/new")}>
            <Plus className="w-4 h-4 mr-2" /> Start New Assessment
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(c => {
            const sc = statusConfig[c.status];
            return (
              <div key={c.id} className="glass-card rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all"
                onClick={() => navigate(`/dealer/disputeiq/${c.id}`)}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-sm truncate">{c.customerName}</p>
                    <span className="text-xs text-muted-foreground">{c.vehicleReg}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.complaintType} — {c.issueClassification || "Unclassified"}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {c.aiRiskLevel && (
                    <Badge variant="outline" className={`text-xs ${riskColors[c.aiRiskLevel]}`}>
                      {c.aiRiskLevel} risk
                    </Badge>
                  )}
                  <Badge variant="outline" className={`text-xs ${sc.color}`}>{sc.label}</Badge>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
