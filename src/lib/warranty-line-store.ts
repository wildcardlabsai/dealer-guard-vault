import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface WarrantyLine {
  id: string;
  dealerId: string;
  status: "not_active" | "setup_in_progress" | "active" | "paused";
  phoneNumber: string | null;
  greetingMessage: string;
  forwardingNumber: string;
  ivrEnabled: boolean;
  option1Label: string;
  option2Label: string;
  option3Label: string;
  holdMusicType: "default" | "light" | "professional";
  voicemailEnabled: boolean;
  voicemailEmail: string;
  businessName: string;
  createdAt: string;
  updatedAt: string;
}

async function dbCall(body: Record<string, unknown>) {
  try {
    const { data } = await supabase.functions.invoke("admin-data", { body });
    return data?.data || null;
  } catch (err) {
    console.error("WarrantyLine DB call failed:", err);
    return null;
  }
}

function rowToLine(r: any): WarrantyLine {
  return {
    id: r.id,
    dealerId: r.dealer_id,
    status: r.status,
    phoneNumber: r.phone_number || null,
    greetingMessage: r.greeting_message || "",
    forwardingNumber: r.forwarding_number || "",
    ivrEnabled: r.ivr_enabled ?? true,
    option1Label: r.option1_label || "New Claim",
    option2Label: r.option2_label || "Existing Claim",
    option3Label: r.option3_label || "",
    holdMusicType: r.hold_music_type || "default",
    voicemailEnabled: r.voicemail_enabled ?? false,
    voicemailEmail: r.voicemail_email || "",
    businessName: r.business_name || "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function generatePhoneNumber(): string {
  const mid = String(Math.floor(Math.random() * 900) + 100);
  const end = String(Math.floor(Math.random() * 9000) + 1000);
  return `0330 ${mid} ${end}`;
}

let warrantyLines: Record<string, WarrantyLine> = {};
let listeners: (() => void)[] = [];
let loaded = false;

function notify() { listeners.forEach(l => l()); }

async function loadLines() {
  const rows = await dbCall({ table: "warranty_lines", action: "select" });
  if (rows) {
    warrantyLines = {};
    for (const r of rows) {
      const line = rowToLine(r);
      warrantyLines[line.dealerId] = line;
    }
    loaded = true;
    notify();
  }
}

export function useWarrantyLineStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.push(listener);
    if (!loaded) loadLines();
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  return {
    getLine(dealerId: string): WarrantyLine | null {
      return warrantyLines[dealerId] || null;
    },

    async activateLine(dealerId: string, config: Partial<WarrantyLine>) {
      const now = new Date().toISOString();
      const row = await dbCall({
        table: "warranty_lines", action: "insert",
        updates: {
          dealer_id: dealerId,
          status: "setup_in_progress",
          greeting_message: config.greetingMessage || "",
          forwarding_number: config.forwardingNumber || "",
          ivr_enabled: config.ivrEnabled ?? true,
          option1_label: config.option1Label || "New Claim",
          option2_label: config.option2Label || "Existing Claim",
          option3_label: config.option3Label || "",
          hold_music_type: config.holdMusicType || "default",
          voicemail_enabled: config.voicemailEnabled ?? false,
          voicemail_email: config.voicemailEmail || "",
          business_name: config.businessName || "",
        },
      });
      await loadLines();

      // Simulate provisioning
      if (row) {
        setTimeout(async () => {
          await dbCall({
            table: "warranty_lines", action: "update", id: row.id,
            updates: { status: "active", phone_number: generatePhoneNumber() },
          });
          await loadLines();
        }, 3000);
      }
    },

    async updateLine(dealerId: string, updates: Partial<WarrantyLine>) {
      const line = warrantyLines[dealerId];
      if (!line) return;
      const dbUpdates: Record<string, unknown> = {};
      if (updates.greetingMessage !== undefined) dbUpdates.greeting_message = updates.greetingMessage;
      if (updates.forwardingNumber !== undefined) dbUpdates.forwarding_number = updates.forwardingNumber;
      if (updates.ivrEnabled !== undefined) dbUpdates.ivr_enabled = updates.ivrEnabled;
      if (updates.option1Label !== undefined) dbUpdates.option1_label = updates.option1Label;
      if (updates.option2Label !== undefined) dbUpdates.option2_label = updates.option2Label;
      if (updates.option3Label !== undefined) dbUpdates.option3_label = updates.option3Label;
      if (updates.holdMusicType !== undefined) dbUpdates.hold_music_type = updates.holdMusicType;
      if (updates.voicemailEnabled !== undefined) dbUpdates.voicemail_enabled = updates.voicemailEnabled;
      if (updates.voicemailEmail !== undefined) dbUpdates.voicemail_email = updates.voicemailEmail;
      if (updates.businessName !== undefined) dbUpdates.business_name = updates.businessName;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (Object.keys(dbUpdates).length > 0) {
        await dbCall({ table: "warranty_lines", action: "update", id: line.id, updates: dbUpdates });
        await loadLines();
      }
    },

    async pauseLine(dealerId: string) {
      const line = warrantyLines[dealerId];
      if (!line) return;
      await dbCall({ table: "warranty_lines", action: "update", id: line.id, updates: { status: "paused" } });
      await loadLines();
    },

    async resumeLine(dealerId: string) {
      const line = warrantyLines[dealerId];
      if (!line) return;
      await dbCall({ table: "warranty_lines", action: "update", id: line.id, updates: { status: "active" } });
      await loadLines();
    },

    async cancelLine(dealerId: string) {
      const line = warrantyLines[dealerId];
      if (!line) return;
      await dbCall({ table: "warranty_lines", action: "delete", id: line.id });
      await loadLines();
    },
  };
}
