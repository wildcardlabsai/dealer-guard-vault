import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDealerTermsAcceptance } from "@/lib/dealer-terms-acceptance";

/**
 * Wraps dealer dashboard routes. If the dealer hasn't accepted the current
 * dashboard terms version, redirect to /accept-terms.
 */
export default function DealerTermsGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { loading, hasAcceptedCurrent } = useDealerTermsAcceptance(user?.id, user?.role);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!hasAcceptedCurrent) {
    return <Navigate to="/accept-terms" replace />;
  }

  return <>{children}</>;
}
