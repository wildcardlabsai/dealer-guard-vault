import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWarrantyLineStore } from "@/lib/warranty-line-store";
import { useDealerSettingsStore } from "@/lib/dealer-settings-store";
import { demoDealers } from "@/data/demo-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, ArrowRight, Target, PoundSterling, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function DealerSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const warrantyLineStore = useWarrantyLineStore();
  const dealerId = user?.dealerId || "d-1";
  const warrantyLine = warrantyLineStore.getLine(dealerId);
  const dealerSettingsStore = useDealerSettingsStore();
  const dealerSettings = dealerSettingsStore.getSettings(dealerId);
  const dealer = demoDealers.find(d => d.id === dealerId);
  const [salesTarget, setSalesTarget] = useState(dealerSettings.monthlySalesTarget);
  const [maxLabourRate, setMaxLabourRate] = useState(dealerSettings.maxLabourRate);
  const [maxPerClaimLimit, setMaxPerClaimLimit] = useState(dealerSettings.maxPerClaimLimit);
  const [form, setForm] = useState({
    name: dealer?.name || "",
    email: dealer?.email || "",
    phone: dealer?.phone || "",
    fcaNumber: dealer?.fcaNumber || "",
    address: dealer?.address || "",
    city: dealer?.city || "",
    postcode: dealer?.postcode || "",
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your dealership details</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="font-semibold font-display">Dealership Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Dealership Name</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>FCA Number</Label>
            <Input value={form.fcaNumber} onChange={e => setForm({ ...form, fcaNumber: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Address</Label>
            <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Postcode</Label>
            <Input value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} />
          </div>
        </div>
        <Button onClick={() => toast.success("Settings saved")} className="glow-primary-sm">Save Changes</Button>
      </div>

      {/* Sales Target */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h2 className="font-semibold font-display">Monthly Sales Target</h2>
        </div>
        <p className="text-sm text-muted-foreground">Set the number of warranties you aim to sell each month. This is shown on your dashboard.</p>
        <div className="flex items-end gap-3">
          <div className="space-y-2 flex-1 max-w-[200px]">
            <Label>Target (warranties/month)</Label>
            <Input
              type="number"
              min={1}
              max={999}
              value={salesTarget}
              onChange={e => setSalesTarget(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <Button onClick={() => { dealerSettingsStore.updateSettings(dealerId, { monthlySalesTarget: salesTarget }); toast.success(`Sales target updated to ${salesTarget}`); }} className="glow-primary-sm">
            Save Target
          </Button>
        </div>
      </div>

      {/* Max Labour Rate */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <PoundSterling className="w-4 h-4 text-primary" />
          <h2 className="font-semibold font-display">Maximum Labour Rate</h2>
        </div>
        <p className="text-sm text-muted-foreground">Set the maximum hourly labour rate you'll authorise for warranty claims. Any claim exceeding this rate will be flagged for review.</p>
        <div className="flex items-end gap-3">
          <div className="space-y-2 flex-1 max-w-[200px]">
            <Label>Max rate (£/hour)</Label>
            <Input
              type="number"
              min={1}
              max={500}
              value={maxLabourRate}
              onChange={e => setMaxLabourRate(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <Button onClick={() => { dealerSettingsStore.updateSettings(dealerId, { maxLabourRate }); toast.success(`Max labour rate set to £${maxLabourRate}/hour`); }} className="glow-primary-sm">
            Save Rate
          </Button>
        </div>
      </div>

      {/* Max Per Claim Limit */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h2 className="font-semibold font-display">Maximum Per Claim Limit</h2>
        </div>
        <p className="text-sm text-muted-foreground">Set the maximum amount you'll pay out on a single warranty claim. Claims exceeding this limit will require manual approval.</p>
        <div className="flex items-end gap-3">
          <div className="space-y-2 flex-1 max-w-[200px]">
            <Label>Max per claim (£)</Label>
            <Input
              type="number"
              min={100}
              max={50000}
              value={maxPerClaimLimit}
              onChange={e => setMaxPerClaimLimit(Math.max(100, parseInt(e.target.value) || 100))}
            />
          </div>
          <Button onClick={() => { dealerSettingsStore.updateSettings(dealerId, { maxPerClaimLimit }); toast.success(`Max per claim limit set to £${maxPerClaimLimit}`); }} className="glow-primary-sm">
            Save Limit
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="font-semibold font-display">Logo</h2>
        <p className="text-sm text-muted-foreground">Upload your dealership logo for branded documents</p>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.info("Upload simulated")}>Choose File</Button>
        </div>
      </div>
      {/* Warranty Line Upgrade */}
      {!warrantyLine && (
        <div className="glass-card-strong rounded-xl p-6 glow-primary cursor-pointer hover:border-primary/40 transition-all"
          onClick={() => navigate("/dealer/warranty-line")}>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-[hsl(var(--cta))]/10 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-[hsl(var(--cta))]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold font-display">Upgrade your customer experience</p>
              <p className="text-sm text-muted-foreground">Add a dedicated warranty phone line — £25/month</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
}
