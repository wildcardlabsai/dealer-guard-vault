

# Implementation Plan: Auth, Stripe, Support Tickets & Feature Audit

This is a large change touching authentication, payments, a new support system, and data cleanup. Here is the full plan broken into clear phases.

---

## Phase 1: Fix All Existing Features (Audit & Repair)

Review and fix any broken references or missing functionality across the app:

- **AdminSettings pricing**: Currently shows old "Monthly Subscription" and "Per Warranty Admin Fee" fields. Update to reflect the actual £19 per warranty model with £0 monthly fees.
- **Cover template linking**: Ensure `AddWarranty.tsx` has a cover template dropdown so dealers can assign templates when creating warranties.
- **Customer portal data flow**: Verify `CustomerCover`, `CustomerClaimsEnhanced`, `CustomerClaimSubmit` all correctly pull data for the logged-in customer (customer-1 = John Smith with active warranties w-1 and w-6).
- **Dealer claim assist**: Verify the claim workspace tabs (Summary, Evidence, Checklist, Messages, Timeline, Decision, Audit Log) all render and function correctly.
- **Certificate generation**: Update `generate-certificate.ts` to include cover level and key covered/excluded items from the linked cover template.

---

## Phase 2: Proper Authentication (Replace Demo Quick Logins)

Remove the one-click demo login buttons from `LoginPage.tsx` and set up proper email/password authentication using the existing `AuthContext`.

### Changes:
- **LoginPage.tsx**: Remove the entire "Demo Logins" card with the three quick-login buttons. Keep only the email/password form.
- **AuthContext.tsx**: Update the `login` function to validate against a password field. Remove the `loginAs` helper. Set up 3 hardcoded demo accounts with real passwords:
  - **Super Admin**: `admin@warrantyvault.com` / `admin123`
  - **Dealer**: `dealer@prestige-motors.co.uk` / `dealer123`
  - **Customer**: `john@example.com` / `customer123`
- **Demo hint**: Add a small collapsible "Demo credentials" section at the bottom of the login page (just showing the email/password combos as text, not buttons).

---

## Phase 3: Stripe Payment for £19 Warranty Issuance

Integrate a simulated Stripe payment flow into the warranty creation process.

### Changes:
- **AddWarranty.tsx**: Add a final "Payment" step after the review step. Show a payment summary card: "Warranty Admin Fee: £19". Include a simulated "Pay with Stripe" button that shows a loading state, then confirms payment.
- **warranty-store.ts**: Add a `paymentStatus` field to warranties (paid/pending).
- **DealerDashboard**: Show total fees paid as a stat.
- **Landing page / pricing**: Ensure all references show £19 per warranty, £0 monthly.

> Note: This will be a simulated payment for now. Real Stripe can be enabled later using the Stripe connector.

---

## Phase 4: Support Ticket System

Build a new "Support" feature allowing dealers to submit help requests to the super admin.

### Data Model (in-memory store):
```
SupportTicket {
  id, dealerId, dealerName, subject, message,
  status: "open" | "in_progress" | "resolved" | "closed",
  priority: "low" | "medium" | "high",
  messages: { from, message, timestamp }[],
  createdAt, updatedAt
}
```

### Dealer Side:
- Add "Support" nav item to `DealerLayout.tsx` sidebar
- Create `src/pages/dealer/DealerSupport.tsx`:
  - "My Tickets" list showing all tickets with status badges
  - "New Ticket" form: subject, message, priority dropdown
  - Click ticket to view conversation thread and reply
- Add route `/dealer/support` in `App.tsx`

### Admin Side:
- Add "Support Tickets" nav item to `AdminLayout.tsx` sidebar
- Create `src/pages/admin/AdminSupport.tsx`:
  - All tickets from all dealers, with filters (status, dealer, priority)
  - Click ticket to view details, reply, change status
  - KPI cards: Open, In Progress, Resolved this month
- Add route `/admin/support` in `App.tsx`

### Store:
- Create `src/lib/support-store.ts` with the same listener pattern used elsewhere
- Seed 2-3 demo tickets from the dealer account

---

## Phase 5: Fully Populated Demo Accounts

Ensure all three demo accounts have rich, realistic data:

### Super Admin (`admin@warrantyvault.com`):
- Sees all dealers, all warranties, all claims, all support tickets, signup requests

### Dealer (`dealer@prestige-motors.co.uk` — dealerId `d-1`):
- 4+ customers, 6+ warranties (mix of active/expired)
- 3+ cover templates (Basic, Standard, Premium)
- 4+ claims at various statuses
- Active warranty line
- 2+ support tickets
- Claim settings configured

### Customer (`john@example.com` — customerId `customer-1`):
- 2 active warranties (w-1, w-6)
- 1 claim (engine warning light, under review)
- Cover template linked and visible
- Full portal experience working

---

## Files to Create
- `src/lib/support-store.ts`
- `src/pages/dealer/DealerSupport.tsx`
- `src/pages/admin/AdminSupport.tsx`

## Files to Edit
- `src/contexts/AuthContext.tsx` — proper password auth, remove `loginAs`
- `src/pages/LoginPage.tsx` — remove quick logins, add credentials hint
- `src/App.tsx` — add support routes
- `src/components/layouts/DealerLayout.tsx` — add Support nav
- `src/components/layouts/AdminLayout.tsx` — add Support nav
- `src/pages/dealer/AddWarranty.tsx` — add cover template dropdown + payment step
- `src/pages/admin/AdminSettings.tsx` — fix pricing to £19/warranty model
- `src/lib/generate-certificate.ts` — enhance with cover template data
- `src/data/demo-data.ts` — ensure demo data is comprehensive
- `src/lib/warranty-store.ts` — add payment tracking

---

## Technical Notes
- All state management uses the existing in-memory store + listener pattern (no backend needed yet)
- Stripe is simulated — structured so real Stripe can replace it later
- Auth remains client-side demo auth with password validation (no Supabase yet)
- Support ticket messaging follows the same pattern as claim messages

