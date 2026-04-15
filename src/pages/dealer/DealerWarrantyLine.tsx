import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWarrantyLineStore, type WarrantyLine } from "@/lib/warranty-line-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Phone, PhoneForwarded, Headphones, MessageSquare, CheckCircle2,
  Copy, Loader2, Pause, Play, X, Edit, Zap, Shield, Music
} from "lucide-react";
import { toast } from "sonner";

function StatusBadge({ status }: { status: WarrantyLine["status"] }) {
  const config = {
    not_active: { label: "Not Active", className: "bg-muted text-muted-foreground border-border" },
    setup_in_progress: { label: "Setup in Progress", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    active: { label: "Active", className: "bg-primary/10 text-primary border-primary/20" },
    paused: { label: "Paused", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  };
  const c = config[status];
  return <Badge variant="outline" className={c.className}>{c.label}</Badge>;
}

export default function DealerWarrantyLine() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "";
  const dealerName = user?.dealerName || user?.name || "Dealer";
  const store = useWarrantyLineStore();
  const line = store.getLine(dealerId);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    businessName: dealerName,
    greetingMessage: `Thank you for calling ${dealerName} warranty department. Your call is important to us.`,
    forwardingNumber: "",
    ivrEnabled: true,
    option1Label: "New Claim",
    option2Label: "Existing Claim",
    option3Label: "",
    holdMusicType: "default" as WarrantyLine["holdMusicType"],
    voicemailEnabled: false,
    voicemailEmail: user?.email || "",
  });

  useEffect(() => {
    if (line && !editing) {
      setForm({
        businessName: line.businessName,
        greetingMessage: line.greetingMessage,
        forwardingNumber: line.forwardingNumber,
        ivrEnabled: line.ivrEnabled,
        option1Label: line.option1Label,
        option2Label: line.option2Label,
        option3Label: line.option3Label,
        holdMusicType: line.holdMusicType,
        voicemailEnabled: line.voicemailEnabled,
        voicemailEmail: line.voicemailEmail,
      });
    }
  }, [line, editing]);

  const handleActivate = () => {
    if (!form.forwardingNumber.trim()) {
      toast.error("Please enter a forwarding number");
      return;
    }
    store.activateLine(dealerId, form);
    toast.success("Warranty line is being set up!");
  };

  const handleSaveEdits = () => {
    store.updateLine(dealerId, form);
    setEditing(false);
    toast.success("Warranty line settings updated");
  };

  const copyNumber = () => {
    if (line?.phoneNumber) {
      navigator.clipboard.writeText(line.phoneNumber);
      toast.success("Phone number copied");
    }
  };

  const isActive = line?.status === "active";
  const isSetup = line?.status === "setup_in_progress";
  const isPaused = line?.status === "paused";
  const showForm = !line || editing;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold font-display">Warranty Line</h1>
          <p className="text-sm text-muted-foreground">Dedicated phone line for warranty enquiries</p>
        </div>
        {line && <StatusBadge status={line.status} />}
      </div>

      {/* Upgrade prompt when not active */}
      {!line && (
        <div className="glass-card-strong rounded-2xl p-8 glow-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-52 h-52 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--cta))]/10 flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-[hsl(var(--cta))]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display">Dedicated Warranty Line</h2>
                  <p className="text-2xl font-bold font-display">£25<span className="text-sm text-muted-foreground font-normal">/month</span></p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Give your customers a professional, dedicated phone line for all warranty enquiries and claims.
                Keep warranty calls separate from sales and look like a proper warranty department.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {[
                  "Custom greeting for your dealership",
                  "Professional hold music",
                  "Call routing to your phone",
                  "Simple menu options (Press 1, 2...)",
                  "Keeps warranty calls off your sales line",
                  "No technical setup required",
                ].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Zap className="w-4 h-4 text-[hsl(var(--cta))]" />
                <span>Set up in 24 hours. No technical setup required. Fully managed.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status card when active/setup/paused */}
      {line && !editing && (
        <div className="glass-card-strong rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isActive ? "bg-primary/10" : "bg-amber-500/10"}`}>
                <Phone className={`w-6 h-6 ${isActive ? "text-primary" : "text-amber-400"}`} />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display">Your Warranty Line</h2>
                <StatusBadge status={line.status} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">£25/month</p>
          </div>

          {isSetup && (
            <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-6">
              <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
              <div>
                <p className="text-sm font-medium">Setting up your warranty line...</p>
                <p className="text-xs text-muted-foreground">This usually takes less than 24 hours. We'll notify you when it's ready.</p>
              </div>
            </div>
          )}

          {(isActive || isPaused) && line.phoneNumber && (
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                <p className="text-xs text-muted-foreground mb-1">Your warranty line number</p>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold font-display tracking-wide">{line.phoneNumber}</p>
                  <Button variant="outline" size="sm" onClick={copyNumber}>
                    <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy
                  </Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Greeting</p>
                  <p className="text-sm">{line.greetingMessage}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Forwarding to</p>
                  <p className="text-sm font-mono">{line.forwardingNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Call Menu</p>
                  <p className="text-sm">{line.ivrEnabled ? "Enabled" : "Disabled"}</p>
                  {line.ivrEnabled && (
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>Press 1 — {line.option1Label}</p>
                      <p>Press 2 — {line.option2Label}</p>
                      {line.option3Label && <p>Press 3 — {line.option3Label}</p>}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Hold Music</p>
                  <p className="text-sm capitalize">{line.holdMusicType.replace("_", " ")}</p>
                </div>
                {line.voicemailEnabled && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Voicemail notifications</p>
                    <p className="text-sm">{line.voicemailEmail}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-border/50">
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Setup
                </Button>
                {isActive && (
                  <Button variant="outline" size="sm" onClick={() => { store.pauseLine(dealerId); toast.info("Warranty line paused"); }}>
                    <Pause className="w-3.5 h-3.5 mr-1.5" /> Pause Line
                  </Button>
                )}
                {isPaused && (
                  <Button variant="outline" size="sm" onClick={() => { store.resumeLine(dealerId); toast.success("Warranty line resumed"); }}>
                    <Play className="w-3.5 h-3.5 mr-1.5" /> Resume Line
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { store.cancelLine(dealerId); toast.info("Warranty line cancelled"); }}>
                  <X className="w-3.5 h-3.5 mr-1.5" /> Cancel Line
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Customer experience preview */}
      {(isActive || isSetup) && !editing && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold font-display mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            How your customers experience this
          </h3>
          <div className="bg-[hsl(222,25%,10%)] rounded-xl p-5 text-white/80 text-sm space-y-3 font-mono">
            <p className="text-white/50 text-xs">— Automated greeting —</p>
            <p>"{form.greetingMessage || `Thank you for calling ${form.businessName} warranty department.`}"</p>
            {form.ivrEnabled && (
              <>
                <p className="text-white/50 text-xs mt-3">— Menu options —</p>
                <p>"Press 1 for {form.option1Label || "New Claims"}."</p>
                <p>"Press 2 for {form.option2Label || "Existing Claims"}."</p>
                {form.option3Label && <p>"Press 3 for {form.option3Label}."</p>}
              </>
            )}
            <p className="text-white/50 text-xs mt-3">— Hold music plays —</p>
            <p className="text-white/40 italic text-xs">♪ {form.holdMusicType === "light" ? "Light background music" : form.holdMusicType === "professional" ? "Professional corporate tone" : "Default hold music"} ♪</p>
          </div>
        </div>
      )}

      {/* Setup / Edit form */}
      {showForm && (
        <div className="space-y-6">
          {/* Business & Greeting */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold font-display flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> Line Setup
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Forwarding Number</Label>
                <Input placeholder="Your phone number" value={form.forwardingNumber} onChange={e => setForm({ ...form, forwardingNumber: e.target.value })} />
                <p className="text-xs text-muted-foreground">Where warranty calls will be forwarded to</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Greeting Message</Label>
              <Input
                placeholder={`Thank you for calling ${form.businessName || "[Dealer Name]"} warranty department…`}
                value={form.greetingMessage}
                onChange={e => setForm({ ...form, greetingMessage: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">This is played when a customer calls your warranty line</p>
            </div>
          </div>

          {/* IVR Menu */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold font-display flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" /> Call Menu (IVR)
              </h3>
              <Switch checked={form.ivrEnabled} onCheckedChange={v => setForm({ ...form, ivrEnabled: v })} />
            </div>
            {form.ivrEnabled && (
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Option 1 — Press 1</Label>
                    <Input placeholder="e.g. New Claim" value={form.option1Label} onChange={e => setForm({ ...form, option1Label: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Option 2 — Press 2</Label>
                    <Input placeholder="e.g. Existing Claim" value={form.option2Label} onChange={e => setForm({ ...form, option2Label: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Option 3 — Press 3 (optional)</Label>
                  <Input placeholder="e.g. General Enquiry" value={form.option3Label} onChange={e => setForm({ ...form, option3Label: e.target.value })} />
                </div>
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Preview</p>
                  <p className="text-sm">
                    "Press 1 for {form.option1Label || "..."}, Press 2 for {form.option2Label || "..."}
                    {form.option3Label ? `, Press 3 for ${form.option3Label}` : ""}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Hold Music */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold font-display flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" /> Hold Music
            </h3>
            <div className="space-y-2">
              <Label>Music Style</Label>
              <Select value={form.holdMusicType} onValueChange={v => setForm({ ...form, holdMusicType: v as WarrantyLine["holdMusicType"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default hold music</SelectItem>
                  <SelectItem value="light">Light music</SelectItem>
                  <SelectItem value="professional">Professional tone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border border-dashed border-border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Upload custom audio (coming soon)</p>
            </div>
          </div>

          {/* Voicemail */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold font-display flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Voicemail
              </h3>
              <Switch checked={form.voicemailEnabled} onCheckedChange={v => setForm({ ...form, voicemailEnabled: v })} />
            </div>
            {form.voicemailEnabled && (
              <div className="space-y-2">
                <Label>Notification Email</Label>
                <Input type="email" placeholder="you@dealer.co.uk" value={form.voicemailEmail} onChange={e => setForm({ ...form, voicemailEmail: e.target.value })} />
                <p className="text-xs text-muted-foreground">Get notified when a customer leaves a voicemail</p>
              </div>
            )}
          </div>

          {/* Action */}
          <div className="flex gap-3">
            {!line ? (
              <Button size="lg" className="btn-cta rounded-full px-8 h-12" onClick={handleActivate}>
                <Headphones className="w-5 h-5 mr-2" /> Activate Warranty Line — £25/month
              </Button>
            ) : (
              <>
                <Button size="lg" className="glow-primary-sm rounded-full px-8 h-12" onClick={handleSaveEdits}>
                  Save Changes
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 h-12" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
