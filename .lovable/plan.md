

# Landing Page Restructuring

## Current State
The landing page has 12 sections in one monolithic scroll:
1. Hero
2. Statement
3. Problem
4. Solution
5. Features
6. Comparison Table
7. How it Works
8. Warranty Line Add-on
9. Pricing
10. Testimonials
11. Blog/Resources
12. FAQ
13. Final CTA
14. Footer

## Recommendation

**Keep on the landing page** (high-conversion, above-the-fold essentials):
- Hero (with clear CTA)
- Statement / social proof line
- Features (condensed 6-card grid)
- Pricing (simple, single-price — it's a strength)
- Testimonials (trust signals)
- Final CTA
- Footer

**Move to dedicated pages:**
- `/features` — Full features breakdown + Comparison Table + How it Works
- `/warranty-line` — The dedicated warranty phone line add-on (this is a separate product)
- `/faq` — FAQ with the JSON-LD schema (Google indexes this fine as a standalone page — arguably better)
- `/blog` — Blog index page listing all articles (currently cards are inlined)

## What This Achieves
- **Faster landing page** — less DOM, quicker paint, lower bounce
- **Better SEO** — each page targets its own keywords (`/faq` ranks for question queries, `/features` for feature comparisons, `/blog` for long-tail)
- **Cleaner navigation** — Nav links go to real pages instead of anchor scrolls
- **More indexable pages** — Google prefers multiple focused pages over one mega-scroll

## Implementation

### 1. Create `/features` page
- Move Problem, Solution, Features grid, Comparison table, and How it Works sections
- Add SEOHead targeting "self-funded warranty features" / "warranty software comparison"
- Add CTA at bottom linking to signup

### 2. Create `/warranty-line` page
- Move the Warranty Line add-on section
- Expand with more detail (this deserves its own page as a product)
- Add SEOHead targeting "dedicated warranty phone line for dealers"

### 3. Create `/faq` page
- Move FAQ section with JSON-LD FAQPage schema intact
- Add SEOHead targeting "self-funded warranty FAQ" / "dealer warranty questions"

### 4. Create `/blog` page
- Move the Resources grid to a dedicated blog index
- Each card links to `/blog/:slug` (already working)
- Add SEOHead targeting "car dealer warranty guides"

### 5. Slim down `LandingPage.tsx`
- Keep: Hero, Statement, Features (condensed), Pricing, Testimonials, CTA, Footer
- Update nav links to point to `/features`, `/faq`, `/blog`

### 6. Update routing and sitemap
- Add routes in `App.tsx` for `/features`, `/warranty-line`, `/faq`, `/blog`
- Update `sitemap.xml` with the 4 new URLs
- Update nav bar links

## Files
- **New**: `src/pages/FeaturesPage.tsx`, `src/pages/WarrantyLinePage.tsx`, `src/pages/FAQPage.tsx`, `src/pages/BlogIndexPage.tsx`
- **Edit**: `src/pages/LandingPage.tsx` (remove moved sections, update nav)
- **Edit**: `src/App.tsx` (add 4 routes)
- **Edit**: `public/sitemap.xml` (add 4 URLs)

