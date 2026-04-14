

# Visual Improvements to Dealer and Customer Dashboards

## Overview
Eight visual upgrades across both dashboards, keeping the existing dark UI aesthetic and glass-card patterns.

---

## Dealer Dashboard Changes (`src/pages/dealer/DealerDashboard.tsx`)

### 1. Fund Health Score Widget
Replace the simple Warranty Fund banner (lines 408-426) with a mini ring/donut chart showing the Fund Health Score (0-100). Import the `calcHealthScore`, `calcExposure`, `getEffectiveMetrics` functions from the Warranty Fund page (extract to a shared utility or inline). Display the numeric score inside a CSS circular progress ring, with the status label (Healthy/Stable/Watch/Risk) and colour-coded badge.

### 2. Claim Priority Indicators
In the Recent Claims list (lines 318-338), add an urgency indicator for claims pending longer than 7 days. Calculate days since `claim.createdAt`, and show an orange/red "Overdue" or "7d+" micro-badge next to claims exceeding the threshold. Claims under 7 days keep the existing dot indicator.

### 3. New Dealer Onboarding State
When `warranties.length === 0`, replace the stats grid and performance sections with a guided onboarding card. Show 3 steps: (1) Add your first warranty, (2) Set up your warranty fund, (3) Try DisputeIQ. Each step links to the relevant page. Use a checklist-style layout with the existing dark card styling.

---

## Customer Dashboard Changes (`src/pages/customer/CustomerDashboard.tsx`)

### 4. Stat Card Upgrades
Replace the plain `glass-card` stat blocks (lines 148-164) with the dealer-style `StatCard` pattern: icon in a rounded container, hover lift effect (`hover:-translate-y-0.5`), and subtle border glow on the active/accent card.

### 5. Circular Warranty Countdown
Replace the linear `<Progress>` bar (lines 80-91) with an SVG circular progress ring. Show `daysRemaining` in large text in the centre, with "days left" beneath. Keep the start/end date labels below.

### 6. Empty Claim State
When `latestClaim` is null (no claims), show a friendly empty state card instead of nothing. Include a shield icon, "No claims yet" message, and a "Submit a Claim" button linking to `/customer/claims`.

### 7. Coverage Tier Badge
Add a tier badge next to the "Active" badge on the warranty card (line 59). Derive tier from the cover template name (e.g., "Gold", "Silver", "Bronze") or warranty duration. Show as a small coloured badge.

### 8. Mobile Button Grid
Change the action buttons row (lines 93-100) from `flex flex-wrap` to a `grid grid-cols-2` layout on mobile, ensuring consistent button sizing and spacing.

---

## Shared Utility Extraction

Extract `calcHealthScore`, `calcExposure`, `getEffectiveMetrics`, and `getScoreStatus` from `DealerWarrantyFund.tsx` into a new file `src/lib/fund-health.ts` so both the Fund page and Dealer Dashboard can import them without duplication.

---

## Files to Create/Edit

| File | Action |
|------|--------|
| `src/lib/fund-health.ts` | Create — extract health score engine functions |
| `src/pages/dealer/DealerWarrantyFund.tsx` | Edit — import from `fund-health.ts` instead of inline |
| `src/pages/dealer/DealerDashboard.tsx` | Edit — add health ring widget, claim priority badges, onboarding state |
| `src/pages/customer/CustomerDashboard.tsx` | Edit — stat card upgrade, circular countdown, empty claim state, coverage tier badge, mobile button grid |

