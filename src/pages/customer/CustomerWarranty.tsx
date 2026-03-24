import { demoWarranties } from "@/data/demo-data";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

export default function CustomerWarranty() {
  const { user } = useAuth();
  const warranties = demoWarranties.filter(w => w.customerId === user?.id && w.status === "active");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">My Warranties</h1>
      {warranties.map(w => (
        <div key={w.id} className="glass-card rounded-xl p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Vehicle:</span> <span className="font-medium">{w.vehicleYear} {w.vehicleMake} {w.vehicleModel}</span></div>
            <div><span className="text-muted-foreground">Registration:</span> <span className="font-mono font-medium">{w.vehicleReg}</span></div>
            <div><span className="text-muted-foreground">Colour:</span> <span className="font-medium">{w.vehicleColour}</span></div>
            <div><span className="text-muted-foreground">Mileage:</span> <span className="font-medium">{w.mileage.toLocaleString()} miles</span></div>
            <div><span className="text-muted-foreground">Start Date:</span> <span className="font-medium">{new Date(w.startDate).toLocaleDateString("en-GB")}</span></div>
            <div><span className="text-muted-foreground">End Date:</span> <span className="font-medium">{new Date(w.endDate).toLocaleDateString("en-GB")}</span></div>
            <div><span className="text-muted-foreground">Duration:</span> <span className="font-medium">{w.duration} months</span></div>
            <div><span className="text-muted-foreground">Dealer:</span> <span className="font-medium">{w.dealerName}</span></div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Certificate download (simulated)")}>
              <Download className="w-4 h-4 mr-2" /> Download Certificate
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("Print (simulated)")}>
              <FileText className="w-4 h-4 mr-2" /> Print
            </Button>
          </div>
        </div>
      ))}
      {warranties.length === 0 && (
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">No active warranties</div>
      )}
    </div>
  );
}
