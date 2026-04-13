import { useParams, Link, Navigate } from "react-router-dom";
import { Clock, CalendarDays, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { blogArticles } from "@/data/blog-articles";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/" replace />;

  const otherArticles = blogArticles.filter((a) => a.slug !== slug).slice(0, 3);

  const renderInlineLinks = (text: string) => {
    // Handle markdown links [text](url) and bold **text**
    const parts = text.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g);
    return parts.map((part, j) => {
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const [, linkText, url] = linkMatch;
        if (url.startsWith("/")) {
          return <Link key={j} to={url} className="text-primary hover:underline font-medium">{linkText}</Link>;
        }
        return <a key={j} href={url} className="text-primary hover:underline font-medium" rel="noopener noreferrer">{linkText}</a>;
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j} className="text-foreground">{part.slice(2, -2)}</strong>;
      }
      return <span key={j}>{part}</span>;
    });
  };

  return (
    <>
      <SEOHead
        title={`${article.title} | WarrantyVault`}
        description={article.metaDescription}
        canonical={`https://dealer-guard-vault.lovable.app/blog/${article.slug}`}
        ogType="article"
      />
      <div className="min-h-screen bg-background">
        <PublicNav currentPage="/blog" />

        {/* Breadcrumb */}
        <div className="pt-24 px-6">
          <div className="max-w-3xl mx-auto">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground/70 truncate max-w-[200px]">{article.title}</span>
            </nav>
          </div>
        </div>

        {/* Article */}
        <article className="pt-6 pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {article.tag}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {article.readTime}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                <time dateTime={article.publishedDate}>
                  {new Date(article.publishedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </time>
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
                      {intro && <p className="text-muted-foreground leading-relaxed mb-3">{renderInlineLinks(intro)}</p>}
                      <ul className="space-y-2">
                        {items.map((item, j) => {
                          const text = item.replace(/^- /, "");
                          return (
                            <li key={j} className="flex items-start gap-3 text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                              <span>{renderInlineLinks(text)}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                }
                return <p key={i} className="text-muted-foreground leading-relaxed mb-5">{renderInlineLinks(block)}</p>;
              })}
            </div>

            {/* DisputeIQ CTA */}
            <div className="mt-16 glass-card rounded-xl p-8 border-[hsl(var(--cta))]/10 bg-[hsl(var(--cta))]/[0.03]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cta))]/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[hsl(var(--cta))]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display mb-2">Not sure how to handle a situation like this?</h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    If you're not sure how to handle situations like this, WarrantyVault's DisputeIQ can guide you step-by-step. Get risk assessments, Consumer Rights Act guidance, and professional response templates — completely free for all dealers.
                  </p>
                  <Button className="btn-cta rounded-full px-6 h-9 text-sm" asChild>
                    <Link to="/disputeiq">See DisputeIQ in Action <ArrowRight className="ml-2 w-3.5 h-3.5" /></Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* General CTA */}
            <div className="mt-6 glass-card rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold font-display mb-3">Ready to self-fund your warranties?</h3>
              <p className="text-muted-foreground mb-6 text-sm">WarrantyVault gives you everything you need to run a professional in-house warranty programme. <Link to="/features" className="text-primary hover:underline font-medium">Explore all features</Link>.</p>
              <Button className="btn-cta rounded-full px-8" asChild>
                <Link to="/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <section className="pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold font-display mb-6">Related Articles</h2>
            <div className="grid gap-4">
              {otherArticles.map((a) => (
                <Link
                  key={a.slug}
                  to={`/blog/${a.slug}`}
                  className="glass-card rounded-xl p-5 flex items-center justify-between group hover:border-primary/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {a.tag}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        <time dateTime={a.publishedDate}>
                          {new Date(a.publishedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </time>
                      </span>
                    </div>
                    <span className="font-medium text-sm group-hover:text-primary transition-colors">{a.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-4" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <PublicFooter />
      </div>
    </>
  );
}
