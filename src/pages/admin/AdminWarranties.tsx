import { demoWarranties } from "@/data/demo-data";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  active: "bg-primary/10 text-primary border-primary/20",
  expired: "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-muted text-muted-foreground border-border",
};

export default function AdminWarranties() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">All Warranties</h1>
        <p className="text-sm text-muted-foreground">{demoWarranties.length} warranties across all dealers</p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Dealer</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Vehicle</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Reg</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Cost</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoWarranties.map(w => (
                <tr key={w.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">{w.customerName}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{w.dealerName}</td>
                  <td className="p-4 text-muted-foreground">{w.vehicleMake} {w.vehicleMake !== w.vehicleModel ? w.vehicleModel : ""}</td>
                  <td className="p-4 hidden lg:table-cell"><code className="text-xs bg-secondary/50 px-2 py-1 rounded">{w.vehicleReg}</code></td>
                  <td className="p-4 font-medium">£{w.cost}</td>
                  <td className="p-4"><Badge variant="outline" className={`capitalize ${statusColors[w.status]}`}>{w.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
