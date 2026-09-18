import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ArrowRight, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useSignupStore } from "@/lib/signup-store";
import { Brand } from "@/components/vroom/SiteHeader";
import SEOHead from "@/components/SEOHead";

export default function SignupPage() {
  const navigate = useNavigate();
  const { addRequest } = useSignupStore();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    dealershipName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    fcaNumber: "",
    estimatedVolume: "",
    message: "",
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.dealershipName || !form.contactName || !form.email || !form.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    addRequest({
      id: `sr-${Date.now()}`,
      dealershipName: form.dealershipName,
      contactName: form.contactName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      postcode: form.postcode,
      fcaNumber: form.fcaNumber,
      estimatedVolume: form.estimatedVolume,
      message: form.message,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-vroom-dark flex items-center justify-center px-6 text-vroom-hero-fg">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-vroom-green/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-vroom-green" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Application Submitted</h1>
          <p className="text-vroom-hero-muted mb-6">
            Thank you for your interest in VROOM. We'll review your application and get back to you within 24 hours.
          </p>
          <p className="text-vroom-hero-muted/70 text-sm mb-8">
            You'll receive an email with your login details once approved.
          </p>
          <Button variant="outline" className="border-vroom-hero-border text-vroom-hero-fg hover:bg-vroom-hero-soft hover:text-vroom-hero-fg bg-transparent" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vroom-dark py-16 px-6 text-vroom-hero-fg">
      <SEOHead title="Sign Up | VROOM — Start Managing Your Own Warranties" description="Apply for a dealer account on VROOM. Start managing self-funded car warranties in-house with full control and better margins." />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <Brand />
          </Link>
          <h1 className="text-3xl font-bold mb-3">Apply for a Dealer Account</h1>
          <p className="text-vroom-hero-muted max-w-md mx-auto">
            Fill in your details below and we'll review your application. Once approved, we'll send your login credentials via email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-vroom-hero-soft/60 backdrop-blur-md border border-vroom-hero-border/40 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-vroom-hero-border/40">
            <div className="w-10 h-10 rounded-xl bg-vroom-green/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-vroom-green" />
            </div>
            <div>
              <h2 className="font-semibold text-vroom-hero-fg">Dealership Information</h2>
              <p className="text-xs text-vroom-hero-muted">Fields marked with * are required</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-vroom-hero-muted">Dealership Name *</Label>
              <Input
                value={form.dealershipName} onChange={e => update("dealershipName", e.target.value)}
                placeholder="e.g. Prestige Motors"
                className="bg-vroom-hero-soft border-vroom-hero-border/50 text-vroom-hero-fg placeholder:text-vroom-hero-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-vroom-hero-muted">Contact Name *</Label>
              <Input
                value={form.contactName} onChange={e => update("contactName", e.target.value)}
                placeholder="e.g. James Harrison"
                className="bg-vroom-hero-soft border-vroom-hero-border/50 text-vroom-hero-fg placeholder:text-vroom-hero-muted/50"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-vroom-hero-muted">Email Address *</Label>
              <Input
                type="email" value={form.email} onChange={e => update("email", e.target.value)}
                placeholder="dealer@example.co.uk"
                className="bg-vroom-hero-soft border-vroom-hero-border/50 text-vroom-hero-fg placeholder:text-vroom-hero-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-vroom-hero-muted">Phone Number *</Label>
              <Input
                value={form.phone} onChange={e => update("phone", e.target.value)}
                placeholder="07700 900000"
                className="bg-vroom-hero-soft border-vroom-hero-border/50 text-vroom-hero-fg placeholder:text-vroom-hero-muted/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-vroom-hero-muted">Address</Label>
            <Input
              value={form.address} onChange={e => update("address", e.target.value)}
              placeholder="Dealership address"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-vroom-hero-muted">City</Label>
              <Input
                value={form.city} onChange={e => update("city", e.target.value)}
                placeholder="e.g. Birmingham"
                className="bg-vroom-hero-soft border-vroom-hero-border/50 text-vroom-hero-fg placeholder:text-vroom-hero-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-vroom-hero-muted">Postcode</Label>
              <Input
                value={form.postcode} onChange={e => update("postcode", e.target.value)}
                placeholder="e.g. B1 2HP"
                className="bg-vroom-hero-soft border-vroom-hero-border/50 text-vroom-hero-fg placeholder:text-vroom-hero-muted/50"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-vroom-hero-muted">FCA Number (if applicable)</Label>
              <Input
                value={form.fcaNumber} onChange={e => update("fcaNumber", e.target.value)}
                placeholder="e.g. FCA-123456"
                className="bg-vroom-hero-soft border-vroom-hero-border/50 text-vroom-hero-fg placeholder:text-vroom-hero-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-vroom-hero-muted">Est. Monthly Warranty Volume</Label>
              <Input
                value={form.estimatedVolume} onChange={e => update("estimatedVolume", e.target.value)}
                placeholder="e.g. 10-20"
                className="bg-vroom-hero-soft border-vroom-hero-border/50 text-vroom-hero-fg placeholder:text-vroom-hero-muted/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-vroom-hero-muted">Anything else you'd like us to know?</Label>
            <Textarea
              value={form.message} onChange={e => update("message", e.target.value)}
              placeholder="Tell us about your dealership..."
              className="bg-vroom-hero-soft border-vroom-hero-border/50 text-vroom-hero-fg placeholder:text-vroom-hero-muted/50 min-h-[80px]"
            />
          </div>

          <Button type="submit" size="lg" className="w-full bg-vroom-green font-bold text-vroom-green-foreground hover:bg-vroom-green-hover rounded-full h-12 text-base">
            Submit Application <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <p className="text-center text-xs text-vroom-hero-muted/70">
            Already have an account? <Link to="/login" className="text-vroom-green hover:underline">Sign in</Link>
          </p>
        </form>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-vroom-hero-muted/70">
          {["£0/month", "£15 per warranty", "No contracts"].map(item => (
            <div key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-vroom-green/70" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
