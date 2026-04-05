

# Consistent Nav + Enhanced Features Page

## Problem
1. **Nav inconsistency**: Landing page has 6 links (Features, Pricing, FAQ, Blog, Dealers, Customers) plus mobile hamburger menu. Features, FAQ, Blog pages only have 3 links (Features, FAQ, Blog) and no mobile menu, no Dealers/Customers links.
2. **Features page is missing newer features**: Only lists 6 features. Missing: Warranty Line, Cover Templates, Claim Settings (max labour rate / per-claim limit), First 5 Free, Dealer Documents, Dealer Support.
3. **Features page layout is plain**: Just a grid of icon cards with no visual interest or screenshot placeholders.

## Plan

### 1. Extract shared nav into a reusable component
Create `src/components/PublicNav.tsx` — a shared navigation bar used across all public pages:
- Same links as landing page: Features, Pricing (links to `/#pricing`), FAQ, Blog, Dealers, Customers
- Mobile hamburger menu with all links + Sign Up button
- Accepts `currentPage` prop to highlight the active link
- Replace nav in: `LandingPage.tsx`, `FeaturesPage.tsx`, `FAQPage.tsx`, `BlogIndexPage.tsx`, `WarrantyLinePage.tsx`

### 2. Expand features list on Features page
Add all missing features to the page (12 total):
- Warranty Management, Branded Certificates, DVLA Lookup, Customer Portal, Claims Management, Profit Tracking (existing)
- **Warranty Line** — dedicated phone line for warranty calls
- **Cover Templates** — customisable warranty cover documents
- **Claim Limits** — set max labour rate and per-claim limits
- **First 5 Free** — no cost on your first 5 warranties
- **Dealer Documents** — manage and store warranty documents
- **Dealer Support** — built-in support ticket system

### 3. Redesign Features page layout
Instead of a plain grid, use an alternating showcase layout:
- Each feature gets a **full-width row** with text on one side and a **screenshot placeholder** (a styled empty container with a dashed border, aspect-ratio box, and "Screenshot coming soon" text) on the other side
- Alternate left/right layout for visual rhythm
- Keep the quick icon grid at the top as an overview, then expand into detailed sections below
- Each detailed section includes: title, description, 3-4 bullet points, and the screenshot placeholder
- Group features into 3-4 categories (e.g. "Core", "Claims & Control", "Add-ons") with section headers
- Add subtle background alternation between sections

## Files
- **New**: `src/components/PublicNav.tsx`
- **Edit**: `src/pages/FeaturesPage.tsx` (new features, new layout with screenshot placeholders)
- **Edit**: `src/pages/LandingPage.tsx` (use PublicNav)
- **Edit**: `src/pages/FAQPage.tsx` (use PublicNav)
- **Edit**: `src/pages/BlogIndexPage.tsx` (use PublicNav)
- **Edit**: `src/pages/WarrantyLinePage.tsx` (use PublicNav)

