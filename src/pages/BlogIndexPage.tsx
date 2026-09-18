import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import SiteHeader from "@/components/vroom/SiteHeader";
import SiteFooter from "@/components/vroom/SiteFooter";
import PageHero from "@/components/vroom/PageHero";
import { blogArticles } from "@/data/blog-articles";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

export default function BlogIndexPage() {
  return (
    <div className="vroom-site min-h-screen bg-vroom-surface text-vroom-ink">
      <SEOHead
        title="Car Dealer Warranty Guides & Articles | VROOM Blog"
        description="Expert guides on self-funded car warranties for UK dealers. Learn about FCA compliance, pricing strategies, claims management, and maximising warranty profits."
        canonical="https://govroom.co.uk/blog"
      />

      <SiteHeader />

      <main>
        <PageHero
          eyebrow="Resources"
          title="Self-Funded Warranty Guides for UK Dealers"
          subtitle="Everything you need to know about running your own in-house warranty programme — from setup to claims handling."
        />

        <section className="bg-vroom-surface px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogArticles.map((article, i) => (
                <motion.div key={article.slug} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <Link
                    to={`/blog/${article.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-vroom-line bg-vroom-panel p-6 shadow-sm transition-colors hover:border-vroom-green/40"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="rounded-full bg-vroom-green/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-vroom-green-deep">{article.tag}</span>
                      <span className="flex items-center gap-1 text-[11px] text-vroom-ink-muted"><Clock className="h-3 w-3" />{article.readTime}</span>
                    </div>
                    <h2 className="mb-3 text-base font-semibold leading-snug transition-colors group-hover:text-vroom-green-deep">{article.title}</h2>
                    <p className="flex-1 text-sm leading-relaxed text-vroom-ink-muted">{article.excerpt}</p>
                    <div className="mt-5 flex items-center gap-1 text-sm font-medium text-vroom-green-deep">
                      Read more <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-vroom-dark px-5 py-20 text-vroom-hero-fg lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to self-fund your warranties?</h2>
            <p className="mb-8 text-lg text-vroom-hero-muted">Join dealers who are keeping more profit by managing warranties in-house.</p>
            <Button size="lg" className="h-12 bg-vroom-green px-10 font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" asChild>
              <Link to="/signup">Sign Up <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <p className="mt-5 text-xs text-vroom-hero-muted">No monthly fees. £15 per warranty.</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
