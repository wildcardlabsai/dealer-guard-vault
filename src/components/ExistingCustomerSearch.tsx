import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, CheckCircle2 } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  dealerId: string;
}

interface Props {
  customers: Customer[];
  selectedCustomerId: string;
  onSelect: (customerId: string) => void;
  onClear: () => void;
  selectedName: string;
  selectedEmail: string;
}

export default function ExistingCustomerSearch({ customers, selectedCustomerId, onSelect, onClear, selectedName, selectedEmail }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Search Customer</Label>
        <Button variant="ghost" size="sm" onClick={onClear}>Change</Button>
      </div>

      {selectedCustomerId ? (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <p className="font-medium text-primary">Selected: {selectedName}</p>
          </div>
          <p className="text-muted-foreground">{selectedEmail}</p>
        </div>
      ) : (
        <div className="relative" ref={ref}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9"
              value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
            />
          </div>
          {open && (
            <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-popover shadow-lg">
              {filtered.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground text-center">No customers found</p>
              ) : (
                filtered.map(c => (
                  <button
                    key={c.id}
                    className="w-full text-left px-3 py-2.5 hover:bg-secondary/50 transition-colors flex items-center justify-between"
                    onClick={() => { onSelect(c.id); setOpen(false); setQuery(""); }}
                  >
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                    {c.phone && <span className="text-xs text-muted-foreground">{c.phone}</span>}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}