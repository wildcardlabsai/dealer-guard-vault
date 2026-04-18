import { useState, useEffect, useCallback } from "react";
import { demoDealers } from "@/data/demo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Eye, Pencil, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";

export default function AdminDealers() {
  const [showCreate, setShowCreate] = useState(false);
  const [dealers, setDealers] = useState(demoDealers);
  const [loading, setLoading] = useState(true);

  const fetchDealers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-data", {
        body: { table: "dealers", action: "select" },
      });
      if (error) throw error;
      const dbDealers = (data?.data || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        email: d.email,
        phone: d.phone || "",
        fcaNumber: d.fca_number || "",
        address: d.address || "",
        city: d.city || "",
        postcode: d.postcode || "",
        createdAt: d.joined_at || d.created_at,
        status: d.status as "active" | "suspended" | "trial",
        warrantyCount: 0,
        monthlyFee: 0,
      }));
      // Merge: DB dealers first, then demo dealers not already in DB
      const dbEmails = new Set(dbDealers.map((d: any) => d.email.toLowerCase()));
      const merged = [...dbDealers, ...demoDealers.filter(d => !dbEmails.has(d.email.toLowerCase()))];
      setDealers(merged);
    } catch {
      // Fallback to demo data
      setDealers(demoDealers);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDealers(); }, [fetchDealers]);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", fcaNumber: "", address: "", city: "", postcode: "", password: "",
  });

  // Edit dealer state
  const [editDealer, setEditDealer] = useState<typeof demoDealers[0] | null>(null);
  const [editForm, setEditForm] = useState({
    name: "", email: "", phone: "", fcaNumber: "", address: "", city: "", postcode: "", status: "",
  });
  const [editSaving, setEditSaving] = useState(false);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const openEditDealer = (d: typeof demoDealers[0]) => {
    setEditDealer(d);
    setEditForm({
      name: d.name, email: d.email, phone: d.phone, fcaNumber: d.fcaNumber,
      address: d.address, city: d.city, postcode: d.postcode, status: d.status,
    });
  };

  const handleSaveDealer = async () => {
    if (!editDealer || !editForm.name || !editForm.email) {
      toast.error("Name and email are required");
      return;
    }
    setEditSaving(true);
    try {
      const { error } = await supabase.functions.invoke("admin-data", {
        body: {
          table: "dealers",
          action: "update",
          id: editDealer.id,
          updates: {
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone || null,
            fca_number: editForm.fcaNumber || null,
            address: editForm.address || null,
            city: editForm.city || null,
            postcode: editForm.postcode || null,
            status: editForm.status,
          },
        },
      });
      if (error) throw error;
      // Update local state
      setDealers(prev => prev.map(d => d.id === editDealer.id ? {
        ...d, name: editForm.name, email: editForm.email, phone: editForm.phone,
        fcaNumber: editForm.fcaNumber, address: editForm.address, city: editForm.city,
        postcode: editForm.postcode, status: editForm.status as any,
      } : d));
      toast.success("Dealer details updated");
      setEditDealer(null);
      fetchDealers();
    } catch (err: any) {
      toast.error("Failed to update dealer: " + (err.message || "Unknown error"));
    } finally {
      setEditSaving(false);
    }
  };

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
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={fetchDealers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-1" /> Create Dealer</Button>
        </div>
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
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
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
                  <td className="p-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDealer(d)} title="Edit">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dealer Dialog */}
      <Dialog open={!!editDealer} onOpenChange={() => setEditDealer(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Dealer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dealership Name *</Label>
                <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>FCA Number</Label>
                <Input value={editForm.fcaNumber} onChange={e => setEditForm(f => ({ ...f, fcaNumber: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={editForm.city} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Postcode</Label>
                <Input value={editForm.postcode} onChange={e => setEditForm(f => ({ ...f, postcode: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full text-sm bg-secondary/50 border border-border/50 rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="trial">Trial</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDealer(null)}>Cancel</Button>
            <Button onClick={handleSaveDealer} disabled={editSaving}>
              {editSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
