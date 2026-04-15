

# Launch Readiness Audit — Remaining Items

After a thorough audit, the system is **mostly production-ready** but has several leftover demo artifacts that need cleaning up before launch.

## Issues Found

### 1. Nine dealer pages still have `|| "d-1"` fallback IDs
These files use `user?.dealerId || "d-1"` which means if the auth user somehow lacks a dealerId, they'd see another dealer's data:
- `DealerRequests.tsx`, `DealerWarranties.tsx`, `DealerDocuments.tsx`, `DealerCoverTemplates.tsx`, `DealerClaims.tsx`, `DealerClaimAssist.tsx`, `DealerDisputeIQ.tsx`, `DisputeIQAssessment.tsx`, `DealerWarrantyFund.tsx`

**Fix:** Replace `|| "d-1"` with `|| ""` in all nine files. Empty string means they'll see nothing instead of another dealer's data.

### 2. Notification store seeds fake demo notifications
`src/lib/notification-store.ts` has a `seedNotifications()` function that creates hardcoded fake notifications ("AutoCare Solutions", "Prestige Motors", "AB12 CDE") when no DB notifications exist. It also checks for `admin-1` and `cust-1` IDs.

**Fix:** Remove the entire `seedNotifications` function. If no notifications exist in DB, show empty — that's correct for a new system.

### 3. ContactPage pushes notification to hardcoded `"admin-1"` 
`src/pages/ContactPage.tsx` line 42: `pushNotification("admin-1", ...)` — this won't reach the real admin whose ID is a UUID.

**Fix:** Push to the real admin user ID, or better, store the enquiry in DB and let the admin see it via the enquiries page (which already works).

### 4. Certificate generator uses demo cover templates
`src/lib/generate-certificate.ts` imports `demoCoverTemplates` from the static file instead of fetching from the database. Certificates won't show real cover template data.

**Fix:** Accept an optional `CoverTemplate` parameter so the caller passes the real template from the cover store.

### 5. Cover templates file still has hardcoded demo arrays
`src/data/cover-templates.ts` exports `demoCoverTemplates` (4 templates with `d-1`/`d-2` dealerIds) and `warrantyTemplateMap`. These are only used by `generate-certificate.ts` now.

**Fix:** Keep the type exports, remove the demo arrays. Certificate generation will use the real template passed in.

### 6. Claim data file has demo claim records
`src/data/claim-data.ts` has ~5 hardcoded demo claims with "John Smith", "Prestige Motors" etc. But these are only type/config exports now — the actual demo claim objects aren't imported elsewhere. The types and config maps (`claimStatusConfig`, `claimPriorityConfig`, etc.) ARE used.

**Fix:** Remove the demo claim array (`demoClaims` or similar) but keep all types and config objects.

### 7. Certificate text says "warrantyvault.com" instead of ".co.uk"
Line 98 of `generate-certificate.ts` says "Log into your customer portal at warrantyvault.com" — should be `.co.uk`.

**Fix:** Update to `warrantyvault.co.uk`.

## What's Already Good
- Auth system — fully Supabase-only, no demo logic
- Admin dashboard, dealers, warranties, revenue, logs — all DB-driven
- Dealer dashboard, settings, support, warranty line — all DB-driven
- Customer layout — no fallback IDs
- Email service — correctly uses warrantyvault.co.uk
- Edge functions — all production-ready
- Signup/approval flow — working end-to-end
- Admin account created and working

## Summary of Changes

| # | File(s) | Change |
|---|---------|--------|
| 1 | 9 dealer pages | Remove `\|\| "d-1"` fallbacks |
| 2 | `notification-store.ts` | Remove `seedNotifications()` and demo notification data |
| 3 | `ContactPage.tsx` | Fix admin notification target |
| 4 | `generate-certificate.ts` | Use real template from caller, fix URL |
| 5 | `cover-templates.ts` | Remove demo arrays, keep types |
| 6 | `claim-data.ts` | Remove demo claim objects, keep types/configs |

Total: ~15 files touched, mostly small surgical edits.

