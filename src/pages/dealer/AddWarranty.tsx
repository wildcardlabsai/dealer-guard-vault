import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { lookupVehicle, lookupPostcode, lookupMOTHistory, type DVLAVehicle, type DVSAResult, type Address } from "@/lib/simulated-apis";
import { useWarrantyStore } from "@/lib/warranty-store";
import { useCoverStore } from "@/lib/cover-store";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Car, CheckCircle2, Loader2, CreditCard, Shield, FileText, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function AddWarranty() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const store = useWarrantyStore();
  const coverStore = useCoverStore();
  const dealerId = user?.dealerId || "d-1";
  const templates = coverStore.templates.filter(t => t.dealerId === dealerId || t.dealerId === "system");
  const [step, setStep] = useState(1);
  const [reg, setReg] = useState("");
  const [postcode, setPostcode] = useState("");
  const [vehicle, setVehicle] = useState<DVLAVehicle | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({ customerName: "", email: "", phone: "", mileage: "", duration: "12", cost: "", notes: "", coverTemplateId: "" });

  const handleVehicleLookup = async () => {
    if (!reg.trim()) return;
    setLoading(true);
    const result = await lookupVehicle(reg);
    setVehicle(result);
    setLoading(false);
    if (result) {
      toast.success(`Vehicle found: ${result.make} ${result.model}`);
      setStep(2);
    } else {
      toast.error("Vehicle not found. Please check the registration and try again.");
    }
  };

  const handlePostcodeLookup = async () => {
    if (!postcode.trim()) return;
    setLoading(true);
    const results = await lookupPostcode(postcode);
    setAddresses(results);
    setLoading(false);
  };

  const handlePayAndCreate = async () => {
    if (!vehicle || !form.customerName || !form.cost) {
      toast.error("Please fill in all required fields");
      return;
    }
    setPaying(true);
    await new Promise(r => setTimeout(r, 2000));
    
    const startDate = new Date().toISOString().split("T")[0];
    const endDate = new Date(Date.now() + parseInt(form.duration) * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    store.addWarranty({
      id: `w-${Date.now()}`,
      customerId: `cust-${Date.now()}`,
      customerName: form.customerName,
      dealerId,
      dealerName: dealerId === "d-1" ? "Prestige Motors" : "City Autos",
      vehicleReg: vehicle.registration,
      vehicleMake: vehicle.make,
      vehicleModel: vehicle.model,
      vehicleYear: vehicle.year,
      vehicleColour: vehicle.colour,
      mileage: parseInt(form.mileage) || 0,
      duration: parseInt(form.duration),
      startDate,
      endDate,
      cost: parseInt(form.cost),
      status: "active",
      notes: form.notes,
      createdAt: startDate,
      coverTemplateId: form.coverTemplateId || undefined,
      paymentStatus: "paid",
    });

    setPaying(false);
    toast.success("Payment successful! Warranty created.");
    // Send warranty confirmation email
    if (form.email) {
      import("@/lib/email-service").then(m => m.sendWarrantyConfirmationEmail(
        form.email, form.customerName, vehicle.registration,
        vehicle.make, vehicle.model, startDate, endDate,
        dealerId === "d-1" ? "Prestige Motors" : "City Autos"
      ));
    }
    navigate("/dealer/warranties");
  };

  const selectedTemplate = templates.find(t => t.id === form.coverTemplateId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Add New Warranty</h1>
        <p className="text-sm text-muted-foreground">Step {step} of 4</p>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-secondary"}`} />
        ))}
      </div>

      {/* Step 1: Vehicle Lookup */}
      {step === 1 && (
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Car className="w-5 h-5 text-primary" />
            <h2 className="font-semibold font-display">Vehicle Lookup</h2>
          </div>
          <div className="space-y-2">
            <Label>Registration Number</Label>
            <div className="flex gap-2">
              <Input placeholder="e.g. AB12 CDE" value={reg} onChange={e => setReg(e.target.value.toUpperCase())}
                className="font-mono text-lg tracking-wider" onKeyDown={e => e.key === "Enter" && handleVehicleLookup()} />
              <Button onClick={handleVehicleLookup} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Try: AB12 CDE, CD34 FGH, EF56 IJK or any reg</p>
          </div>

          {vehicle && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Vehicle Found
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Make:</span> <span className="font-medium">{vehicle.make}</span></div>
                <div><span className="text-muted-foreground">Model:</span> <span className="font-medium">{vehicle.model}</span></div>
                <div><span className="text-muted-foreground">Year:</span> <span className="font-medium">{vehicle.year}</span></div>
                <div><span className="text-muted-foreground">Colour:</span> <span className="font-medium">{vehicle.colour}</span></div>
                <div><span className="text-muted-foreground">Fuel:</span> <span className="font-medium">{vehicle.fuelType}</span></div>
                <div><span className="text-muted-foreground">Engine:</span> <span className="font-medium">{vehicle.engineSize}</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Customer Details */}
      {step === 2 && (
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h2 className="font-semibold font-display">Customer Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input placeholder="John Smith" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input placeholder="john@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="07700 900000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Postcode</Label>
              <div className="flex gap-2">
                <Input placeholder="B1 1QT" value={postcode} onChange={e => setPostcode(e.target.value)} />
                <Button variant="outline" onClick={handlePostcodeLookup} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Find"}
                </Button>
              </div>
            </div>
          </div>
          {addresses.length > 0 && (
            <div className="space-y-2">
              <Label>Select Address</Label>
              <Select onValueChange={v => setSelectedAddress(addresses[parseInt(v)])}>
                <SelectTrigger><SelectValue placeholder="Choose address..." /></SelectTrigger>
                <SelectContent>
                  {addresses.map((a, i) => (
                    <SelectItem key={i} value={i.toString()}>{a.line1}, {a.city}, {a.postcode}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAddress && (
                <p className="text-sm text-muted-foreground">{selectedAddress.line1}{selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}, {selectedAddress.city}, {selectedAddress.postcode}</p>
              )}
            </div>
          )}
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => { if (!form.customerName) { toast.error("Customer name is required"); return; } setStep(3); }}>Continue</Button>
          </div>
        </div>
      )}

      {/* Step 3: Warranty Details */}
      {step === 3 && (
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h2 className="font-semibold font-display">Warranty Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cover Template</Label>
              <Select value={form.coverTemplateId} onValueChange={v => setForm({ ...form, coverTemplateId: v })}>
                <SelectTrigger><SelectValue placeholder="Select cover level..." /></SelectTrigger>
                <SelectContent>
                  {templates.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name} — {t.levelName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mileage</Label>
              <Input type="number" placeholder="32000" value={form.mileage} onChange={e => setForm({ ...form, mileage: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={form.duration} onValueChange={v => setForm({ ...form, duration: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                  <SelectItem value="36">36 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cost (£) *</Label>
              <Input type="number" placeholder="599" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea placeholder="Additional notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={() => { if (!form.cost) { toast.error("Cost is required"); return; } setStep(4); }}>Continue to Payment</Button>
          </div>
        </div>
      )}

      {/* Step 4: Payment */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="font-semibold font-display">Review & Pay</h2>
            
            {vehicle && (
              <div className="bg-secondary/30 rounded-lg p-4 text-sm space-y-1">
                <p className="font-medium mb-2">Warranty Summary</p>
                <p><span className="text-muted-foreground">Vehicle:</span> {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.registration})</p>
                <p><span className="text-muted-foreground">Customer:</span> {form.customerName}</p>
                <p><span className="text-muted-foreground">Duration:</span> {form.duration} months</p>
                <p><span className="text-muted-foreground">Warranty Value:</span> £{form.cost}</p>
                {selectedTemplate && <p><span className="text-muted-foreground">Cover Level:</span> {selectedTemplate.levelName}</p>}
              </div>
            )}
          </div>

          <div className="glass-card-strong rounded-xl p-6 glow-primary space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold font-display">Warranty Admin Fee</h3>
                <p className="text-xs text-muted-foreground">One-time fee per warranty issued</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm">WarrantyVault Admin Fee</span>
              </div>
              <span className="text-xl font-bold font-display">£19</span>
            </div>

            <p className="text-xs text-muted-foreground">Payment processed securely via Stripe. This fee covers platform administration, certificate generation, and customer portal access.</p>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button onClick={handlePayAndCreate} disabled={paying} className="glow-primary-sm min-w-[180px]">
                {paying ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  <><CreditCard className="w-4 h-4 mr-2" /> Pay £19 & Create</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
