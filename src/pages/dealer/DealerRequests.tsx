import { useWarrantyStore } from "@/lib/warranty-store";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

const typeColors: Record<string, string> = {
  extension: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cancellation: "bg-destructive/10 text-destructive border-destructive/20",
  update: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function DealerRequests() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "d-1";
  const store = useWarrantyStore();
  const requests = store.requests.filter(r => r.dealerId === dealerId);

  const handleAction = (requestId: string, status: "approved" | "rejected") => {
    store.updateRequestStatus(requestId, status);
    toast.success(`Request ${status}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Customer Requests</h1>
        <p className="text-sm text-muted-foreground">{requests.length} requests</p>
      </div>
      <div className="space-y-4">
        {requests.map(r => (
          <div key={r.id} className="glass-card rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <p className="font-medium">{r.customerName}</p>
                <p className="text-sm text-muted-foreground">{r.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`capitalize ${typeColors[r.type]}`}>{r.type}</Badge>
                <Badge variant="outline" className={`capitalize ${r.status === "approved" ? "bg-primary/10 text-primary border-primary/20" : r.status === "rejected" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>{r.status}</Badge>
              </div>
            </div>
            {r.status === "pending" && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleAction(r.id, "approved")}><CheckCircle2 className="w-4 h-4 mr-1" /> Approve</Button>
                <Button size="sm" variant="destructive" onClick={() => handleAction(r.id, "rejected")}><XCircle className="w-4 h-4 mr-1" /> Reject</Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">{new Date(r.createdAt).toLocaleDateString("en-GB")}</p>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">No requests</div>
        )}
      </div>
    </div>
  );
}
