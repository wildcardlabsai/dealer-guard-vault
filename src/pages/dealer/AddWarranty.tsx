import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { lookupVehicle, lookupPostcode, lookupMOTHistory, type DVLAVehicle, type DVSAResult, type Address } from "@/lib/simulated-apis";
import { supabase } from "@/integrations/supabase/client";
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
  const location = useLocation();
  const { user } = useAuth();
  const store = useWarrantyStore();
  const coverStore = useCoverStore();
  const dealerId = user?.dealerId || "d-1";
  const templates = coverStore.templates.filter(t => t.dealerId === dealerId || t.dealerId === "system");
  const passedState = location.state as { reg?: string; vehicle?: DVLAVehicle } | null;
  const [step, setStep] = useState(passedState?.vehicle ? 1 : 1);
  const [reg, setReg] = useState(passedState?.reg || "");
  const [postcode, setPostcode] = useState("");
  const [vehicle, setVehicle] = useState<DVLAVehicle | null>(null);
  const [dvsaData, setDvsaData] = useState<DVSAResult | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({ customerName: "", email: "", phone: "", mileage: "", duration: "12", cost: "", notes: "", coverTemplateId: "" });

  // Auto-trigger lookup if navigated with reg from dashboard
  useEffect(() => {
    if (passedState?.reg && !vehicle) {
      handleVehicleLookup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVehicleLookup = async () => {
    if (!reg.trim()) return;
    setLoading(true);
    // Fetch DVLA and DVSA data in parallel
    const [dvlaResult, dvsaResult] = await Promise.all([
      lookupVehicle(reg),
      lookupMOTHistory(reg),
    ]);
    setVehicle(dvlaResult);
    setDvsaData(dvsaResult);
    setLoading(false);
    if (dvlaResult) {
      // Pre-fill mileage from latest MOT if available
      if (dvsaResult?.motTests?.[0]?.odometerValue) {
        setForm(f => ({ ...f, mileage: dvsaResult.motTests[0].odometerValue }));
      }
      toast.success(`Vehicle found: ${dvlaResult.make} ${dvlaResult.model}`);
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
    
    // Only simulate payment processing for paid warranties
    const dealerCount = store.warranties.filter(w => w.dealerId === dealerId).length;
    const isFree = dealerCount < 5;
    if (!isFree) {
      await new Promise(r => setTimeout(r, 2000));
    } else {
      await new Promise(r => setTimeout(r, 800));
    }
    
    const startDate = new Date().toISOString().split("T")[0];
    const endDate = new Date(Date.now() + parseInt(form.duration) * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    store.addWarranty({
      id: `w-${Date.now()}`,
      customerId: `cust-${Date.now()}`,
      customerName: form.customerName,
      customerEmail: form.email || undefined,
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
      paymentStatus: isFree ? "free" : "paid",
    });

    setPaying(false);
    toast.success(isFree ? "Free warranty created successfully!" : "Payment successful! Warranty created.");
    
    // Create customer account and send warranty email with credentials
    if (form.email) {
      const dealerName = dealerId === "d-1" ? "Prestige Motors" : "City Autos";
      supabase.functions.invoke("invite-customer", {
        body: {
          email: form.email,
          customerName: form.customerName,
          dealerName,
          vehicleReg: vehicle.registration,
          vehicleMake: vehicle.make,
          vehicleModel: vehicle.model,
          startDate,
          endDate,
        },
      }).then(({ data, error }) => {
        if (error || !data?.success) {
          console.error("Customer invite error:", error || data?.error);
          toast.error("Warranty created but failed to send customer invite email");
        } else if (data.isNewAccount) {
          toast.success(`Customer portal account created for ${form.email}`);
        } else {
          toast.info(`Warranty notification sent to ${form.email}`);
        }
      });
    }
    navigate("/dealer/warranties");
  };

  const selectedTemplate = templates.find(t => t.id === form.coverTemplateId);
  const dealerWarrantyCount = store.warranties.filter(w => w.dealerId === dealerId).length;
  const isFreeWarranty = dealerWarrantyCount < 5;
  const freeRemaining = Math.max(0, 5 - dealerWarrantyCount);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Add New Warranty</h1>
        <p className="text-sm text-muted-foreground">Step {step} of {isFreeWarranty ? 3 : 4}</p>
      </div>

      <div className="flex gap-2">
        {(isFreeWarranty ? [1, 2, 3] : [1, 2, 3, 4]).map(s => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-secondary"}`} />
        ))}
      </div>

      {isFreeWarranty && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary shrink-0" />
          <div className="text-sm">
            <span className="font-medium text-primary">Free warranty!</span>{" "}
            <span className="text-muted-foreground">You have {freeRemaining} of 5 free warranties remaining. No admin fee applies.</span>
          </div>
        </div>
      )}

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
            <p className="text-xs text-muted-foreground">Enter any UK vehicle registration number</p>
          </div>

          {vehicle && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Vehicle Found (DVLA)
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Make:</span> <span className="font-medium">{vehicle.make}</span></div>
                <div><span className="text-muted-foreground">Model:</span> <span className="font-medium">{vehicle.model}</span></div>
                <div><span className="text-muted-foreground">Year:</span> <span className="font-medium">{vehicle.year}</span></div>
                <div><span className="text-muted-foreground">Colour:</span> <span className="font-medium">{vehicle.colour}</span></div>
                <div><span className="text-muted-foreground">Fuel:</span> <span className="font-medium">{vehicle.fuelType}</span></div>
                <div><span className="text-muted-foreground">Engine:</span> <span className="font-medium">{vehicle.engineSize}</span></div>
                {vehicle.taxStatus && <div><span className="text-muted-foreground">Tax:</span> <span className="font-medium">{vehicle.taxStatus}</span></div>}
                {vehicle.motStatus && <div><span className="text-muted-foreground">MOT:</span> <span className="font-medium">{vehicle.motStatus}</span></div>}
              </div>
            </div>
          )}

          {dvsaData && (
            <div className="bg-secondary/30 border border-border rounded-lg p-4 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="w-4 h-4 text-primary" /> MOT History (DVSA)
              </div>
              {dvsaData.motTestExpiryDate && (
                <div className="text-sm">
                  <span className="text-muted-foreground">MOT Expires:</span>{" "}
                  <span className="font-medium">{dvsaData.motTestExpiryDate}</span>
                </div>
              )}
              {dvsaData.motTests.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {dvsaData.motTests.slice(0, 5).map((test, i) => (
                    <div key={i} className="bg-background/50 rounded-md p-2 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{test.completedDate}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${test.testResult === "PASSED" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                          {test.testResult}
                        </span>
                      </div>
                      {test.odometerValue && (
                        <div className="text-muted-foreground">Mileage: {Number(test.odometerValue).toLocaleString()} {test.odometerUnit?.toLowerCase()}</div>
                      )}
                      {test.defects.length > 0 && (
                        <div className="space-y-0.5">
                          {test.defects.map((d, j) => (
                            <div key={j} className="flex items-start gap-1 text-muted-foreground">
                              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0 text-amber-500" />
                              <span>{d.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No MOT test history available</p>
              )}
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
              <Select value={form.coverTemplateId} onValueChange={v => {
                const tmpl = templates.find(t => t.id === v);
                setForm(f => ({
                  ...f,
                  coverTemplateId: v,
                  cost: tmpl?.suggestedPrice ? String(tmpl.suggestedPrice) : f.cost,
                }));
              }}>
                <SelectTrigger><SelectValue placeholder="Select cover level..." /></SelectTrigger>
                <SelectContent>
                  {templates.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} — {t.levelName}
                      {t.suggestedPrice ? ` (£${t.suggestedPrice})` : ""}
                    </SelectItem>
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
            <Button onClick={() => {
              if (!form.cost) { toast.error("Cost is required"); return; }
              if (isFreeWarranty) {
                handlePayAndCreate();
              } else {
                setStep(4);
              }
            }}>
              {isFreeWarranty ? "Create Warranty (Free)" : "Continue to Payment"}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Payment (only for paid warranties) */}
      {step === 4 && !isFreeWarranty && (
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
