import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEOHead from "@/components/SEOHead";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[hsl(222,30%,6%)]">
      <SEOHead title="Cookie Policy | WarrantyVault" description="How WarrantyVault uses cookies and similar technologies on its website and dealer portal." />
      <PublicNav />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20 text-white/70">
        <h1 className="text-4xl font-bold font-display text-white mb-2">Cookie Policy</h1>
        <p className="text-sm text-white/40 mb-10">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. What are cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They allow the site to remember your actions and preferences across pages and sessions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How we use cookies</h2>
            <p>WarrantyVault uses a minimal set of cookies and browser storage strictly necessary to operate the platform. We do not use advertising cookies or sell data to ad networks.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Categories we use</h2>
            <ul className="list-disc list-inside space-y-2 text-white/65">
              <li><strong className="text-white/80">Strictly necessary:</strong> authentication tokens, session state and security tokens. Without these, login and the dashboard will not work.</li>
              <li><strong className="text-white/80">Preferences:</strong> theme (light/dark), Simple Mode toggle, and other UI preferences stored in <code className="text-xs">localStorage</code>.</li>
              <li><strong className="text-white/80">Analytics (aggregate only):</strong> we may use privacy-respecting analytics to understand how the platform is used. No personal profiles are built.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Managing cookies</h2>
            <p>You can clear or block cookies through your browser settings. Disabling strictly necessary cookies will prevent you from logging in or using the dashboard.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Contact</h2>
            <p>Questions about this policy can be sent to <a href="mailto:dealeropsdms@gmail.com" className="text-primary hover:underline">dealeropsdms@gmail.com</a>.</p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
