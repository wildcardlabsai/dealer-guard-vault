import { useState } from "react";
import { useEnquiryStore } from "@/lib/enquiry-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Mail, CheckCircle2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export default function AdminEnquiries() {
  const store = useEnquiryStore();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = store.enquiries.find(e => e.id === selectedId);

  const filtered = store.enquiries.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (id: string) => {
    store.markEnquiryRead(id);
    setSelectedId(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Contact Enquiries</h1>
          <p className="text-sm text-muted-foreground">
            {store.unreadCount > 0 ? `${store.unreadCount} unread` : "All caught up"} · {store.enquiries.length} total
          </p>
        </div>
        {store.unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={store.markAllEnquiriesRead}>
            <CheckCircle2 className="w-4 h-4 mr-1" /> Mark All Read
          </Button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search enquiries..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Subject</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className={`border-b border-border/30 hover:bg-secondary/20 transition-colors ${!e.read ? "bg-primary/5" : ""}`}>
                  <td className="p-4 font-medium">{e.name}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{e.email}</td>
                  <td className="p-4 text-muted-foreground">{e.subject}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">{new Date(e.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="p-4">
                    <Badge variant="outline" className={e.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary border-primary/20"}>
                      {e.read ? "Read" : "New"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(e.id)} title="View">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No enquiries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Enquiry Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelectedId(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">{selected.subject}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{selected.name}</span></div>
                  <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{selected.email}</span></div>
                  {selected.phone && <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{selected.phone}</span></div>}
                  <div><span className="text-muted-foreground">Date:</span> <span className="font-medium">{new Date(selected.createdAt).toLocaleDateString("en-GB")} {new Date(selected.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span></div>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-1">Message:</p>
                  <p className="whitespace-pre-wrap">{selected.message}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}>
                    <Mail className="w-4 h-4 mr-1" /> Reply via Email
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
