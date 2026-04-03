

# SEO Fixes for WarrantyVault

## Problems Found

1. **Empty meta lines in index.html** — Multiple blank lines between meta tags (lines 22-32) look like empty/orphaned tags to crawlers
2. **No favicon meta tags** — Missing `apple-touch-icon`, `theme-color`, and proper favicon link tags (favicon.ico exists but isn't referenced)
3. **No sitemap.xml** — Google Search Console needs this
4. **robots.txt missing sitemap reference** — Should point to sitemap
5. **No canonical URL** — Duplicate content risk
6. **No structured data (JSON-LD)** — Google can't understand what the business is (SaaS, automotive, UK-based)
7. **No per-page meta tags** — SPA serves the same title/description for every route; Google sees identical meta on `/login`, `/signup`, landing page
8. **Missing `og:url`** — Open Graph incomplete
9. **No `lang="en-GB"`** — Currently `en`, should signal UK-English for UK market targeting
10. **No keyword-optimised content in meta** — Missing terms like "self-funded warranty", "dealer warranty software UK", "in-house car warranty"

## Plan

### 1. Clean up `index.html`
- Remove all empty lines between meta tags
- Add `lang="en-GB"` instead of `en`
- Add `<link rel="icon" ...>`, `<link rel="apple-touch-icon" ...>`, `<meta name="theme-color">`
- Add `<link rel="canonical" href="https://dealer-guard-vault.lovable.app/">`
- Add `og:url` meta tag
- Add keyword-rich `<meta name="keywords">` targeting: self-funded warranty, dealer warranty software, UK car warranty management, in-house warranty, used car warranty platform
- Add JSON-LD structured data block for `SoftwareApplication` + `Organization` schema in a `<script type="application/ld+json">` tag

### 2. Add `react-helmet-async` for per-page SEO
- Install `react-helmet-async`
- Wrap `App` with `<HelmetProvider>`
- Create a reusable `<SEOHead>` component that accepts `title`, `description`, and optional `canonical`
- Add `<SEOHead>` to key public pages:
  - **LandingPage**: "Self-Funded Car Warranty Software for UK Dealers | WarrantyVault"
  - **LoginPage**: "Login | WarrantyVault"
  - **SignupPage**: "Sign Up | WarrantyVault — Start Managing Your Own Warranties"
  - **NotFound**: "Page Not Found | WarrantyVault" + `noindex` meta

### 3. Add `public/sitemap.xml`
- Static sitemap listing public routes: `/`, `/login`, `/signup`
- Exclude all `/dealer/*`, `/admin/*`, `/customer/*` (behind auth)
- Set `lastmod` to current date, `changefreq` weekly, priority 1.0 for landing

### 4. Update `public/robots.txt`
- Add `Sitemap: https://dealer-guard-vault.lovable.app/sitemap.xml`
- Add `Disallow` rules for `/dealer/`, `/admin/`, `/customer/` to prevent crawling auth-protected routes

### 5. Landing page content SEO
- Add an `<h1>` tag with target keyword (currently the headline is in a motion div but may not be an h1 — will verify and fix)
- Ensure proper heading hierarchy (h1 > h2 > h3)
- Add `alt` text to any images

---

## Files Changed
- `index.html` — Clean up metas, add structured data, canonical, favicon links
- `public/robots.txt` — Add sitemap ref and disallow rules
- `public/sitemap.xml` — New file
- `src/components/SEOHead.tsx` — New reusable component
- `src/App.tsx` — Wrap with HelmetProvider
- `src/main.tsx` — No changes
- `src/pages/LandingPage.tsx` — Add SEOHead, verify h1
- `src/pages/LoginPage.tsx` — Add SEOHead
- `src/pages/SignupPage.tsx` — Add SEOHead
- `src/pages/NotFound.tsx` — Add SEOHead with noindex
- `package.json` — Add `react-helmet-async`

