import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWarrantyStore } from "@/lib/warranty-store";
import { useCoverStore } from "@/lib/cover-store";
import { useWarrantyLineStore } from "@/lib/warranty-line-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { downloadCertificate } from "@/lib/generate-certificate";
import {
  Shield, CheckCircle2, XCircle, AlertTriangle, Search, ChevronDown, ChevronUp,
  Download, FileText, Phone, ArrowRight, HelpCircle,
} from "lucide-react";

export default function CustomerCover() {
  const { user } = useAuth();
  const store = useWarrantyStore();
  const coverStore = useCoverStore();
  const warrantyLineStore = useWarrantyLineStore();
  const userEmail = user?.email?.toLowerCase();
  const warranties = store.warranties.filter(w =>
    (w.customerId === user?.id || (userEmail && w.customerEmail?.toLowerCase() === userEmail)) && w.status === "active"
  );
  const warranty = warranties[0];
  const template = warranty ? coverStore.getTemplateForWarranty(warranty.id) : undefined;
  const warrantyLine = warranty ? warrantyLineStore.getLine(warranty.dealerId) : null;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<null | { status: "covered" | "excluded" | "conditional"; item: any }>(null);
  const [searchDone, setSearchDone] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSearch = () => {
    if (!template || !searchQuery.trim()) return;
    const result = coverStore.lookupCoverage(template.id, searchQuery);
    setSearchResult(result);
    setSearchDone(true);
  };

  const categories = template ? [...new Set([
    ...template.coveredItems.map(i => i.category),
    ...template.excludedItems.map(i => i.category),
    ...template.conditionalItems.map(i => i.category),
  ])] : [];

  if (!warranty || !template) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-display">Your Warranty Cover</h1>
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
          <Shield className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No active warranty found</p>
          <p className="text-sm mt-1">Contact your dealership for more information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Your Warranty Cover</h1>
        <p className="text-sm text-muted-foreground">A clear breakdown of what's included and what's not.</p>
      </div>

      {/* Hero Summary Card */}
      <div className="glass-card-strong rounded-xl p-6 glow-primary-sm">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-semibold font-display text-lg">{template.levelName} Cover</h2>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 ml-auto">Active</Badge>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div><p className="text-xs text-muted-foreground mb-0.5">Vehicle</p><p className="font-medium font-mono">{warranty.vehicleReg}</p></div>
          <div><p className="text-xs text-muted-foreground mb-0.5">Start Date</p><p className="font-medium">{new Date(warranty.startDate).toLocaleDateString("en-GB")}</p></div>
          <div><p className="text-xs text-muted-foreground mb-0.5">End Date</p><p className="font-medium">{new Date(warranty.endDate).toLocaleDateString("en-GB")}</p></div>
          <div><p className="text-xs text-muted-foreground mb-0.5">Dealer</p><p className="font-medium">{warranty.dealerName}</p></div>
        </div>
        <p className="text-sm text-muted-foreground mt-4 border-t border-border/50 pt-3">
          Here's a clear breakdown of what's included and what's not.
        </p>
      </div>

      {/* Cover at a Glance */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold font-display">What's Covered</h3>
          </div>
          <div className="space-y-2.5">
            {template.coveredItems.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-destructive" />
            <h3 className="font-semibold font-display">What's Not Covered</h3>
          </div>
          <div className="space-y-2.5">
            {template.excludedItems.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {template.conditionalItems.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold font-display">Conditional / Limits Apply</h3>
          </div>
          <div className="space-y-2.5">
            {template.conditionalItems.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.explanation}</p>
                  {item.note && <p className="text-xs text-amber-400 mt-0.5">{item.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Lookup */}
      <div className="glass-card-strong rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-5 h-5 text-primary" />
          <h3 className="font-semibold font-display">Check if something is covered</h3>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. clutch, turbo, timing chain"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setSearchDone(false); }}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            className="bg-background/60"
          />
          <Button onClick={handleSearch} className="glow-primary-sm">Search</Button>
        </div>
        {searchDone && (
          <div className="mt-4 animate-fade-in">
            {searchResult ? (
              <div className={`rounded-lg p-4 flex items-start gap-3 ${
                searchResult.status === "covered" ? "bg-primary/5 border border-primary/20" :
                searchResult.status === "excluded" ? "bg-destructive/5 border border-destructive/20" :
                "bg-amber-500/5 border border-amber-500/20"
              }`}>
                {searchResult.status === "covered" && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />}
                {searchResult.status === "excluded" && <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />}
                {searchResult.status === "conditional" && <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />}
                <div>
                  <p className="font-medium text-sm">
                    {searchResult.status === "covered" && "✔ Covered"}
                    {searchResult.status === "excluded" && "✘ Not Covered"}
                    {searchResult.status === "conditional" && "⚠ Conditional"}
                    {" — "}{searchResult.item.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{searchResult.item.explanation}</p>
                  {searchResult.item.note && <p className="text-xs text-amber-400 mt-1">{searchResult.item.note}</p>}
                </div>
              </div>
            ) : (
              <div className="rounded-lg p-4 bg-secondary/30 border border-border">
                <p className="text-sm text-muted-foreground">
                  We couldn't find an exact match. Please check your full terms or contact your dealership.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 className="font-semibold font-display mb-3">Cover by Category</h3>
        <div className="space-y-2">
          {categories.map(cat => {
            const isOpen = expandedCategory === cat;
            const covered = template.coveredItems.filter(i => i.category === cat);
            const excluded = template.excludedItems.filter(i => i.category === cat);
            const conditional = template.conditionalItems.filter(i => i.category === cat);
            return (
              <div key={cat} className="glass-card rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-secondary/20 transition-colors"
                  onClick={() => setExpandedCategory(isOpen ? null : cat)}
                >
                  <span className="font-medium text-sm">{cat}</span>
                  <div className="flex items-center gap-2">
                    {covered.length > 0 && <span className="text-xs text-primary">{covered.length} covered</span>}
                    {excluded.length > 0 && <span className="text-xs text-destructive">{excluded.length} excluded</span>}
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-border/50 p-5 space-y-4 animate-fade-in">
                    {covered.length > 0 && (
                      <div className="space-y-2">
                        {covered.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5" />
                            <div><p className="text-sm">{item.name}</p><p className="text-xs text-muted-foreground">{item.explanation}</p></div>
                          </div>
                        ))}
                      </div>
                    )}
                    {excluded.length > 0 && (
                      <div className="space-y-2">
                        {excluded.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <XCircle className="w-3.5 h-3.5 text-destructive mt-0.5" />
                            <div><p className="text-sm">{item.name}</p><p className="text-xs text-muted-foreground">{item.explanation}</p></div>
                          </div>
                        ))}
                      </div>
                    )}
                    {conditional.length > 0 && (
                      <div className="space-y-2">
                        {conditional.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5" />
                            <div><p className="text-sm">{item.name}</p><p className="text-xs text-muted-foreground">{item.explanation}</p>{item.note && <p className="text-xs text-amber-400">{item.note}</p>}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Common Questions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="font-semibold font-display">Common Questions</h3>
        </div>
        <div className="space-y-2">
          {template.faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-secondary/20 transition-colors"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                <span className="text-sm font-medium">{faq.question}</span>
                {expandedFaq === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {expandedFaq === i && (
                <div className="border-t border-border/50 px-5 py-3.5 animate-fade-in">
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* How to Make a Claim */}
      <div className="glass-card-strong rounded-xl p-6">
        <h3 className="font-semibold font-display text-lg mb-4">How to Make a Claim</h3>
        <div className="space-y-3">
          {[
            "Log into your customer portal",
            "Start a new claim",
            "Upload photos and supporting documents",
            "Wait for your dealership to review before authorising repairs",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">{i + 1}</div>
              <p className="text-sm pt-0.5">{step}</p>
            </div>
          ))}
        </div>
        {warrantyLine?.status === "active" && warrantyLine.phoneNumber && (
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-3">
            <Phone className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Warranty Line</p>
              <p className="text-sm font-bold font-mono">{warrantyLine.phoneNumber}</p>
            </div>
          </div>
        )}
        <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <p className="text-sm text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            Please do not authorise repairs before contacting your dealership.
          </p>
        </div>
        <Button className="mt-4 glow-primary-sm" asChild>
          <Link to="/customer/claims"><ArrowRight className="w-4 h-4 mr-1" /> Start a Claim</Link>
        </Button>
      </div>

      {/* Document Access */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold font-display mb-3 text-sm">Documents</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => downloadCertificate(warranty)}>
            <Download className="w-3.5 h-3.5 mr-1" /> Warranty Certificate
          </Button>
          <Button variant="outline" size="sm" onClick={() => { /* brochure download */ }}>
            <FileText className="w-3.5 h-3.5 mr-1" /> Cover Summary
          </Button>
          <Button variant="outline" size="sm" onClick={() => { /* terms */ }}>
            <FileText className="w-3.5 h-3.5 mr-1" /> Full Terms
          </Button>
        </div>
      </div>
    </div>
  );
}
