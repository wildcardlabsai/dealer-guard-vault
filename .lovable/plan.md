

# Update Features Page + Nav Scroll Anchors

## What's Missing

The Features page is outdated — it doesn't include **DisputeIQ**, **Warranty Fund**, **Claim Assist**, or **Evidence Pack Generator**. These are core product features that need showcasing.

The nav Product dropdown currently sends Warranty Management, Claim Assist, and Warranty Fund all to `/features` with no scroll targeting. DisputeIQ already has `/disputeiq`.

## Approach: Hybrid Navigation

- **DisputeIQ** → keeps its own page (`/disputeiq`) — already works
- **Warranty Management** → scrolls to `#warranty-management` on `/features`
- **Claim Assist** → scrolls to `#claim-assist` on `/features`
- **Warranty Fund** → scrolls to `#warranty-fund` on `/features`

## Changes

### 1. Add missing features to FeaturesPage (`src/pages/FeaturesPage.tsx`)

Restructure the feature groups to include all current product capabilities:

**Core Features** (keep):
- Warranty Management
- Customer Portal

**Claims & Control** — add two new entries:
- Claims Management (keep)
- **Claim Assist** (NEW) — end-to-end claim handling with evidence requests, checklists, messaging, decisions, and the Evidence Pack Generator
- **Evidence Pack Generator** (as a bullet under Claim Assist) — generates printable HTML claim summaries for records and disputes

**Intelligence & Risk** (NEW section):
- **DisputeIQ** — AI complaint handler, CRA reasoning, risk levels, response generation in 4 styles, Strategy Mode
- **Warranty Fund** — financial oversight, buffer calculation, health status, scenario simulator, AI contribution recommendations

**Add-ons** (keep existing):
- Warranty Line, Cover Templates, Documents, Support

Also update the **quick overview grid** at the top to include DisputeIQ, Warranty Fund, Claim Assist, and Evidence Pack.

Add `id` attributes to each feature group section for scroll targeting.

### 2. Update nav links (`src/components/PublicNav.tsx`)

Change dropdown `to` values to use hash links:
- Warranty Management → `/features#warranty-management`
- Claim Assist → `/features#claim-assist`
- DisputeIQ → `/disputeiq` (unchanged)
- Warranty Fund → `/features#warranty-fund`

Add scroll-into-view logic in FeaturesPage using `useLocation` + `useEffect` to handle hash-based scrolling with `scroll-margin-top` for the fixed nav.

### 3. Update comparison table

Add rows for:
- **Complaint Handling**: "No guidance, risk of escalation" vs "AI-powered responses with legal reasoning"
- **Financial Visibility**: "No real-time fund tracking" vs "Live fund health with buffer calculations"

---

## Technical Details

- **Files modified**: `src/pages/FeaturesPage.tsx`, `src/components/PublicNav.tsx`
- Screenshots for new features will use placeholder images (same pattern as existing) — you can swap real screenshots later
- No new dependencies
- Smooth scroll behaviour via `scrollIntoView({ behavior: 'smooth' })` with `scroll-margin-top` on sections to account for fixed nav

