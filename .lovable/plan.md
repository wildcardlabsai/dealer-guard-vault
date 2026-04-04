

# Dedicated `/customers` and `/dealers` Login Pages

## Overview
Create two dedicated entry-point pages at `/customers` and `/dealers`. Each shows role-specific branding and a login form. When already authenticated with the correct role, redirect straight to the dashboard. All existing `/dealer/*` and `/customer/*` routes remain unchanged.

## New Files

### 1. `src/pages/CustomersLoginPage.tsx`
- SEOHead: "Customer Login | WarrantyVault"
- Customer-focused messaging: "View your warranty, track claims, download certificates"
- Login form (reuses same `useAuth` login logic)
- On success: validates role is `customer`, navigates to `/customer`
- Shows error if dealer/admin credentials used
- Link to `/dealers` for wrong portal

### 2. `src/pages/DealersLoginPage.tsx`
- SEOHead: "Dealer Login | WarrantyVault"
- Dealer-focused messaging: "Manage warranties, handle claims, grow your business"
- Login form validates role is `dealer`, navigates to `/dealer`
- Shows error if customer/admin credentials used
- Links to `/signup` and `/customers`

## Edited Files

### 3. `src/App.tsx`
- Import both new pages
- Add routes:
  - `/customers` — if authenticated as customer, redirect to `/customer`; otherwise show `CustomersLoginPage`
  - `/dealers` — if authenticated as dealer, redirect to `/dealer`; otherwise show `DealersLoginPage`
- Update `ProtectedRoute`: redirect unauthenticated customer routes to `/customers`, dealer routes to `/dealers`

### 4. `public/sitemap.xml`
- Add `/customers` and `/dealers` URLs

## Routing Logic
- `/customers` = public login page for customers (redirects to `/customer` dashboard if already logged in)
- `/dealers` = public login page for dealers (redirects to `/dealer` dashboard if already logged in)
- Existing `/customer/*` and `/dealer/*` protected routes stay as-is but redirect to `/customers` or `/dealers` when not authenticated

