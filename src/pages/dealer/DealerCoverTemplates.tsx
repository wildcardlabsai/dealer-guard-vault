import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCoverStore } from "@/lib/cover-store";
import { CoverTemplate, CoverItem, CoverFAQ, coverCategories } from "@/data/cover-templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Edit2, Copy, Trash2, Eye, ArrowLeft, CheckCircle2, XCircle, AlertTriangle,
  ChevronDown, ChevronUp, X, PoundSterling
} from "lucide-react";
import { toast } from "sonner";

export default function DealerCoverTemplates() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "";
  const coverStore = useCoverStore();
  const templates = coverStore.getTemplatesForDealer(dealerId);
  const [editing, setEditing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [previewMode, setPreviewMode] = useState<string | null>(null);

  const editingTemplate = editing ? coverStore.getTemplate(editing) : null;

  const [form, setForm] = useState<Partial<CoverTemplate>>({});
  const [newItem, setNewItem] = useState<Partial<CoverItem>>({ name: "", category: "Engine", explanation: "", keywords: [] });
  const [newItemType, setNewItemType] = useState<"covered" | "excluded" | "conditional">("covered");
  const [newFaq, setNewFaq] = useState<Partial<CoverFAQ>>({ question: "", answer: "" });

  const startEdit = (template: CoverTemplate) => {
    setForm({ ...template });
    setEditing(template.id);
    setActiveTab("details");
  };

  const startNew = () => {
    const newTemplate: CoverTemplate = {
      id: `ct-${Date.now()}`,
      dealerId,
      name: "",
      levelName: "",
      description: "",
      brochureIntro: "",
      certificateSummary: "",
      claimInstructions: "Log into your customer portal to start a new claim. Upload photos and any diagnostic reports. Please do not authorise repairs before contacting your dealership.",
      coveredItems: [],
      excludedItems: [],
      conditionalItems: [],
      faqs: [],
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setForm(newTemplate);
    setEditing("new");
    setActiveTab("details");
  };

  const saveTemplate = () => {
    if (!form.name || !form.levelName) { toast.error("Name and level are required"); return; }
    if (editing === "new") {
      coverStore.addTemplate(form as CoverTemplate);
      toast.success("Template created");
    } else if (editing) {
      coverStore.updateTemplate(editing, form);
      toast.success("Template saved");
    }
    setEditing(null);
  };

  const addItem = () => {
    if (!newItem.name) return;
    const item: CoverItem = {
      name: newItem.name || "",
      category: newItem.category || "Other",
      explanation: newItem.explanation || "",
      note: newItem.note,
      keywords: (newItem.name || "").toLowerCase().split(/[\s,]+/).filter(Boolean),
    };
    const key = newItemType === "covered" ? "coveredItems" : newItemType === "excluded" ? "excludedItems" : "conditionalItems";
    setForm(prev => ({ ...prev, [key]: [...(prev[key] || []), item] }));
    setNewItem({ name: "", category: newItem.category, explanation: "", keywords: [] });
    toast.success("Item added");
  };

  const removeItem = (type: "coveredItems" | "excludedItems" | "conditionalItems", index: number) => {
    setForm(prev => ({ ...prev, [type]: (prev[type] || []).filter((_, i) => i !== index) }));
  };

  const addFaq = () => {
    if (!newFaq.question || !newFaq.answer) return;
    setForm(prev => ({ ...prev, faqs: [...(prev.faqs || []), newFaq as CoverFAQ] }));
    setNewFaq({ question: "", answer: "" });
    toast.success("FAQ added");
  };

  // Preview mode
  if (previewMode) {
    const t = coverStore.getTemplate(previewMode);
    if (!t) { setPreviewMode(null); return null; }
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setPreviewMode(null)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
          <h1 className="text-xl font-bold font-display">Preview: {t.levelName} Cover</h1>
        </div>
        <div className="glass-card-strong rounded-xl p-6 glow-primary-sm">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h2 className="font-semibold font-display text-lg">{t.levelName} Cover</h2>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 ml-auto">Preview</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{t.description}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4"><CheckCircle2 className="w-5 h-5 text-primary" /><h3 className="font-semibold font-display">What's Covered</h3></div>
            <div className="space-y-2">{t.coveredItems.map((item, i) => (
              <div key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5" /><div><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.explanation}</p></div></div>
            ))}</div>
          </div>
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4"><XCircle className="w-5 h-5 text-destructive" /><h3 className="font-semibold font-display">What's Not Covered</h3></div>
            <div className="space-y-2">{t.excludedItems.map((item, i) => (
              <div key={i} className="flex items-start gap-2"><XCircle className="w-4 h-4 text-destructive mt-0.5" /><div><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.explanation}</p></div></div>
            ))}</div>
          </div>
        </div>
        {t.conditionalItems.length > 0 && (
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-5 h-5 text-amber-400" /><h3 className="font-semibold font-display">Conditional</h3></div>
            <div className="space-y-2">{t.conditionalItems.map((item, i) => (
              <div key={i} className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" /><div><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.explanation}</p>{item.note && <p className="text-xs text-amber-400">{item.note}</p>}</div></div>
            ))}</div>
          </div>
        )}
      </div>
    );
  }

  // Editing mode
  if (editing) {
    const tabs = ["details", "covered", "excluded", "conditional", "faq"];
    const itemKey = activeTab === "covered" ? "coveredItems" : activeTab === "excluded" ? "excludedItems" : "conditionalItems";

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setEditing(null)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
          <h1 className="text-xl font-bold font-display">{editing === "new" ? "Create Template" : "Edit Template"}</h1>
          <div className="ml-auto">
            <Button onClick={saveTemplate} className="glow-primary-sm">Save Template</Button>
          </div>
        </div>

        <div className="flex gap-1 border-b border-border/50 overflow-x-auto">
          {tabs.map(t => (
            <button key={t} className={`px-4 py-2.5 text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              activeTab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
            }`} onClick={() => setActiveTab(t)}>{t === "faq" ? "FAQ" : t === "covered" ? "Covered Items" : t === "excluded" ? "Excluded Items" : t === "conditional" ? "Conditional Items" : t}</button>
          ))}
        </div>

        {activeTab === "details" && (
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Template Name *</Label><Input value={form.name || ""} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Premium Cover" /></div>
              <div className="space-y-2"><Label>Cover Level Name *</Label><Input value={form.levelName || ""} onChange={e => setForm(p => ({ ...p, levelName: e.target.value }))} placeholder="e.g. Premium" /></div>
            </div>
            <div className="space-y-2"><Label>Short Description</Label><Textarea value={form.description || ""} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} /></div>

            <div className="border-t border-border/50 pt-4 mt-4">
              <h3 className="font-semibold font-display text-sm mb-3 flex items-center gap-2">
                <PoundSterling className="w-4 h-4 text-primary" /> Financial Parameters
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Labour Rate (£/hr)</Label>
                  <Input type="number" min={0} value={form.labourRate ?? ""} onChange={e => setForm(p => ({ ...p, labourRate: e.target.value ? parseInt(e.target.value) : undefined }))} placeholder="e.g. 75" />
                  <p className="text-xs text-muted-foreground">Max hourly rate for claims</p>
                </div>
                <div className="space-y-2">
                  <Label>Max Claim Limit (£)</Label>
                  <Input type="number" min={0} value={form.maxClaimLimit ?? ""} onChange={e => setForm(p => ({ ...p, maxClaimLimit: e.target.value ? parseInt(e.target.value) : undefined }))} placeholder="e.g. 2500" />
                  <p className="text-xs text-muted-foreground">Maximum payout per claim</p>
                </div>
                <div className="space-y-2">
                  <Label>Suggested Price (£)</Label>
                  <Input type="number" min={0} value={form.suggestedPrice ?? ""} onChange={e => setForm(p => ({ ...p, suggestedPrice: e.target.value ? parseInt(e.target.value) : undefined }))} placeholder="e.g. 499" />
                  <p className="text-xs text-muted-foreground">Default price when adding warranty</p>
                </div>
              </div>
            </div>

            <div className="space-y-2"><Label>Brochure Intro Text</Label><Textarea value={form.brochureIntro || ""} onChange={e => setForm(p => ({ ...p, brochureIntro: e.target.value }))} rows={3} /></div>
            <div className="space-y-2"><Label>Certificate Summary Text</Label><Textarea value={form.certificateSummary || ""} onChange={e => setForm(p => ({ ...p, certificateSummary: e.target.value }))} rows={2} /></div>
            <div className="space-y-2"><Label>Claim Instructions</Label><Textarea value={form.claimInstructions || ""} onChange={e => setForm(p => ({ ...p, claimInstructions: e.target.value }))} rows={3} /></div>
          </div>
        )}

        {(activeTab === "covered" || activeTab === "excluded" || activeTab === "conditional") && (
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-6 space-y-4">
              <h3 className="font-semibold font-display text-sm">Add Item</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Item Name</Label><Input value={newItem.name || ""} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Turbocharger" /></div>
                <div className="space-y-2"><Label>Category</Label>
                  <Select value={newItem.category} onValueChange={v => setNewItem(p => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{coverCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Explanation</Label><Textarea value={newItem.explanation || ""} onChange={e => setNewItem(p => ({ ...p, explanation: e.target.value }))} rows={2} /></div>
              {activeTab === "conditional" && (
                <div className="space-y-2"><Label>Condition Note</Label><Input value={newItem.note || ""} onChange={e => setNewItem(p => ({ ...p, note: e.target.value }))} placeholder="e.g. Subject to approval" /></div>
              )}
              <Button size="sm" onClick={() => { setNewItemType(activeTab as any); addItem(); }}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>

            <div className="space-y-2">
              {(form[itemKey as keyof typeof form] as CoverItem[] || []).map((item, i) => (
                <div key={i} className="glass-card rounded-xl p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    {activeTab === "covered" && <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />}
                    {activeTab === "excluded" && <XCircle className="w-4 h-4 text-destructive mt-0.5" />}
                    {activeTab === "conditional" && <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />}
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category} — {item.explanation}</p>
                      {item.note && <p className="text-xs text-amber-400">{item.note}</p>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => removeItem(itemKey as any, i)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-6 space-y-4">
              <h3 className="font-semibold font-display text-sm">Add FAQ</h3>
              <div className="space-y-2"><Label>Question</Label><Input value={newFaq.question || ""} onChange={e => setNewFaq(p => ({ ...p, question: e.target.value }))} placeholder="e.g. Is the clutch covered?" /></div>
              <div className="space-y-2"><Label>Answer</Label><Textarea value={newFaq.answer || ""} onChange={e => setNewFaq(p => ({ ...p, answer: e.target.value }))} rows={2} /></div>
              <Button size="sm" onClick={addFaq}><Plus className="w-4 h-4 mr-1" /> Add FAQ</Button>
            </div>
            <div className="space-y-2">
              {(form.faqs || []).map((faq, i) => (
                <div key={i} className="glass-card rounded-xl p-4 flex items-start justify-between gap-3">
                  <div><p className="text-sm font-medium">{faq.question}</p><p className="text-xs text-muted-foreground mt-1">{faq.answer}</p></div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setForm(p => ({ ...p, faqs: (p.faqs || []).filter((_, j) => j !== i) }))}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Cover Templates</h1>
          <p className="text-sm text-muted-foreground">Manage what customers see in their warranty cover</p>
        </div>
        <Button onClick={startNew} size="sm"><Plus className="w-4 h-4 mr-1" /> Create Template</Button>
      </div>

      <div className="grid gap-4">
        {templates.map(template => (
          <div key={template.id} className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold font-display">{template.name}</h3>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{template.levelName}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" />{template.coveredItems.length} covered</span>
                  <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-destructive" />{template.excludedItems.length} excluded</span>
                  <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-400" />{template.conditionalItems.length} conditional</span>
                  {template.suggestedPrice && <span className="flex items-center gap-1"><PoundSterling className="w-3 h-3" />£{template.suggestedPrice}</span>}
                  {template.labourRate && <span>Labour: £{template.labourRate}/hr</span>}
                  {template.maxClaimLimit && <span>Max claim: £{template.maxClaimLimit}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewMode(template.id)}><Eye className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(template)}><Edit2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { coverStore.duplicateTemplate(template.id, dealerId); toast.success("Template duplicated"); }}><Copy className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { coverStore.deleteTemplate(template.id); toast.success("Template deleted"); }}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
            <p>No cover templates yet</p>
            <Button size="sm" className="mt-4" onClick={startNew}><Plus className="w-4 h-4 mr-1" /> Create Your First Template</Button>
          </div>
        )}
      </div>
    </div>
  );
}
