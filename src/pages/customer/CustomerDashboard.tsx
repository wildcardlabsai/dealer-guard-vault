import { demoWarranties, demoClaims } from "@/data/demo-data";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Car, Calendar, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const warranties = demoWarranties.filter(w => w.customerId === user?.id);
  const claims = demoClaims.filter(c => c.customerId === user?.id);
  const activeWarranty = warranties.find(w => w.status === "active");

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
        </div>
      ) : (
        <div className="glass-card rounded-xl p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No active warranty found</p>
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
