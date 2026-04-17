import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { blogArticles } from "@/data/blog-articles";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Car Dealer Warranty Guides & Articles | WarrantyVault Blog"
        description="Expert guides on self-funded car warranties for UK dealers. Learn about consumer rights act compliance, claims management, pricing strategies, and complaint handling."
        canonical="https://dealer-guard-vault.lovable.app/blog"
      />

      <PublicNav currentPage="/blog" />

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="eyebrow text-white/55">Resources</span>
          <h1 className="text-5xl sm:text-6xl font-bold font-display tracking-tight text-white leading-[1.05] mb-5">Self-Funded Warranty Guides for UK Dealers</h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">Practical guides on warranty management, claims handling, consumer rights, and complaint response — written for UK independent car dealers.</p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24 md:py-32 px-6 section-hairline">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogArticles.map((article, i) => (
              <motion.div key={article.slug} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Link
                  to={`/blog/${article.slug}`}
                  className="glass-card rounded-2xl p-7 flex flex-col group hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 cursor-pointer h-full block"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[hsl(var(--cta))] bg-[hsl(var(--cta))]/12 px-3 py-1.5 rounded-full">{article.tag}</span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                  </div>
                  <h2 className="font-bold font-display text-lg mb-3 group-hover:text-primary transition-colors leading-snug tracking-tight">{article.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-[hsl(30_20%_92%)]">
                    <span className="text-[11px] text-muted-foreground/70 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      <time dateTime={article.publishedDate}>
                        {new Date(article.publishedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </time>
                    </span>
                    <span className="flex items-center gap-1 text-sm text-primary font-semibold group-hover:gap-2 transition-all">
                      Read <ChevronRight className="w-4 h-4" />
                    </span>
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
          <p className="text-white/50 mb-4 text-lg">Join dealers who are keeping more profit by managing warranties in-house.</p>
          <p className="text-white/40 mb-8 text-sm">Need help with customer complaints? <Link to="/disputeiq" className="text-primary hover:underline font-semibold">Handle complaints with DisputeIQ</Link> — completely free.</p>
          <Button size="lg" className="btn-cta rounded-full px-10 text-base h-12" asChild>
            <Link to="/signup">Sign Up <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <p className="text-xs text-white/30 mt-5">No monthly fees. £15 per warranty.</p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
