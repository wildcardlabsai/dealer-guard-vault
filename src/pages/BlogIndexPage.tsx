import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/warrantylogo.png";
import SEOHead from "@/components/SEOHead";
import { blogArticles } from "@/data/blog-articles";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Car Dealer Warranty Guides & Articles | WarrantyVault Blog"
        description="Expert guides on self-funded car warranties for UK dealers. Learn about FCA compliance, pricing strategies, claims management, and maximising warranty profits."
        canonical="https://dealer-guard-vault.lovable.app/blog"
      />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[hsl(var(--hero-bg))]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link to="/"><img src={logo} alt="WarrantyVault" className="h-10" /></Link>
          <div className="hidden md:flex items-center gap-10 text-[15px] text-white/70">
            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
            <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link to="/blog" className="text-white transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 text-[15px]" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="sm" className="btn-cta rounded-full px-6 text-[15px] h-10" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Resources</span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-white mb-4">Self-Funded Warranty Guides for UK Dealers</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">Everything you need to know about running your own in-house warranty programme — from setup to claims handling.</p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogArticles.map((article, i) => (
              <motion.div key={article.slug} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Link
                  to={`/blog/${article.slug}`}
                  className="glass-card rounded-xl p-6 flex flex-col group hover:border-primary/30 transition-colors cursor-pointer h-full block"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">{article.tag}</span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                  </div>
                  <h2 className="font-semibold font-display text-base mb-3 group-hover:text-primary transition-colors leading-snug">{article.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{article.excerpt}</p>
                  <div className="mt-5 flex items-center gap-1 text-sm text-primary font-medium">
                    Read more <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">Ready to self-fund your warranties?</h2>
          <p className="text-white/50 mb-8 text-lg">Join dealers who are keeping more profit by managing warranties in-house.</p>
          <Button size="lg" className="btn-cta rounded-full px-10 text-base h-12" asChild>
            <Link to="/signup">Sign Up <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <p className="text-xs text-white/30 mt-5">No monthly fees. £19 per warranty.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 hero-gradient">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/"><img src={logo} alt="WarrantyVault" className="h-6 opacity-60" /></Link>
          <p className="text-xs text-muted-foreground">Built by <span className="text-foreground font-medium">Wildcard Labs</span></p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
