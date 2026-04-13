

# WarrantyVault Expansion — 5 Focused Features

## Summary
Add five tightly scoped features to WarrantyVault: Warranty Fund dashboard with AI insights, Profit Dashboard, Evidence Pack Generator, Customer Timeline, and Light Benchmarking. All built using existing demo data stores, matching the current glass-card dark-mode aesthetic.

---

## Technical Approach

All features use the existing in-memory stores (`warranty-store`, `claim-store`, `dealer-settings-store`) and demo data. Calculations are derived from current warranty costs (as contributions) and claim amounts (as payouts). One new edge function for AI-powered fund insights and benchmarking analysis.

---

## Feature 1: Warranty Fund

**New page:** `/dealer/warranty-fund` → `src/pages/dealer/DealerWarrantyFund.tsx`  
**New sidebar item:** "Warranty Fund" with `Wallet` icon

**Data model (computed from existing stores):**
- `contributions` = sum of all warranty `cost` values for dealer
- `claimsPaid` = sum of all approved/partially-approved claim `amount` values
- `balance` = contributions − claimsPaid
- `avgClaimCost` = mean of claim amounts
- `claimRate` = total claims / total warranties
- `estimatedLiability` = active warranties × avgClaimCost × riskFactor (0.15 default)
- `buffer` = balance − estimatedLiability

**UI sections:**
1. **Hero card** — Large fund balance, monthly change, status badge (Healthy/Watch/Risk based on buffer %)
2. **Key metrics row** — Total contributions, claims paid, active warranties, claim rate, avg claim cost
3. **AI Fund Insight** — Calls new edge function `warranty-fund-insight` to get plain-English recommendation on contribution levels
4. **Contribution slider** — £50–£300 range, shows recommended range from AI
5. **Scenario simulator** — Select 1/3/5 claims, see projected balance and status change

**Edge function:** `supabase/functions/warranty-fund-insight/index.ts`  
Uses Lovable AI (gemini-3-flash-preview) with structured tool calling to return: recommended contribution range, risk assessment, plain-English summary. Non-streaming, invoked via supabase SDK.

---

## Feature 2: Profit Dashboard

**New section** integrated into the Warranty Fund page (as a tab or below the fund section).

**Calculations:**
- Revenue = sum(warranty costs)
- Claims cost = sum(approved claim amounts)
- Profit = revenue − claims
- Profit per warranty = profit / warranty count
- Monthly trend (derived from warranty `createdAt` and claim dates)

**UI:**
- Three hero stat cards: Total Revenue, Claims Cost, Net Profit
- Profit per warranty callout
- Monthly trend bar chart (revenue vs claims)
- Simple AI insight line: "You are making £X per warranty on average"

---

## Feature 3: Evidence Pack Generator

**Added to:** `src/pages/dealer/DealerClaimAssist.tsx` (new "Generate Evidence Pack" button in claim workspace)

**Implementation:**
- Button appears in claim detail view header
- Generates a clean HTML document in a new tab containing:
  - Claim reference and summary
  - Customer details
  - Vehicle details
  - Full timeline
  - Messages (non-internal only)
  - Decision details
  - Checklist results
- Styled for print with `@media print` CSS
- Also offers download as HTML file (same approach as existing DealerDocuments)

No PDF library needed — clean printable HTML that browsers can "Print to PDF."

---

## Feature 4: Customer Timeline

**New page:** `/dealer/customers/:id/timeline` OR integrated as a view within `DealerCustomers.tsx`

**Approach:** Add a "View Timeline" button on each customer card in DealerCustomers. Opens a modal/panel showing a chronological list pulling from:
- Warranty store (warranty created events)
- Claim store (claims, messages, decisions)
- DisputeIQ store (dispute cases)
- Audit log entries

**UI:** Simple vertical timeline with icons, dates, and brief descriptions. No new data model — just aggregates existing stores filtered by customerId.

---

## Feature 5: Light Benchmarking

**Integrated into:** Warranty Fund page as a "Market Comparison" section.

**Data:** Uses anonymised averages from all dealers in demo data (d-1, d-2, d-3) to create "market" benchmarks.

**Comparisons:**
- Contribution per warranty (your avg vs market avg)
- Claim rate (yours vs market)
- Avg claim cost (yours vs market)

Each metric shows: your value, market value, and a badge (Above/Below/On Par).

**AI insight** included in the same `warranty-fund-insight` edge function call — returns a one-line benchmarking observation.

---

## Files to Create
1. `src/pages/dealer/DealerWarrantyFund.tsx` — Warranty Fund + Profit Dashboard + Benchmarking
2. `supabase/functions/warranty-fund-insight/index.ts` — AI insight edge function

## Files to Edit
1. `src/components/layouts/DealerLayout.tsx` — Add "Warranty Fund" sidebar item
2. `src/App.tsx` — Add route `/dealer/warranty-fund`
3. `src/pages/dealer/DealerClaimAssist.tsx` — Add "Generate Evidence Pack" button + generator logic
4. `src/pages/dealer/DealerCustomers.tsx` — Add "View Timeline" button + timeline modal

---

## Design Rules
- All glass-card styling, consistent with existing pages
- Large readable numbers, card-based layout
- No tables unless necessary
- Dark mode compatible (uses existing CSS variables)
- Premium SaaS feel throughout

