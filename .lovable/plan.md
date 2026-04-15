

# Launch Readiness Plan: Remove All Demo Data, Go Production-Only

## Summary

The codebase is heavily dependent on hardcoded demo data (`demo-data.ts`) across **12+ files**. Every admin page, the auth system, dealer pages, and customer pages reference static demo arrays. This plan removes all demo dependencies and makes everything database-driven.

## What Needs to Change

### 1. Auth System — Remove Demo Credentials
**File:** `src/contexts/AuthContext.tsx`
- Remove `demoUsers`, `demoPasswords`, `DEMO_USER_KEY`, and all localStorage demo-user logic
- Login should ONLY use `supabase.auth.signInWithPassword`
- Session restore should ONLY use `supabase.auth.getSession` and `onAuthStateChange`
- The `buildUserFromSupabase` function already works correctly for real users
- **Requires:** A real admin account in Supabase Auth (currently none exists — only `imfunnzi@gmail.com` as dealer and `mattoftaylor@gmail.com` as customer)

### 2. Create Admin Account
- Run the `approve-dealer` pattern but for an admin: create a Supabase Auth user with `role: "admin"` in metadata via a one-time edge function invocation or migration
- This is critical — without it, no one can access the admin dashboard

### 3. Admin Dashboard — Fetch Real Data
**File:** `src/pages/admin/AdminDashboard.tsx`
- Replace `demoDealers`, `demoWarranties`, `demoClaims`, `demoAuditLog` with data from `useWarrantyStore()` and database queries via the `admin-data` Edge Function
- Revenue calculations should use real warranty counts × £15
- Dealer leaderboard, claims breakdown, activity logs — all from DB
- Monthly revenue trend should aggregate from real `warranties.created_at` dates

### 4. Admin Warranties Page — Fetch Real Data
**File:** `src/pages/admin/AdminWarranties.tsx`
- Replace `demoWarranties` with data from `useWarrantyStore()` (which already fetches from DB)

### 5. Admin Revenue Page — Fetch Real Data
**File:** `src/pages/admin/AdminRevenue.tsx`
- Replace `demoDealers`, `demoWarranties` with real DB data
- Calculate actual revenue from real warranty records

### 6. Admin Logs Page — Fetch Real Data
**File:** `src/pages/admin/AdminLogs.tsx`
- Replace `demoAuditLog` with data from `useWarrantyStore()` which already loads audit_log from DB

### 7. Admin Dealers Page — Remove Demo Fallback
**File:** `src/pages/admin/AdminDealers.tsx`
- Remove `demoDealers` import and merge logic
- Only show dealers from the database
- Remove demo fallback in catch block

### 8. Dealer Pages — Remove Hardcoded Fallbacks
Multiple files use `|| "d-1"` as fallback dealer ID and `dealerId === "d-1" ? "Prestige Motors" : "City Autos"` for dealer names:
- `DealerDashboard.tsx`, `DealerSettings.tsx`, `DealerSupport.tsx`, `DealerWarrantyLine.tsx`, `AddWarranty.tsx`, `DealerCustomers.tsx`, and others
- Replace with: use `user.dealerId` (no fallback) and fetch dealer name from the `dealers` table or user metadata

### 9. Dealer Customers Page — Fetch from DB
**File:** `src/pages/dealer/DealerCustomers.tsx`
- Replace `demoCustomers` with customers fetched from the `customers` table via `admin-data` Edge Function
- Currently shows only hardcoded demo customers

### 10. Customer Layout — Remove Hardcoded ID
**File:** `src/components/layouts/CustomerLayout.tsx`
- Replace `user?.id || "customer-1"` with just `user?.id`

### 11. Type Exports — Keep Interfaces, Remove Demo Arrays
**File:** `src/data/demo-data.ts`
- Keep all TypeScript interfaces (`User`, `Dealer`, `Customer`, `Warranty`, `Claim`, etc.)
- Remove all exported demo data arrays (`demoUsers`, `demoDealers`, `demoCustomers`, `demoWarranties`, `demoClaims`, `demoRequests`, `demoAuditLog`)
- Or: move interfaces to a dedicated `types.ts` file and delete `demo-data.ts`

### 12. Warranty Store — Already DB-Driven
**File:** `src/lib/warranty-store.ts`
- Only imports types from `demo-data.ts` — no demo data dependency. Just needs the import path updated if types move.

### 13. Other Files Using Demo Data
- `src/lib/generate-certificate.ts` — imports `Warranty` type only (fine)
- `src/pages/dealer/DealerSupport.tsx` — uses `demoDealers` for dealer name lookup

## Technical Details

### Files to modify (14 files):
1. `src/contexts/AuthContext.tsx` — Remove demo auth
2. `src/data/demo-data.ts` — Remove demo arrays, keep types
3. `src/pages/admin/AdminDashboard.tsx` — All real data
4. `src/pages/admin/AdminWarranties.tsx` — Use warranty store
5. `src/pages/admin/AdminRevenue.tsx` — Use warranty store + dealers from DB
6. `src/pages/admin/AdminLogs.tsx` — Use warranty store
7. `src/pages/admin/AdminDealers.tsx` — Remove demo merge
8. `src/pages/dealer/DealerDashboard.tsx` — Remove `|| "d-1"`
9. `src/pages/dealer/DealerSettings.tsx` — Fetch dealer info from DB
10. `src/pages/dealer/DealerSupport.tsx` — Fetch dealer name from DB
11. `src/pages/dealer/DealerWarrantyLine.tsx` — Remove demo dealer lookup
12. `src/pages/dealer/AddWarranty.tsx` — Fetch customers from DB
13. `src/pages/dealer/DealerCustomers.tsx` — Fetch customers from DB
14. `src/components/layouts/CustomerLayout.tsx` — Remove fallback ID

### One-time setup needed:
- Create an admin Supabase Auth account (you'll need to provide the email/password you want for your admin login)

### Pattern for dealer name resolution:
Instead of hardcoded lookups, store dealer name in user metadata (already done during approval) and access via `user.name` / fetch from `dealers` table when needed.

