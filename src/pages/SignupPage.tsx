import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ArrowRight, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useSignupStore } from "@/lib/signup-store";
import logo from "@/assets/warrantylogo.png";

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
      <div className="min-h-screen hero-gradient flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white mb-3">Application Submitted</h1>
          <p className="text-white/50 mb-6">
            Thank you for your interest in WarrantyVault. We'll review your application and get back to you within 24 hours.
          </p>
          <p className="text-white/30 text-sm mb-8">
            You'll receive an email with your login details once approved.
          </p>
          <Button variant="outline" className="border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Link to="/">
            <img src={logo} alt="WarrantyVault" className="h-8 mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold font-display text-white mb-3">Apply for a Dealer Account</h1>
          <p className="text-white/50 max-w-md mx-auto">
            Fill in your details below and we'll review your application. Once approved, we'll send your login credentials via email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[hsl(222,25%,10%)]/80 backdrop-blur-md border border-white/8 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Dealership Information</h2>
              <p className="text-xs text-white/40">Fields marked with * are required</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/70">Dealership Name *</Label>
              <Input
                value={form.dealershipName} onChange={e => update("dealershipName", e.target.value)}
                placeholder="e.g. Prestige Motors"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Contact Name *</Label>
              <Input
                value={form.contactName} onChange={e => update("contactName", e.target.value)}
                placeholder="e.g. James Harrison"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/70">Email Address *</Label>
              <Input
                type="email" value={form.email} onChange={e => update("email", e.target.value)}
                placeholder="dealer@example.co.uk"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Phone Number *</Label>
              <Input
                value={form.phone} onChange={e => update("phone", e.target.value)}
                placeholder="07700 900000"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Address</Label>
            <Input
              value={form.address} onChange={e => update("address", e.target.value)}
              placeholder="Dealership address"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/70">City</Label>
              <Input
                value={form.city} onChange={e => update("city", e.target.value)}
                placeholder="e.g. Birmingham"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Postcode</Label>
              <Input
                value={form.postcode} onChange={e => update("postcode", e.target.value)}
                placeholder="e.g. B1 2HP"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/70">FCA Number (if applicable)</Label>
              <Input
                value={form.fcaNumber} onChange={e => update("fcaNumber", e.target.value)}
                placeholder="e.g. FCA-123456"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Est. Monthly Warranty Volume</Label>
              <Input
                value={form.estimatedVolume} onChange={e => update("estimatedVolume", e.target.value)}
                placeholder="e.g. 10-20"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Anything else you'd like us to know?</Label>
            <Textarea
              value={form.message} onChange={e => update("message", e.target.value)}
              placeholder="Tell us about your dealership..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px]"
            />
          </div>

          <Button type="submit" size="lg" className="w-full btn-cta rounded-full h-12 text-base">
            Submit Application <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <p className="text-center text-xs text-white/30">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </form>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/30">
          {["£0/month", "£19 per warranty", "No contracts"].map(item => (
            <div key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-primary/50" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
