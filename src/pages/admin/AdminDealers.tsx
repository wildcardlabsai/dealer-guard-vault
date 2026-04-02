import { useState } from "react";
import { demoDealers } from "@/data/demo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";

export default function AdminDealers() {
  const [showCreate, setShowCreate] = useState(false);
  const [dealers, setDealers] = useState(demoDealers);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", fcaNumber: "", address: "", city: "", postcode: "", password: "",
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleCreate = () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Name, email and password are required");
      return;
    }
    const newDealer = {
      id: `d-${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      fcaNumber: form.fcaNumber,
      address: form.address,
      city: form.city,
      postcode: form.postcode,
      createdAt: new Date().toISOString(),
      status: "active" as const,
      warrantyCount: 0,
      monthlyFee: 0,
    };
    setDealers(prev => [newDealer, ...prev]);
    toast.success(`Dealer "${form.name}" created. Login credentials sent to ${form.email}`);
    // Send real email
    import("@/lib/email-service").then(m => m.sendDealerCreatedEmail(form.email, form.name, form.password));
    setShowCreate(false);
    setForm({ name: "", email: "", phone: "", fcaNumber: "", address: "", city: "", postcode: "", password: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Dealers</h1>
          <p className="text-sm text-muted-foreground">{dealers.length} registered dealers</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-1" /> Create Dealer</Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Dealer</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Location</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">FCA</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Warranties</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {dealers.map(d => (
                <tr key={d.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="p-4">
                    <p className="font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.email}</p>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{d.city}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell"><code className="text-xs bg-secondary/50 px-2 py-1 rounded">{d.fcaNumber}</code></td>
                  <td className="p-4 font-medium">{d.warrantyCount}</td>
                  <td className="p-4">
                    <Badge variant="outline" className={`capitalize ${d.status === "active" ? "bg-primary/10 text-primary border-primary/20" : d.status === "trial" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                      {d.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{new Date(d.createdAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Dealer Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Create New Dealer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dealership Name *</Label>
                <Input value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Prestige Motors" />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="dealer@example.co.uk" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="07700 900000" />
              </div>
              <div className="space-y-2">
                <Label>FCA Number</Label>
                <Input value={form.fcaNumber} onChange={e => update("fcaNumber", e.target.value)} placeholder="FCA-123456" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={e => update("address", e.target.value)} placeholder="Dealership address" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={form.city} onChange={e => update("city", e.target.value)} placeholder="e.g. Birmingham" />
              </div>
              <div className="space-y-2">
                <Label>Postcode</Label>
                <Input value={form.postcode} onChange={e => update("postcode", e.target.value)} placeholder="e.g. B1 2HP" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Initial Password *</Label>
              <Input type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder="Set a password for the dealer" />
              <p className="text-xs text-muted-foreground">This will be sent to the dealer via email.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create & Send Credentials</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
