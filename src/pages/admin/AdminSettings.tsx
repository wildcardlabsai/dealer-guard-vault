import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export default function AdminSettings() {
  const [warrantyFee, setWarrantyFee] = useState("15");

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold font-display">Platform Settings</h1>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="font-semibold font-display">Pricing Model</h2>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> Pay-Per-Use Model
          </div>
          <p className="text-sm text-muted-foreground">Dealers are charged per warranty issued. No monthly subscription fees.</p>
        </div>
        <div className="space-y-2">
          <Label>Per Warranty Admin Fee (£)</Label>
          <Input type="number" value={warrantyFee} onChange={e => setWarrantyFee(e.target.value)} />
          <p className="text-xs text-muted-foreground">Charged via Stripe when a dealer issues a warranty</p>
        </div>
        <div className="space-y-2">
          <Label>Monthly Subscription</Label>
          <div className="flex items-center gap-2">
            <Input type="text" value="£0" disabled className="max-w-[100px]" />
            <span className="text-sm text-muted-foreground">No monthly fees</span>
          </div>
        </div>
        <Button onClick={() => toast.success("Pricing updated")} className="glow-primary-sm">Save</Button>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="font-semibold font-display">Add-Ons</h2>
        <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
          <div>
            <p className="text-sm font-medium">Dedicated Warranty Line</p>
            <p className="text-xs text-muted-foreground">Optional add-on for dealers</p>
          </div>
          <span className="text-sm font-semibold">£25/month</span>
        </div>
      </div>
    </div>
  );
}
