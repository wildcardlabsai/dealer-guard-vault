import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import CustomersLoginPage from "@/pages/CustomersLoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import DealersLoginPage from "@/pages/DealersLoginPage";
import NotFound from "@/pages/NotFound";
import BlogArticlePage from "@/pages/BlogArticlePage";
import FeaturesPage from "@/pages/FeaturesPage";
import WarrantyLinePage from "@/pages/WarrantyLinePage";
import FAQPage from "@/pages/FAQPage";
import BlogIndexPage from "@/pages/BlogIndexPage";

import DealerLayout from "@/components/layouts/DealerLayout";
import DealerDashboard from "@/pages/dealer/DealerDashboard";
import DealerWarranties from "@/pages/dealer/DealerWarranties";
import AddWarranty from "@/pages/dealer/AddWarranty";
import DealerClaims from "@/pages/dealer/DealerClaims";
import DealerCustomers from "@/pages/dealer/DealerCustomers";
import DealerRequests from "@/pages/dealer/DealerRequests";
import DealerDocuments from "@/pages/dealer/DealerDocuments";
import DealerSettings from "@/pages/dealer/DealerSettings";
import DealerWarrantyLine from "@/pages/dealer/DealerWarrantyLine";
import DealerCoverTemplates from "@/pages/dealer/DealerCoverTemplates";
import DealerClaimAssist from "@/pages/dealer/DealerClaimAssist";
import DealerClaimSettings from "@/pages/dealer/DealerClaimSettings";
import DealerSupport from "@/pages/dealer/DealerSupport";

import CustomerLayout from "@/components/layouts/CustomerLayout";
import CustomerDashboard from "@/pages/customer/CustomerDashboard";
import CustomerWarranty from "@/pages/customer/CustomerWarranty";
import CustomerCover from "@/pages/customer/CustomerCover";
import CustomerClaimsEnhanced from "@/pages/customer/CustomerClaimsEnhanced";
import CustomerClaimSubmit from "@/pages/customer/CustomerClaimSubmit";
import CustomerRequests from "@/pages/customer/CustomerRequests";

import AdminLayout from "@/components/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminDealers from "@/pages/admin/AdminDealers";
import AdminSignupRequests from "@/pages/admin/AdminSignupRequests";
import AdminWarranties from "@/pages/admin/AdminWarranties";
import AdminRevenue from "@/pages/admin/AdminRevenue";
import AdminLogs from "@/pages/admin/AdminLogs";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminClaims from "@/pages/admin/AdminClaims";
import AdminSupport from "@/pages/admin/AdminSupport";

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: string }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    if (role === "customer") return <Navigate to="/customers" replace />;
    if (role === "dealer") return <Navigate to="/dealers" replace />;
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== role) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/warranty-line" element={<WarrantyLinePage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/blog" element={<BlogIndexPage />} />
      <Route path="/blog/:slug" element={<BlogArticlePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/customers" element={<CustomersLoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/dealers" element={<DealersLoginPage />} />

      {/* Dealer Routes */}
      <Route path="/dealer" element={<ProtectedRoute role="dealer"><DealerLayout><DealerDashboard /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/warranties" element={<ProtectedRoute role="dealer"><DealerLayout><DealerWarranties /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/warranties/new" element={<ProtectedRoute role="dealer"><DealerLayout><AddWarranty /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/claims" element={<ProtectedRoute role="dealer"><DealerLayout><DealerClaims /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/customers" element={<ProtectedRoute role="dealer"><DealerLayout><DealerCustomers /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/requests" element={<ProtectedRoute role="dealer"><DealerLayout><DealerRequests /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/warranty-line" element={<ProtectedRoute role="dealer"><DealerLayout><DealerWarrantyLine /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/documents" element={<ProtectedRoute role="dealer"><DealerLayout><DealerDocuments /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/settings" element={<ProtectedRoute role="dealer"><DealerLayout><DealerSettings /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/cover-templates" element={<ProtectedRoute role="dealer"><DealerLayout><DealerCoverTemplates /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/claim-assist" element={<ProtectedRoute role="dealer"><DealerLayout><DealerClaimAssist /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/claim-settings" element={<ProtectedRoute role="dealer"><DealerLayout><DealerClaimSettings /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/support" element={<ProtectedRoute role="dealer"><DealerLayout><DealerSupport /></DealerLayout></ProtectedRoute>} />

      {/* Customer Routes */}
      <Route path="/customer" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerDashboard /></CustomerLayout></ProtectedRoute>} />
      <Route path="/customer/warranty" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerWarranty /></CustomerLayout></ProtectedRoute>} />
      <Route path="/customer/cover" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerCover /></CustomerLayout></ProtectedRoute>} />
      <Route path="/customer/claims" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerClaimsEnhanced /></CustomerLayout></ProtectedRoute>} />
      <Route path="/customer/claims/new" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerClaimSubmit /></CustomerLayout></ProtectedRoute>} />
      <Route path="/customer/requests" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerRequests /></CustomerLayout></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/dealers" element={<ProtectedRoute role="admin"><AdminLayout><AdminDealers /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/signup-requests" element={<ProtectedRoute role="admin"><AdminLayout><AdminSignupRequests /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/warranties" element={<ProtectedRoute role="admin"><AdminLayout><AdminWarranties /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/claims" element={<ProtectedRoute role="admin"><AdminLayout><AdminClaims /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/revenue" element={<ProtectedRoute role="admin"><AdminLayout><AdminRevenue /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/logs" element={<ProtectedRoute role="admin"><AdminLayout><AdminLogs /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/support" element={<ProtectedRoute role="admin"><AdminLayout><AdminSupport /></AdminLayout></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
