import { demoDealers } from "@/data/demo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminDealers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Dealers</h1>
          <p className="text-sm text-muted-foreground">{demoDealers.length} registered dealers</p>
        </div>
        <Button size="sm" onClick={() => toast.info("Create dealer (simulated)")}><Plus className="w-4 h-4 mr-1" /> Add Dealer</Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Dealer</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Location</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">FCA</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Warranties</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {demoDealers.map(d => (
                <tr key={d.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="p-4">
                    <p className="font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.email}</p>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{d.city}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell"><code className="text-xs bg-secondary/50 px-2 py-1 rounded">{d.fcaNumber}</code></td>
                  <td className="p-4 font-medium">{d.warrantyCount}</td>
                  <td className="p-4">
                    <Badge variant="outline" className={`capitalize ${d.status === "active" ? "bg-primary/10 text-primary border-primary/20" : d.status === "trial" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                      {d.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{new Date(d.createdAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
