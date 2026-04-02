import { useState, useEffect } from "react";

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

function generatePhoneNumber(): string {
  const mid = String(Math.floor(Math.random() * 900) + 100);
  const end = String(Math.floor(Math.random() * 9000) + 1000);
  return `0330 ${mid} ${end}`;
}

let warrantyLines: Record<string, WarrantyLine> = {};
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export function useWarrantyLineStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return {
    getLine(dealerId: string): WarrantyLine | null {
      return warrantyLines[dealerId] || null;
    },

    activateLine(dealerId: string, config: Partial<WarrantyLine>) {
      const now = new Date().toISOString();
      warrantyLines[dealerId] = {
        id: `wl-${Date.now()}`,
        dealerId,
        status: "setup_in_progress",
        phoneNumber: null,
        greetingMessage: config.greetingMessage || "",
        forwardingNumber: config.forwardingNumber || "",
        ivrEnabled: config.ivrEnabled ?? true,
        option1Label: config.option1Label || "New Claim",
        option2Label: config.option2Label || "Existing Claim",
        option3Label: config.option3Label || "",
        holdMusicType: config.holdMusicType || "default",
        voicemailEnabled: config.voicemailEnabled ?? false,
        voicemailEmail: config.voicemailEmail || "",
        businessName: config.businessName || "",
        createdAt: now,
        updatedAt: now,
      };
      notify();

      // Simulate provisioning
      setTimeout(() => {
        if (warrantyLines[dealerId]) {
          warrantyLines[dealerId] = {
            ...warrantyLines[dealerId],
            status: "active",
            phoneNumber: generatePhoneNumber(),
            updatedAt: new Date().toISOString(),
          };
          notify();
        }
      }, 3000);
    },

    updateLine(dealerId: string, updates: Partial<WarrantyLine>) {
      if (warrantyLines[dealerId]) {
        warrantyLines[dealerId] = {
          ...warrantyLines[dealerId],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        notify();
      }
    },

    pauseLine(dealerId: string) {
      if (warrantyLines[dealerId]) {
        warrantyLines[dealerId] = {
          ...warrantyLines[dealerId],
          status: "paused",
          updatedAt: new Date().toISOString(),
        };
        notify();
      }
    },

    resumeLine(dealerId: string) {
      if (warrantyLines[dealerId]) {
        warrantyLines[dealerId] = {
          ...warrantyLines[dealerId],
          status: "active",
          updatedAt: new Date().toISOString(),
        };
        notify();
      }
    },

    cancelLine(dealerId: string) {
      delete warrantyLines[dealerId];
      notify();
    },
  };
}
