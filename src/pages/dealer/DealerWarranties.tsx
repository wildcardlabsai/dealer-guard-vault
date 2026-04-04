import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWarrantyStore } from "@/lib/warranty-store";
import { useAuth } from "@/contexts/AuthContext";
import { lookupVehicle, type DVLAVehicle } from "@/lib/simulated-apis";
import { openCertificate, generateCertificateHTML } from "@/lib/generate-certificate";
import { sendCertificateEmail } from "@/lib/email-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Plus, Search, Eye, Trash2, FileText, Download, Printer, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { printCertificate, downloadCertificate } from "@/lib/generate-certificate";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const statusColors: Record<string, string> = {
  active: "bg-primary/10 text-primary border-primary/20",
  expired: "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-muted text-muted-foreground border-border",
};

export default function DealerWarranties() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "d-1";
  const store = useWarrantyStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [emailDialogId, setEmailDialogId] = useState<string | null>(null);
  const [emailMode, setEmailMode] = useState<"default" | "custom">("default");
  const [customEmail, setCustomEmail] = useState("");
  const [sending, setSending] = useState(false);

  const warranties = store.warranties
    .filter(w => w.dealerId === dealerId)
    .filter(w => statusFilter === "all" || w.status === statusFilter)
    .filter(w =>
      w.customerName.toLowerCase().includes(search.toLowerCase()) ||
      w.vehicleReg.toLowerCase().includes(search.toLowerCase()) ||
      w.vehicleMake.toLowerCase().includes(search.toLowerCase())
    );

  const selected = warranties.find(w => w.id === selectedId);
  const emailTarget = warranties.find(w => w.id === emailDialogId);

  const handleSendCertificate = async () => {
    if (!emailTarget) return;
    const targetEmail = emailMode === "custom" ? customEmail.trim() : emailTarget.customerEmail;
    if (emailMode === "custom" && !targetEmail) {
      toast.error("Please enter an email address");
      return;
    }
    if (emailMode === "default" && !emailTarget.customerEmail) {
      toast.error("No email on file for this customer. Please enter a custom email address.");
      setEmailMode("custom");
      return;
    }
    const finalEmail = targetEmail!;
    setSending(true);
    try {
      const certHtml = generateCertificateHTML(emailTarget);
      const success = await sendCertificateEmail(
        finalEmail, emailTarget.customerName, certHtml,
        emailTarget.vehicleReg, emailTarget.vehicleMake, emailTarget.vehicleModel
      );
      if (success) {
        toast.success(`Certificate sent to ${finalEmail}`);
        setEmailDialogId(null);
        setCustomEmail("");
        setEmailMode("default");
      } else {
        toast.error("Failed to send certificate. Please try again.");
      }
    } catch {
      toast.error("An error occurred sending the certificate.");
    }
    setSending(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Warranties</h1>
          <p className="text-sm text-muted-foreground">{warranties.length} warranties found</p>
        </div>
        <Button className="glow-primary-sm" asChild>
          <Link to="/dealer/warranties/new"><Plus className="w-4 h-4 mr-2" /> Add Warranty</Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, reg or make..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {["all", "active", "expired", "cancelled"].map(s => (
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)} className="capitalize">
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Vehicle</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Reg</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Duration</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Cost</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warranties.map(w => (
                <tr key={w.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">{w.customerName}</td>
                  <td className="p-4 text-muted-foreground">{w.vehicleMake} {w.vehicleModel}</td>
                  <td className="p-4 hidden lg:table-cell"><code className="text-xs bg-secondary/50 px-2 py-1 rounded">{w.vehicleReg}</code></td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{w.duration} months</td>
                  <td className="p-4 font-medium">£{w.cost}</td>
                  <td className="p-4">
                    <Badge variant="outline" className={`capitalize ${statusColors[w.status]}`}>{w.status}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedId(w.id)} title="View">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openCertificate(w)} title="Certificate">
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEmailDialogId(w.id); setEmailMode("default"); setCustomEmail(""); }} title="Email Certificate">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { store.deleteWarranty(w.id); toast.success("Warranty deleted"); }} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Warranty Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelectedId(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">Warranty Details</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Customer:</span> <span className="font-medium">{selected.customerName}</span></div>
                <div><span className="text-muted-foreground">Vehicle:</span> <span className="font-medium">{selected.vehicleMake} {selected.vehicleModel}</span></div>
                <div><span className="text-muted-foreground">Reg:</span> <span className="font-mono font-medium">{selected.vehicleReg}</span></div>
                <div><span className="text-muted-foreground">Year:</span> <span className="font-medium">{selected.vehicleYear}</span></div>
                <div><span className="text-muted-foreground">Colour:</span> <span className="font-medium">{selected.vehicleColour}</span></div>
                <div><span className="text-muted-foreground">Mileage:</span> <span className="font-medium">{selected.mileage.toLocaleString()}</span></div>
                <div><span className="text-muted-foreground">Start:</span> <span className="font-medium">{new Date(selected.startDate).toLocaleDateString("en-GB")}</span></div>
                <div><span className="text-muted-foreground">End:</span> <span className="font-medium">{new Date(selected.endDate).toLocaleDateString("en-GB")}</span></div>
                <div><span className="text-muted-foreground">Duration:</span> <span className="font-medium">{selected.duration} months</span></div>
                <div><span className="text-muted-foreground">Cost:</span> <span className="font-medium">£{selected.cost}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={`capitalize ${statusColors[selected.status]}`}>{selected.status}</Badge></div>
                {selected.notes && <div className="col-span-2"><span className="text-muted-foreground">Notes:</span> <span className="font-medium">{selected.notes}</span></div>}
              </div>
              <DialogFooter className="gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => downloadCertificate(selected)}><Download className="w-4 h-4 mr-1" /> Download</Button>
                <Button variant="outline" size="sm" onClick={() => printCertificate(selected)}><Printer className="w-4 h-4 mr-1" /> Print</Button>
                <Button variant="outline" size="sm" onClick={() => { setSelectedId(null); setEmailDialogId(selected.id); setEmailMode("default"); setCustomEmail(""); }}>
                  <Mail className="w-4 h-4 mr-1" /> Send to Customer
                </Button>
                <Button size="sm" onClick={() => openCertificate(selected)}><FileText className="w-4 h-4 mr-1" /> View Certificate</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Certificate Email Dialog */}
      <Dialog open={!!emailTarget} onOpenChange={() => { setEmailDialogId(null); setCustomEmail(""); setEmailMode("default"); }}>
        <DialogContent className="max-w-md">
          {emailTarget && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" /> Send Certificate
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-secondary/30 rounded-lg p-3 text-sm">
                  <p className="font-medium">{emailTarget.customerName}</p>
                  <p className="text-muted-foreground">{emailTarget.vehicleMake} {emailTarget.vehicleModel} — {emailTarget.vehicleReg}</p>
                </div>

                <RadioGroup value={emailMode} onValueChange={(v) => setEmailMode(v as "default" | "custom")} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="email-default" />
                    <Label htmlFor="email-default" className="text-sm cursor-pointer">
                      Send to customer's email on file
                      {emailTarget.customerEmail && (
                        <span className="text-muted-foreground ml-1">({emailTarget.customerEmail})</span>
                      )}
                      {!emailTarget.customerEmail && (
                        <span className="text-muted-foreground ml-1">(no email on file)</span>
                      )}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="email-custom" />
                    <Label htmlFor="email-custom" className="text-sm cursor-pointer">Send to a different email address</Label>
                  </div>
                </RadioGroup>

                {emailMode === "custom" && (
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      placeholder="customer@example.com"
                      value={customEmail}
                      onChange={e => setCustomEmail(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setEmailDialogId(null); setCustomEmail(""); }}>Cancel</Button>
                <Button onClick={handleSendCertificate} disabled={sending}>
                  {sending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                  ) : (
                    <><Mail className="w-4 h-4 mr-2" /> Send Certificate</>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
