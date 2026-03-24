import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

import DealerLayout from "@/components/layouts/DealerLayout";
import DealerDashboard from "@/pages/dealer/DealerDashboard";
import DealerWarranties from "@/pages/dealer/DealerWarranties";
import AddWarranty from "@/pages/dealer/AddWarranty";
import DealerClaims from "@/pages/dealer/DealerClaims";
import DealerCustomers from "@/pages/dealer/DealerCustomers";
import DealerRequests from "@/pages/dealer/DealerRequests";
import DealerDocuments from "@/pages/dealer/DealerDocuments";
import DealerSettings from "@/pages/dealer/DealerSettings";

import CustomerLayout from "@/components/layouts/CustomerLayout";
import CustomerDashboard from "@/pages/customer/CustomerDashboard";
import CustomerWarranty from "@/pages/customer/CustomerWarranty";
import CustomerClaims from "@/pages/customer/CustomerClaims";
import CustomerRequests from "@/pages/customer/CustomerRequests";

import AdminLayout from "@/components/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminDealers from "@/pages/admin/AdminDealers";
import AdminWarranties from "@/pages/admin/AdminWarranties";
import AdminRevenue from "@/pages/admin/AdminRevenue";
import AdminLogs from "@/pages/admin/AdminLogs";
import AdminSettings from "@/pages/admin/AdminSettings";

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: string }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== role) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Dealer Routes */}
      <Route path="/dealer" element={<ProtectedRoute role="dealer"><DealerLayout><DealerDashboard /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/warranties" element={<ProtectedRoute role="dealer"><DealerLayout><DealerWarranties /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/warranties/new" element={<ProtectedRoute role="dealer"><DealerLayout><AddWarranty /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/claims" element={<ProtectedRoute role="dealer"><DealerLayout><DealerClaims /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/customers" element={<ProtectedRoute role="dealer"><DealerLayout><DealerCustomers /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/requests" element={<ProtectedRoute role="dealer"><DealerLayout><DealerRequests /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/documents" element={<ProtectedRoute role="dealer"><DealerLayout><DealerDocuments /></DealerLayout></ProtectedRoute>} />
      <Route path="/dealer/settings" element={<ProtectedRoute role="dealer"><DealerLayout><DealerSettings /></DealerLayout></ProtectedRoute>} />

      {/* Customer Routes */}
      <Route path="/customer" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerDashboard /></CustomerLayout></ProtectedRoute>} />
      <Route path="/customer/warranty" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerWarranty /></CustomerLayout></ProtectedRoute>} />
      <Route path="/customer/claims" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerClaims /></CustomerLayout></ProtectedRoute>} />
      <Route path="/customer/requests" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerRequests /></CustomerLayout></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/dealers" element={<ProtectedRoute role="admin"><AdminLayout><AdminDealers /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/warranties" element={<ProtectedRoute role="admin"><AdminLayout><AdminWarranties /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/revenue" element={<ProtectedRoute role="admin"><AdminLayout><AdminRevenue /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/logs" element={<ProtectedRoute role="admin"><AdminLayout><AdminLogs /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
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
);

export default App;
