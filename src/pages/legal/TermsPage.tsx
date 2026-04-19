import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEOHead from "@/components/SEOHead";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[hsl(222,30%,6%)]">
      <SEOHead title="Terms of Service | WarrantyVault" description="Terms of Service governing the use of the WarrantyVault platform by UK car dealers and their customers." />
      <PublicNav />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20 text-white/70">
        <h1 className="text-4xl font-bold font-display text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-white/40 mb-10">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="prose prose-invert max-w-none space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. About these terms</h2>
            <p>WarrantyVault ("we", "us", "our") is a software platform operated by Wildcard Labs that enables UK car dealers to issue, manage and administer self-funded vehicle warranties. By creating an account, submitting a signup request or otherwise using the platform, you agree to be bound by these Terms of Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Eligibility</h2>
            <p>Dealer accounts are available only to UK-registered businesses trading as motor dealers. You must be authorised to bind your business to these terms. We reserve the right to refuse, suspend or terminate any account at our sole discretion.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Pricing & payment</h2>
            <p>WarrantyVault is offered on a pay-per-use basis at £15 per warranty issued, with no monthly subscription fee. New dealers receive their first 5 warranties free. Optional add-ons such as the Dedicated Warranty Line are billed monthly at the rate displayed at the point of activation. All fees are exclusive of VAT.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Self-funded warranty model</h2>
            <p>You acknowledge that WarrantyVault is a software tool only. We are not an insurer and do not underwrite, fund or administer claims. All claim payouts and warranty obligations are the sole financial and legal responsibility of the issuing dealer. You are responsible for ensuring your warranty offering complies with all applicable UK consumer law, including the Consumer Rights Act 2015, and any FCA requirements that apply to your business.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Your data and customer data</h2>
            <p>You retain ownership of all data you upload. You grant us a licence to process this data solely to provide the service. You are the data controller for your customer records; we act as data processor. You must obtain all necessary consents from your customers before adding them to the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Acceptable use</h2>
            <p>You must not use the platform to issue fraudulent warranties, misrepresent cover, harass customers, attempt to access another dealer's data, reverse engineer the platform, or use it in any way that breaches UK law.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Service availability</h2>
            <p>We aim to provide a reliable service but do not guarantee uninterrupted availability. Scheduled maintenance and unforeseen outages may occur. We are not liable for losses arising from temporary unavailability.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Limitation of liability</h2>
            <p>To the maximum extent permitted by law, our total liability to you for any claim arising out of the use of the platform is limited to the fees paid by you in the 12 months preceding the claim. We are not liable for indirect or consequential losses, loss of profit, loss of business or loss of goodwill.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Termination</h2>
            <p>You may close your account at any time. We may suspend or terminate accounts that breach these terms, with or without notice. On termination, you will retain access to historical records for a reasonable wind-down period.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Changes to these terms</h2>
            <p>We may update these terms from time to time. Material changes will be communicated by email or in-app notification. Continued use of the platform after changes take effect constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Governing law</h2>
            <p>These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the English courts.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Contact</h2>
            <p>Questions about these terms can be sent to <a href="mailto:dealeropsdms@gmail.com" className="text-primary hover:underline">dealeropsdms@gmail.com</a>.</p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
