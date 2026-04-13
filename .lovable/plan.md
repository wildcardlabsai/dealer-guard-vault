

# Fix Nav Dropdown Overlap + Improve Section Differentiation

## Problems Identified

1. **Dropdown clash**: The Product dropdown (`z-50` on nav) renders behind or visually clashes with the HeroMock because the mock has its own layered glow, borders, and 3D transform that compete visually. The dropdown's `bg-[hsl(222_28%_10%)]/95` blends into the mock's similar dark tones.

2. **Section differentiation**: Yes — the page is hard to scan. Sections alternate between `hsl(222 30% 6%)` and `hsl(222 30% 7.5%)` which is only a 1.5% lightness difference — barely perceptible. Cards use similarly dark backgrounds. The result is a wall of dark UI where sections blur together.

---

## Plan

### 1. Fix dropdown z-index and visual clash

**File: `src/components/PublicNav.tsx`**
- Increase dropdown `z-index` to `z-[60]` (above the nav's `z-50`)
- Make dropdown background fully opaque and slightly lighter: `bg-[hsl(222_28%_12%)]` (no transparency)
- Add a stronger border: `border-white/[0.1]`
- Add a stronger shadow to lift it visually above the hero mock

### 2. Improve section differentiation across the landing page

**File: `src/pages/LandingPage.tsx`**
- Widen the background alternation gap: use `hsl(222 30% 6%)` for dark sections and `hsl(222 28% 10%)` for lighter ones (4% lightness jump instead of 1.5%)
- Give the lighter sections a subtle top/bottom inner border or padding container with a visible rounded panel
- Increase section padding slightly on key sections (Problem, DisputeIQ, Pricing) to create more breathing room between groups
- Make section dividers slightly more visible: `via-white/[0.08]` instead of `0.06`
- Add a subtle top-border accent to the DisputeIQ and Pricing sections (their signature colours — orange and teal respectively)

### 3. Card contrast boost

- Bump card backgrounds from `bg-white/[0.03]` to `bg-white/[0.05]` and borders from `border-white/[0.06]` to `border-white/[0.08]` across all feature/step/testimonial cards
- This creates a clearer card-on-section hierarchy

---

## Technical Details

- **Files modified**: `src/components/PublicNav.tsx`, `src/pages/LandingPage.tsx`
- No new dependencies or components
- All changes are CSS class adjustments — no logic changes
- Approximately 15-20 line edits across both files

