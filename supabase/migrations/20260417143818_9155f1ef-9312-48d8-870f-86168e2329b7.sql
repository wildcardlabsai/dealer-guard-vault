-- Add signup acceptance tracking to signup_requests
ALTER TABLE public.signup_requests
  ADD COLUMN IF NOT EXISTS accepted_signup_terms boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS accepted_signup_terms_at timestamptz,
  ADD COLUMN IF NOT EXISTS signup_terms_version text,
  ADD COLUMN IF NOT EXISTS signup_ip_address text,
  ADD COLUMN IF NOT EXISTS signup_user_agent text;

-- Create dealer_terms_acceptance table
CREATE TABLE IF NOT EXISTS public.dealer_terms_acceptance (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dealer_id text NOT NULL,
  user_id uuid NOT NULL,
  accepted_dashboard_terms boolean NOT NULL DEFAULT false,
  accepted_dashboard_terms_at timestamptz,
  dashboard_terms_version text NOT NULL,
  dashboard_ip_address text,
  dashboard_user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, dashboard_terms_version)
);

CREATE INDEX IF NOT EXISTS idx_dealer_terms_acceptance_user
  ON public.dealer_terms_acceptance (user_id);
CREATE INDEX IF NOT EXISTS idx_dealer_terms_acceptance_dealer
  ON public.dealer_terms_acceptance (dealer_id);

ALTER TABLE public.dealer_terms_acceptance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own acceptance"
  ON public.dealer_terms_acceptance
  FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Users can insert own acceptance"
  ON public.dealer_terms_acceptance
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own acceptance"
  ON public.dealer_terms_acceptance
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_dealer_terms_acceptance_updated_at
  BEFORE UPDATE ON public.dealer_terms_acceptance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();