import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDisputeIQStore, classifyCRA, detectEscalationFlags, type ComplaintType, type DisputeCase } from "@/lib/disputeiq-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft, ArrowRight, Brain, AlertTriangle, CheckCircle2, Shield,
  MessageSquare, Sparkles, Loader2, Copy, RotateCcw, Eye, EyeOff,
  ChevronDown, ChevronUp, FileText, Minus, Plus
} from "lucide-react";
import { toast } from "sonner";

const complaintTypes: { value: ComplaintType; label: string; desc: string }[] = [
  { value: "mechanical", label: "Mechanical Fault", desc: "Engine, gearbox, suspension, brakes, electrics, etc." },
  { value: "cosmetic", label: "Cosmetic Issue", desc: "Bodywork, paint, interior damage, trim" },
  { value: "misdescription", label: "Misdescription", desc: "Vehicle not as described — mileage, history, spec" },
  { value: "finance", label: "Finance Dispute", desc: "HP/PCP rejection, Section 75, chargeback" },
  { value: "service", label: "Service Complaint", desc: "Poor aftersales, delayed repair, communication" },
  { value: "other", label: "Other", desc: "Anything not covered above" },
];

const issueClassifications = [
  "Engine / Powertrain",
  "Gearbox / Transmission",
  "Electrical System",
  "Brakes / Suspension",
  "Bodywork / Paintwork",
  "Interior / Trim",
  "Mileage Discrepancy",
  "History / HPI Issue",
  "Specification Mismatch",
  "Cooling System",
  "Exhaust / Emissions",
  "Steering",
  "Other",
];

const riskColors: Record<string, string> = {
  low: "text-green-600 bg-green-500/10 border-green-500/20",
  medium: "text-[hsl(var(--cta))] bg-[hsl(var(--cta))]/10 border-[hsl(var(--cta))]/20",
  high: "text-destructive bg-destructive/10 border-destructive/20",
};

const craWindowColors: Record<string, string> = {
  under30: "text-destructive bg-destructive/10",
  "30to6m": "text-[hsl(var(--cta))] bg-[hsl(var(--cta))]/10",
  over6m: "text-green-600 bg-green-500/10",
};

const craWindowLabels: Record<string, string> = {
  under30: "Under 30 Days",
  "30to6m": "30 Days — 6 Months",
  over6m: "Over 6 Months",
};

