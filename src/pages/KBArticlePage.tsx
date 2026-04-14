import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { getArticleBySlug, getRelatedArticles } from "@/data/kb-articles";

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ");
      if (text.trim()) {
        elements.push(
          <p key={elements.length} className="text-sm text-muted-foreground leading-relaxed">
            {renderInline(text)}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={elements.length} className="space-y-1.5 ml-1">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0" />
              <span className="leading-relaxed">{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const renderInline = (text: string): React.ReactNode => {
    // Bold
    const parts = text.split(/\*\*(.*?)\*\*/g);
    if (parts.length > 1) {
      return parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i} className="text-foreground font-medium">{part}</strong> : part
      );
    }
    return text;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      flushList();
      flushParagraph();
      elements.push(
        <h2 key={elements.length} className="text-base font-semibold font-display mt-6 mb-2 first:mt-0">
          {trimmed.replace("## ", "")}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      flushList();
      flushParagraph();
      elements.push(
        <h3 key={elements.length} className="text-sm font-semibold font-display mt-4 mb-1.5">
          {renderInline(trimmed.replace("### ", ""))}
        </h3>
      );
    } else if (trimmed.startsWith("- ")) {
      flushParagraph();
      inList = true;
      listItems.push(trimmed.replace("- ", ""));
    } else if (trimmed === "") {
      if (inList) flushList();
      flushParagraph();
    } else {
      if (inList) flushList();
      currentParagraph.push(trimmed);
    }
  }
  flushList();
  flushParagraph();

  return <div className="space-y-3">{elements}</div>;
}

export default function KBArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNav currentPage="/knowledge-base" />
        <div className="pt-32 pb-16 px-6 text-center">
          <h1 className="text-2xl font-bold font-display mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Button asChild><Link to="/knowledge-base">Back to Knowledge Base</Link></Button>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const related = getRelatedArticles(article);
  const audienceLabel = article.audience === "dealer" ? "Dealers" : article.audience === "customer" ? "Customers" : "Everyone";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${article.title} | Knowledge Base | WarrantyVault`}
        description={article.summary}
        canonical={`https://dealer-guard-vault.lovable.app/knowledge-base/${article.slug}`}
      />

      <PublicNav currentPage="/knowledge-base" />

      {/* Breadcrumb */}
      <section className="pt-24 pb-0 px-6">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
            <Link to="/knowledge-base" className="hover:text-foreground transition-colors">Knowledge Base</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{article.category}</span>
          </nav>
          <Link to="/knowledge-base" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
          </Link>
        </div>
      </section>

      {/* Article */}
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">{article.category}</Badge>
              <Badge variant="outline" className="text-xs">{audienceLabel}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display mb-3">{article.title}</h1>
            <p className="text-muted-foreground">{article.summary}</p>
          </div>

          <div className="glass-card-strong rounded-xl p-6 sm:p-8">
            {renderMarkdown(article.content)}
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold font-display mb-4">Related Articles</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {related.map(r => (
                  <Link key={r.slug} to={`/knowledge-base/${r.slug}`} className="glass-card rounded-xl p-4 hover:border-primary/20 transition-colors group">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-xs mb-1 group-hover:text-primary transition-colors">{r.title}</h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">{r.summary}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 glass-card rounded-xl p-6 text-center">
            <p className="font-medium mb-1">Still need help?</p>
            <p className="text-sm text-muted-foreground mb-4">Check our FAQ or contact support.</p>
            <div className="flex gap-3 justify-center">
              <Button size="sm" variant="outline" asChild><Link to="/faq">View FAQ</Link></Button>
              <Button size="sm" variant="outline" asChild><Link to="/contact">Contact Us</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
