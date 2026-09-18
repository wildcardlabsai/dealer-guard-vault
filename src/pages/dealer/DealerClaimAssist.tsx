import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useClaimStore } from "@/lib/claim-store";
import { useCoverStore } from "@/lib/cover-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { claimStatusConfig, claimPriorityConfig, rejectionReasons, messageTemplates } from "@/data/claim-data";
import type { EnhancedClaim, ClaimStatus, ClaimChecklistItem } from "@/data/claim-data";
import {
  ClipboardList, AlertTriangle, Clock, CheckCircle2, XCircle, Eye, Search,
  MessageSquare, FileText, ListChecks, ArrowLeft, Send, BarChart3,
  Shield, User, Car, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

function KPICard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color?: string }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color || "text-primary"}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold font-display">{value}</p>
    </div>
  );
}

export default function DealerClaimAssist() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "d-1";
  const claimStore = useClaimStore();
  const coverStore = useCoverStore();
  const allClaims = claimStore.getClaimsForDealer(dealerId);

  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [msgText, setMsgText] = useState("");
  const [msgInternal, setMsgInternal] = useState(false);
  const [decisionType, setDecisionType] = useState<string>("");
  const [decisionNote, setDecisionNote] = useState("");
  const [decisionReason, setDecisionReason] = useState("");
  const [decisionPayout, setDecisionPayout] = useState("");

  const filteredClaims = allClaims.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.reference.toLowerCase().includes(q) || c.customerName.toLowerCase().includes(q) ||
        c.vehicleReg.toLowerCase().includes(q) || c.issueTitle.toLowerCase().includes(q);
    }
    return true;
  });

  const claim = selectedClaim ? claimStore.getClaim(selectedClaim) : null;

  const openCount = allClaims.filter(c => ["submitted", "awaiting_review", "under_assessment"].includes(c.status)).length;
  const awaitingReview = allClaims.filter(c => c.status === "awaiting_review" || c.status === "submitted").length;
  const awaitingInfo = allClaims.filter(c => c.status === "awaiting_info").length;
  const approvedMonth = allClaims.filter(c => c.status === "approved" || c.status === "partially_approved").length;
  const rejectedMonth = allClaims.filter(c => c.status === "rejected").length;
  const urgent = allClaims.filter(c => c.priority === "urgent").length;

  const handleSendMessage = () => {
    if (!claim || !msgText.trim()) return;
    claimStore.addMessage(claim.id, {
      from: user?.name || "",
      fromRole: "dealer",
      message: msgText,
      timestamp: new Date().toISOString(),
      internal: msgInternal,
    });
    if (!msgInternal && claim.status === "awaiting_review") {
      claimStore.updateStatus(claim.id, "awaiting_info", user?.name || "");
    }
    setMsgText("");
    toast.success(msgInternal ? "Internal note added" : "Message sent to customer");
  };

  const handleDecision = () => {
    if (!claim || !decisionType || !decisionNote) { toast.error("Please fill in decision details"); return; }
    claimStore.makeDecision(claim.id, {
      type: decisionType as any,
      note: decisionNote,
      reason: decisionReason || undefined,
      payoutAmount: decisionPayout ? parseInt(decisionPayout) : undefined,
      timestamp: new Date().toISOString(),
      by: user?.name || "",
    });
    toast.success(`Claim ${decisionType.replace(/_/g, " ")}`);
    // Send claim status email to customer
    if (claim.customerId) {
      const statusMap: Record<string, string> = { approved: "approved", rejected: "rejected", partially_approved: "partially_approved", info_requested: "awaiting_info", escalated: "under_assessment" };
      import("@/lib/email-service").then(m => m.sendClaimStatusEmail(
        "", claim.customerName, claim.reference, statusMap[decisionType] || decisionType
      ));
    }
    setDecisionType("");
    setDecisionNote("");
    setDecisionReason("");
    setDecisionPayout("");
  };

  const handleChecklistUpdate = (index: number, value: "yes" | "no" | "unknown") => {
    if (!claim) return;
    const updated = claim.checklist.map((item, i) => i === index ? { ...item, value } : item);
    claimStore.updateChecklist(claim.id, updated);
  };

  const coverageCheck = (claimData: EnhancedClaim) => {
    if (!claimData.coverTemplateId) return null;
    const result = coverStore.lookupCoverage(claimData.coverTemplateId, claimData.issueTitle);
    return result;
  };

  // Claim workspace view
  if (claim) {
    const status = claimStatusConfig[claim.status];
    const priority = claimPriorityConfig[claim.priority];
    const coverage = coverageCheck(claim);
    const checklistComplete = claim.checklist.filter(c => c.value !== "unknown").length;
    const tabs = ["summary", "evidence", "checklist", "messages", "timeline", "decision", "audit"];

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setSelectedClaim(null)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">{claim.reference}</span>
              <Badge variant="outline" className={status.color}>{status.label}</Badge>
              <Badge variant="outline" className={priority.color}>{priority.label}</Badge>
            </div>
            <h1 className="text-lg font-bold font-display mt-0.5">{claim.issueTitle}</h1>
          </div>
          <div className="flex gap-2">
            {["submitted", "awaiting_review", "under_assessment", "awaiting_info"].includes(claim.status) && (
              <>
                <Button size="sm" variant="outline" onClick={() => { claimStore.updateStatus(claim.id, "under_assessment", user?.name || ""); toast.success("Moved to assessment"); }}>Under Assessment</Button>
                <Button size="sm" onClick={() => { setActiveTab("decision"); }}>Make Decision</Button>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-1 border-b border-border/50 overflow-x-auto">
          {tabs.map(t => (
            <button key={t} className={`px-4 py-2.5 text-xs font-medium capitalize whitespace-nowrap transition-colors ${
              activeTab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
            }`} onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>

        {activeTab === "summary" && (
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-card rounded-xl p-5 space-y-3">
                <h3 className="font-semibold font-display text-sm flex items-center gap-2"><User className="w-4 h-4" /> Customer & Vehicle</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Customer:</span> <span className="font-medium">{claim.customerName}</span></div>
                  <div><span className="text-muted-foreground">Vehicle:</span> <span className="font-medium">{claim.vehicleMake} {claim.vehicleModel}</span></div>
                  <div><span className="text-muted-foreground">Reg:</span> <span className="font-medium font-mono">{claim.vehicleReg}</span></div>
                  <div><span className="text-muted-foreground">Mileage:</span> <span className="font-medium">{claim.currentMileage?.toLocaleString()}</span></div>
                  <div><span className="text-muted-foreground">Drivable:</span> <span className="font-medium capitalize">{claim.vehicleDrivable}</span></div>
                  {claim.atGarage && <div><span className="text-muted-foreground">Garage:</span> <span className="font-medium">{claim.garageName}</span></div>}
                </div>
              </div>
              <div className="glass-card rounded-xl p-5">
                <h3 className="font-semibold font-display text-sm mb-2">Issue Details</h3>
                <p className="text-sm">{claim.description}</p>
                <p className="text-xs text-muted-foreground mt-2">Started: {claim.issueStartDate}</p>
              </div>
              {claim.triageOutcome && (
                <div className={`glass-card rounded-xl p-4 flex items-center gap-3 ${
                  claim.triageOutcome === "likely_covered" ? "border-primary/30" :
                  claim.triageOutcome === "likely_excluded" ? "border-destructive/30" :
                  claim.triageOutcome === "urgent" ? "border-destructive/30" : "border-amber-500/30"
                }`}>
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-sm font-medium capitalize">{claim.triageOutcome.replace(/_/g, " ")}</p>
                    <p className="text-xs text-muted-foreground">Auto-triage result — dealer review required</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {coverage && (
                <div className={`glass-card rounded-xl p-4 ${
                  coverage.status === "covered" ? "border-primary/30" :
                  coverage.status === "excluded" ? "border-destructive/30" : "border-amber-500/30"
                }`}>
                  <h4 className="font-semibold font-display text-xs mb-2 flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Coverage Check</h4>
                  <div className="flex items-center gap-2">
                    {coverage.status === "covered" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    {coverage.status === "excluded" && <XCircle className="w-4 h-4 text-destructive" />}
                    {coverage.status === "conditional" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    <span className="text-sm font-medium capitalize">{coverage.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{coverage.item.name}: {coverage.item.explanation}</p>
                </div>
              )}
              <div className="glass-card rounded-xl p-4">
                <h4 className="font-semibold font-display text-xs mb-2">Checklist Progress</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(checklistComplete / claim.checklist.length) * 100}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{checklistComplete}/{claim.checklist.length}</span>
                </div>
              </div>
              {claim.decision && (
                <div className={`glass-card rounded-xl p-4 ${
                  claim.decision.type === "approved" ? "border-primary/30" :
                  claim.decision.type === "rejected" ? "border-destructive/30" : "border-amber-500/30"
                }`}>
                  <h4 className="font-semibold font-display text-xs mb-2">Decision</h4>
                  <p className="text-sm font-medium capitalize">{claim.decision.type.replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted-foreground mt-1">{claim.decision.note}</p>
                  {claim.decision.payoutAmount && <p className="text-sm font-medium mt-1">£{claim.decision.payoutAmount}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "evidence" && (
          <div className="glass-card rounded-xl p-5 space-y-3">
            {claim.files.length === 0 && <p className="text-sm text-muted-foreground">No evidence uploaded</p>}
            {claim.files.map(f => (
              <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{f.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{f.type.replace("_", " ")} • {f.uploadedAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "checklist" && (
          <div className="glass-card rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold font-display text-sm">Review Checklist</h3>
              <span className="text-xs text-muted-foreground">{checklistComplete}/{claim.checklist.length} complete</span>
            </div>
            {claim.checklist.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-border/30 last:border-0">
                <span className="text-sm flex-1">{item.label}</span>
                <div className="flex gap-1">
                  {(["yes", "no", "unknown"] as const).map(v => (
                    <button key={v} className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                      item.value === v
                        ? v === "yes" ? "bg-primary/20 text-primary" : v === "no" ? "bg-destructive/20 text-destructive" : "bg-secondary text-muted-foreground"
                        : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                    }`} onClick={() => handleChecklistUpdate(i, v)}>
                      {v === "yes" ? "Yes" : v === "no" ? "No" : "?"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button variant={!msgInternal ? "default" : "outline"} size="sm" onClick={() => setMsgInternal(false)}>Customer Messages</Button>
              <Button variant={msgInternal ? "default" : "outline"} size="sm" onClick={() => setMsgInternal(true)}>Internal Notes</Button>
            </div>
            <div className="glass-card rounded-xl p-5 space-y-3 max-h-96 overflow-y-auto">
              {claim.messages.filter(m => msgInternal ? m.internal : !m.internal).map(msg => (
                <div key={msg.id} className={`rounded-lg p-3 text-sm ${
                  msg.fromRole === "dealer" ? "bg-primary/5 border border-primary/20 ml-8" : "bg-secondary/30 mr-8"
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-xs">{msg.from}{msg.internal ? " (internal)" : ""}</span>
                    <span className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleDateString("en-GB")}</span>
                  </div>
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 mb-2">
                {messageTemplates.map((t, i) => (
                  <button key={i} className="text-xs px-2 py-1 rounded-md bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors"
                    onClick={() => setMsgText(t.text)}>{t.label}</button>
                ))}
              </div>
              <Textarea value={msgText} onChange={e => setMsgText(e.target.value)} rows={3}
                placeholder={msgInternal ? "Add internal note..." : "Message to customer..."} />
              <Button size="sm" onClick={handleSendMessage}><Send className="w-4 h-4 mr-1" /> {msgInternal ? "Save Note" : "Send Message"}</Button>
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="glass-card rounded-xl p-5">
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
          </div>
        )}

        {activeTab === "decision" && (
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h3 className="font-semibold font-display">Make Decision</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {(["approved", "partially_approved", "rejected", "info_requested"] as const).map(type => (
                <button key={type} className={`p-3 rounded-lg text-sm text-center transition-all ${
                  decisionType === type ? "bg-primary/10 border border-primary/30 text-primary" : "bg-secondary/30 hover:bg-secondary/50 text-muted-foreground"
                }`} onClick={() => setDecisionType(type)}>
                  {type.replace(/_/g, " ")}
                </button>
              ))}
            </div>

            {decisionType === "rejected" && (
              <div className="space-y-2">
                <Label>Rejection Reason</Label>
                <Select value={decisionReason} onValueChange={setDecisionReason}>
                  <SelectTrigger><SelectValue placeholder="Select reason..." /></SelectTrigger>
                  <SelectContent>{rejectionReasons.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}

            {(decisionType === "approved" || decisionType === "partially_approved") && (
              <div className="space-y-2">
                <Label>Payout Amount (£)</Label>
                <Input type="number" value={decisionPayout} onChange={e => setDecisionPayout(e.target.value)} placeholder="e.g. 850" />
              </div>
            )}

            <div className="space-y-2">
              <Label>Decision Note *</Label>
              <Textarea value={decisionNote} onChange={e => setDecisionNote(e.target.value)} rows={3}
                placeholder="Explain the decision..." />
            </div>

            <Button onClick={handleDecision} className="glow-primary-sm" disabled={!decisionType || !decisionNote}>
              Confirm Decision
            </Button>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-semibold font-display text-sm mb-3">Audit Log</h3>
            <div className="space-y-2">
              {claim.timeline.map((t, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0 text-sm">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground flex-shrink-0">{t.date}</span>
                  <span className="flex-1">{t.action}</span>
                  <span className="text-muted-foreground">{t.by}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Claims dashboard
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Claim Assist</h1>
        <p className="text-sm text-muted-foreground">Manage warranty claims professionally</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <KPICard icon={ClipboardList} label="Open Claims" value={openCount} />
        <KPICard icon={Clock} label="Awaiting Review" value={awaitingReview} color="text-amber-400" />
        <KPICard icon={MessageSquare} label="Awaiting Info" value={awaitingInfo} color="text-purple-400" />
        <KPICard icon={CheckCircle2} label="Approved" value={approvedMonth} />
        <KPICard icon={XCircle} label="Rejected" value={rejectedMonth} color="text-destructive" />
        <KPICard icon={AlertTriangle} label="Urgent" value={urgent} color="text-destructive" />
      </div>

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
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Vehicle</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Issue</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map(claim => {
                const s = claimStatusConfig[claim.status];
                const p = claimPriorityConfig[claim.priority];
                return (
                  <tr key={claim.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors cursor-pointer"
                    onClick={() => { setSelectedClaim(claim.id); setActiveTab("summary"); }}>
                    <td className="px-4 py-3 font-mono text-xs">{claim.reference}</td>
                    <td className="px-4 py-3 font-medium">{claim.customerName}</td>
                    <td className="px-4 py-3 font-mono hidden md:table-cell">{claim.vehicleReg}</td>
                    <td className="px-4 py-3 hidden lg:table-cell truncate max-w-48">{claim.issueTitle}</td>
                    <td className="px-4 py-3"><Badge variant="outline" className={s.color}>{s.label}</Badge></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><Badge variant="outline" className={p.color}>{p.label}</Badge></td>
                    <td className="px-4 py-3"><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredClaims.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No claims found</div>
        )}
      </div>
    </div>
  );
}
