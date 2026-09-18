import { useState } from "react";
import { useWarrantyStore } from "@/lib/warranty-store";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function CustomerRequests() {
  const { user } = useAuth();
  const store = useWarrantyStore();
  const requests = store.requests.filter(r => r.customerId === user?.id);
  const warranties = store.warranties.filter(w => w.customerId === user?.id);
  const [showNew, setShowNew] = useState(false);
  const [type, setType] = useState("extension");
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    if (!desc.trim()) { toast.error("Please describe your request"); return; }
    const warranty = warranties[0];
    if (!warranty) { toast.error("No warranty found"); return; }

    store.addRequest({
      id: `req-${Date.now()}`,
      customerId: user?.id || "",
      customerName: user?.name || "",
      warrantyId: warranty.id,
      dealerId: warranty.dealerId,
      type: type as any,
      description: desc,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    });

    toast.success("Request submitted!");
    setShowNew(false);
    setDesc("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">My Requests</h1>
        <Button size="sm" onClick={() => setShowNew(!showNew)}><Plus className="w-4 h-4 mr-1" /> New Request</Button>
      </div>

      {showNew && (
        <div className="glass-card rounded-xl p-6 space-y-4 animate-fade-in">
          <h2 className="font-semibold font-display">Submit Request</h2>
          <div className="space-y-2">
            <Label>Request Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="extension">Warranty Extension</SelectItem>
                <SelectItem value="cancellation">Cancellation</SelectItem>
                <SelectItem value="update">Update Details</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Details *</Label>
            <Textarea placeholder="Describe your request..." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit}>Submit</Button>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {requests.map(r => (
          <div key={r.id} className="glass-card rounded-xl p-5 flex items-start justify-between">
            <div>
              <p className="font-medium capitalize">{r.type} Request</p>
              <p className="text-sm text-muted-foreground">{r.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(r.createdAt).toLocaleDateString("en-GB")}</p>
            </div>
            <Badge variant="outline" className={`capitalize ${r.status === "approved" ? "bg-primary/10 text-primary border-primary/20" : r.status === "rejected" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>{r.status}</Badge>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">No requests submitted</div>
        )}
      </div>
    </div>
  );
}
