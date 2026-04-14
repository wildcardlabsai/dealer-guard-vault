import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, Shield, FileText, Phone, AlertTriangle, Users, Settings, HelpCircle, ChevronRight, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

interface KBArticle {
  title: string;
  summary: string;
  audience: "dealer" | "customer" | "both";
  category: string;
}

const kbArticles: KBArticle[] = [
  // Dealer articles
  { title: "Getting started as a dealer", summary: "How to set up your dealership, configure cover templates, and issue your first warranty.", audience: "dealer", category: "Getting Started" },
  { title: "Issuing a warranty step by step", summary: "Walk through the 4-step warranty wizard: vehicle lookup, customer details, cover selection, and payment.", audience: "dealer", category: "Warranties" },
  { title: "Managing your cover templates", summary: "Create, edit, and manage what components are covered, conditionally covered, and excluded.", audience: "dealer", category: "Warranties" },
  { title: "Understanding free warranty allocations", summary: "How the 5 free warranty system works and how to track your remaining allowance.", audience: "dealer", category: "Warranties" },
  { title: "Processing and managing claims", summary: "How to review, approve, reject, and respond to customer claims from your dashboard.", audience: "dealer", category: "Claims" },
  { title: "Using Claim Assist for faster triage", summary: "Let AI help you categorise and prioritise claims with recommended actions.", audience: "dealer", category: "Claims" },
  { title: "Setting claim limits and labour rates", summary: "Configure maximum per-claim limits and labour rate caps in your claim settings.", audience: "dealer", category: "Claims" },
  { title: "Using DisputeIQ for complaint resolution", summary: "How to use AI-powered dispute assessment to handle customer complaints under the Consumer Rights Act.", audience: "dealer", category: "DisputeIQ" },
  { title: "Editing and sending DisputeIQ responses", summary: "Select, customise, and send AI-generated responses to customers.", audience: "dealer", category: "DisputeIQ" },
  { title: "Understanding your Warranty Fund health", summary: "Track revenue vs. claims, monitor reserves, and get smart contribution recommendations.", audience: "dealer", category: "Warranty Fund" },
  { title: "Setting up your Warranty Line", summary: "Configure your dedicated phone number, IVR menus, greetings, and call forwarding.", audience: "dealer", category: "Warranty Line" },
  { title: "Managing your customer list", summary: "View, search, and manage customers. Resend welcome emails and view customer warranties.", audience: "dealer", category: "Customers" },
  { title: "Inviting customers to the portal", summary: "How customers receive access and how to resend invitation emails.", audience: "dealer", category: "Customers" },
  { title: "Dealer dashboard overview", summary: "Understanding your key metrics, performance indicators, and quick actions.", audience: "dealer", category: "Getting Started" },
  { title: "Handling customer requests", summary: "Review and respond to warranty extension, update, and cancellation requests.", audience: "dealer", category: "Customers" },

  // Customer articles
  { title: "Accessing your warranty portal", summary: "How to log in, find your credentials, and navigate your customer dashboard.", audience: "customer", category: "Getting Started" },
  { title: "Viewing your warranty details", summary: "See your vehicle information, coverage dates, remaining days, and what's covered.", audience: "customer", category: "Your Warranty" },
  { title: "Understanding what's covered", summary: "How to check which components are covered, conditionally covered, and excluded.", audience: "customer", category: "Your Warranty" },
  { title: "Downloading your warranty certificate", summary: "How to download, print, or save your warranty certificate as a PDF.", audience: "customer", category: "Your Warranty" },
  { title: "Submitting a warranty claim", summary: "Step-by-step guide to submitting a claim through your portal, including what information to provide.", audience: "customer", category: "Claims" },
  { title: "Tracking your claim status", summary: "How to follow your claim through Submitted → Under Review → Decision stages.", audience: "customer", category: "Claims" },
  { title: "Replying to information requests", summary: "What to do when your dealer asks for additional information on your claim.", audience: "customer", category: "Claims" },
  { title: "Requesting a warranty extension", summary: "How to submit a request to extend your warranty coverage.", audience: "customer", category: "Requests" },
  { title: "Updating your details", summary: "How to request changes to your contact information or vehicle details.", audience: "customer", category: "Requests" },
  { title: "Resetting your password", summary: "How to reset your password if you've forgotten it, and what the requirements are.", audience: "both", category: "Account" },
  { title: "Contacting your dealer", summary: "How to reach your dealer through the warranty line or portal messages.", audience: "customer", category: "Support" },
];

const dealerCategories = ["Getting Started", "Warranties", "Claims", "DisputeIQ", "Warranty Fund", "Warranty Line", "Customers"];
const customerCategories = ["Getting Started", "Your Warranty", "Claims", "Requests", "Account", "Support"];

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState<"dealer" | "customer">("dealer");

  const categories = audience === "dealer" ? dealerCategories : customerCategories;
  const filtered = kbArticles.filter(a =>
    (a.audience === audience || a.audience === "both") &&
    (!search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase()))
  );

  const grouped = categories.map(cat => ({
    category: cat,
    articles: filtered.filter(a => a.category === cat),
  })).filter(g => g.articles.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Knowledge Base | WarrantyVault"
        description="Help guides and articles for WarrantyVault dealers and customers. Learn how to manage warranties, claims, DisputeIQ, and more."
        canonical="https://dealer-guard-vault.lovable.app/knowledge-base"
      />

      <PublicNav currentPage="/knowledge-base" />

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">Knowledge Base</span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-white mt-6 mb-4">How can we help?</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-8">Guides and articles for dealers and customers.</p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
        </div>
      </section>

      {/* Audience Toggle */}
      <section className="px-6 py-6 border-b border-border/30">
        <div className="max-w-4xl mx-auto flex justify-center gap-2">
          <button
            onClick={() => setAudience("dealer")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${audience === "dealer" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            <Settings className="w-3.5 h-3.5 inline mr-1.5" />
            For Dealers
          </button>
          <button
            onClick={() => setAudience("customer")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${audience === "customer" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            <Users className="w-3.5 h-3.5 inline mr-1.5" />
            For Customers
          </button>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          {grouped.map(group => (
            <div key={group.category}>
              <h2 className="text-lg font-semibold font-display mb-4 text-primary">{group.category}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {group.articles.map(article => (
                  <div key={article.title} className="glass-card rounded-xl p-5 hover:border-primary/20 transition-colors group cursor-default">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1">{article.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{article.summary}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {grouped.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium mb-2">No matching articles found</p>
              <p className="text-sm">Try a different search term.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient pt-16 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold font-display text-white mb-4">Can't find what you're looking for?</h2>
          <p className="text-white/50 mb-6">Check our FAQ or get in touch with our team.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="rounded-full px-8 border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent" asChild>
              <Link to="/faq">View FAQ</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
