
The user is asking a design opinion question about the FeatureMocks on the dark Features page. Looking at the current MockFrame in FeatureMocks.tsx — it uses a macOS chrome with what appears to be a dark/gradient interior. The Features page background alternates between `bg-background` and `bg-secondary/30` but the hero and CTA use the deep `hero-gradient` navy.

Key consideration: real SaaS marketing pages (Linear, Vercel, Stripe, Notion) almost universally show **light-UI product screenshots on dark marketing backgrounds**. The contrast makes the product "pop" off the page and signals "this is the actual product UI." Dark mocks on a dark page tend to blend in and feel flat.

Counter-argument: the actual dashboard defaults to dark mode, so light mocks would technically misrepresent the default experience. But marketing convention wins — most users read this as "a product screenshot" not "this is exactly what you'll see."

Recommendation: **light mocks**. They'll create the high-contrast, premium "floating screenshot" effect the landing page hero already achieves, and match the visual language of top-tier SaaS sites.

# Plan — Convert Feature Mocks to Light Mode

## Recommendation
Switch the 11 mocks in `FeatureMocks.tsx` to a **light UI** style. Reasoning:
- Dark mocks on a dark page blend in and look flat
- Every premium SaaS site (Linear, Stripe, Vercel) shows light product shots on dark marketing pages — it's the visual cue for "this is a screenshot"
- Creates the "floating window" depth effect the landing hero already has
- The dashboard does support light mode, so it's not misleading

## Changes
**File: `src/components/feature-mocks/FeatureMocks.tsx`**

1. **MockFrame wrapper**: change interior from dark gradient → white/very-light-grey background (`bg-white` or `bg-slate-50`), keep the macOS chrome (traffic-light dots) but lighten the title bar to a soft grey
2. **Drop shadow**: add a stronger shadow (`shadow-2xl` + subtle ring) so frames lift off the dark page background
3. **Inside each mock**: swap dark surfaces (`bg-white/5`, `bg-slate-900`) → light surfaces (`bg-slate-50`, `bg-white`); swap white text → slate-900/slate-700; keep the **brand teal accent** (`text-primary`, status badges) so they still feel on-brand
4. **Status colors**: keep semantic colors (green/amber/red badges) but use light-mode tints (e.g. `bg-green-100 text-green-700` instead of `bg-green-500/20 text-green-300`)
5. **Charts/bars**: use teal/slate fills on white instead of glowing fills on dark

## What stays the same
- Layout, content, icons, structure of every mock
- Section gradients on the page itself (dark stays dark)
- The macOS-style chrome with traffic-light dots
- Brand teal as the primary accent color

## Out of scope
- No changes to FeaturesPage.tsx structure or section backgrounds
- No new mocks added — just restyling the 11 existing ones

Result: the dark Features page will frame 11 crisp, light "product screenshots" that pop off the page like a real SaaS marketing site.
