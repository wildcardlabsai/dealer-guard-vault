import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSupportStore, SupportTicket } from "@/lib/support-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowLeft, Send, MessageSquare, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { demoDealers } from "@/data/demo-data";

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

export default function DealerSupport() {
  const { user } = useAuth();
  const store = useSupportStore();
  const dealerId = user?.dealerId || "d-1";
  const dealer = demoDealers.find(d => d.id === dealerId);
  const tickets = store.getTicketsForDealer(dealerId);
  const [view, setView] = useState<"list" | "new" | "detail">("list");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [form, setForm] = useState({ subject: "", message: "", priority: "medium" as SupportTicket["priority"] });
  const [reply, setReply] = useState("");

  const handleSubmit = () => {
    if (!form.subject.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const now = new Date().toISOString();
    store.addTicket({
      id: `st-${Date.now()}`,
      dealerId,
      dealerName: dealer?.name || "Dealer",
      subject: form.subject,
      status: "open",
      priority: form.priority,
      messages: [{ id: `sm-${Date.now()}`, from: user?.name || "Dealer", fromRole: "dealer", message: form.message, timestamp: now }],
      createdAt: now,
      updatedAt: now,
    });
    toast.success("Support ticket submitted");
    setForm({ subject: "", message: "", priority: "medium" });
    setView("list");
  };

  const handleReply = () => {
    if (!reply.trim() || !selectedTicket) return;
    store.addMessage(selectedTicket.id, {
      id: `sm-${Date.now()}`,
      from: user?.name || "Dealer",
      fromRole: "dealer",
      message: reply,
      timestamp: new Date().toISOString(),
    });
    setReply("");
    toast.success("Reply sent");
    const updated = store.getTicketsForDealer(dealerId).find(t => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  if (view === "new") {
    return (
      <div className="max-w-2xl space-y-6">
        <button onClick={() => setView("list")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to tickets
        </button>
        <h1 className="text-2xl font-bold font-display">New Support Ticket</h1>
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input placeholder="Brief description of your issue" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea placeholder="Describe your issue in detail..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="min-h-[120px]" />
          </div>
          <Button onClick={handleSubmit} className="glow-primary-sm">Submit Ticket</Button>
        </div>
      </div>
    );
  }

  if (view === "detail" && selectedTicket) {
    const ticket = store.getTicketsForDealer(dealerId).find(t => t.id === selectedTicket.id) || selectedTicket;
    return (
      <div className="max-w-2xl space-y-6">
        <button onClick={() => { setView("list"); setSelectedTicket(null); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to tickets
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold font-display">{ticket.subject}</h1>
            <p className="text-sm text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString("en-GB")}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={statusConfig[ticket.status].color}>{statusConfig[ticket.status].label}</Badge>
            <Badge variant="outline" className={priorityConfig[ticket.priority].color}>{priorityConfig[ticket.priority].label}</Badge>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 space-y-4">
          {ticket.messages.map(msg => (
            <div key={msg.id} className={`p-4 rounded-lg ${msg.fromRole === "admin" ? "bg-primary/5 border border-primary/10" : "bg-secondary/30"}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{msg.from}</p>
                <p className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleString("en-GB")}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>

        {ticket.status !== "closed" && ticket.status !== "resolved" && (
          <div className="glass-card rounded-xl p-6">
            <Label className="mb-2 block">Reply</Label>
            <Textarea placeholder="Type your reply..." value={reply} onChange={e => setReply(e.target.value)} className="mb-3" />
            <Button onClick={handleReply} size="sm"><Send className="w-4 h-4 mr-1" /> Send Reply</Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Support</h1>
          <p className="text-sm text-muted-foreground">{tickets.length} tickets</p>
        </div>
        <Button onClick={() => setView("new")} className="glow-primary-sm"><Plus className="w-4 h-4 mr-1" /> New Ticket</Button>
      </div>

      <div className="space-y-3">
        {tickets.map(ticket => {
          const status = statusConfig[ticket.status];
          const priority = priorityConfig[ticket.priority];
          return (
            <div key={ticket.id}
              className="glass-card rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-all"
              onClick={() => { setSelectedTicket(ticket); setView("detail"); }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{ticket.subject}</p>
                  <p className="text-sm text-muted-foreground mt-1 truncate">{ticket.messages[ticket.messages.length - 1]?.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(ticket.updatedAt).toLocaleDateString("en-GB")} · {ticket.messages.length} message{ticket.messages.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
                  <Badge variant="outline" className={status.color}><status.icon className="w-3 h-3 mr-1" />{status.label}</Badge>
                  <Badge variant="outline" className={priority.color}>{priority.label}</Badge>
                </div>
              </div>
            </div>
          );
        })}
        {tickets.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center">
            <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium mb-1">No support tickets</p>
            <p className="text-sm text-muted-foreground mb-4">Need help? Create a ticket and we'll get back to you quickly.</p>
            <Button onClick={() => setView("new")}><Plus className="w-4 h-4 mr-1" /> New Ticket</Button>
          </div>
        )}
      </div>
    </div>
  );
}
