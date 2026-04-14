import { useState, useEffect } from "react";
import { CoverTemplate, CoverItem, CoverFAQ } from "@/data/cover-templates";
import { supabase } from "@/integrations/supabase/client";

async function dbCall(body: Record<string, unknown>) {
  try {
    const { data } = await supabase.functions.invoke("admin-data", { body });
    return data?.data || null;
  } catch (err) {
    console.error("Cover DB call failed:", err);
    return null;
  }
}

function rowToTemplate(r: any): CoverTemplate {
  const meta = r.metadata || {};
  return {
    id: r.id,
    dealerId: r.dealer_id,
    name: r.name,
    levelName: meta.levelName || r.name,
    description: meta.description || "",
    brochureIntro: meta.brochureIntro || "",
    certificateSummary: meta.certificateSummary || "",
    claimInstructions: meta.claimInstructions || "",
    coveredItems: Array.isArray(r.covered_items) ? r.covered_items : [],
    excludedItems: Array.isArray(r.excluded_items) ? r.excluded_items : [],
    conditionalItems: Array.isArray(r.conditional_items) ? r.conditional_items : [],
    faqs: meta.faqs || [],
    termsDocUrl: meta.termsDocUrl,
    labourRate: meta.labourRate,
    maxClaimLimit: meta.maxClaimLimit,
    suggestedPrice: meta.suggestedPrice,
    createdAt: r.created_at?.split("T")[0] || r.created_at,
    updatedAt: r.updated_at?.split("T")[0] || r.updated_at,
  };
}

// --- Global state ---
let templates: CoverTemplate[] = [];
let templateMap: Record<string, string> = {};
let listeners: (() => void)[] = [];
let loaded = false;

function notify() { listeners.forEach(l => l()); }

async function loadTemplates() {
  const rows = await dbCall({ table: "cover_templates", action: "select" });
  if (rows) {
    templates = rows.map(rowToTemplate);
    loaded = true;
    notify();
  }
}

export function useCoverStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.push(listener);
    if (!loaded) loadTemplates();
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  return {
    templates,
    templateMap,

    getTemplate(id: string) { return templates.find(t => t.id === id); },

    getTemplateForWarranty(warrantyId: string) {
      const templateId = templateMap[warrantyId];
      return templateId ? templates.find(t => t.id === templateId) : undefined;
    },

    getTemplatesForDealer(dealerId: string) {
      return templates.filter(t => t.dealerId === dealerId);
    },

    async addTemplate(template: CoverTemplate) {
      await dbCall({
        table: "cover_templates", action: "insert",
        updates: {
          dealer_id: template.dealerId,
          name: template.name,
          covered_items: template.coveredItems,
          conditional_items: template.conditionalItems,
          excluded_items: template.excludedItems,
          metadata: {
            levelName: template.levelName, description: template.description,
            brochureIntro: template.brochureIntro, certificateSummary: template.certificateSummary,
            claimInstructions: template.claimInstructions, faqs: template.faqs,
            labourRate: template.labourRate, maxClaimLimit: template.maxClaimLimit,
            suggestedPrice: template.suggestedPrice, termsDocUrl: template.termsDocUrl,
          },
        },
      });
      await loadTemplates();
    },

    async updateTemplate(id: string, updates: Partial<CoverTemplate>) {
      const existing = templates.find(t => t.id === id);
      if (!existing) return;
      const merged = { ...existing, ...updates };
      await dbCall({
        table: "cover_templates", action: "update", id,
        updates: {
          name: merged.name,
          covered_items: merged.coveredItems,
          conditional_items: merged.conditionalItems,
          excluded_items: merged.excludedItems,
          metadata: {
            levelName: merged.levelName, description: merged.description,
            brochureIntro: merged.brochureIntro, certificateSummary: merged.certificateSummary,
            claimInstructions: merged.claimInstructions, faqs: merged.faqs,
            labourRate: merged.labourRate, maxClaimLimit: merged.maxClaimLimit,
            suggestedPrice: merged.suggestedPrice, termsDocUrl: merged.termsDocUrl,
          },
        },
      });
      await loadTemplates();
    },

    async deleteTemplate(id: string) {
      await dbCall({ table: "cover_templates", action: "delete", id });
      await loadTemplates();
    },

    async duplicateTemplate(id: string, dealerId: string) {
      const source = templates.find(t => t.id === id);
      if (!source) return;
      const newTemplate = { ...source, dealerId, name: `${source.name} (Copy)` };
      await dbCall({
        table: "cover_templates", action: "insert",
        updates: {
          dealer_id: dealerId,
          name: newTemplate.name,
          covered_items: newTemplate.coveredItems,
          conditional_items: newTemplate.conditionalItems,
          excluded_items: newTemplate.excludedItems,
          metadata: {
            levelName: newTemplate.levelName, description: newTemplate.description,
            brochureIntro: newTemplate.brochureIntro, certificateSummary: newTemplate.certificateSummary,
            claimInstructions: newTemplate.claimInstructions, faqs: newTemplate.faqs,
            labourRate: newTemplate.labourRate, maxClaimLimit: newTemplate.maxClaimLimit,
            suggestedPrice: newTemplate.suggestedPrice,
          },
        },
      });
      await loadTemplates();
      return templates.find(t => t.name === newTemplate.name && t.dealerId === dealerId);
    },

    assignTemplateToWarranty(warrantyId: string, templateId: string) {
      templateMap = { ...templateMap, [warrantyId]: templateId };
      notify();
    },

    lookupCoverage(templateId: string, query: string) {
      const template = templates.find(t => t.id === templateId);
      if (!template) return null;
      const q = query.toLowerCase().trim();
      if (!q) return null;
      for (const item of template.coveredItems) {
        if (item.keywords.some(k => k.toLowerCase().includes(q)) || item.name.toLowerCase().includes(q)) {
          return { status: "covered" as const, item };
        }
      }
      for (const item of template.conditionalItems) {
        if (item.keywords.some(k => k.toLowerCase().includes(q)) || item.name.toLowerCase().includes(q)) {
          return { status: "conditional" as const, item };
        }
      }
      for (const item of template.excludedItems) {
        if (item.keywords.some(k => k.toLowerCase().includes(q)) || item.name.toLowerCase().includes(q)) {
          return { status: "excluded" as const, item };
        }
      }
      return null;
    },
  };
}
