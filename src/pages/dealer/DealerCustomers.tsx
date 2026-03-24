import { demoCustomers, demoWarranties } from "@/data/demo-data";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DealerCustomers() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "d-1";
  const [search, setSearch] = useState("");
  const customers = demoCustomers
    .filter(c => c.dealerId === dealerId)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Customers</h1>
          <p className="text-sm text-muted-foreground">{customers.length} customers</p>
        </div>
        <Button variant="outline" onClick={() => toast.info("Invite sent (simulated)")}>
          <Mail className="w-4 h-4 mr-2" /> Send Invite
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search customers..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map(c => {
          const warranties = demoWarranties.filter(w => w.customerId === c.id);
          const active = warranties.filter(w => w.status === "active").length;
          return (
            <div key={c.id} className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                {active > 0 && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{active} active</Badge>}
              </div>
              <h3 className="font-medium">{c.name}</h3>
              <p className="text-sm text-muted-foreground">{c.email}</p>
              <p className="text-sm text-muted-foreground">{c.phone}</p>
              <p className="text-xs text-muted-foreground mt-2">{c.address}, {c.city}, {c.postcode}</p>
              <p className="text-xs text-muted-foreground mt-1">Joined: {new Date(c.createdAt).toLocaleDateString("en-GB")}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
