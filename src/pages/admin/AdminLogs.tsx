import { useWarrantyStore } from "@/lib/warranty-store";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const actionTypes = ["all", "warranty", "claim", "customer", "dealer", "system"];

export default function AdminLogs() {
  const store = useWarrantyStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = store.auditLog.filter(log => {
    const matchesSearch = search === "" ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || log.action.toLowerCase().includes(filter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">System Logs</h1>
        <p className="text-sm text-muted-foreground">Audit trail of all platform activity</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search logs..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {actionTypes.map(t => (
            <Button key={t} variant={filter === t ? "default" : "outline"} size="sm" onClick={() => setFilter(t)} className="capitalize">
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Timestamp</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Action</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} className="border-b border-border/30">
                  <td className="p-4 text-muted-foreground whitespace-nowrap">{new Date(log.timestamp).toLocaleString("en-GB")}</td>
                  <td className="p-4"><code className="text-xs bg-secondary/50 px-2 py-1 rounded">{log.action}</code></td>
                  <td className="p-4 text-muted-foreground">{log.details}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-muted-foreground">No logs matching your search</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
