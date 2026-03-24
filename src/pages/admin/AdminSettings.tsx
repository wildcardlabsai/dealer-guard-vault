import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [warrantyFee, setWarrantyFee] = useState("15");
  const [monthlyFee, setMonthlyFee] = useState("50");

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold font-display">Platform Settings</h1>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="font-semibold font-display">Pricing</h2>
        <div className="space-y-2">
          <Label>Monthly Subscription (£)</Label>
          <Input type="number" value={monthlyFee} onChange={e => setMonthlyFee(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Per Warranty Admin Fee (£)</Label>
          <Input type="number" value={warrantyFee} onChange={e => setWarrantyFee(e.target.value)} />
        </div>
        <Button onClick={() => toast.success("Pricing updated")} className="glow-primary-sm">Save</Button>
      </div>
    </div>
  );
}
