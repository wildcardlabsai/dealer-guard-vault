import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { addEnquiry } from "@/lib/enquiry-store";
import { pushNotification } from "@/lib/notification-store";
import logo from "@/assets/warrantylogo.png";
import SEOHead from "@/components/SEOHead";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

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

    // Store in database
    const enquiry = await addEnquiry({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      subject: form.subject,
      message: form.message,
    });

    // Notification handled via enquiries page — admin views from DB

    // Send email via edge function
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
          to: "dealeropsdms@gmail.com",
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

  return (
    <>
      <SEOHead
        title="Contact Us | WarrantyVault"
        description="Get in touch with the WarrantyVault team. We'd love to hear from you about self-funded car warranty solutions."
      />
      <PublicNav />
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <h1 className="text-3xl font-bold font-display mb-2">Get in Touch</h1>
          <p className="text-muted-foreground mb-8">Have a question about WarrantyVault? Fill in the form below and we'll get back to you as soon as possible.</p>

          {sent ? (
            <div className="glass-card-strong rounded-xl p-10 text-center">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold font-display mb-2">Message Sent</h2>
              <p className="text-muted-foreground mb-6">Thank you for reaching out. We'll respond within 24 hours.</p>
              <Button asChild variant="outline">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card-strong rounded-xl p-6 sm:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" placeholder="Your name" value={form.name} onChange={e => update("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="you@company.com" value={form.email} onChange={e => update("email", e.target.value)} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="07xxx xxx xxx" value={form.phone} onChange={e => update("phone", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" placeholder="What's this about?" value={form.subject} onChange={e => update("subject", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" placeholder="Tell us how we can help..." className="min-h-[140px]" value={form.message} onChange={e => update("message", e.target.value)} />
              </div>
              <Button type="submit" className="w-full glow-primary-sm" disabled={sending}>
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
      <PublicFooter />
    </>
  );
}
