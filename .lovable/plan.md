

## Plan: Landing Page Enhancement + Platform-Wide QA & Feature Recommendations

### Part 1: Landing Page — New Sections from Screenshots

The screenshots show several sections to add/refine:

**A. "Most dealers are already moving away..." transition section**
- Add between hero social-proof bar and the problem section
- Centered italic headline: "Most dealers are already moving away from warranty providers..."
- Sub: "The problem is they don't have the right system to manage it properly."

**B. Pricing trust bar**
- Horizontal row of 4 check items: "£0/month", "Only pay per warranty", "First 5 warranties free", "No contracts or upfront costs"
- Placed between the transition section and the problem section
- Subtle top/bottom borders

**C. Problem section refinement**
- Match screenshot layout: full-width centered headline, subtitle below
- Pain points in a 2-column grid of bordered cards (not bullet list with X icons)
- Each card has an orange CheckCircle icon + text
- Closing line: "There's a better way to run warranties."

**D. Features section refinement**
- Section label: "PLATFORM FEATURES"
- Headline: "Everything you need to stay in control"
- Sub: "Built for UK dealers who want higher margins, faster claim decisions, and fewer admin headaches."
- 3x2 grid of feature cards matching screenshot style (icon in teal rounded box at top-left, title, description)

**E. "Optional Add-on" — Dedicated Warranty Line section**
- New section with orange "OPTIONAL ADD-ON" label
- Headline: "Look like a proper warranty department"
- Sub: "Give your customers a dedicated line for warranty enquiries and claims."
- Left side: 2-column grid of benefit cards (custom greeting, hold music, simple menu, calls routed, keeps warranty calls separate)
- Right side: pricing card "Dedicated Warranty Line — £25/month" with features and orange CTA
- Bottom text about stopping personal mobiles + "Set up in 24 hours"

**F. Tighten existing sections**
- Remove the separate "Solution" section (merged into flow above)
- Remove the "Differentiator + Dashboard" preview section (redundant with hero dashboard preview)
- Keep: How it Works, Pricing, Testimonials, Final CTA, Footer

### Part 2: Dashboard & Platform QA

Files to update for full functionality:

**A. Dealer Dashboard (`DealerDashboard.tsx`)**
- Already functional with reg lookup, quick actions, stats, charts. No changes needed.

**B. Add Warranty flow (`AddWarranty.tsx`)**
- Already uses `lookupVehicle` (DVLA sim) and `lookupPostcode` (address sim). Fully working.

**C. Dealer Warranties (`DealerWarranties.tsx`)**
- Certificate generation already wired (view/print/download). Working.

**D. Dealer Claims (`DealerClaims.tsx`)**
- Approve/reject/request-info actions already update store. Working.

**E. Customer portal**
- Claims submission, requests, warranty viewing, certificate download — all connected to store. Working.

**F. Admin panel**
- Dashboard, dealers list, warranties, revenue, logs, settings — all reading from demo data. Working.

### Part 3: Feature Recommendations

After reviewing the full codebase, here are recommendations to present to the user:

1. **Warranty Renewal/Extension flow** — Allow dealers to extend an existing warranty directly from the warranties table (currently only customers can request extensions).

2. **Email notification simulation** — Show toast + add audit log entries when warranties are created, claims change status, or customer requests are actioned. Add a "Notifications" section in dealer settings for email template previews.

3. **Warranty expiry alerts** — Add a "Expiring Soon" badge/section on the dealer dashboard showing warranties expiring in the next 30 days.

4. **Dealer profit/loss report** — Enhance the revenue chart to show warranty income vs claims paid out, giving a true P&L view.

5. **Customer invite flow** — When creating a warranty, auto-generate a simulated "invite email" with login credentials for the customer portal.

6. **Search across all pages** — Add global search in the dealer layout header that searches across warranties, customers, and claims.

7. **Mobile bottom navigation** — The dealer layout has mobile nav but could be tightened for thumb-friendly use.

### Technical Details

**Files to modify:**
- `src/pages/LandingPage.tsx` — Major rewrite to add new sections, reorder, and tighten layout
- No other files need changes for the landing page work

**New icons needed:** `Phone`, `PhoneCall`, `Headphones`, `Music` from lucide-react for the warranty line add-on section.

**Implementation approach:** Single file edit to `LandingPage.tsx` rewriting the page with all new sections in the correct order matching the screenshots.

