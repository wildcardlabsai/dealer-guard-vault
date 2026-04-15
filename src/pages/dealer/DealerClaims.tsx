import { useWarrantyStore } from "@/lib/warranty-store";
import { useWarrantyLineStore } from "@/lib/warranty-line-store";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: Clock },
  under_review: { label: "Under Review", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: MessageSquare },
  approved: { label: "Approved", color: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
  info_requested: { label: "Info Requested", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: MessageSquare },
};

export default function DealerClaims() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "";
  const store = useWarrantyStore();
  const warrantyLineStore = useWarrantyLineStore();
  const warrantyLine = warrantyLineStore.getLine(dealerId);
  const claims = store.claims.filter(c => c.dealerId === dealerId);
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAction = (claimId: string, action: "approved" | "rejected" | "info_requested") => {
    store.updateClaimStatus(claimId, action, user?.name || "Dealer");
    toast.success(`Claim ${action.replace("_", " ")} successfully`);
  };

  const openClaims = claims.filter(c => c.status === "pending" || c.status === "under_review").length;
  const approvedClaims = claims.filter(c => c.status === "approved").length;
  const rejectedClaims = claims.filter(c => c.status === "rejected").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Claims</h1>
        <p className="text-sm text-muted-foreground">{claims.length} claims</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold font-display text-amber-400">{openClaims}</p>
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

      <div className="space-y-4">
        {claims.map(claim => {
          const status = statusConfig[claim.status];
          const isOpen = selectedClaim === claim.id;
          return (
            <div key={claim.id} className="glass-card rounded-xl overflow-hidden">
              <div className="p-5 cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => setSelectedClaim(isOpen ? null : claim.id)}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{claim.customerName}</p>
                    <p className="text-sm text-muted-foreground">{claim.vehicleReg} — {claim.description.slice(0, 60)}...</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {claim.amount && <span className="text-sm font-medium">£{claim.amount}</span>}
                    <Badge variant="outline" className={status.color}>
                      <status.icon className="w-3 h-3 mr-1" /> {status.label}
                    </Badge>
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-border/50 p-5 space-y-4 animate-fade-in">
                  <div>
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-muted-foreground">{claim.description}</p>
                  </div>

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

                  {(claim.status === "pending" || claim.status === "under_review") && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={() => handleAction(claim.id, "approved")}>
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleAction(claim.id, "rejected")}>
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAction(claim.id, "info_requested")}>
                        <MessageSquare className="w-4 h-4 mr-1" /> Request Info
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {claims.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">No claims yet</div>
        )}
      </div>
    </div>
  );
}
