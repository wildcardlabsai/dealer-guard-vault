import { useState } from "react";
import { useSupportStore, SupportTicket } from "@/lib/support-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, MessageSquare, Clock, CheckCircle2, Inbox, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  open: { label: "Open", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: MessageSquare },
  resolved: { label: "Resolved", color: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle2 },
  closed: { label: "Closed", color: "bg-muted text-muted-foreground border-border", icon: CheckCircle2 },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-secondary text-muted-foreground border-border" },
  medium: { label: "Medium", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  high: { label: "High", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
      <p className="text-2xl font-bold font-display">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function AdminSupport() {
  const store = useSupportStore();
  const allTickets = store.tickets;
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const filtered = allTickets.filter(t => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    return true;
  });

  const openCount = allTickets.filter(t => t.status === "open").length;
  const inProgressCount = allTickets.filter(t => t.status === "in_progress").length;
  const resolvedCount = allTickets.filter(t => t.status === "resolved").length;

  const handleReply = () => {
    if (!reply.trim() || !selectedTicket) return;
    store.addMessage(selectedTicket.id, {
      id: `sm-${Date.now()}`,
      from: "Platform Admin",
      fromRole: "admin",
      message: reply,
      timestamp: new Date().toISOString(),
    });
    setReply("");
    toast.success("Reply sent");
    const updated = allTickets.find(t => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  const handleStatusChange = (ticketId: string, status: SupportTicket["status"]) => {
    store.updateStatus(ticketId, status);
    toast.success(`Ticket marked as ${status.replace("_", " ")}`);
    const updated = allTickets.find(t => t.id === ticketId);
    if (updated) setSelectedTicket(updated);
  };

  if (view === "detail" && selectedTicket) {
    const ticket = allTickets.find(t => t.id === selectedTicket.id) || selectedTicket;
    return (
      <div className="max-w-3xl space-y-6">
        <button onClick={() => { setView("list"); setSelectedTicket(null); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to tickets
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold font-display">{ticket.subject}</h1>
            <p className="text-sm text-muted-foreground">{ticket.dealerName} · {new Date(ticket.createdAt).toLocaleDateString("en-GB")}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Select value={ticket.status} onValueChange={v => handleStatusChange(ticket.id, v as SupportTicket["status"])}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className={priorityConfig[ticket.priority].color}>{priorityConfig[ticket.priority].label}</Badge>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 space-y-4">
          {ticket.messages.map(msg => (
            <div key={msg.id} className={`p-4 rounded-lg ${msg.fromRole === "admin" ? "bg-primary/5 border border-primary/10" : "bg-secondary/30"}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{msg.from} <span className="text-xs text-muted-foreground ml-1">({msg.fromRole})</span></p>
                <p className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleString("en-GB")}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-xl p-6">
          <Label className="mb-2 block">Reply</Label>
          <Textarea placeholder="Type your reply..." value={reply} onChange={e => setReply(e.target.value)} className="mb-3" />
          <Button onClick={handleReply} size="sm"><Send className="w-4 h-4 mr-1" /> Send Reply</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">Support Tickets</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Inbox} label="Open" value={openCount} />
        <StatCard icon={MessageSquare} label="In Progress" value={inProgressCount} />
        <StatCard icon={CheckCircle2} label="Resolved" value={resolvedCount} />
      </div>

      <div className="flex gap-3">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map(ticket => {
          const status = statusConfig[ticket.status];
          const priority = priorityConfig[ticket.priority];
          return (
            <div key={ticket.id}
              className="glass-card rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-all"
              onClick={() => { setSelectedTicket(ticket); setView("detail"); }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium truncate">{ticket.subject}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{ticket.dealerName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(ticket.updatedAt).toLocaleDateString("en-GB")} · {ticket.messages.length} message{ticket.messages.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
                  <Badge variant="outline" className={status.color}><status.icon className="w-3 h-3 mr-1" />{status.label}</Badge>
                  <Badge variant="outline" className={priority.color}>{priority.label}</Badge>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center">
            <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No tickets match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
