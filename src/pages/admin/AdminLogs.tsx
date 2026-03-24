import { demoAuditLog } from "@/data/demo-data";

export default function AdminLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">System Logs</h1>
        <p className="text-sm text-muted-foreground">Audit trail of all platform activity</p>
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
              {demoAuditLog.map(log => (
                <tr key={log.id} className="border-b border-border/30">
                  <td className="p-4 text-muted-foreground whitespace-nowrap">{new Date(log.timestamp).toLocaleString("en-GB")}</td>
                  <td className="p-4"><code className="text-xs bg-secondary/50 px-2 py-1 rounded">{log.action}</code></td>
                  <td className="p-4 text-muted-foreground">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
