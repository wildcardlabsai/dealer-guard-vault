import { Button } from "@/components/ui/button";
import { FileText, Download, Printer, Eye } from "lucide-react";
import { toast } from "sonner";
import { useWarrantyStore } from "@/lib/warranty-store";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { downloadCertificate, printCertificate, openCertificate } from "@/lib/generate-certificate";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function DealerDocuments() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "d-1";
  const store = useWarrantyStore();
  const warranties = store.warranties.filter(w => w.dealerId === dealerId);
  const [selectedWarrantyId, setSelectedWarrantyId] = useState<string>("");
  const selectedWarranty = warranties.find(w => w.id === selectedWarrantyId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Documents</h1>
        <p className="text-sm text-muted-foreground">Generate certificates and documents from your warranty data</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="font-semibold font-display">Warranty Certificate</h2>
        </div>
        <p className="text-sm text-muted-foreground">Select a warranty to generate, download, or print the certificate.</p>

        <div className="max-w-sm">
          <Select value={selectedWarrantyId} onValueChange={setSelectedWarrantyId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a warranty..." />
            </SelectTrigger>
            <SelectContent>
              {warranties.map(w => (
                <SelectItem key={w.id} value={w.id}>
                  {w.customerName} — {w.vehicleReg} ({w.vehicleMake} {w.vehicleModel})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedWarranty && (
          <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Customer:</span> <span className="font-medium">{selectedWarranty.customerName}</span></div>
              <div><span className="text-muted-foreground">Vehicle:</span> <span className="font-medium">{selectedWarranty.vehicleMake} {selectedWarranty.vehicleModel}</span></div>
              <div><span className="text-muted-foreground">Reg:</span> <span className="font-mono font-medium">{selectedWarranty.vehicleReg}</span></div>
              <div><span className="text-muted-foreground">Duration:</span> <span className="font-medium">{selectedWarranty.duration} months</span></div>
            </div>
            <div className="flex gap-2 pt-2 flex-wrap">
              <Button size="sm" onClick={() => { downloadCertificate(selectedWarranty); toast.success("Certificate downloaded"); }}>
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
              <Button size="sm" variant="outline" onClick={() => printCertificate(selectedWarranty)}>
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
              <Button size="sm" variant="outline" onClick={() => openCertificate(selectedWarranty)}>
                <Eye className="w-4 h-4 mr-2" /> View
              </Button>
            </div>
          </div>
        )}

        {warranties.length === 0 && (
          <p className="text-sm text-muted-foreground">No warranties issued yet. Add a warranty to generate documents.</p>
        )}
      </div>
    </div>
  );
}
