import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CURRENT_DASHBOARD_TERMS_VERSION } from "@/lib/terms-config";
import { getClientIp, getUserAgent } from "@/lib/client-meta";

interface AcceptanceState {
  loading: boolean;
  hasAcceptedCurrent: boolean;
}

export function useDealerTermsAcceptance(userId: string | undefined, role: string | undefined) {
  const [state, setState] = useState<AcceptanceState>({ loading: true, hasAcceptedCurrent: false });

  const refresh = useCallback(async () => {
    if (!userId || role !== "dealer") {
      setState({ loading: false, hasAcceptedCurrent: true });
      return;
    }
    try {
      const { data } = await supabase
        .from("dealer_terms_acceptance")
        .select("dashboard_terms_version, accepted_dashboard_terms")
        .eq("user_id", userId)
        .eq("dashboard_terms_version", CURRENT_DASHBOARD_TERMS_VERSION)
        .maybeSingle();
      setState({
        loading: false,
        hasAcceptedCurrent: !!(data && data.accepted_dashboard_terms),
      });
    } catch {
      setState({ loading: false, hasAcceptedCurrent: false });
    }
  }, [userId, role]);

  useEffect(() => { refresh(); }, [refresh]);

  return { ...state, refresh };
}

export async function recordDealerAcceptance(params: { userId: string; dealerId: string }) {
  const ip = await getClientIp();
  const ua = getUserAgent();
  const payload = {
    user_id: params.userId,
    dealer_id: params.dealerId || "unknown",
    accepted_dashboard_terms: true,
    accepted_dashboard_terms_at: new Date().toISOString(),
    dashboard_terms_version: CURRENT_DASHBOARD_TERMS_VERSION,
    dashboard_ip_address: ip,
    dashboard_user_agent: ua,
  };
  // Upsert by (user_id, dashboard_terms_version)
  const { error } = await supabase
    .from("dealer_terms_acceptance")
    .upsert(payload, { onConflict: "user_id,dashboard_terms_version" });
  if (error) throw error;
}
