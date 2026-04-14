import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWarrantyStore } from "@/lib/warranty-store";
import { useClaimStore } from "@/lib/claim-store";
import { useCoverStore } from "@/lib/cover-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Upload, CheckCircle2, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { VehicleDrivable, ClaimFile } from "@/data/claim-data";

export default function CustomerClaimSubmit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const warrantyStore = useWarrantyStore();
  const claimStore = useClaimStore();
  const coverStore = useCoverStore();
  const userEmail = user?.email?.toLowerCase();
  const warranties = warrantyStore.warranties.filter(w =>
    (w.customerId === user?.id || (userEmail && w.customerEmail?.toLowerCase() === userEmail)) && w.status === "active"
  );

  const [step, setStep] = useState(1);
  const [selectedWarrantyId, setSelectedWarrantyId] = useState(warranties[0]?.id || "");
  const warranty = warranties.find(w => w.id === selectedWarrantyId);

  const [form, setForm] = useState({
    issueTitle: "",
    description: "",
    issueStartDate: "",
    currentMileage: "",
    vehicleDrivable: "yes" as VehicleDrivable,
    atGarage: false,
    garageName: "",
    garageContact: "",
    repairsAuthorised: false,
  });

  const [files] = useState<ClaimFile[]>([]);

  const handleSubmit = async () => {
    if (!warranty || !form.issueTitle || !form.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const templateId = coverStore.templateMap[warranty.id];
    const claim = await claimStore.submitClaim({
      warrantyId: warranty.id,
      customerId: user?.id || "",
      customerName: user?.name || "",
      dealerId: warranty.dealerId,
      dealerName: warranty.dealerName,
      vehicleReg: warranty.vehicleReg,
      vehicleMake: warranty.vehicleMake,
      vehicleModel: warranty.vehicleModel,
      issueTitle: form.issueTitle,
      description: form.description,
      issueStartDate: form.issueStartDate || new Date().toISOString().split("T")[0],
      currentMileage: parseInt(form.currentMileage) || warranty.mileage,
      vehicleDrivable: form.vehicleDrivable,
      atGarage: form.atGarage,
      garageName: form.garageName || undefined,
      garageContact: form.garageContact || undefined,
      repairsAuthorised: form.repairsAuthorised,
      files,
      coverTemplateId: templateId,
    });

    toast.success(`Claim submitted — Ref: ${claim.reference}`);
    if (user?.email) {
      import("@/lib/email-service").then(m => m.sendClaimSubmittedEmail(
        user.email!, user.name || "Customer", claim.reference, warranty.vehicleReg, form.issueTitle
      ));
    }
    navigate("/customer/claims");
  };

  if (warranties.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold font-display">Start a Claim</h1>
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
          <Shield className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No active warranty to claim against</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Start a New Claim</h1>
        <p className="text-sm text-muted-foreground">Step {step} of 4</p>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-secondary"}`} />
        ))}
      </div>

      {/* Step 1: Select Warranty */}
      {step === 1 && (
        <div className="glass-card rounded-xl p-6 space-y-4 animate-fade-in">
          <h2 className="font-semibold font-display">Select Vehicle & Warranty</h2>
          {warranties.length > 1 ? (
            <div className="space-y-3">
              {warranties.map(w => (
                <button key={w.id}
                  className={`w-full text-left glass-card rounded-lg p-4 transition-all ${
                    selectedWarrantyId === w.id ? "border-primary bg-primary/5" : "hover:border-border"
                  }`}
                  onClick={() => setSelectedWarrantyId(w.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{w.vehicleMake} {w.vehicleModel}</p>
                      <p className="text-sm text-muted-foreground font-mono">{w.vehicleReg}</p>
                    </div>
                    {selectedWarrantyId === w.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {warranty && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-1 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Vehicle:</span> <span className="font-medium">{warranty.vehicleMake} {warranty.vehicleModel}</span></div>
                <div><span className="text-muted-foreground">Reg:</span> <span className="font-medium font-mono">{warranty.vehicleReg}</span></div>
                <div><span className="text-muted-foreground">Cover:</span> <span className="font-medium">{coverStore.getTemplateForWarranty(warranty.id)?.levelName || "Standard"}</span></div>
                <div><span className="text-muted-foreground">Expires:</span> <span className="font-medium">{new Date(warranty.endDate).toLocaleDateString("en-GB")}</span></div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)}>Continue <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
        </div>
      )}

      {/* Step 2: Issue Details */}
      {step === 2 && (
        <div className="glass-card rounded-xl p-6 space-y-4 animate-fade-in">
          <h2 className="font-semibold font-display">Issue Details</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Brief issue title *</Label>
              <Input placeholder="e.g. Engine management light and rough idle" value={form.issueTitle}
                onChange={e => setForm({ ...form, issueTitle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>What has gone wrong? *</Label>
              <Textarea placeholder="Describe the issue in detail..." value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} rows={4} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>When did the issue start?</Label>
                <Input type="date" value={form.issueStartDate}
                  onChange={e => setForm({ ...form, issueStartDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Current mileage</Label>
                <Input type="number" placeholder={warranty?.mileage?.toString()} value={form.currentMileage}
                  onChange={e => setForm({ ...form, currentMileage: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Is the vehicle still drivable?</Label>
              <Select value={form.vehicleDrivable} onValueChange={v => setForm({ ...form, vehicleDrivable: v as VehicleDrivable })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="limited">Limited</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Is the vehicle currently at a garage?</Label>
              <div className="flex gap-2">
                <Button variant={form.atGarage ? "default" : "outline"} size="sm" onClick={() => setForm({ ...form, atGarage: true })}>Yes</Button>
                <Button variant={!form.atGarage ? "default" : "outline"} size="sm" onClick={() => setForm({ ...form, atGarage: false })}>No</Button>
              </div>
            </div>
            {form.atGarage && (
              <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Garage name</Label>
                  <Input placeholder="Garage name" value={form.garageName}
                    onChange={e => setForm({ ...form, garageName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Garage contact</Label>
                  <Input placeholder="Phone number" value={form.garageContact}
                    onChange={e => setForm({ ...form, garageContact: e.target.value })} />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Have any repairs already been authorised?</Label>
              <div className="flex gap-2">
                <Button variant={form.repairsAuthorised ? "default" : "outline"} size="sm" onClick={() => setForm({ ...form, repairsAuthorised: true })}>Yes</Button>
                <Button variant={!form.repairsAuthorised ? "default" : "outline"} size="sm" onClick={() => setForm({ ...form, repairsAuthorised: false })}>No</Button>
              </div>
              {form.repairsAuthorised && (
                <p className="text-xs text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Unauthorised repairs may not be covered
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
            <Button onClick={() => {
              if (!form.issueTitle || !form.description) { toast.error("Please fill in the issue title and description"); return; }
              setStep(3);
            }}>Continue <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
        </div>
      )}

      {/* Step 3: Evidence */}
      {step === 3 && (
        <div className="glass-card rounded-xl p-6 space-y-4 animate-fade-in">
          <h2 className="font-semibold font-display">Supporting Evidence</h2>
          <p className="text-sm text-muted-foreground">Upload photos, invoices, diagnostic reports or service history.</p>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">Photos, PDFs, invoices, diagnostic reports</p>
            <Input type="file" multiple className="mt-3 max-w-xs mx-auto" />
          </div>
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map(f => (
                <Badge key={f.id} variant="outline" className="py-1.5 px-3">{f.name}</Badge>
              ))}
            </div>
          )}
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
            <Button onClick={() => setStep(4)}>Continue <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Submit */}
      {step === 4 && warranty && (
        <div className="glass-card rounded-xl p-6 space-y-4 animate-fade-in">
          <h2 className="font-semibold font-display">Review & Submit</h2>
          <div className="space-y-3 text-sm">
            <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
              <p className="font-medium mb-2">Claim Summary</p>
              <p><span className="text-muted-foreground">Vehicle:</span> {warranty.vehicleMake} {warranty.vehicleModel} ({warranty.vehicleReg})</p>
              <p><span className="text-muted-foreground">Issue:</span> {form.issueTitle}</p>
              <p><span className="text-muted-foreground">Description:</span> {form.description}</p>
              <p><span className="text-muted-foreground">Mileage:</span> {form.currentMileage || warranty.mileage}</p>
              <p><span className="text-muted-foreground">Drivable:</span> {form.vehicleDrivable}</p>
              {form.atGarage && <p><span className="text-muted-foreground">Garage:</span> {form.garageName}</p>}
              <p><span className="text-muted-foreground">Files:</span> {files.length} uploaded</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-sm text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              Do not authorise repairs until your dealership has confirmed approval.
            </p>
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(3)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
            <Button onClick={handleSubmit} className="glow-primary-sm">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Submit Claim
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
