import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEOHead from "@/components/SEOHead";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[hsl(222,30%,6%)]">
      <SEOHead title="Privacy Policy | WarrantyVault" description="How WarrantyVault collects, uses and protects personal data under UK GDPR for dealers and their customers." />
      <PublicNav />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20 text-white/70">
        <h1 className="text-4xl font-bold font-display text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-white/40 mb-10">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Who we are</h2>
            <p>WarrantyVault is operated by Wildcard Labs, a UK business. For the purposes of UK GDPR and the Data Protection Act 2018, Wildcard Labs is the data controller for personal data collected directly from dealers, and a data processor for personal data uploaded by dealers about their customers.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Data we collect</h2>
            <ul className="list-disc list-inside space-y-2 text-white/65">
              <li><strong className="text-white/80">Dealer account data:</strong> business name, contact name, email, phone, address, FCA number.</li>
              <li><strong className="text-white/80">Customer data uploaded by dealers:</strong> name, email, phone, address, vehicle details and warranty/claim history.</li>
              <li><strong className="text-white/80">Vehicle data:</strong> registration, make, model, mileage and MOT history, retrieved from DVLA and DVSA APIs.</li>
              <li><strong className="text-white/80">Usage data:</strong> log-in events, IP addresses, browser type and pages visited.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How we use your data</h2>
            <ul className="list-disc list-inside space-y-2 text-white/65">
              <li>To provide and operate the warranty management platform.</li>
              <li>To authenticate users and protect accounts from unauthorised access.</li>
              <li>To send transactional emails (warranty certificates, claim updates, account notifications).</li>
              <li>To respond to support enquiries and improve the service.</li>
              <li>To comply with legal and regulatory obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Lawful basis</h2>
            <p>We process dealer data on the basis of contract performance and legitimate interests. We process customer data on behalf of dealers under their lawful basis (typically contract performance for the warranty issued).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data sharing</h2>
            <p>We share data only with service providers necessary to operate the platform, including Supabase (database hosting, EU region), Resend (transactional email), DVLA and DVSA (vehicle data lookups). We do not sell personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Data retention</h2>
            <p>Account and warranty records are retained for as long as your account is active and for up to 7 years after closure to meet legal and accounting obligations. You can request earlier deletion subject to those obligations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Your rights</h2>
            <p>Under UK GDPR you have the right to access, rectify, erase, restrict or object to the processing of your personal data, and the right to data portability. To exercise any of these rights, email <a href="mailto:dealeropsdms@gmail.com" className="text-primary hover:underline">dealeropsdms@gmail.com</a>. You also have the right to complain to the Information Commissioner's Office (ICO) at ico.org.uk.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Security</h2>
            <p>We use Row Level Security, encrypted transport (TLS), encrypted storage at rest, and Have I Been Pwned password protection. No system is perfectly secure, but we follow industry best practice to protect your data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. International transfers</h2>
            <p>Personal data is stored in the EU. Where any sub-processor operates outside the UK/EU, we rely on UK-approved safeguards such as Standard Contractual Clauses.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
            <p>For privacy enquiries, email <a href="mailto:dealeropsdms@gmail.com" className="text-primary hover:underline">dealeropsdms@gmail.com</a>.</p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
