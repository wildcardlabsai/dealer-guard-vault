import { useAuth } from "@/contexts/AuthContext";
import { useWarrantyStore } from "@/lib/warranty-store";
import { useClaimStore } from "@/lib/claim-store";
import { useDisputeIQStore } from "@/lib/disputeiq-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Mail, Loader2, UserPlus, Clock, Send, Pencil } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  dealerId: string;
  createdAt: string;
}

export default function DealerCustomers() {
  const { user } = useAuth();
  const { warranties } = useWarrantyStore();
  const claimStore = useClaimStore();
  const disputeStore = useDisputeIQStore();
  const dealerId = user?.dealerId || "";
  const dealerName = user?.dealerName || user?.name || "";
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviting, setInviting] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [timelineCustomer, setTimelineCustomer] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // Edit customer state
  const [editCustomer, setEditCustomer] = useState<CustomerRecord | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", address: "", city: "", postcode: "" });
  const [saving, setSaving] = useState(false);

  const fetchCustomers = useCallback(async () => {
    if (!dealerId) return;
    try {
      const { data, error } = await supabase.functions.invoke("admin-data", {
        body: { table: "customers", action: "select", filters: { dealer_id: dealerId } },
      });
      if (!error && data?.data) {
        setCustomers((data.data as any[]).map((c: any) => ({
          id: c.id,
          name: c.full_name,
          email: c.email,
          phone: c.phone || "",
          address: c.address || "",
          city: c.city || "",
          postcode: c.postcode || "",
          dealerId: c.dealer_id,
          createdAt: c.created_at,
        })));
      }
    } catch { /* ignore */ }
    setLoadingCustomers(false);
  }, [dealerId]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const openEdit = (c: CustomerRecord) => {
    setEditCustomer(c);
    setEditForm({ name: c.name, email: c.email, phone: c.phone, address: c.address, city: c.city, postcode: c.postcode });
  };

  const handleSaveCustomer = async () => {
    if (!editCustomer || !editForm.name || !editForm.email) {
      toast.error("Name and email are required");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.functions.invoke("admin-data", {
        body: {
          table: "customers",
          action: "update",
          id: editCustomer.id,
          updates: {
            full_name: editForm.name,
            email: editForm.email,
            phone: editForm.phone || null,
            address: editForm.address || null,
            city: editForm.city || null,
            postcode: editForm.postcode || null,
          },
        },
      });
      if (error) throw error;
      toast.success("Customer details updated");
      setEditCustomer(null);
      fetchCustomers();
    } catch (err: any) {
      toast.error("Failed to update customer: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const getTimeline = (customerId: string) => {
    const events: { date: string; type: string; detail: string }[] = [];
    warranties.filter(w => w.customerId === customerId).forEach(w => {
      events.push({ date: w.createdAt, type: "warranty", detail: `Warranty created — ${w.vehicleMake} ${w.vehicleModel} (${w.vehicleReg})` });
    });
    claimStore.getClaimsForCustomer(customerId).forEach(c => {
      events.push({ date: c.createdAt, type: "claim", detail: `Claim submitted — ${c.issueTitle} (${c.reference})` });
      if (c.decision) events.push({ date: c.decision.timestamp, type: "decision", detail: `Claim ${c.decision.type.replace(/_/g, " ")} — ${c.reference}` });
      (c.messages || []).filter(m => !m.internal).forEach(m => {
        events.push({ date: m.timestamp, type: "message", detail: `Message from ${m.from}: "${m.message.slice(0, 60)}..."` });
      });
    });
    const customerName = customers.find(c => c.id === customerId)?.name || "";
    disputeStore.getCasesForDealer(dealerId).filter(d => d.customerName === customerName).forEach(d => {
      events.push({ date: d.createdAt, type: "dispute", detail: `DisputeIQ case opened — ${d.complaintType}` });
    });
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const timelineEvents = timelineCustomer ? getTimeline(timelineCustomer) : [];
  const timelineCustomerName = customers.find(c => c.id === timelineCustomer)?.name || "";

  const filteredCustomers = customers
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  const handleInvite = async () => {
    if (!inviteEmail || !inviteName) {
      toast.error("Please fill in both name and email");
      return;
    }
    setInviting(true);
    try {
      const { data, error } = await supabase.functions.invoke("invite-customer", {
        body: { email: inviteEmail, customerName: inviteName, dealerName },
      });
      if (error) throw error;
      if (data?.success) {
        toast.success(data.isNewAccount ? `Account created and invite sent to ${inviteEmail}` : `Reminder email sent to ${inviteEmail} (account already exists)`);
        setInviteOpen(false);
        setInviteEmail("");
        setInviteName("");
        fetchCustomers();
      } else {
        throw new Error(data?.error || "Unknown error");
      }
    } catch (err: any) {
      console.error("Invite error:", err);
      toast.error(`Failed to send invite: ${err.message || "Unknown error"}`);
    } finally {
      setInviting(false);
    }
  };

  const handleInviteExisting = async (customer: CustomerRecord) => {
    const toastId = toast.loading(`Sending invite to ${customer.email}...`);
    try {
      const { data, error } = await supabase.functions.invoke("invite-customer", {
        body: { email: customer.email, customerName: customer.name, dealerName },
      });
      if (error) throw error;
      if (data?.success) {
        toast.success(data.isNewAccount ? `Account created and invite sent to ${customer.name}` : `Reminder sent to ${customer.name} (account exists)`, { id: toastId });
      } else {
        throw new Error(data?.error || "Unknown error");
      }
    } catch (err: any) {
      toast.error(`Failed to invite ${customer.name}: ${err.message || "Unknown error"}`, { id: toastId });
    }
  };

  const handleResendWelcome = async (customer: CustomerRecord) => {
    setResendingId(customer.id);
    const toastId = toast.loading(`Resending welcome email to ${customer.email}...`);
    try {
      const { data, error } = await supabase.functions.invoke("invite-customer", {
        body: { email: customer.email, customerName: customer.name, dealerName },
      });
      if (error) throw error;
      if (data?.success) {
        toast.success(data.isNewAccount ? `New account created and welcome email sent to ${customer.name}` : `Welcome email resent to ${customer.name} with existing login details`, { id: toastId });
      } else {
        throw new Error(data?.error || "Unknown error");
      }
    } catch (err: any) {
      toast.error(`Failed to resend: ${err.message || "Unknown error"}`, { id: toastId });
    } finally {
      setResendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Customers</h1>
          <p className="text-sm text-muted-foreground">{filteredCustomers.length} customers</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" /> Invite Customer
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search customers..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loadingCustomers ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No customers found. Customers are created automatically when you issue warranties.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map(c => {
            const custWarranties = warranties.filter(w => w.customerId === c.id || w.customerEmail?.toLowerCase() === c.email.toLowerCase());
            const active = custWarranties.filter(w => w.status === "active").length;
            return (
              <div key={c.id} className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex items-center gap-2">
                    {active > 0 && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{active} active</Badge>}
                  </div>
                </div>
                <h3 className="font-medium">
                  <Link to={`/dealer/warranties?customer=${encodeURIComponent(c.email)}`} className="hover:text-primary hover:underline transition-colors">
                    {c.name}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">{c.email}</p>
                {c.phone && <p className="text-sm text-muted-foreground">{c.phone}</p>}
                {c.address && <p className="text-xs text-muted-foreground mt-2">{c.address}{c.city ? `, ${c.city}` : ""}{c.postcode ? `, ${c.postcode}` : ""}</p>}
                <p className="text-xs text-muted-foreground mt-1">Joined: {new Date(c.createdAt).toLocaleDateString("en-GB")}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => openEdit(c)}>
                    <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleResendWelcome(c)} disabled={resendingId === c.id}>
                    {resendingId === c.id ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-1.5" />}
                    Resend Welcome
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleInviteExisting(c)}>
                    <Mail className="w-3.5 h-3.5 mr-1.5" /> Invite
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setTimelineCustomer(c.id)}>
                    <Clock className="w-3.5 h-3.5 mr-1.5" /> Timeline
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Customer Dialog */}
      <Dialog open={!!editCustomer} onOpenChange={() => setEditCustomer(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={editForm.city} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Postcode</Label>
                <Input value={editForm.postcode} onChange={e => setEditForm(f => ({ ...f, postcode: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCustomer(null)}>Cancel</Button>
            <Button onClick={handleSaveCustomer} disabled={saving}>
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New Customer</DialogTitle>
            <DialogDescription>Create a customer portal account and send them login credentials via email.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input placeholder="John Smith" value={inviteName} onChange={e => setInviteName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="john@example.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleInvite} disabled={inviting}>
              {inviting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : <><Mail className="w-4 h-4 mr-2" /> Create Account & Send Invite</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Timeline Modal */}
      <Dialog open={!!timelineCustomer} onOpenChange={() => setTimelineCustomer(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Timeline — {timelineCustomerName}</DialogTitle>
            <DialogDescription>Chronological history of all interactions</DialogDescription>
          </DialogHeader>
          <div className="space-y-0 pt-2">
            {timelineEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No activity found</p>
            ) : (
              timelineEvents.map((ev, i) => {
                const typeColors: Record<string, string> = {
                  warranty: "bg-primary/20 text-primary",
                  claim: "bg-amber-500/20 text-amber-400",
                  decision: "bg-emerald-500/20 text-emerald-400",
                  message: "bg-muted text-muted-foreground",
                  dispute: "bg-purple-500/20 text-purple-400",
                };
                return (
                  <div key={i} className="flex gap-3 py-3 border-b border-border/30 last:border-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${typeColors[ev.type]?.split(" ")[0] || "bg-muted"}`} />
                      {i < timelineEvents.length - 1 && <div className="w-px flex-1 bg-border/30 mt-1" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{ev.detail}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(ev.date).toLocaleDateString("en-GB")} {new Date(ev.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] h-5 shrink-0 ${typeColors[ev.type] || ""}`}>
                      {ev.type}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