export default function DisputeIQAssessment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const dealerId = user?.dealerId || "d-1";
  const store = useDisputeIQStore();

  const isNew = id === "new";
  const existing = !isNew ? store.getCase(id || "") : null;

  // Pre-fill from Claim Assist
  const prefilledClaim = location.state as any;

  const [step, setStep] = useState(existing ? 4 : 1);
  const [loading, setLoading] = useState(false);
  const [strategyMode, setStrategyMode] = useState(false);
  const [activeResponseTab, setActiveResponseTab] = useState<string>("helpful");

  // Form state
  const [complaintType, setComplaintType] = useState<ComplaintType>(existing?.complaintType || prefilledClaim?.complaintType || "mechanical");
  const [saleDate, setSaleDate] = useState(existing?.saleDate || prefilledClaim?.saleDate || "");
  const [issueDate, setIssueDate] = useState(existing?.issueDate || prefilledClaim?.issueDate || "");
  const [mileageAtSale, setMileageAtSale] = useState(existing?.mileageAtSale?.toString() || prefilledClaim?.mileageAtSale || "");
  const [mileageNow, setMileageNow] = useState(existing?.mileageNow?.toString() || prefilledClaim?.mileageNow || "");
  const [drivable, setDrivable] = useState<"yes" | "no" | "limited">(existing?.drivable || prefilledClaim?.drivable || "yes");
  const [repairsAuthorised, setRepairsAuthorised] = useState<"yes" | "no" | "partial">(existing?.repairsAuthorised || "no");
  const [warrantyStatus, setWarrantyStatus] = useState<"active" | "expired" | "none">(existing?.warrantyStatus || prefilledClaim?.warrantyStatus || "active");
  const [customerSummary, setCustomerSummary] = useState(existing?.customerSummary || prefilledClaim?.customerSummary || "");
  const [customerName, setCustomerName] = useState(existing?.customerName || prefilledClaim?.customerName || "");
  const [vehicleReg, setVehicleReg] = useState(existing?.vehicleReg || prefilledClaim?.vehicleReg || "");
  const [issueClassification, setIssueClassification] = useState(existing?.issueClassification || "");
  const [notes, setNotes] = useState(existing?.notes || "");

  // AI result state
  const [disputeCase, setDisputeCase] = useState<DisputeCase | null>(existing || null);
  const [editedResponse, setEditedResponse] = useState(existing?.editedResponse || "");

  const canProceedStep2 = saleDate && issueDate && customerName && customerSummary;
  const canProceedStep3 = issueClassification;

  const handleAssess = async () => {
    setLoading(true);

    const cra = classifyCRA(saleDate, issueDate);
    const flags = detectEscalationFlags(customerSummary);

    // Create or update case first
    let caseData: DisputeCase;
    if (isNew) {
      caseData = store.createCase({
        dealerId,
        complaintType,
        saleDate,
        issueDate,
        mileageAtSale: parseInt(mileageAtSale) || 0,
        mileageNow: parseInt(mileageNow) || 0,
        drivable: drivable as any,
        repairsAuthorised: repairsAuthorised as any,
        warrantyStatus: warrantyStatus as any,
        customerSummary,
        customerName,
        vehicleReg,
        issueClassification,
        notes,
        linkedClaimId: prefilledClaim?.claimId,
      });
    } else {
      store.updateCase(id!, {
        complaintType, saleDate, issueDate, mileageAtSale: parseInt(mileageAtSale) || 0,
        mileageNow: parseInt(mileageNow) || 0, drivable: drivable as any,
        repairsAuthorised: repairsAuthorised as any, warrantyStatus: warrantyStatus as any,
        customerSummary, customerName, vehicleReg, issueClassification, notes,
      });
      caseData = store.getCase(id!)!;
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const resp = await fetch(`${supabaseUrl}/functions/v1/disputeiq-reason`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${anonKey}` },
        body: JSON.stringify({
          complaintType,
          saleDate,
          issueDate,
          mileageAtSale: parseInt(mileageAtSale) || 0,
          mileageNow: parseInt(mileageNow) || 0,
          drivable,
          repairsAuthorised,
          warrantyStatus,
          customerSummary,
          customerName,
          vehicleReg,
          issueClassification,
          craWindow: cra.window,
          craExplanation: cra.explanation,
          escalationFlags: flags,
        }),
      });

      if (!resp.ok) {
        throw new Error("AI analysis failed");
      }

      const result = await resp.json();

      store.updateCase(caseData.id, {
        status: "assessed",
        aiSummary: result.summary,
        aiPosition: result.position,
        aiRiskLevel: result.riskLevel,
        aiApproach: result.approach,
        aiToneRecommendation: result.toneRecommendation,
        riskAlerts: result.riskAlerts,
        responses: result.responses,
        responseScore: result.responseScore,
        strategyDoNots: result.strategyDoNots,
        strategyKeyRisks: result.strategyKeyRisks,
        strategySuggestedStance: result.strategySuggestedStance,
      });

      setDisputeCase(store.getCase(caseData.id)!);
      setStep(4);
      toast.success("AI analysis complete");
    } catch (e) {
      // Fallback with local reasoning if AI fails
      const fallbackResult = generateFallbackAnalysis(caseData, cra, flags);
      store.updateCase(caseData.id, { ...fallbackResult, status: "assessed" });
      setDisputeCase(store.getCase(caseData.id)!);
      setStep(4);
      toast.success("Assessment complete");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Response copied to clipboard");
  };

  const handleToneAdjust = async (instruction: string) => {
    const currentText = editedResponse || disputeCase?.responses?.[activeResponseTab as keyof typeof disputeCase.responses] || "";
    if (!currentText) return;
    setLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const resp = await fetch(`${supabaseUrl}/functions/v1/disputeiq-reason`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${anonKey}` },
        body: JSON.stringify({ action: "adjust", text: currentText, instruction }),
      });
      if (resp.ok) {
        const result = await resp.json();
        setEditedResponse(result.adjustedText || currentText);
      }
    } catch {
      toast.error("Could not adjust — try again");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkResponded = () => {
    if (!disputeCase) return;
    const finalResponse = editedResponse || disputeCase.responses?.[activeResponseTab as keyof typeof disputeCase.responses] || "";
    store.updateCase(disputeCase.id, { status: "responded", selectedResponse: activeResponseTab, editedResponse: finalResponse });
    toast.success("Case marked as responded");
    navigate("/dealer/disputeiq");
  };

  // Render
  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dealer/disputeiq")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold font-display">{isNew ? "New Assessment" : "Case " + id}</h1>
          </div>
          <p className="text-sm text-muted-foreground">DisputeIQ — Customer Complaint Helper</p>
        </div>
      </div>

      {/* Progress */}
      {step < 4 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}%</span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>
      )}

      {/* STEP 1: Complaint Type */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold font-display">What type of complaint is this?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {complaintTypes.map(ct => (
              <div
                key={ct.value}
                className={`glass-card rounded-xl p-4 cursor-pointer transition-all ${
                  complaintType === ct.value ? "border-primary bg-primary/5" : "hover:border-primary/30"
                }`}
                onClick={() => setComplaintType(ct.value)}
              >
                <p className="font-medium text-sm">{ct.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{ct.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setStep(2)}>
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Key Facts */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold font-display">Key facts</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer Name *</Label>
              <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. James Smith" />
            </div>
            <div className="space-y-2">
              <Label>Vehicle Registration</Label>
              <Input value={vehicleReg} onChange={e => setVehicleReg(e.target.value.toUpperCase())} placeholder="e.g. AB12 CDE" />
            </div>
            <div className="space-y-2">
              <Label>Sale Date *</Label>
              <Input type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Issue Reported Date *</Label>
              <Input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Mileage at Sale</Label>
              <Input type="number" value={mileageAtSale} onChange={e => setMileageAtSale(e.target.value)} placeholder="e.g. 45000" />
            </div>
            <div className="space-y-2">
              <Label>Mileage Now</Label>
              <Input type="number" value={mileageNow} onChange={e => setMileageNow(e.target.value)} placeholder="e.g. 47500" />
            </div>
            <div className="space-y-2">
              <Label>Is the vehicle drivable?</Label>
              <Select value={drivable} onValueChange={v => setDrivable(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="limited">Limited</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Repairs authorised?</Label>
              <Select value={repairsAuthorised} onValueChange={v => setRepairsAuthorised(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Warranty Status</Label>
              <Select value={warrantyStatus} onValueChange={v => setWarrantyStatus(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Customer's complaint / summary *</Label>
            <Textarea
              className="min-h-[120px]"
              value={customerSummary}
              onChange={e => setCustomerSummary(e.target.value)}
              placeholder="Paste or describe the customer's complaint in their own words..."
            />
          </div>

          {/* Live CRA preview */}
          {saleDate && issueDate && (
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">CRA Window Preview</p>
              {(() => {
                const cra = classifyCRA(saleDate, issueDate);
                return (
                  <div className="flex items-center gap-3">
                    <Badge className={`${craWindowColors[cra.window]} border-0`}>{craWindowLabels[cra.window]}</Badge>
                    <p className="text-xs text-muted-foreground flex-1">{cra.explanation.split(".")[0]}.</p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Live escalation flags */}
          {customerSummary && detectEscalationFlags(customerSummary).length > 0 && (
            <div className="glass-card rounded-xl p-4 border-destructive/20 bg-destructive/5">
              <p className="text-xs font-semibold text-destructive mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Escalation Flags Detected
              </p>
              <div className="flex flex-wrap gap-2">
                {detectEscalationFlags(customerSummary).map((f, i) => (
                  <Badge key={i} variant="outline" className="text-xs text-destructive border-destructive/30">{f}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Classification + Submit */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold font-display">Issue classification</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {issueClassifications.map(ic => (
              <div
                key={ic}
                className={`glass-card rounded-xl p-3 cursor-pointer transition-all text-center text-sm ${
                  issueClassification === ic ? "border-primary bg-primary/5 font-medium" : "hover:border-primary/30"
                }`}
                onClick={() => setIssueClassification(ic)}
              >
                {ic}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Internal notes (optional)</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any internal notes about this case..." />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button onClick={handleAssess} disabled={!canProceedStep3 || loading} className="btn-cta">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analysing...</> : <><Brain className="w-4 h-4 mr-2" /> Run AI Analysis</>}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Results */}
      {step === 4 && disputeCase && (
        <div className="space-y-6">
          {/* CRA Classification */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold font-display flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> CRA Classification
              </h3>
              <Badge className={`${craWindowColors[disputeCase.craWindow]} border-0`}>
                {craWindowLabels[disputeCase.craWindow]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{disputeCase.craExplanation}</p>
          </div>

          {/* Risk Alerts */}
          {(disputeCase.riskAlerts?.length || 0) > 0 && (
            <div className="glass-card rounded-xl p-5 border-destructive/20 bg-destructive/5">
              <h3 className="font-semibold font-display flex items-center gap-2 text-destructive mb-3">
                <AlertTriangle className="w-4 h-4" /> Risk Alerts
              </h3>
              <div className="space-y-2">
                {disputeCase.riskAlerts?.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Escalation Flags */}
          {(disputeCase.escalationFlags?.length || 0) > 0 && (
            <div className="glass-card rounded-xl p-5 border-[hsl(var(--cta))]/20 bg-[hsl(var(--cta))]/5">
              <h3 className="font-semibold font-display flex items-center gap-2 text-[hsl(var(--cta))] mb-3">
                <AlertTriangle className="w-4 h-4" /> Escalation Detected — Proceed Carefully
              </h3>
              <div className="flex flex-wrap gap-2">
                {disputeCase.escalationFlags?.map((f, i) => (
                  <Badge key={i} variant="outline" className="text-xs text-[hsl(var(--cta))] border-[hsl(var(--cta))]/30">{f}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* AI Reasoning */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold font-display flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> AI Reasoning
              </h3>
              {disputeCase.aiRiskLevel && (
                <Badge className={`${riskColors[disputeCase.aiRiskLevel]} border`}>
                  {disputeCase.aiRiskLevel.toUpperCase()} RISK
                </Badge>
              )}
            </div>
            <div className="space-y-4">
              {disputeCase.aiSummary && (
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">Situation Summary</p>
                  <p className="text-sm text-foreground">{disputeCase.aiSummary}</p>
                </div>
              )}
              {disputeCase.aiPosition && (
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">Your Likely Position</p>
                  <p className="text-sm text-foreground">{disputeCase.aiPosition}</p>
                </div>
              )}
              {disputeCase.aiApproach && (
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">Suggested Approach</p>
                  <p className="text-sm text-foreground">{disputeCase.aiApproach}</p>
                </div>
              )}
              {disputeCase.aiToneRecommendation && (
                <div className="p-3 rounded-lg bg-primary/5">
                  <p className="text-xs font-semibold text-primary mb-1 uppercase">Tone Recommendation</p>
                  <p className="text-sm text-foreground">{disputeCase.aiToneRecommendation}</p>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic">
              This is structured guidance, not legal advice. For complex disputes, seek independent legal counsel.
            </p>
          </div>

          {/* Strategy Mode Toggle */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold font-display flex items-center gap-2">
                {strategyMode ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                Internal Strategy View
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Strategy Mode</span>
                <Switch checked={strategyMode} onCheckedChange={setStrategyMode} />
              </div>
            </div>
            {strategyMode && (
              <div className="space-y-4">
                {(disputeCase.strategyDoNots?.length || 0) > 0 && (
                  <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                    <p className="text-xs font-semibold text-destructive mb-2 uppercase">What NOT to say</p>
                    <ul className="space-y-1">
                      {disputeCase.strategyDoNots?.map((d, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Minus className="w-3 h-3 text-destructive flex-shrink-0 mt-1" /> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(disputeCase.strategyKeyRisks?.length || 0) > 0 && (
                  <div className="p-3 rounded-lg bg-[hsl(var(--cta))]/5 border border-[hsl(var(--cta))]/10">
                    <p className="text-xs font-semibold text-[hsl(var(--cta))] mb-2 uppercase">Key Risks</p>
                    <ul className="space-y-1">
                      {disputeCase.strategyKeyRisks?.map((r, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 text-[hsl(var(--cta))] flex-shrink-0 mt-1" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {disputeCase.strategySuggestedStance && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs font-semibold text-primary mb-1 uppercase">Suggested Stance</p>
                    <p className="text-sm text-foreground">{disputeCase.strategySuggestedStance}</p>
                  </div>
                )}
              </div>
            )}
            {!strategyMode && (
              <p className="text-sm text-muted-foreground">Toggle on to see internal-only strategy guidance — what NOT to say, key risks, and suggested stance.</p>
            )}
          </div>

          {/* Response Generator */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-semibold font-display flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-primary" /> Response Generator
            </h3>

            {/* Response Score */}
            {disputeCase.responseScore && (
              <div className="flex gap-4 mb-4 flex-wrap">
                {[
                  { label: "Clarity", value: disputeCase.responseScore.clarity },
                  { label: "Risk", value: disputeCase.responseScore.risk },
                  { label: "Tone", value: disputeCase.responseScore.tone },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${s.value}%` }} />
                    </div>
                    <span className="text-xs font-medium">{s.value}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Response tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {["helpful", "firm", "defensive", "deescalation"].map(t => (
                <button
                  key={t}
                  onClick={() => { setActiveResponseTab(t); setEditedResponse(""); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeResponseTab === t ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1).replace("escalation", "-escalation")}
                </button>
              ))}
            </div>

            {/* Response content */}
            <Textarea
              className="min-h-[200px] text-sm leading-relaxed"
              value={editedResponse || disputeCase.responses?.[activeResponseTab as keyof typeof disputeCase.responses] || ""}
              onChange={e => setEditedResponse(e.target.value)}
            />

            {/* Controls */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => handleToneAdjust("Make this more formal and professional")} disabled={loading}>
                Make more formal
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleToneAdjust("Make this softer and more empathetic")} disabled={loading}>
                Make softer
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleToneAdjust("Shorten this significantly while keeping the key points")} disabled={loading}>
                Shorten
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleAssess()} disabled={loading}>
                <RotateCcw className="w-3 h-3 mr-1" /> Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleCopyResponse(editedResponse || disputeCase.responses?.[activeResponseTab as keyof typeof disputeCase.responses] || "")}>
                <Copy className="w-3 h-3 mr-1" /> Copy
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button className="btn-cta" onClick={handleMarkResponded}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Responded
            </Button>
            <Button variant="outline" onClick={() => navigate("/dealer/disputeiq")}>
              Save & Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Fallback analysis when AI is unavailable
function generateFallbackAnalysis(c: DisputeCase, cra: { window: string; explanation: string }, flags: string[]) {
  const daysStr = cra.window === "under30" ? "under 30 days" : cra.window === "30to6m" ? "30 days to 6 months" : "over 6 months";
  const riskLevel = cra.window === "under30" ? "high" : cra.window === "30to6m" ? "medium" : "low";
  const escalated = flags.length > 0;
  const finalRisk = escalated ? "high" : riskLevel;

  return {
    aiSummary: `${c.customerName} has reported a ${c.complaintType} issue with vehicle ${c.vehicleReg}. The complaint was raised ${daysStr} after purchase. Vehicle is ${c.drivable === "yes" ? "drivable" : c.drivable === "limited" ? "limited drivability" : "not drivable"}. Warranty is ${c.warrantyStatus}.`,
    aiPosition: cra.window === "under30"
      ? "The customer is within the 30-day short-term right to reject window. Their consumer rights are at their strongest. Consider offering a repair or replacement promptly."
      : cra.window === "30to6m"
      ? "Within the 6-month window, faults are presumed to have existed at the point of sale. The burden is on you to prove otherwise. Offer repair as a first remedy."
      : "Over 6 months from sale — the customer must prove the fault was present at sale. Your position is stronger, but goodwill gestures can prevent escalation.",
    aiRiskLevel: finalRisk as any,
    aiApproach: cra.window === "under30"
      ? "Respond quickly and professionally. Offer inspection and repair at no cost. Avoid language that could be seen as dismissive."
      : "Acknowledge the complaint, offer to inspect the vehicle, and keep communication professional and documented.",
    aiToneRecommendation: escalated ? "Careful and measured — avoid inflammatory language. Be factual and professional." : "Professional and helpful — show willingness to resolve.",
    riskAlerts: [
      ...(cra.window === "under30" ? ["Customer has strong right to reject within 30 days"] : []),
      ...(c.drivable === "no" ? ["Vehicle is not drivable — adds urgency to complaint"] : []),
      ...flags,
    ],
    responses: {
      helpful: `Hi ${c.customerName},\n\nThank you for getting in touch and letting us know about this. I'm sorry to hear you've experienced an issue and I completely understand how frustrating this must be.\n\nI'd like to arrange for our workshop to inspect the vehicle at our earliest convenience — at no cost to you. We take all concerns seriously and want to get this resolved as quickly as possible.\n\nCould you let me know a day and time that works for you? I'll make sure we prioritise this.\n\nKind regards`,
      firm: `Hi ${c.customerName},\n\nThank you for contacting us regarding the issue with your vehicle.\n\nWe take all customer feedback seriously. To properly assess the situation, we'd like to arrange a professional inspection of the vehicle. This will help us understand the nature and cause of the issue.\n\nPlease contact us to arrange a convenient time for inspection. We will then be able to confirm the appropriate next steps.\n\nRegards`,
      defensive: `Hi ${c.customerName},\n\nThank you for your correspondence regarding the reported issue.\n\nAll our vehicles undergo a thorough pre-sale inspection and preparation. However, we appreciate that mechanical components can develop faults over time with use.\n\nWe would welcome the opportunity to inspect the vehicle to determine the nature of the reported issue. Please contact us to arrange an appointment.\n\nRegards`,
      deescalation: `Hi ${c.customerName},\n\nI really appreciate you taking the time to let us know about this. I can tell this has been a frustrating experience and I want you to know we're here to help.\n\nOur priority is making sure you're happy with your purchase. Let me personally arrange an inspection and I'll keep you updated every step of the way.\n\nWould you be available this week for us to take a look? I'd like to get this sorted for you as quickly as possible.\n\nWarm regards`,
    },
    responseScore: { clarity: 82, risk: finalRisk === "high" ? 35 : finalRisk === "medium" ? 60 : 80, tone: 78 },
    strategyDoNots: [
      "Don't admit liability or fault outright",
      "Don't promise a refund before inspection",
      "Don't use phrases like 'sold as seen' — this doesn't override consumer rights",
      "Don't ignore the complaint or delay responding",
    ],
    strategyKeyRisks: [
      ...(cra.window === "under30" ? ["Customer may exercise short-term right to reject"] : []),
      ...(escalated ? ["Customer has mentioned escalation — handle with extra care"] : []),
      "Delayed response could lead to formal complaint",
    ],
    strategySuggestedStance: cra.window === "under30"
      ? "Be proactive and accommodating. Offer inspection and repair quickly. If genuine fault, consider repair or partial goodwill. Avoid anything that looks like you're stalling."
      : "Professional and measured. Offer inspection to assess the fault. Document everything. If fault is confirmed, offer repair as first remedy.",
  };
}
