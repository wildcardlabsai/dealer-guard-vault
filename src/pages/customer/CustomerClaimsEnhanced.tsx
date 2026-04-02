import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useClaimStore } from "@/lib/claim-store";
import { useWarrantyLineStore } from "@/lib/warranty-line-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { claimStatusConfig } from "@/data/claim-data";
import type { EnhancedClaim } from "@/data/claim-data";
import {
  Plus, Phone, ArrowRight, Clock, FileText, MessageSquare,
  ChevronDown, ChevronUp, AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function CustomerClaimsEnhanced() {
  const { user } = useAuth();
  const claimStore = useClaimStore();
  const warrantyLineStore = useWarrantyLineStore();
  const claims = claimStore.getClaimsForCustomer(user?.id || "");
  const dealerId = claims[0]?.dealerId;
  const warrantyLine = dealerId ? warrantyLineStore.getLine(dealerId) : null;
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});
  const [replyText, setReplyText] = useState("");

  const handleReply = (claimId: string) => {
    if (!replyText.trim()) return;
    claimStore.addMessage(claimId, {
      from: user?.name || "",
      fromRole: "customer",
      message: replyText,
      timestamp: new Date().toISOString(),
      internal: false,
    });
    setReplyText("");
    toast.success("Reply sent");
  };

  const getTab = (claimId: string) => activeTab[claimId] || "summary";
  const setTab = (claimId: string, tab: string) => setActiveTab(prev => ({ ...prev, [claimId]: tab }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">My Claims</h1>
          <p className="text-sm text-muted-foreground">{claims.length} claims</p>
        </div>
        <Button size="sm" asChild>
          <Link to="/customer/claims/new"><Plus className="w-4 h-4 mr-1" /> Start New Claim</Link>
        </Button>
      </div>

      {warrantyLine?.status === "active" && warrantyLine.phoneNumber && (
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <Phone className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Or call your warranty line</p>
            <p className="text-lg font-bold font-display tracking-wide">{warrantyLine.phoneNumber}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {claims.map(claim => {
          const status = claimStatusConfig[claim.status];
          const isOpen = expandedClaim === claim.id;
          const tab = getTab(claim.id);
          const visibleMessages = claim.messages.filter(m => !m.internal);
          return (
            <div key={claim.id} className="glass-card rounded-xl overflow-hidden">
              <button
                className="w-full p-5 text-left hover:bg-secondary/20 transition-colors"
                onClick={() => setExpandedClaim(isOpen ? null : claim.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{claim.reference}</span>
                      <Badge variant="outline" className={status.color}>{status.label}</Badge>
                    </div>
                    <p className="font-medium">{claim.issueTitle}</p>
                    <p className="text-sm text-muted-foreground">{claim.vehicleReg} — {claim.vehicleMake} {claim.vehicleModel}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {claim.createdAt}
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border/50 animate-fade-in">
                  <div className="flex border-b border-border/50 px-2">
                    {["summary", "messages", "documents", "timeline"].map(t => (
                      <button key={t} className={`px-4 py-2.5 text-xs font-medium capitalize transition-colors ${
                        tab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                      }`} onClick={() => setTab(claim.id, t)}>{t}</button>
                    ))}
                  </div>

                  <div className="p-5">
                    {tab === "summary" && (
                      <div className="space-y-3 text-sm">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div><span className="text-muted-foreground">Reference:</span> <span className="font-mono">{claim.reference}</span></div>
                          <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={status.color}>{status.label}</Badge></div>
                          <div><span className="text-muted-foreground">Mileage:</span> {claim.currentMileage?.toLocaleString()}</div>
                          <div><span className="text-muted-foreground">Submitted:</span> {claim.createdAt}</div>
                        </div>
                        <div className="pt-2 border-t border-border/50">
                          <p className="text-muted-foreground mb-1">Issue:</p>
                          <p>{claim.description}</p>
                        </div>
                        {claim.decision && (
                          <div className={`rounded-lg p-4 mt-3 ${
                            claim.decision.type === "approved" ? "bg-primary/5 border border-primary/20" :
                            claim.decision.type === "rejected" ? "bg-destructive/5 border border-destructive/20" :
                            "bg-amber-500/5 border border-amber-500/20"
                          }`}>
                            <p className="font-medium capitalize mb-1">Decision: {claim.decision.type.replace(/_/g, " ")}</p>
                            <p className="text-muted-foreground">{claim.decision.note}</p>
                            {claim.decision.payoutAmount && <p className="mt-1 font-medium">Payout: £{claim.decision.payoutAmount}</p>}
                          </div>
                        )}
                        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 mt-3">
                          <p className="text-sm text-amber-400 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            Do not authorise repairs unless your dealership has confirmed approval.
                          </p>
                        </div>
                      </div>
                    )}

                    {tab === "messages" && (
                      <div className="space-y-4">
                        {visibleMessages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet</p>}
                        {visibleMessages.map(msg => (
                          <div key={msg.id} className={`rounded-lg p-3 text-sm ${
                            msg.fromRole === "customer" ? "bg-primary/5 border border-primary/20 ml-8" : "bg-secondary/30 mr-8"
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-xs">{msg.from}</span>
                              <span className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleDateString("en-GB")}</span>
                            </div>
                            <p>{msg.message}</p>
                          </div>
                        ))}
                        {claim.status === "awaiting_info" && (
                          <div className="space-y-2 pt-2 border-t border-border/50">
                            <Textarea placeholder="Type your reply..." value={replyText} onChange={e => setReplyText(e.target.value)} rows={3} />
                            <Button size="sm" onClick={() => handleReply(claim.id)}>
                              <MessageSquare className="w-4 h-4 mr-1" /> Send Reply
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {tab === "documents" && (
                      <div className="space-y-2">
                        {claim.files.length === 0 && <p className="text-sm text-muted-foreground">No documents uploaded</p>}
                        {claim.files.map(f => (
                          <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{f.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">{f.type.replace("_", " ")} • {f.uploadedAt}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {tab === "timeline" && (
                      <div className="space-y-3">
                        {claim.timeline.map((t, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
                              {i < claim.timeline.length - 1 && <div className="w-px flex-1 bg-border/50 mt-1" />}
                            </div>
                            <div className="pb-3">
                              <p className="text-sm">{t.action}</p>
                              <p className="text-xs text-muted-foreground">{t.date} — {t.by}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {claims.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No claims submitted yet</p>
            <Button size="sm" className="mt-4" asChild>
              <Link to="/customer/claims/new">Start a Claim <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
