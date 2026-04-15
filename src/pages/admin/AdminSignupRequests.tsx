import { useState } from "react";
import { sendDealerApprovalEmail, sendDealerRejectionEmail } from "@/lib/email-service";
import { useSignupStore, SignupRequest } from "@/lib/signup-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Eye, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  approved: "bg-primary/10 text-primary border-primary/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function AdminSignupRequests() {
  const store = useSignupStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const selected = store.signupRequests.find(r => r.id === selectedId);
  const filtered = store.signupRequests.filter(r => filter === "all" || r.status === filter);
  const pendingCount = store.signupRequests.filter(r => r.status === "pending").length;

  const handleApprove = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("approve-dealer", {
        body: { signupRequestId: id },
      });
      if (error || !data?.success) {
        toast.error(data?.error || "Failed to approve dealer");
        return;
      }
      // Send welcome email with the real generated password
      sendDealerApprovalEmail(data.email, data.dealerName, data.password);
      toast.success("Dealer approved — login credentials sent via email");
      // Refresh the list
      store.approveRequest(id);
      setSelectedId(null);
    } catch (err) {
      toast.error("Failed to approve dealer");
      console.error(err);
    }
  };

  const handleReject = () => {
    if (rejectId) {
      const req = store.signupRequests.find(r => r.id === rejectId);
      store.rejectRequest(rejectId, rejectionReason);
      toast.info("Application rejected");
      if (req) {
        sendDealerRejectionEmail(req.email, req.dealershipName, rejectionReason || undefined);
      }
      setRejectId(null);
      setRejectionReason("");
      setSelectedId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Signup Requests</h1>
          <p className="text-sm text-muted-foreground">
            {pendingCount} pending {pendingCount === 1 ? "request" : "requests"}
          </p>
        </div>
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected"].map(s => (
            <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" onClick={() => setFilter(s)} className="capitalize">
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Dealership</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Contact</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Location</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Volume</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="p-4">
                    <p className="font-medium">{r.dealershipName}</p>
                    <p className="text-xs text-muted-foreground">{r.email}</p>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{r.contactName}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">{r.city || "—"}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">{r.estimatedVolume || "—"}</td>
                  <td className="p-4">
                    <Badge variant="outline" className={`capitalize ${statusColors[r.status]}`}>{r.status}</Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedId(r.id)} title="View">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {r.status === "pending" && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary" onClick={() => handleApprove(r.id)} title="Approve">
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setRejectId(r.id); }} title="Reject">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No signup requests found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Request Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelectedId(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">Signup Request — {selected.dealershipName}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Contact:</span> <span className="font-medium">{selected.contactName}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{selected.email}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{selected.phone}</span></div>
                <div><span className="text-muted-foreground">City:</span> <span className="font-medium">{selected.city || "—"}</span></div>
                <div><span className="text-muted-foreground">Postcode:</span> <span className="font-medium">{selected.postcode || "—"}</span></div>
                <div><span className="text-muted-foreground">FCA:</span> <span className="font-medium">{selected.fcaNumber || "—"}</span></div>
                <div><span className="text-muted-foreground">Volume:</span> <span className="font-medium">{selected.estimatedVolume || "—"}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={`capitalize ${statusColors[selected.status]}`}>{selected.status}</Badge></div>
                {selected.message && <div className="col-span-2"><span className="text-muted-foreground">Message:</span> <span className="font-medium">{selected.message}</span></div>}
                {selected.rejectionReason && <div className="col-span-2"><span className="text-muted-foreground">Rejection Reason:</span> <span className="font-medium text-destructive">{selected.rejectionReason}</span></div>}
              </div>
              {selected.status === "pending" && (
                <DialogFooter className="gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setRejectId(selected.id); setSelectedId(null); }}>
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                  <Button size="sm" onClick={() => handleApprove(selected.id)}>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Approve & Send Credentials
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectId} onOpenChange={() => { setRejectId(null); setRejectionReason(""); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Reject Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Reason for rejection (optional)</Label>
            <Textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="e.g. Unable to verify business details..."
              className="min-h-[80px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectId(null); setRejectionReason(""); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
