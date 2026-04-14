const listeners: Array<() => void> = [];
const notify = () => listeners.forEach(l => l());

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

let idCounter = 1;
const enquiries: Enquiry[] = [];

export function addEnquiry(e: Omit<Enquiry, "id" | "createdAt" | "read">) {
  const enquiry: Enquiry = {
    ...e,
    id: `enq-${idCounter++}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  enquiries.unshift(enquiry);
  notify();
  return enquiry;
}

export function markEnquiryRead(id: string) {
  const e = enquiries.find(e => e.id === id);
  if (e) { e.read = true; notify(); }
}

export function markAllEnquiriesRead() {
  enquiries.forEach(e => e.read = true);
  notify();
}

export function useEnquiryStore() {
  const [, setState] = (await_import => {
    // Use React hooks
    const { useState, useEffect } = require("react");
    return useState(0);
  })();

  // Workaround: use the hook pattern from other stores
  return { enquiries, addEnquiry, markEnquiryRead, markAllEnquiriesRead };
}
