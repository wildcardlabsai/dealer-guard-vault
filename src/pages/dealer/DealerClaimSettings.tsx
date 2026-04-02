import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function DealerClaimSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    warrantyPhone: "",
    claimEmail: "",
    internalNote: "",
    uploadGuidance: "Please upload clear photos of the issue, any diagnostic reports, and relevant invoices.",
    autoAcknowledge: true,
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Claim Settings</h1>
        <p className="text-sm text-muted-foreground">Configure how claims are handled</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="font-semibold font-display">Contact Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Warranty Phone Number</Label>
            <Input value={settings.warrantyPhone} onChange={e => setSettings(s => ({ ...s, warrantyPhone: e.target.value }))} placeholder="e.g. 0330 123 4567" />
          </div>
          <div className="space-y-2">
            <Label>Claims Email</Label>
            <Input value={settings.claimEmail} onChange={e => setSettings(s => ({ ...s, claimEmail: e.target.value }))} placeholder="claims@yourdealership.co.uk" />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="font-semibold font-display">Customer Guidance</h2>
        <div className="space-y-2">
          <Label>Upload Guidance Text</Label>
          <Textarea value={settings.uploadGuidance} onChange={e => setSettings(s => ({ ...s, uploadGuidance: e.target.value }))} rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Internal Staff Note</Label>
          <Textarea value={settings.internalNote} onChange={e => setSettings(s => ({ ...s, internalNote: e.target.value }))} rows={2}
            placeholder="Notes visible only to staff..." />
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="font-semibold font-display">Automation</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Auto-acknowledge claims</p>
            <p className="text-xs text-muted-foreground">Automatically send acknowledgement when a claim is submitted</p>
          </div>
          <Switch checked={settings.autoAcknowledge} onCheckedChange={v => setSettings(s => ({ ...s, autoAcknowledge: v }))} />
        </div>
      </div>

      <Button onClick={() => toast.success("Settings saved")} className="glow-primary-sm">Save Changes</Button>
    </div>
  );
}
