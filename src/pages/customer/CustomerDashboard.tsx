import { useWarrantyStore } from "@/lib/warranty-store";
import { useCoverStore } from "@/lib/cover-store";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Car, Calendar, AlertTriangle, Download, CheckCircle2, Circle, Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { downloadCertificate } from "@/lib/generate-certificate";

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-5 border transition-all duration-200 hover:-translate-y-0.5 ${
      accent
        ? "bg-primary/[0.06] border-primary/20 shadow-[0_0_16px_-6px_hsl(172,66%,40%,0.12)]"
        : "glass-card hover:border-primary/10"
    }`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${accent ? "bg-primary/15" : "bg-muted"}`}>
        <Icon className={`w-3.5 h-3.5 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <p className="text-2xl font-bold font-display">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function CircularCountdown({ daysRemaining, totalDays }: { daysRemaining: number; totalDays: number }) {
  const elapsed = totalDays - daysRemaining;
  const progressPercent = totalDays > 0 ? (elapsed / totalDays) * 100 : 0;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-display">{daysRemaining}</span>
          <span className="text-[10px] text-muted-foreground">days left</span>
        </div>
      </div>
    </div>
  );
}

function getCoverageTier(templateName?: string, duration?: number): { label: string; className: string } | null {
  if (templateName) {
    const lower = templateName.toLowerCase();
    if (lower.includes("premium") || lower.includes("gold")) return { label: "Gold", className: "bg-amber-500/15 text-amber-400 border-amber-500/25" };
    if (lower.includes("standard") || lower.includes("silver")) return { label: "Silver", className: "bg-slate-400/15 text-slate-300 border-slate-400/25" };
    if (lower.includes("basic") || lower.includes("bronze")) return { label: "Bronze", className: "bg-orange-600/15 text-orange-400 border-orange-600/25" };
  }
  if (duration) {
    if (duration >= 24) return { label: "Gold", className: "bg-amber-500/15 text-amber-400 border-amber-500/25" };
    if (duration >= 12) return { label: "Silver", className: "bg-slate-400/15 text-slate-300 border-slate-400/25" };
    return { label: "Bronze", className: "bg-orange-600/15 text-orange-400 border-orange-600/25" };
  }
  return null;
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const store = useWarrantyStore();
  const coverStore = useCoverStore();
  const warranties = store.warranties.filter(w => w.customerId === user?.id);
  const claims = store.claims.filter(c => c.customerId === user?.id);
  const activeWarranty = warranties.find(w => w.status === "active");

  let daysRemaining = 0;
  let totalDays = 0;
  if (activeWarranty) {
    const start = new Date(activeWarranty.startDate).getTime();
    const end = new Date(activeWarranty.endDate).getTime();
    const now = Date.now();
    totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  }

  const latestClaim = claims.length > 0 ? claims[0] : null;
  const claimSteps = ["Submitted", "Under Review", "Decision"];
  const getClaimStepIndex = (status?: string) => {
    if (!status) return -1;
    if (status === "pending") return 0;
    if (status === "under_review" || status === "info_requested") return 1;
    return 2;
  };
  const currentStepIndex = latestClaim ? getClaimStepIndex(latestClaim.status) : -1;

  const coverTemplate = activeWarranty ? coverStore.getTemplateForWarranty(activeWarranty.id) : undefined;
  const tier = getCoverageTier(coverTemplate?.name, activeWarranty?.duration);

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
            {tier && <Badge variant="outline" className={tier.className}>{tier.label}</Badge>}
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Vehicle details */}
            <div className="flex-1 grid sm:grid-cols-2 gap-4">
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

            {/* Circular countdown */}
            <div className="flex flex-col items-center">
              <CircularCountdown daysRemaining={daysRemaining} totalDays={totalDays} />
              <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
                <span>{new Date(activeWarranty.startDate).toLocaleDateString("en-GB")}</span>
                <span>{new Date(activeWarranty.endDate).toLocaleDateString("en-GB")}</span>
              </div>
            </div>
          </div>

          {/* Prominent Certificate Download */}
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Download className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Download Your Warranty Certificate</p>
              <p className="text-xs text-muted-foreground">Keep a copy for your records and garage visits</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => downloadCertificate(activeWarranty)}>
              <Download className="w-3.5 h-3.5 mr-1" /> Download
            </Button>
          </div>

          {/* Action buttons — 2x2 grid on mobile */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
            <Button size="sm" asChild><Link to="/customer/warranty">View Details</Link></Button>
            <Button size="sm" variant="outline" asChild><Link to="/customer/cover">Your Cover</Link></Button>
            <Button size="sm" variant="outline" asChild><Link to="/customer/claims">Submit Claim</Link></Button>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-xl p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No active warranty found</p>
        </div>
      )}

      {/* Claim Status Tracker OR Empty Claim State */}
      {latestClaim ? (
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
          <p className="text-[10px] text-muted-foreground mt-2 text-center">Typically 3–5 working days</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="font-medium mb-1">No claims yet</p>
          <p className="text-sm text-muted-foreground mb-4">If something goes wrong with your vehicle, you can submit a claim here.</p>
          <Button size="sm" asChild>
            <Link to="/customer/claims">Submit a Claim</Link>
          </Button>
        </div>
      )}

      {/* Stat cards with hover effects */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={Car} label="Total Warranties" value={warranties.length} />
        <StatCard icon={Shield} label="Active" value={warranties.filter(w => w.status === "active").length} accent />
        <StatCard icon={Calendar} label="Claims" value={claims.length} />
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
