

# Dashboard Enhancements - All Three Dashboards

## Overview
Enhance all three dashboards (Dealer, Admin, Customer) with the features previously suggested, using existing data from demo stores.

---

## 1. Dealer Dashboard Enhancements

**File:** `src/pages/dealer/DealerDashboard.tsx`

- **Expiring Warranties Alert**: Add a warning section showing warranties expiring within 30 days, with vehicle details and days remaining. Clickable rows navigate to warranty details.
- **Claim Approval Rate**: Add a stat card showing approval rate percentage (approved / total resolved claims).
- **Activity Feed**: Add a "Recent Activity" section pulling from `auditLog` filtered by dealer, showing the last 5 actions with timestamps and icons.
- **Sales Target Progress**: Add a monthly target progress bar (e.g. target of 10 warranties/month) showing current month's count vs target using the Progress component.

## 2. Admin Dashboard Enhancements

**File:** `src/pages/admin/AdminDashboard.tsx`

- **Pending Actions Banner**: Top banner showing counts of pending signup requests (from `useSignupStore`), open support tickets (from `useSupportStore`), and pending claims. Each count is a clickable link to its management page.
- **Dealer Leaderboard**: Ranked list of top 5 dealers by warranty count, showing name and count with a bar indicator.
- **Claims Breakdown**: Add a PieChart (from recharts) showing claims by status (pending, approved, rejected, under_review).
- **Platform Activity Log**: Show last 5 audit log entries from `demoAuditLog`.
- **MRR & Churn Metrics**: Add stat cards for Monthly Recurring Revenue and an estimated churn rate based on dealer statuses.

## 3. Customer Dashboard Enhancements

**File:** `src/pages/customer/CustomerDashboard.tsx`

- **Warranty Countdown**: Visual progress bar showing time elapsed vs total duration for the active warranty, with "X days remaining" label.
- **Claim Status Tracker**: For the most recent claim, show a horizontal step indicator (Submitted > Under Review > Decision) with the current step highlighted.
- **Quick Certificate Download**: Add a "Download Certificate" button on the active warranty card using `downloadCertificate` from the existing generate-certificate utility.
- **What's Covered Summary**: Pull the cover template for the active warranty (via `useCoverStore`) and display a compact list of covered items with check icons.

---

## Technical Notes

- All data comes from existing in-memory stores (no database changes needed)
- Uses existing UI components: Progress, Badge, Button, and recharts (already installed)
- Imports `useSignupStore`, `useSupportStore`, `useCoverStore` where needed
- Follows the existing `glass-card` styling pattern throughout
- No new files created -- all changes are additions to the three existing dashboard files

