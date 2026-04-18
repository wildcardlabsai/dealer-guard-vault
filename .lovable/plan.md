

# Dashboard & Feature Audit — Recommendations

Keeping this strictly within the warranty platform scope. No DMS creep. Every recommendation directly serves warranty issuance, claims, fund management, or platform operations.

---

## What's Already Strong (No Changes Needed)

- **Dealer Dashboard** — Well-structured with fund health ring, claim priority badges, onboarding flow, expiring alerts, and sales target. The simple/advanced mode toggle is smart.
- **Warranty Fund + Smart Contribution AI** — This is a standout feature. Leave as-is.
- **DisputeIQ** — Properly scoped and valuable. No changes.
- **Customer Dashboard** — Clean circular countdown, tier badges, coverage summary, claim tracker all work well.
- **Contact + Enquiry system** — Recently added and functional.

---

## Recommended Improvements

### DEALER SIDE

**1. Warranty Renewal Prompts**
Expiring warranties show a "Xd left" badge but there's no way to renew. Add a "Renew" button on each expiring warranty row that pre-fills a new warranty for the same vehicle/customer. This is the single most useful action a dealer needs and it's missing.

**2. Claim Assist — Quick Stats at Top**
The Claim Assist page already has KPIs but the dealer Claims list (`DealerClaims.tsx`) is basic — just a list with action buttons. Add 3 summary stat cards at the top (Open, Approved, Rejected) so dealers can see the picture at a glance without navigating to Claim Assist.

**3. Documents Page — Too Generic**
Every document downloads the same generic HTML template. This page should dynamically generate documents using real warranty data:
- "Warranty Certificate" should use `generateCertificate()` (already exists) for a selected warranty
- Remove fake templates that don't tie to real data
- Add a simple warranty selector so the dealer picks which warranty to generate a certificate for

**4. Remove "Warranty Line" Upsell from Dashboard (simplify)**
The Warranty Line upsell banner appears on the dashboard AND on the claims page AND on settings. That's 3 upsell points for a £25/month add-on. Keep it only on the Settings page to reduce clutter. The dashboard should focus on warranties and claims, not selling add-ons.

### CUSTOMER SIDE

**5. Warranty Document Download — More Prominent**
The "Certificate" download button is buried in a 2x2 grid. Move it into the warranty card itself as a standalone row beneath the vehicle details, with a clear "Download Your Warranty Certificate" label. Customers need this for their records and garage visits.

**6. Claim Progress — Add Expected Timeline**
The 3-step claim tracker (Submitted → Under Review → Decision) is good but dealers often take 3-5 working days. Add a small "Typically 3-5 working days" note beneath the tracker so customers aren't left guessing.

### ADMIN SIDE

**7. Admin Dashboard — Revenue Uses £50/mo Subscription Model but Settings Says Pay-Per-Use**
There's a contradiction: `AdminSettings.tsx` says "No monthly subscription fees — Pay-Per-Use Model" and charges £15 per warranty. But `AdminDashboard.tsx` calculates `subscriptionRevenue = activeDealers * 50` and shows MRR based on £50/month subscriptions. Pick one model and make both pages consistent. Given your positioning as a lean warranty platform, the pay-per-use model in Settings is better. Update the dashboard and revenue page to use per-warranty fee calculations only.

**8. Admin System Logs — Add Filtering**
The logs page is a raw table dump with no filtering or search. Add a search input and an action type filter dropdown (warranty, claim, customer) so admins can actually find things. This is a basic usability fix.

**9. Admin Revenue — Add Time Period Selector**
Revenue page shows a single bar chart with no date filtering. Add a simple period toggle (This Month / Last 3 Months / All Time) so admins can track trends.

---

## What to NOT Add (Scope Discipline)

- No CRM features (customer birthday reminders, marketing campaigns)
- No inventory or stock tracking
- No vehicle history / MOT integration beyond what's needed for warranty issuance
- No dealer-to-dealer messaging or marketplace
- No invoicing or accounting tools

---

## Summary of Changes

| # | Area | Change | Effort |
|---|------|--------|--------|
| 1 | Dealer | Warranty renewal button on expiring warranties | Small |
| 2 | Dealer | Claim summary stats on DealerClaims page | Small |
| 3 | Dealer | Documents page uses real warranty data | Medium |
| 4 | Dealer | Remove duplicate Warranty Line upsells from dashboard/claims | Small |
| 5 | Customer | More prominent certificate download | Small |
| 6 | Customer | Expected timeline note on claim tracker | Tiny |
| 7 | Admin | Fix revenue model contradiction (use pay-per-use consistently) | Medium |
| 8 | Admin | Add search/filter to System Logs | Small |
| 9 | Admin | Add time period selector to Revenue page | Small |

All 9 changes stay firmly within warranty operations. No feature bloat.

