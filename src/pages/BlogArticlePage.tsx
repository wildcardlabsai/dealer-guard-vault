import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Clock, CalendarDays, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { blogArticles } from "@/data/blog-articles";
import logo from "@/assets/warrantylogo.png";

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/" replace />;

  const otherArticles = blogArticles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <>
      <SEOHead
        title={`${article.title} | WarrantyVault`}
        description={article.metaDescription}
        canonical={`https://dealer-guard-vault.lovable.app/blog/${article.slug}`}
      />
      <div className="min-h-screen bg-background">
        {/* Nav */}
        <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
            <Link to="/">
              <img src={logo} alt="WarrantyVault" className="h-10" />
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="btn-cta rounded-full px-6" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </nav>

        {/* Article */}
        <article className="pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <Link to="/#resources" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to resources
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {article.tag}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {article.readTime}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> {new Date(article.publishedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display leading-tight mb-6">
              {article.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 border-l-2 border-primary/30 pl-5">
              {article.excerpt}
            </p>

            <div className="prose prose-invert max-w-none">
              {article.content.map((block, i) => {
                if (block.startsWith("### ")) {
                  return <h3 key={i} className="text-xl font-semibold font-display mt-10 mb-4">{block.replace("### ", "")}</h3>;
                }
                if (block.startsWith("## ")) {
                  return <h2 key={i} className="text-2xl font-bold font-display mt-12 mb-5 text-foreground">{block.replace("## ", "")}</h2>;
                }
                if (block.includes("\n-")) {
                  const parts = block.split("\n");
                  const intro = parts[0].startsWith("-") ? null : parts[0];
                  const items = parts.filter((p) => p.startsWith("- "));
                  return (
                    <div key={i} className="mb-6">
                      {intro && <p className="text-muted-foreground leading-relaxed mb-3">{intro}</p>}
                      <ul className="space-y-2">
                        {items.map((item, j) => {
                          const text = item.replace(/^- /, "");
                          const boldMatch = text.match(/^\*\*(.*?)\*\*(.*)/);
                          return (
                            <li key={j} className="flex items-start gap-3 text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                              <span>
                                {boldMatch ? (
                                  <><strong className="text-foreground">{boldMatch[1]}</strong>{boldMatch[2]}</>
                                ) : (
                                  text.replace(/\*\*/g, "")
                                )}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                }
                // Handle bold text and inline formatting
                const renderText = (text: string) => {
                  const segments = text.split(/(\*\*.*?\*\*)/g);
                  return segments.map((seg, j) => {
                    if (seg.startsWith("**") && seg.endsWith("**")) {
                      return <strong key={j} className="text-foreground">{seg.slice(2, -2)}</strong>;
                    }
                    return <span key={j}>{seg}</span>;
                  });
                };
                return <p key={i} className="text-muted-foreground leading-relaxed mb-5">{renderText(block)}</p>;
              })}
            </div>

            {/* CTA */}
            <div className="mt-16 glass-card rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold font-display mb-3">Ready to self-fund your warranties?</h3>
              <p className="text-muted-foreground mb-6">WarrantyVault gives you everything you need to run a professional in-house warranty programme.</p>
              <Button className="btn-cta rounded-full px-8" asChild>
                <Link to="/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <section className="pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold font-display mb-6">More Resources</h2>
            <div className="grid gap-4">
              {otherArticles.map((a) => (
                <Link
                  key={a.slug}
                  to={`/blog/${a.slug}`}
                  className="glass-card rounded-xl p-5 flex items-center justify-between group hover:border-primary/30 transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full mr-3">
                      {a.tag}
                    </span>
                    <span className="font-medium text-sm group-hover:text-primary transition-colors">{a.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-border/50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <img src={logo} alt="WarrantyVault" className="h-6 opacity-60" />
            <p className="text-xs text-muted-foreground">Built by <span className="text-foreground font-medium">Wildcard Labs</span></p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
