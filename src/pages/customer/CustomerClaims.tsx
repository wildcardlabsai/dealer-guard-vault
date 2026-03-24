import { useState } from "react";
import { demoClaims } from "@/data/demo-data";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: Clock },
  under_review: { label: "Under Review", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: MessageSquare },
  approved: { label: "Approved", color: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
  info_requested: { label: "Info Requested", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: MessageSquare },
};

export default function CustomerClaims() {
  const { user } = useAuth();
  const claims = demoClaims.filter(c => c.customerId === user?.id);
  const [showNew, setShowNew] = useState(false);
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    toast.success("Claim submitted successfully!");
    setShowNew(false);
    setDesc("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">My Claims</h1>
        <Button size="sm" onClick={() => setShowNew(!showNew)}>
          <Plus className="w-4 h-4 mr-1" /> New Claim
        </Button>
      </div>

      {showNew && (
        <div className="glass-card rounded-xl p-6 space-y-4 animate-fade-in">
          <h2 className="font-semibold font-display">Submit New Claim</h2>
          <div className="space-y-2">
            <Label>Description of Issue</Label>
            <Textarea placeholder="Describe the fault or issue..." value={desc} onChange={e => setDesc(e.target.value)} rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Upload Photos/Documents</Label>
            <Input type="file" multiple />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit}>Submit Claim</Button>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {claims.map(claim => {
          const status = statusConfig[claim.status];
          return (
            <div key={claim.id} className="glass-card rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{claim.vehicleReg}</p>
                  <p className="text-sm text-muted-foreground">{claim.description}</p>
                </div>
                <Badge variant="outline" className={status.color}>
                  <status.icon className="w-3 h-3 mr-1" /> {status.label}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Timeline</p>
                <div className="space-y-2">
                  {claim.timeline.map((t, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <div>
                        <p>{t.action}</p>
                        <p className="text-xs text-muted-foreground">{t.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        {claims.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">No claims submitted yet</div>
        )}
      </div>
    </div>
  );
}
