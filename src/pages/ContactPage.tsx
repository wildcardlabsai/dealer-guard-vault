import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Loader2, CheckCircle2, Mail, Phone, MessageCircle, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { addEnquiry } from "@/lib/enquiry-store";
import SEOHead from "@/components/SEOHead";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { CONTACT } from "@/lib/contact-info";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);

    await addEnquiry({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      subject: form.subject,
      message: form.message,
    });

    try {
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#2a9d8f;">New Contact Enquiry — WarrantyVault</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:bold;color:#374151;">Name:</td><td style="padding:8px 0;color:#4b5563;">${form.name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#374151;">Email:</td><td style="padding:8px 0;color:#4b5563;">${form.email}</td></tr>
            ${form.phone ? `<tr><td style="padding:8px 0;font-weight:bold;color:#374151;">Phone:</td><td style="padding:8px 0;color:#4b5563;">${form.phone}</td></tr>` : ""}
            <tr><td style="padding:8px 0;font-weight:bold;color:#374151;">Subject:</td><td style="padding:8px 0;color:#4b5563;">${form.subject}</td></tr>
          </table>
          <div style="background:#f4f4f5;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0;color:#374151;white-space:pre-wrap;">${form.message}</p>
          </div>
          <p style="font-size:12px;color:#9ca3af;">Sent from WarrantyVault contact form</p>
        </div>
      `;

      await supabase.functions.invoke("send-email", {
        body: {
          to: CONTACT.email,
          subject: `Contact Enquiry: ${form.subject}`,
          html,
        },
      });
    } catch (err) {
      console.error("Email send error:", err);
    }

    setSending(false);
    setSent(true);
    toast.success("Your message has been sent. We'll be in touch shortly.");
  };

  const contactItems = [
    { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: Phone, label: "Phone", value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phoneTel}` },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat on WhatsApp", href: CONTACT.whatsapp, sub: "Same number as above" },
    { icon: Clock, label: "Hours", value: CONTACT.hours },
    { icon: MapPin, label: "Address", value: CONTACT.address },
  ];

  return (
    <>
      <SEOHead
        title="Contact Us | WarrantyVault"
        description="Get in touch with the WarrantyVault team. Email, phone, WhatsApp or visit our Cardiff office."
      />
      <PublicNav />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 bg-[hsl(30_40%_96%)] border-b border-[hsl(30_20%_92%)]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="eyebrow">Contact</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight mb-4 mt-2">
            Talk to the WarrantyVault team
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Questions about pricing, onboarding or claims handling? We'd love to hear from you.
            Reach us by phone, WhatsApp, email — or send us a message below.
          </p>
        </div>
      </section>

      {/* Contact details + form */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">
          {/* Details */}
          <aside className="lg:col-span-2 space-y-4">
            {contactItems.map(({ icon: Icon, label, value, href, sub }) => (
              <div key={label} className="glass-card rounded-xl p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-1">{label}</p>
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-sm font-medium text-foreground hover:text-primary transition-colors break-words">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-foreground break-words whitespace-pre-line">{value}</p>
                  )}
                  {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
                </div>
              </div>
            ))}
          </aside>

          {/* Form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="glass-card-strong rounded-2xl p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-display mb-2 tracking-tight">Message Sent</h2>
                <p className="text-muted-foreground mb-6">Thank you for reaching out. We'll respond within 24 hours.</p>
                <Button asChild variant="outline">
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card-strong rounded-2xl p-7 sm:p-10 space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">Name *</Label>
                    <Input id="name" placeholder="Your name" value={form.name} onChange={e => update("name", e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
                    <Input id="email" type="email" placeholder="you@company.com" value={form.email} onChange={e => update("email", e.target.value)} className="h-11" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold">Phone</Label>
                    <Input id="phone" placeholder="07xxx xxx xxx" value={form.phone} onChange={e => update("phone", e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-semibold">Subject *</Label>
                    <Input id="subject" placeholder="What's this about?" value={form.subject} onChange={e => update("subject", e.target.value)} className="h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-semibold">Message *</Label>
                  <Textarea id="message" placeholder="Tell us how we can help..." className="min-h-[160px]" value={form.message} onChange={e => update("message", e.target.value)} />
                </div>
                <Button type="submit" className="w-full h-12 btn-cta rounded-full text-base font-semibold" disabled={sending}>
                  {sending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" /> Send Message</>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}
