
## Recommendations for Public Pages Polish

Now that the public site is locked to light mode with dark mocks floating on top, here's what I'd recommend to lift it from "good" to "premium SaaS" tier. Grouped by impact.

### 1. Typography refinement (highest impact, lowest effort)
- **Tighten hero headlines**: current `Space Grotesk` headlines render at default tracking. Drop to `tracking-tight` (-0.02em) on h1/h2 and bump h1 weight to 600. This is what Linear/Vercel/Stripe all do — instantly feels more designed.
- **Larger hero h1**: bump landing hero from current size to `text-5xl md:text-7xl` for more presence on a light background (light pages need bigger type to feel confident).
- **Body line-height**: bump body copy from default to `leading-relaxed` (1.625) on marketing paragraphs — easier to read, feels more editorial.
- **Eyebrow labels**: add small uppercase tracked labels above each section h2 (e.g. "PLATFORM" / "PRICING") in primary teal. Adds rhythm and helps scanning.

### 2. Color & accent system
- **Warm up the neutrals**: page background is pure `#ffffff`. Shift to a barely-off-white (`hsl(30 25% 99%)`) — same warm tone as the cream bands, removes the clinical feel.
- **Add a soft secondary accent**: right now everything is teal + cta-orange. Introduce a soft warm beige (`hsl(30 40% 94%)`) for tertiary surfaces (testimonial cards, FAQ open state) so not every panel is white-on-white.
- **Stronger CTA contrast**: orange CTA button currently sits on cream sections. Add a subtle dark ring/shadow on hover so it pops more.

### 3. Section rhythm & layout
- **Consistent section padding**: audit landing/features — some sections are `py-16`, others `py-24`. Standardise to `py-24 md:py-32` for marketing sections so the page breathes.
- **Max-width discipline**: hero copy and section intros currently stretch full container. Cap intro paragraphs at `max-w-2xl mx-auto` for better readability.
- **Soft section dividers**: between cream and white bands, add a 1px hairline border in `hsl(30 20% 92%)` instead of a hard color flip — softer transition.
- **Feature mock framing**: add a subtle gradient halo behind each dark mock (radial teal/orange glow at 5% opacity) so they feel "lit" rather than just dropped on the page.

### 4. Component polish
- **Glass cards**: currently flat white with light border. Add a very subtle inner highlight (`shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]`) and a tiny warm shadow — gives them a tactile "card" feel.
- **Pricing card**: make the £15 number much larger (`text-7xl`) and add a strikethrough "compare to £200+ traditional" underneath in muted text.
- **Testimonial carousel**: add quote marks as a large decorative serif glyph behind the quote (in 8% opacity teal). Classic SaaS move, instantly elevates.
- **FAQ accordions**: when open, fill with the warm beige tertiary surface instead of white-on-white.

### 5. Micro-interactions
- **Scroll-triggered fade-ups**: already in place via framer — but stagger by 80ms instead of default for a more deliberate feel.
- **CTA button hover**: add a subtle lift (`hover:-translate-y-0.5 hover:shadow-lg`) on primary CTAs.
- **Logo cloud / trust strip**: if not present, add a thin band under the hero with "Trusted by 200+ UK dealers" + small grey logos. Universal trust signal.

### 6. Page-specific notes
- **Features page**: the comparison table at the bottom would benefit from row striping in cream. Also the "Ours vs Theirs" columns could use teal/red header tints.
- **DisputeIQ page**: the live demo card could be bigger and more central — it's the flagship free tool, treat it like a hero.
- **Blog index**: article cards are quite plain — add the tag chip in colour, larger excerpt, and a hover lift.
- **FAQ page**: add a sticky category nav on the side (desktop) so users can jump between sections.
- **Contact page**: form fields currently inherit default light styling — give them more padding and a focus ring in teal.

### My top 5 if you only do a handful
1. Tighten hero typography (tracking-tight, weight 600, larger h1)
2. Warm up page background off pure white
3. Add eyebrow labels above section headlines
4. Add radial glow halos behind dark feature mocks
5. Polish pricing card (huge £15, strikethrough comparison)

Want me to implement all of these, just the top 5, or pick a specific category to start with?

<lov-actions>
<lov-suggestion message="Implement all the recommendations across landing, features, DisputeIQ, blog, FAQ and contact pages.">Do all of them</lov-suggestion>
<lov-suggestion message="Just implement your top 5 recommendations: tighten hero typography, warm up the background, add eyebrow labels, add glow halos behind mocks, and polish the pricing card.">Just the top 5</lov-suggestion>
<lov-suggestion message="Focus only on typography and color refinements (sections 1 and 2) across all public pages.">Typography & color only</lov-suggestion>
<lov-suggestion message="Focus on component polish and micro-interactions (sections 4 and 5) across all public pages.">Components & interactions only</lov-suggestion>
</lov-actions>
