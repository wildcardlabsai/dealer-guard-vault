import { useWarrantyStore } from "@/lib/warranty-store";
import { useCoverStore } from "@/lib/cover-store";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Car, Calendar, AlertTriangle, Download, CheckCircle2, Circle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { downloadCertificate } from "@/lib/generate-certificate";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const store = useWarrantyStore();
  const coverStore = useCoverStore();
  const warranties = store.warranties.filter(w => w.customerId === user?.id);
  const claims = store.claims.filter(c => c.customerId === user?.id);
  const activeWarranty = warranties.find(w => w.status === "active");

  // Warranty countdown
  let daysRemaining = 0;
  let totalDays = 0;
  let progressPercent = 0;
  if (activeWarranty) {
    const start = new Date(activeWarranty.startDate).getTime();
    const end = new Date(activeWarranty.endDate).getTime();
    const now = Date.now();
    totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
    const elapsed = totalDays - daysRemaining;
    progressPercent = totalDays > 0 ? Math.round((elapsed / totalDays) * 100) : 0;
  }

  // Most recent claim for status tracker
  const latestClaim = claims.length > 0 ? claims[0] : null;
  const claimSteps = ["Submitted", "Under Review", "Decision"];
  const getClaimStepIndex = (status?: string) => {
    if (!status) return -1;
    if (status === "pending") return 0;
    if (status === "under_review" || status === "info_requested") return 1;
    return 2; // approved or rejected
  };
  const currentStepIndex = latestClaim ? getClaimStepIndex(latestClaim.status) : -1;

  // Cover template for active warranty
  const coverTemplate = activeWarranty ? coverStore.getTemplateForWarranty(activeWarranty.id) : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Welcome back, {user?.name}</h1>
        <p className="text-sm text-muted-foreground">Your warranty overview</p>
      </div>

      {activeWarranty ? (
        <div className="glass-card-strong rounded-xl p-6 glow-primary-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-semibold font-display">Active Warranty</h2>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 ml-auto">Active</Badge>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Vehicle</p>
              <p className="font-medium">{activeWarranty.vehicleYear} {activeWarranty.vehicleMake} {activeWarranty.vehicleModel}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Registration</p>
              <p className="font-medium font-mono">{activeWarranty.vehicleReg}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Expiry Date</p>
              <p className="font-medium">{new Date(activeWarranty.endDate).toLocaleDateString("en-GB")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Coverage</p>
              <p className="font-medium">{activeWarranty.duration} months</p>
            </div>
          </div>

          {/* Warranty Countdown */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Warranty period</span>
              <span className="text-sm font-medium">{daysRemaining} days remaining</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">{new Date(activeWarranty.startDate).toLocaleDateString("en-GB")}</span>
              <span className="text-xs text-muted-foreground">{new Date(activeWarranty.endDate).toLocaleDateString("en-GB")}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-border/50 flex-wrap">
            <Button size="sm" asChild><Link to="/customer/warranty">View Details</Link></Button>
            <Button size="sm" variant="outline" asChild><Link to="/customer/cover">Your Cover</Link></Button>
            <Button size="sm" variant="outline" asChild><Link to="/customer/claims">Submit Claim</Link></Button>
            <Button size="sm" variant="outline" onClick={() => downloadCertificate(activeWarranty)}>
              <Download className="w-3.5 h-3.5 mr-1" /> Download Certificate
            </Button>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-xl p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No active warranty found</p>
        </div>
      )}

      {/* Claim Status Tracker */}
      {latestClaim && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="font-semibold font-display text-sm">Latest Claim Status</h3>
            <Badge variant="outline" className="ml-auto capitalize text-xs">
              {latestClaim.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4 truncate">{latestClaim.description}</p>
          <div className="flex items-center gap-0">
            {claimSteps.map((step, i) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i <= currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {i < currentStepIndex ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : i === currentStepIndex ? (
                      <Circle className="w-4 h-4 fill-current" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-xs mt-1.5 ${i <= currentStepIndex ? "font-medium" : "text-muted-foreground"}`}>{step}</span>
                </div>
                {i < claimSteps.length - 1 && (
                  <div className={`h-0.5 flex-1 -mx-2 mt-[-1rem] ${i < currentStepIndex ? "bg-primary" : "bg-secondary"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5">
          <Car className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold font-display">{warranties.length}</p>
          <p className="text-sm text-muted-foreground">Total Warranties</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <Shield className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold font-display">{warranties.filter(w => w.status === "active").length}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <Calendar className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold font-display">{claims.length}</p>
          <p className="text-sm text-muted-foreground">Claims</p>
        </div>
      </div>

      {/* What's Covered Summary */}
      {coverTemplate && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="font-semibold font-display text-sm">What's Covered — {coverTemplate.name}</h3>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link to="/customer/cover">View Full Cover</Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {coverTemplate.coveredItems.slice(0, 8).map(item => (
              <div key={item.name} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-primary/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
          {coverTemplate.coveredItems.length > 8 && (
            <p className="text-xs text-muted-foreground mt-2">
              + {coverTemplate.coveredItems.length - 8} more covered items
            </p>
          )}
        </div>
      )}

      {warranties.length > 1 && (
        <div>
          <h3 className="font-semibold font-display mb-3">All Warranties</h3>
          <div className="space-y-3">
            {warranties.map(w => (
              <div key={w.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{w.vehicleMake} {w.vehicleModel}</p>
                  <p className="text-sm text-muted-foreground">{w.vehicleReg} • {w.duration} months</p>
                </div>
                <Badge variant="outline" className={`capitalize ${w.status === "active" ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground"}`}>
                  {w.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
