import { useState, useEffect } from "react";
import { CoverTemplate, demoCoverTemplates, warrantyTemplateMap } from "@/data/cover-templates";

let templates = [...demoCoverTemplates];
let templateMap = { ...warrantyTemplateMap };
let listeners: (() => void)[] = [];

function notify() { listeners.forEach(l => l()); }

export function useCoverStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  return {
    templates,
    templateMap,

    getTemplate(id: string) {
      return templates.find(t => t.id === id);
    },

    getTemplateForWarranty(warrantyId: string) {
      const templateId = templateMap[warrantyId];
      return templateId ? templates.find(t => t.id === templateId) : undefined;
    },

    getTemplatesForDealer(dealerId: string) {
      return templates.filter(t => t.dealerId === dealerId);
    },

    addTemplate(template: CoverTemplate) {
      templates = [template, ...templates];
      notify();
    },

    updateTemplate(id: string, updates: Partial<CoverTemplate>) {
      templates = templates.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString().split("T")[0] } : t);
      notify();
    },

    deleteTemplate(id: string) {
      templates = templates.filter(t => t.id !== id);
      notify();
    },

    duplicateTemplate(id: string, dealerId: string) {
      const source = templates.find(t => t.id === id);
      if (!source) return;
      const newTemplate: CoverTemplate = {
        ...source,
        id: `ct-${Date.now()}`,
        dealerId,
        name: `${source.name} (Copy)`,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      templates = [newTemplate, ...templates];
      notify();
      return newTemplate;
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
