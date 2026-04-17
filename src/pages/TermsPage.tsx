import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEOHead from "@/components/SEOHead";
import { usePublicTheme } from "@/hooks/use-public-theme";
import { CONTACT } from "@/lib/contact-info";

export default function TermsPage() {
  usePublicTheme();
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Terms of Use | WarrantyVault"
        description="WarrantyVault Terms of Use governing access to and use of our self-funded warranty platform for UK motor traders."
        canonical="https://warrantyvault.co.uk/terms"
      />
      <PublicNav />
      <main className="pt-28 pb-20 px-6">
        <article className="max-w-3xl mx-auto">
          <p className="eyebrow mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-3">
            Terms of Use
          </h1>
          <p className="text-sm text-muted-foreground mb-10">Effective Date: 17/04/2026</p>

          <div className="prose-content space-y-8 text-[15px] leading-relaxed text-foreground/90">
            <Section n="1" title="Introduction">
              <p>Welcome to WarrantyVault (“we”, “us”, “our”).</p>
              <p>These Terms of Use (“Terms”) govern your access to and use of our website, platform, and services (“Services”). By using WarrantyVault, you agree to be bound by these Terms.</p>
              <p>If you do not agree, you must not use our Services.</p>
              <p>WarrantyVault is a software platform designed to help motor traders manage self-funded warranties, customer records, documentation, and aftersales processes.</p>
            </Section>

            <Section n="2" title="Eligibility">
              <p>You must:</p>
              <List items={["Be at least 18 years old", "Be operating in a business capacity (e.g. motor trader or dealership)", "Have authority to enter into this agreement"]} />
              <p>By using the platform, you confirm all information provided is accurate and up to date.</p>
            </Section>

            <Section n="3" title="Nature of the Service">
              <p>WarrantyVault provides:</p>
              <List items={["Warranty management tools", "Customer and vehicle record management", "Document and certificate generation", "Aftersales and claims workflows", "AI-assisted guidance tools"]} />
              <p>WarrantyVault is not:</p>
              <List items={["A warranty provider", "An insurer", "A claims adjudicator", "A legal advisor"]} />
              <p>You (the dealer) remain fully responsible for all warranties and customer obligations.</p>
            </Section>

            <Section n="4" title="Self-Funded Warranty Model">
              <p>By using WarrantyVault, you acknowledge that:</p>
              <List items={["All warranties are created, funded, and managed by you", "You retain 100% of warranty funds collected", "WarrantyVault does not hold, manage, or access any warranty funds", "You are fully responsible for all future claim costs"]} />
            </Section>

            <Section n="5" title="Dealer Responsibilities">
              <p>You agree to:</p>
              <List items={["Comply with all applicable UK laws", "Act fairly and professionally with customers", "Clearly communicate warranty terms", "Maintain sufficient funds to cover potential claims", "Ensure all information stored in the platform is accurate"]} />
              <p>You are solely responsible for:</p>
              <List items={["Claim decisions", "Customer outcomes", "Financial liabilities"]} />
            </Section>

            <Section n="6" title="Consumer Rights Act (CRA) Compliance">
              <p>You are fully responsible for complying with the Consumer Rights Act 2015.</p>
              <p>You acknowledge that:</p>
              <List items={["Warranties do not replace statutory rights", "Customers may be entitled to repair, replacement, or refund under law", "WarrantyVault does not guarantee legal compliance"]} />
              <p>You agree not to:</p>
              <List items={["Misrepresent warranties as a substitute for legal rights", "Use the platform in a way that breaches consumer protection laws"]} />
            </Section>

            <Section n="7" title="Warranty & Claim Responsibility">
              <p>All decisions relating to:</p>
              <List items={["Claim approvals or rejections", "Repair authorisation", "Financial contributions"]} />
              <p>Are made entirely by you.</p>
              <p>WarrantyVault:</p>
              <List items={["Does not approve claims", "Does not fund repairs", "Is not liable for any costs, disputes, or outcomes"]} />
            </Section>

            <Section n="8" title="ClaimPilot (Managed Claims Service)">
              <p>Where you opt to use ClaimPilot (or any managed claims service):</p>
              <SubSection title="8.1 Service Scope">
                <p>We may:</p>
                <List items={["Review claims", "Assess repair quotes", "Provide recommendations", "Communicate with customers or repairers on your behalf"]} />
              </SubSection>
              <SubSection title="8.2 No Financial Liability">
                <p>WarrantyVault / ClaimPilot:</p>
                <List items={["Does not fund claims", "Does not accept liability for repair costs", "Does not guarantee outcomes"]} />
                <p>All financial responsibility remains with you.</p>
              </SubSection>
              <SubSection title="8.3 Decision Authority">
                <List items={["All final decisions remain with the Dealer", "You are not required to follow our recommendations"]} />
              </SubSection>
              <SubSection title="8.4 Third-Party Repairs">
                <p>We are not responsible for:</p>
                <List items={["Work carried out by garages or repairers", "Pricing or quality of repairs", "Any disputes arising from third-party services"]} />
              </SubSection>
              <SubSection title="8.5 Communication">
                <p>Where we communicate on your behalf:</p>
                <List items={["We act as your representative", "You remain legally responsible for all communication"]} />
              </SubSection>
            </Section>

            <Section n="9" title="AI Assistant Disclaimer">
              <p>WarrantyVault may provide AI-powered tools to assist with:</p>
              <List items={["Customer responses", "Aftersales scenarios", "Consumer Rights Act guidance"]} />
              <p>These tools:</p>
              <List items={["Are for guidance only", "Do not constitute legal advice", "May not always be accurate"]} />
              <p>You remain fully responsible for all decisions and communications.</p>
            </Section>

            <Section n="10" title="Account Responsibility">
              <p>You are responsible for:</p>
              <List items={["Keeping login details secure", "All activity under your account", "Ensuring authorised use by staff"]} />
              <p>You must notify us of any unauthorised access.</p>
            </Section>

            <Section n="11" title="Payments & Fees">
              <p>Where applicable:</p>
              <List items={["Fees may be charged per warranty, subscription, or add-on service", "Pricing is displayed on the website or agreed separately", "Payments are non-refundable unless stated otherwise"]} />
              <p>We reserve the right to update pricing with reasonable notice.</p>
            </Section>

            <Section n="12" title="Data Protection">
              <List items={["You are the Data Controller", "WarrantyVault acts as a Data Processor (for customer data)"]} />
              <p>You are responsible for:</p>
              <List items={["Lawful collection of data", "GDPR compliance", "Obtaining necessary consents"]} />
              <p>We process data in accordance with our Privacy Policy.</p>
            </Section>

            <Section n="13" title="Platform Availability">
              <p>We aim to provide a reliable service but do not guarantee:</p>
              <List items={["Uninterrupted access", "Error-free operation"]} />
              <p>We may:</p>
              <List items={["Perform maintenance", "Update features", "Suspend access where necessary"]} />
            </Section>

            <Section n="14" title="Intellectual Property">
              <p>All platform content, software, and branding remain the property of WarrantyVault.</p>
              <p>You may not:</p>
              <List items={["Copy, resell, or redistribute the platform", "Reverse engineer any part of the system", "Use our branding without permission"]} />
            </Section>

            <Section n="15" title="Indemnity">
              <p>You agree to indemnify and hold harmless WarrantyVault against:</p>
              <List items={["Customer complaints or disputes", "Legal claims arising from warranty handling", "Breaches of the Consumer Rights Act", "Misrepresentation or misleading sales practices"]} />
            </Section>

            <Section n="16" title="Limitation of Liability">
              <p>To the fullest extent permitted by law:</p>
              <p>WarrantyVault shall not be liable for:</p>
              <List items={["Warranty claims or payouts", "Customer disputes", "Loss of profit, revenue, or business"]} />
              <p>Our total liability is limited to the amount paid by you in the previous 12 months.</p>
            </Section>

            <Section n="17" title="Termination">
              <p>We may suspend or terminate your account if:</p>
              <List items={["You breach these Terms", "You misuse the platform", "Payment is not received"]} />
              <p>You may stop using the service at any time.</p>
            </Section>

            <Section n="18" title="Changes to Terms">
              <p>We may update these Terms from time to time.</p>
              <p>Continued use of the platform constitutes acceptance of any updates.</p>
            </Section>

            <Section n="19" title="Governing Law">
              <p>These Terms are governed by the laws of England and Wales.</p>
              <p>Any disputes will be subject to UK courts.</p>
            </Section>

            <Section n="20" title="Contact">
              <p>For any questions regarding these Terms:</p>
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
