import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Clock, CalendarDays, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import SiteHeader from "@/components/vroom/SiteHeader";
import SiteFooter from "@/components/vroom/SiteFooter";
import { blogArticles } from "@/data/blog-articles";

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/blog" replace />;

  const otherArticles = blogArticles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="vroom-site min-h-screen bg-vroom-surface text-vroom-ink">
      <SEOHead
        title={`${article.title} | VROOM`}
        description={article.metaDescription}
        canonical={`https://govroom.co.uk/blog/${article.slug}`}
      />

      <SiteHeader alwaysSolid />

      <article className="bg-vroom-surface px-5 pb-20 pt-32 lg:px-10 lg:pt-36">
        <div className="mx-auto max-w-3xl">
          <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-vroom-ink-muted transition-colors hover:text-vroom-ink">
            <ArrowLeft className="h-4 w-4" /> Back to resources
          </Link>

          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-full bg-vroom-green/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-vroom-green-deep">
              {article.tag}
            </span>
            <span className="flex items-center gap-1 text-xs text-vroom-ink-muted">
              <Clock className="h-3 w-3" /> {article.readTime}
            </span>
            <span className="flex items-center gap-1 text-xs text-vroom-ink-muted">
              <CalendarDays className="h-3 w-3" /> {new Date(article.publishedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <p className="mb-12 border-l-2 border-vroom-green/40 pl-5 text-lg leading-relaxed text-vroom-ink-muted">
            {article.excerpt}
          </p>

          <div className="max-w-none">
            {article.content.map((block, i) => {
              if (block.startsWith("### ")) {
                return <h3 key={i} className="mb-4 mt-10 text-xl font-semibold">{block.replace("### ", "")}</h3>;
              }
              if (block.startsWith("## ")) {
                return <h2 key={i} className="mb-5 mt-12 text-2xl font-bold text-vroom-ink">{block.replace("## ", "")}</h2>;
              }
              if (block.includes("\n-")) {
                const parts = block.split("\n");
                const intro = parts[0].startsWith("-") ? null : parts[0];
                const items = parts.filter((p) => p.startsWith("- "));
                return (
                  <div key={i} className="mb-6">
                    {intro && <p className="mb-3 leading-relaxed text-vroom-ink-muted">{intro}</p>}
                    <ul className="space-y-2">
                      {items.map((item, j) => {
                        const text = item.replace(/^- /, "");
                        const boldMatch = text.match(/^\*\*(.*?)\*\*(.*)/);
                        return (
                          <li key={j} className="flex items-start gap-3 text-vroom-ink-muted">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-vroom-green" />
                            <span>
                              {boldMatch ? (
                                <><strong className="text-vroom-ink">{boldMatch[1]}</strong>{boldMatch[2]}</>
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
              const renderText = (text: string) => {
                const segments = text.split(/(\*\*.*?\*\*)/g);
                return segments.map((seg, j) => {
                  if (seg.startsWith("**") && seg.endsWith("**")) {
                    return <strong key={j} className="text-vroom-ink">{seg.slice(2, -2)}</strong>;
                  }
                  return <span key={j}>{seg}</span>;
                });
              };
              return <p key={i} className="mb-5 leading-relaxed text-vroom-ink-muted">{renderText(block)}</p>;
            })}
          </div>

          <div className="mt-16 rounded-xl border border-vroom-line bg-vroom-panel p-8 text-center shadow-sm">
            <h3 className="mb-3 text-xl font-bold">Ready to self-fund your warranties?</h3>
            <p className="mb-6 text-vroom-ink-muted">VROOM gives you everything you need to run a professional in-house warranty programme.</p>
            <Button className="bg-vroom-green px-8 font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" asChild>
              <Link to="/signup">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </article>

      <section className="bg-vroom-soft px-5 pb-20 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-xl font-bold">More Resources</h2>
          <div className="grid gap-4">
            {otherArticles.map((a) => (
              <Link
                key={a.slug}
                to={`/blog/${a.slug}`}
                className="group flex items-center justify-between rounded-xl border border-vroom-line bg-vroom-panel p-5 transition-colors hover:border-vroom-green/40"
              >
                <div>
                  <span className="mr-3 rounded-full bg-vroom-green/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-vroom-green-deep">
                    {a.tag}
                  </span>
                  <span className="text-sm font-medium transition-colors group-hover:text-vroom-green-deep">{a.title}</span>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-vroom-ink-muted" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
