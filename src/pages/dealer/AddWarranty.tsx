import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { lookupVehicle, lookupPostcode, lookupMOTHistory, type DVLAVehicle, type DVSAResult, type Address } from "@/lib/simulated-apis";
import { supabase } from "@/integrations/supabase/client";
import { useWarrantyStore } from "@/lib/warranty-store";
import { useCoverStore } from "@/lib/cover-store";
import { useDealerSettingsStore } from "@/lib/dealer-settings-store";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Car, CheckCircle2, Loader2, CreditCard, Shield, FileText, AlertTriangle, UserPlus, Users, Plus } from "lucide-react";
import { toast } from "sonner";
import ExistingCustomerSearch from "@/components/ExistingCustomerSearch";

export default function AddWarranty() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const store = useWarrantyStore();
  const coverStore = useCoverStore();
  const dealerSettingsStore = useDealerSettingsStore();
  const dealerId = user?.dealerId || "";
  const dealerName = user?.dealerName || user?.name || "";
  const templates = coverStore.templates.filter(t => t.dealerId === dealerId || t.dealerId === "system");
  const passedState = location.state as { reg?: string; vehicle?: DVLAVehicle } | null;
  const [step, setStep] = useState(passedState?.vehicle ? 1 : 1);
  const [reg, setReg] = useState(passedState?.reg || "");
  const [postcode, setPostcode] = useState("");
  const [dbCustomers, setDbCustomers] = useState<{ id: string; name: string; email: string; phone: string; dealerId: string }[]>([]);
  const [vehicle, setVehicle] = useState<DVLAVehicle | null>(null);
  const [dvsaData, setDvsaData] = useState<DVSAResult | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [customerType, setCustomerType] = useState<"new" | "existing" | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [form, setForm] = useState({ customerName: "", email: "", phone: "", mileage: "", duration: "12", cost: "", fundContribution: "", notes: "", coverTemplateId: "" });
  const [createdWarranty, setCreatedWarranty] = useState<{
    customerName: string; email: string; vehicleReg: string; vehicleMake: string;
    vehicleModel: string; startDate: string; endDate: string; isFree: boolean;
  } | null>(null);

  // Fetch customers from DB
  useEffect(() => {
    if (!dealerId) return;
    supabase.functions.invoke("admin-data", {
      body: { table: "customers", action: "select", filters: { dealer_id: dealerId } },
    }).then(({ data, error }) => {
      if (!error && data?.data) {
        setDbCustomers((data.data as any[]).map((c: any) => ({
          id: c.id,
          name: c.full_name,
          email: c.email,
          phone: c.phone || "",
          dealerId: c.dealer_id,
        })));
      }
    });
  }, [dealerId]);

  // Also include customers from warranties added by this dealer (not yet in customers table)
  const warrantyCustomers = store.warranties
    .filter(w => w.dealerId === dealerId && w.customerEmail)
    .reduce((acc, w) => {
      if (!acc.find(c => c.email === w.customerEmail) && !dbCustomers.find(c => c.email.toLowerCase() === w.customerEmail!.toLowerCase())) {
        acc.push({ id: w.customerId, name: w.customerName, email: w.customerEmail!, phone: "", dealerId });
      }
      return acc;
    }, [] as { id: string; name: string; email: string; phone: string; dealerId: string }[]);
  const allCustomers = [...dbCustomers, ...warrantyCustomers];

  // Sync free warranty count with actual data
  const dealerWarrantyCount = store.warranties.filter(w => w.dealerId === dealerId).length;
  useEffect(() => {
    dealerSettingsStore.syncFreeWarrantyCount(dealerId, dealerWarrantyCount);
  }, [dealerWarrantyCount, dealerId]);

  const isFreeWarranty = dealerSettingsStore.hasFreeWarranties(dealerId);
  const freeRemaining = dealerSettingsStore.freeWarrantiesRemaining(dealerId);

  useEffect(() => {
    if (passedState?.reg && !vehicle) {
      handleVehicleLookup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVehicleLookup = async () => {
    if (!reg.trim()) return;
    setLoading(true);
    const [dvlaResult, dvsaResult] = await Promise.all([
      lookupVehicle(reg),
      lookupMOTHistory(reg),
    ]);
    // Supplement missing model from DVSA data
    if (dvlaResult && (!dvlaResult.model || dvlaResult.model === "Unknown") && dvsaResult?.model) {
      dvlaResult.model = dvsaResult.model;
    }
    setVehicle(dvlaResult);
    setDvsaData(dvsaResult);
    setLoading(false);
    if (dvlaResult) {
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

  const handleSelectExistingCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const customer = allCustomers.find(c => c.id === customerId);
    if (customer) {
      setForm(f => ({
        ...f,
        customerName: customer.name,
        email: customer.email,
        phone: customer.phone || f.phone,
      }));
    }
  };

  const handlePayAndCreate = async () => {
    if (!vehicle || !form.customerName || !form.cost) {
      toast.error("Please fill in all required fields");
      return;
    }
    setPaying(true);
    
    if (!isFreeWarranty) {
      await new Promise(r => setTimeout(r, 2000));
    } else {
      await new Promise(r => setTimeout(r, 800));
    }
    
    const startDate = new Date().toISOString().split("T")[0];
    const endDate = new Date(Date.now() + parseInt(form.duration) * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const customerId = selectedCustomerId || `cust-${Date.now()}`;

    // Create customer record in DB if new customer
    if (customerType === "new" && form.email) {
      try {
        await supabase.functions.invoke("admin-data", {
          body: {
            table: "customers",
            action: "insert",
            updates: {
              full_name: form.customerName,
              email: form.email,
              phone: form.phone || null,
              dealer_id: dealerId,
              address: selectedAddress?.line1 || null,
              city: selectedAddress?.city || null,
              postcode: selectedAddress?.postcode || postcode || null,
            },
          },
        });
      } catch (err) {
        console.error("Failed to create customer record:", err);
      }
    }

    await store.addWarranty({
      id: `w-${Date.now()}`,
      customerId,
      customerName: form.customerName,
      customerEmail: form.email || undefined,
      dealerId,
      dealerName,
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
      notes: form.notes + (form.fundContribution ? `\nFund contribution: £${form.fundContribution}` : ""),
      createdAt: startDate,
      coverTemplateId: form.coverTemplateId || undefined,
      paymentStatus: isFreeWarranty ? "free" : "paid",
    });

    // Track free warranty usage
    if (isFreeWarranty) {
      dealerSettingsStore.useFreeWarranty(dealerId);
    }

    setPaying(false);
    
    if (form.email) {
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
        }
      });
    }
    setCreatedWarranty({
      customerName: form.customerName,
      email: form.email,
      vehicleReg: vehicle.registration,
      vehicleMake: vehicle.make,
      vehicleModel: vehicle.model,
      startDate,
      endDate,
      isFree: isFreeWarranty,
    });
  };

  const selectedTemplate = templates.find(t => t.id === form.coverTemplateId);

  if (createdWarranty) {
    return (
      <div className="max-w-lg mx-auto text-center py-12 space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display mb-2">
            {createdWarranty.isFree ? "Free Warranty Created!" : "Payment Successful!"}
          </h1>
          <p className="text-muted-foreground">Warranty has been issued and is now active.</p>
        </div>
        <div className="glass-card rounded-xl p-5 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Vehicle</span>
            <span className="font-medium">{createdWarranty.vehicleReg} — {createdWarranty.vehicleMake} {createdWarranty.vehicleModel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Customer</span>
            <span className="font-medium">{createdWarranty.customerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Period</span>
            <span className="font-medium">{new Date(createdWarranty.startDate).toLocaleDateString("en-GB")} — {new Date(createdWarranty.endDate).toLocaleDateString("en-GB")}</span>
          </div>
          {createdWarranty.email && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Portal Invite</span>
              <span className="font-medium text-primary">Sent to {createdWarranty.email}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/dealer/warranties")} variant="outline">View All Warranties</Button>
          <Button onClick={() => { setCreatedWarranty(null); setStep(1); setVehicle(null); setDvsaData(null); setForm({ customerName: "", email: "", phone: "", mileage: "", duration: "12", cost: "", fundContribution: "", notes: "", coverTemplateId: "" }); setCustomerType(null); setSelectedCustomerId(""); setReg(""); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Another Warranty
          </Button>
        </div>
      </div>
    );
  }

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
                <div>
                  <span className="text-muted-foreground">Model:</span>{" "}
                  {vehicle.model && vehicle.model !== "Unknown" ? (
                    <span className="font-medium">{vehicle.model}</span>
                  ) : (
                    <Input
                      placeholder="Enter model (e.g. Jogger)"
                      className="inline-block h-7 w-40 text-sm mt-0.5"
                      value={vehicle.model === "Unknown" ? "" : vehicle.model}
                      onChange={e => setVehicle(v => v ? { ...v, model: e.target.value } : v)}
                    />
                  )}
                </div>
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

          {/* New or Existing Customer Toggle */}
          {!customerType && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCustomerType("new")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">New Customer</p>
                  <p className="text-xs text-muted-foreground">Enter new customer details</p>
                </div>
              </button>
              <button
                onClick={() => setCustomerType("existing")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Existing Customer</p>
                  <p className="text-xs text-muted-foreground">Select from your customers</p>
                </div>
              </button>
            </div>
          )}

          {/* Existing Customer Selector with Search */}
          {customerType === "existing" && (
            <ExistingCustomerSearch
              customers={allCustomers}
              selectedCustomerId={selectedCustomerId}
              onSelect={handleSelectExistingCustomer}
              onClear={() => { setCustomerType(null); setSelectedCustomerId(""); setForm(f => ({ ...f, customerName: "", email: "", phone: "" })); }}
              selectedName={form.customerName}
              selectedEmail={form.email}
            />
          )}

          {/* New Customer Form */}
          {customerType === "new" && (
            <>
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">New customer details</Label>
                <Button variant="ghost" size="sm" onClick={() => { setCustomerType(null); setForm(f => ({ ...f, customerName: "", email: "", phone: "" })); }}>
                  Change
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input placeholder="John Smith" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
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
            </>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button
              disabled={!customerType || !form.customerName}
              onClick={() => {
                if (!form.customerName) { toast.error("Customer name is required"); return; }
                if (customerType === "new" && !form.email) { toast.error("Email is required for new customers"); return; }
                setStep(3);
              }}
            >
              Continue
            </Button>
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
            {selectedTemplate && (selectedTemplate.labourRate || selectedTemplate.maxClaimLimit) && (
              <div className="sm:col-span-2 bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm flex items-center gap-4 flex-wrap">
                <Shield className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium text-primary">{selectedTemplate.levelName} Package:</span>
                {selectedTemplate.labourRate && <span className="text-muted-foreground">Labour rate: <span className="font-medium text-foreground">£{selectedTemplate.labourRate}/hr</span></span>}
                {selectedTemplate.maxClaimLimit && <span className="text-muted-foreground">Max claim: <span className="font-medium text-foreground">£{selectedTemplate.maxClaimLimit}</span></span>}
                {selectedTemplate.coveredItems && <span className="text-muted-foreground">{selectedTemplate.coveredItems.length} components covered</span>}
              </div>
            )}
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
              <Label>Warranty Selling Price (£) *</Label>
              <Input type="number" placeholder="599" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
              <p className="text-xs text-muted-foreground">The price you charged the customer for this warranty</p>
            </div>
            <div className="space-y-2">
              <Label>Fund Contribution (£)</Label>
              <Input type="number" placeholder="200" value={form.fundContribution} onChange={e => setForm({ ...form, fundContribution: e.target.value })} />
              <p className="text-xs text-muted-foreground">Amount you're setting aside in the warranty fund for claims</p>
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
                <p><span className="text-muted-foreground">Selling Price:</span> £{form.cost}</p>
                {form.fundContribution && <p><span className="text-muted-foreground">Fund Contribution:</span> £{form.fundContribution}</p>}
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
              <span className="text-xl font-bold font-display">£15</span>
            </div>

            <p className="text-xs text-muted-foreground">Payment processed securely via Stripe. This fee covers platform administration, certificate generation, and customer portal access.</p>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button onClick={handlePayAndCreate} disabled={paying} className="glow-primary-sm min-w-[180px]">
                {paying ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  <><CreditCard className="w-4 h-4 mr-2" /> Pay £15 & Create</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
