import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEOHead from "@/components/SEOHead";
import { usePublicTheme } from "@/hooks/use-public-theme";
import { CONTACT } from "@/lib/contact-info";

export default function PrivacyPage() {
  usePublicTheme();
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy | WarrantyVault"
        description="How WarrantyVault collects, uses, and protects your personal data under UK GDPR and the Data Protection Act 2018."
        canonical="https://warrantyvault.co.uk/privacy"
      />
      <PublicNav />
      <main className="pt-28 pb-20 px-6">
        <article className="max-w-3xl mx-auto">
          <p className="eyebrow mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-10">Effective Date: 17/04/2026</p>

          <div className="space-y-8 text-[15px] leading-relaxed text-foreground/90">
            <Section n="1" title="Introduction">
              <p>WarrantyVault (“we”, “us”, “our”) is committed to protecting and respecting your privacy.</p>
              <p>This Privacy Policy explains how we collect, use, and protect your personal data when you use WarrantyVault.co.uk and our platform (“Services”).</p>
              <p>We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
            </Section>

            <Section n="2" title="Who We Are">
              <p>WarrantyVault is a software platform designed to help motor traders manage self-funded warranties, customer records, and aftersales processes.</p>
              <p>For the purposes of data protection law:</p>
              <List items={["You (the dealer) are the Data Controller", "WarrantyVault acts as the Data Processor (in most cases)"]} />
              <p>For your own account data, we act as the Data Controller.</p>
            </Section>

            <Section n="3" title="Information We Collect">
              <SubSection title="a) Information You Provide">
                <p>We may collect:</p>
                <List items={["Name", "Business name", "Email address", "Phone number", "Billing details", "Account login details"]} />
              </SubSection>
              <SubSection title="b) Customer Data (uploaded by dealers)">
                <p>You may store:</p>
                <List items={["Customer names", "Contact details", "Vehicle information (e.g. registration, make, model)", "Warranty details", "Claim or aftersales notes"]} />
                <p>We process this data on your behalf.</p>
              </SubSection>
              <SubSection title="c) Automatically Collected Data">
                <p>We may collect:</p>
                <List items={["IP address", "Browser type", "Device information", "Usage data (how you interact with the platform)"]} />
              </SubSection>
            </Section>

            <Section n="4" title="How We Use Your Data">
              <p>We use your data to:</p>
              <List items={["Provide and operate the platform", "Manage your account", "Process payments", "Improve our services", "Communicate with you (support, updates, onboarding)", "Ensure security and prevent fraud"]} />
              <p>We do not sell your data.</p>
            </Section>

            <Section n="5" title="Legal Basis for Processing">
              <p>We process data under the following lawful bases:</p>
              <List items={["Contract – to provide our Services", "Legitimate Interests – to improve and secure our platform", "Legal Obligation – where required by law", "Consent – where applicable (e.g. marketing emails)"]} />
            </Section>

            <Section n="6" title="Data Sharing">
              <p>We may share data with:</p>
              <List items={["Payment providers", "Hosting and infrastructure providers", "Email and communication services (e.g. transactional email platforms)", "Analytics providers"]} />
              <p>All third parties are required to protect your data and only use it for specified purposes.</p>
              <p>We do not sell or rent personal data to third parties.</p>
            </Section>

            <Section n="7" title="Data Storage & Security">
              <p>We take appropriate security measures, including:</p>
              <List items={["Secure servers and hosting", "Encryption where appropriate", "Access controls"]} />
              <p>However, no system is 100% secure, and you use the platform at your own risk.</p>
            </Section>

            <Section n="8" title="Data Retention">
              <p>We retain data:</p>
              <List items={["For as long as your account is active", "As required to provide services", "As necessary to comply with legal obligations"]} />
              <p>You may request deletion of your data at any time.</p>
            </Section>

            <Section n="9" title="Your Rights">
              <p>Under UK GDPR, you have the right to:</p>
              <List items={["Access your data", "Correct inaccurate data", "Request deletion (“right to be forgotten”)", "Restrict processing", "Object to processing", "Data portability"]} />
              <p>To exercise your rights, contact us using the details below.</p>
            </Section>

            <Section n="10" title="Cookies">
              <p>We may use cookies and similar technologies to:</p>
              <List items={["Improve user experience", "Analyse website usage", "Support platform functionality"]} />
              <p>You can control cookies through your browser settings.</p>
            </Section>

            <Section n="11" title="Third-Party Links">
              <p>Our website or platform may contain links to third-party websites.</p>
              <p>We are not responsible for their privacy practices.</p>
            </Section>

            <Section n="12" title="International Transfers">
              <p>Where data is transferred outside the UK, we ensure appropriate safeguards are in place, such as:</p>
              <List items={["Standard Contractual Clauses", "Trusted service providers with adequate protections"]} />
            </Section>

            <Section n="13" title="AI Features">
              <p>WarrantyVault may include AI-powered tools to assist with:</p>
              <List items={["Customer communication", "After-sales guidance", "Consumer Rights Act scenarios"]} />
              <p>These tools may process data you input, but:</p>
              <List items={["Outputs are generated automatically", "You remain responsible for decisions and communications"]} />
            </Section>

            <Section n="14" title="Changes to This Policy">
              <p>We may update this Privacy Policy from time to time.</p>
              <p>Any changes will be posted on this page with an updated effective date.</p>
            </Section>

            <Section n="15" title="Contact Us">
              <p>If you have any questions or requests regarding this Privacy Policy, contact:</p>
              <p>
                Email: <a href={`mailto:${CONTACT.email}`} className="text-primary hover:underline">{CONTACT.email}</a><br />
                Website: <a href="https://www.warrantyvault.co.uk" className="text-primary hover:underline">www.warrantyvault.co.uk</a>
              </p>
            </Section>
          </div>
        </article>
      </main>
      <PublicFooter />
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-3">
        {n}. {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-6 space-y-1.5 text-foreground/85">
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ul>
  );
}
