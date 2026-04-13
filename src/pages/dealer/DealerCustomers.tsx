import { demoCustomers, demoWarranties } from "@/data/demo-data";
import { useAuth } from "@/contexts/AuthContext";
import { useWarrantyStore } from "@/lib/warranty-store";
import { useClaimStore } from "@/lib/claim-store";
import { useDisputeIQStore } from "@/lib/disputeiq-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Mail, Loader2, UserPlus, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

export default function DealerCustomers() {
  const { user } = useAuth();
  const { warranties } = useWarrantyStore();
  const claimStore = useClaimStore();
  const disputeStore = useDisputeIQStore();
  const dealerId = user?.dealerId || "d-1";
  const dealerName = dealerId === "d-1" ? "Prestige Motors" : "City Autos";
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviting, setInviting] = useState(false);
  const [timelineCustomer, setTimelineCustomer] = useState<string | null>(null);

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
    disputeStore.getCasesForDealer(dealerId).filter(d => d.customerName === demoCustomers.find(c => c.id === customerId)?.name).forEach(d => {
      events.push({ date: d.createdAt, type: "dispute", detail: `DisputeIQ case opened — ${d.complaintType}` });
    });
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const timelineEvents = timelineCustomer ? getTimeline(timelineCustomer) : [];
  const timelineCustomerName = demoCustomers.find(c => c.id === timelineCustomer)?.name || "";

  const customers = demoCustomers
    .filter(c => c.dealerId === dealerId)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  const handleInvite = async () => {
    if (!inviteEmail || !inviteName) {
      toast.error("Please fill in both name and email");
      return;
    }
    setInviting(true);
    try {
      const { data, error } = await supabase.functions.invoke("invite-customer", {
        body: {
          email: inviteEmail,
          customerName: inviteName,
          dealerName,
        },
      });
      if (error) throw error;
      if (data?.success) {
        toast.success(
          data.isNewAccount
            ? `Account created and invite sent to ${inviteEmail}`
            : `Reminder email sent to ${inviteEmail} (account already exists)`
        );
        setInviteOpen(false);
        setInviteEmail("");
        setInviteName("");
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

  const handleInviteExisting = async (customer: typeof demoCustomers[0]) => {
    const toastId = toast.loading(`Sending invite to ${customer.email}...`);
    try {
      const { data, error } = await supabase.functions.invoke("invite-customer", {
        body: {
          email: customer.email,
          customerName: customer.name,
          dealerName,
        },
      });
      if (error) throw error;
      if (data?.success) {
        toast.success(
          data.isNewAccount
            ? `Account created and invite sent to ${customer.name}`
            : `Reminder sent to ${customer.name} (account exists)`,
          { id: toastId }
        );
      } else {
        throw new Error(data?.error || "Unknown error");
      }
    } catch (err: any) {
      toast.error(`Failed to invite ${customer.name}: ${err.message || "Unknown error"}`, { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Customers</h1>
          <p className="text-sm text-muted-foreground">{customers.length} customers</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" /> Invite Customer
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search customers..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map(c => {
          const warranties = demoWarranties.filter(w => w.customerId === c.id);
          const active = warranties.filter(w => w.status === "active").length;
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
              <h3 className="font-medium">{c.name}</h3>
              <p className="text-sm text-muted-foreground">{c.email}</p>
              <p className="text-sm text-muted-foreground">{c.phone}</p>
              <p className="text-xs text-muted-foreground mt-2">{c.address}, {c.city}, {c.postcode}</p>
              <p className="text-xs text-muted-foreground mt-1">Joined: {new Date(c.createdAt).toLocaleDateString("en-GB")}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => handleInviteExisting(c)}
              >
                <Mail className="w-3.5 h-3.5 mr-1.5" /> Send Portal Invite
              </Button>
            </div>
          );
        })}
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New Customer</DialogTitle>
            <DialogDescription>
              Create a customer portal account and send them login credentials via email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                placeholder="John Smith"
                value={inviteName}
                onChange={e => setInviteName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleInvite} disabled={inviting}>
              {inviting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
              ) : (
                <><Mail className="w-4 h-4 mr-2" /> Create Account & Send Invite</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
