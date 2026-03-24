import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

const documents = [
  { name: "Warranty Agreement Template", desc: "Standard warranty agreement for customers", type: "PDF" },
  { name: "Warranty Certificate", desc: "Branded warranty certificate template", type: "PDF" },
  { name: "Marketing Flyer", desc: "Customer-facing warranty flyer", type: "PDF" },
  { name: "Terms & Conditions", desc: "Full terms and conditions document", type: "PDF" },
  { name: "Claims Process Guide", desc: "Step-by-step claims process for customers", type: "PDF" },
];

export default function DealerDocuments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Documents</h1>
        <p className="text-sm text-muted-foreground">Download pre-made documents for your dealership</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map(doc => (
          <div key={doc.name} className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium mb-1">{doc.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{doc.desc}</p>
            <Button variant="outline" size="sm" onClick={() => toast.info("Download started (simulated)")}>
              <Download className="w-4 h-4 mr-2" /> Download {doc.type}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
