import { useClaimStore } from "@/lib/claim-store";
import { claimStatusConfig, claimPriorityConfig } from "@/data/claim-data";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, MessageSquare, Clock, ClipboardList, Search, Eye, Edit, Save } from "lucide-react";
import { toast } from "sonner";

const defaultStatusConfig = { label: "Unknown", color: "bg-muted text-muted-foreground border-border" };

export default function DealerClaims() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "";
  const claimStore = useClaimStore();
  const claims = claimStore.getClaimsForDealer(dealerId);
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState("");
  const navigate = useNavigate();

  const filtered = claims.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.customerName.toLowerCase().includes(q) || c.vehicleReg.toLowerCase().includes(q) ||
        c.reference.toLowerCase().includes(q) || c.issueTitle.toLowerCase().includes(q);
    }
    return true;
  });

  const handleStatusChange = (claimId: string, newStatus: string) => {
    claimStore.updateStatus(claimId, newStatus as any, user?.name || "Dealer");
    toast.success(`Claim status updated to ${newStatus.replace(/_/g, " ")}`);
  };

  const handleSaveNotes = (claimId: string) => {
    claimStore.addMessage(claimId, {
      from: user?.name || "Dealer",
      fromRole: "dealer",
      message: notesText,
      timestamp: new Date().toISOString(),
      internal: true,
    });
    setEditingNotes(false);
    setNotesText("");
    toast.success("Internal note added");
  };

  const openCount = claims.filter(c => ["submitted", "awaiting_review", "under_assessment", "pending", "under_review"].includes(c.status)).length;
  const approvedClaims = claims.filter(c => c.status === "approved" || c.status === "partially_approved").length;
  const rejectedClaims = claims.filter(c => c.status === "rejected").length;

  const claim = selectedClaim ? claimStore.getClaim(selectedClaim) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Claims</h1>
          <p className="text-sm text-muted-foreground">{claims.length} claims</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/dealer/claim-assist")}>
          Open Claim Assist
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold font-display text-amber-400">{openCount}</p>
          <p className="text-xs text-muted-foreground">Open</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold font-display text-primary">{approvedClaims}</p>
          <p className="text-xs text-muted-foreground">Approved</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold font-display text-destructive">{rejectedClaims}</p>
          <p className="text-xs text-muted-foreground">Rejected</p>
        </div>
      </div>

      {/* Search & Filter */}
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

      {/* Claim Detail View */}
      {claim && (
        <div className="glass-card-strong rounded-xl overflow-hidden animate-fade-in">
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-muted-foreground">{claim.reference}</span>
                <Badge variant="outline" className={(claimStatusConfig[claim.status] || defaultStatusConfig).color}>
                  {(claimStatusConfig[claim.status] || defaultStatusConfig).label}
                </Badge>
              </div>
              <p className="font-medium">{claim.customerName} — {claim.vehicleReg}</p>
              <p className="text-sm text-muted-foreground">{claim.issueTitle}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedClaim(null)}>✕</Button>
          </div>

          <div className="p-5 space-y-4">
            {/* Description */}
            <div>
              <p className="text-sm font-medium mb-1">Description</p>
              <p className="text-sm text-muted-foreground">{claim.description}</p>
            </div>

            {/* Vehicle details */}
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div><span className="text-muted-foreground">Vehicle:</span> <span className="font-medium">{claim.vehicleMake} {claim.vehicleModel}</span></div>
              <div><span className="text-muted-foreground">Mileage:</span> <span className="font-medium">{claim.currentMileage?.toLocaleString() || "N/A"}</span></div>
              <div><span className="text-muted-foreground">Drivable:</span> <span className="font-medium capitalize">{claim.vehicleDrivable}</span></div>
            </div>

            {/* Status Change */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Update Status</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(claimStatusConfig).map(([key, val]) => (
                  <Button key={key} size="sm" variant={claim.status === key ? "default" : "outline"}
                    className={claim.status === key ? "" : "text-xs"}
                    onClick={() => handleStatusChange(claim.id, key)}
                    disabled={claim.status === key}>
                    {val.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Decision amount */}
            {claim.decision && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
                <p className="font-medium capitalize">{claim.decision.type.replace(/_/g, " ")}</p>
                <p className="text-muted-foreground">{claim.decision.note}</p>
                {claim.decision.payoutAmount && <p className="font-medium mt-1">Payout: £{claim.decision.payoutAmount}</p>}
              </div>
            )}

            {/* Internal Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Internal Notes</p>
                <Button size="sm" variant="outline" onClick={() => setEditingNotes(!editingNotes)}>
                  <Edit className="w-3 h-3 mr-1" /> {editingNotes ? "Cancel" : "Add Note"}
                </Button>
              </div>
              {editingNotes && (
                <div className="space-y-2 mb-3">
                  <Textarea value={notesText} onChange={e => setNotesText(e.target.value)} placeholder="Add an internal note..." rows={3} />
                  <Button size="sm" onClick={() => handleSaveNotes(claim.id)} disabled={!notesText.trim()}>
                    <Save className="w-3 h-3 mr-1" /> Save Note
                  </Button>
                </div>
              )}
              {claim.messages.filter(m => m.internal).length > 0 && (
                <div className="space-y-2">
                  {claim.messages.filter(m => m.internal).map(msg => (
                    <div key={msg.id} className="bg-secondary/30 rounded-lg p-3 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-xs">{msg.from}</span>
                        <span className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleDateString("en-GB")}</span>
                      </div>
                      <p className="text-muted-foreground">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div>
              <p className="text-sm font-medium mb-2">Timeline</p>
              <div className="space-y-3">
                {claim.timeline.map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm">{t.action}</p>
                      <p className="text-xs text-muted-foreground">{t.date} — {t.by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2 border-t border-border/50">
              <Button size="sm" variant="outline" onClick={() => { navigate("/dealer/claim-assist"); }}>
                <Eye className="w-4 h-4 mr-1" /> Open in Claim Assist
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Claims List */}
      <div className="space-y-3">
        {filtered.map(c => {
          const status = claimStatusConfig[c.status] || defaultStatusConfig;
          return (
            <div key={c.id} className={`glass-card rounded-xl overflow-hidden cursor-pointer transition-all ${selectedClaim === c.id ? "ring-1 ring-primary/30" : "hover:bg-secondary/20"}`}
              onClick={() => setSelectedClaim(selectedClaim === c.id ? null : c.id)}>
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{c.customerName}</p>
                    <p className="text-sm text-muted-foreground">{c.vehicleReg} — {c.issueTitle}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{c.reference}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {c.decision?.payoutAmount && <span className="text-sm font-medium">£{c.decision.payoutAmount}</span>}
                    <Badge variant="outline" className={status.color}>
                      {status.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <EmptyState icon={ClipboardList} title="No Claims Yet" description="When customers submit warranty claims, they'll appear here for review and action." />
        )}
      </div>
    </div>
  );
}