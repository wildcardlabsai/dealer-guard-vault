import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { demoDealers } from "@/data/demo-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function DealerSettings() {
  const { user } = useAuth();
  const dealer = demoDealers.find(d => d.id === user?.dealerId);
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

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="font-semibold font-display">Logo</h2>
        <p className="text-sm text-muted-foreground">Upload your dealership logo for branded documents</p>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.info("Upload simulated")}>Choose File</Button>
        </div>
      </div>
    </div>
  );
}
