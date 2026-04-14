import { useState, useEffect } from "react";

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
const listeners: Array<() => void> = [];
const notify = () => listeners.forEach(l => l());

export function addEnquiry(e: Omit<Enquiry, "id" | "createdAt" | "read">): Enquiry {
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
  const e = enquiries.find(eq => eq.id === id);
  if (e) { e.read = true; notify(); }
}

export function markAllEnquiriesRead() {
  enquiries.forEach(e => { e.read = true; });
  notify();
}

export function useEnquiryStore() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const cb = () => setTick(t => t + 1);
    listeners.push(cb);
    return () => { const i = listeners.indexOf(cb); if (i >= 0) listeners.splice(i, 1); };
  }, []);

  const unreadCount = enquiries.filter(e => !e.read).length;

  return { enquiries, unreadCount, addEnquiry, markEnquiryRead, markAllEnquiriesRead };
}
