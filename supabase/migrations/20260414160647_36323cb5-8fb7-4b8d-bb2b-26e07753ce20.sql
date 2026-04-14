
-- ============================================================
-- 1. SUPPORT TICKETS
-- ============================================================
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dealer_id TEXT NOT NULL,
  dealer_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'medium',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Support tickets viewable by dealer and admin"
  ON public.support_tickets FOR SELECT
  USING (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = support_tickets.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE POLICY "Support tickets insertable by dealer and admin"
  ON public.support_tickets FOR INSERT
  WITH CHECK (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = support_tickets.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE POLICY "Support tickets updatable by dealer and admin"
  ON public.support_tickets FOR UPDATE
  USING (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = support_tickets.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 2. COVER TEMPLATES
-- ============================================================
CREATE TABLE public.cover_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dealer_id TEXT NOT NULL,
  name TEXT NOT NULL,
  covered_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  conditional_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  excluded_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cover_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cover templates viewable by dealer and admin"
  ON public.cover_templates FOR SELECT
  USING (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = cover_templates.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE POLICY "Cover templates insertable by dealer and admin"
  ON public.cover_templates FOR INSERT
  WITH CHECK (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = cover_templates.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE POLICY "Cover templates updatable by dealer and admin"
  ON public.cover_templates FOR UPDATE
  USING (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = cover_templates.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE POLICY "Cover templates deletable by dealer and admin"
  ON public.cover_templates FOR DELETE
  USING (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = cover_templates.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE TRIGGER update_cover_templates_updated_at
  BEFORE UPDATE ON public.cover_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 3. DISPUTE CASES
-- ============================================================
CREATE TABLE public.dispute_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dealer_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  complaint_type TEXT NOT NULL,
  sale_date DATE NOT NULL,
  issue_date DATE NOT NULL,
  mileage_at_sale INTEGER NOT NULL DEFAULT 0,
  mileage_now INTEGER NOT NULL DEFAULT 0,
  drivable TEXT NOT NULL DEFAULT 'yes',
  repairs_authorised TEXT NOT NULL DEFAULT 'no',
  warranty_status TEXT NOT NULL DEFAULT 'none',
  customer_summary TEXT NOT NULL DEFAULT '',
  customer_name TEXT NOT NULL DEFAULT '',
  vehicle_reg TEXT NOT NULL DEFAULT '',
  issue_classification TEXT,
  cra_window TEXT,
  cra_explanation TEXT,
  ai_summary TEXT,
  ai_position TEXT,
  ai_risk_level TEXT,
  ai_approach TEXT,
  ai_tone_recommendation TEXT,
  risk_alerts JSONB DEFAULT '[]'::jsonb,
  escalation_flags JSONB DEFAULT '[]'::jsonb,
  responses JSONB,
  response_score JSONB,
  selected_response TEXT,
  edited_response TEXT,
  strategy_do_nots JSONB DEFAULT '[]'::jsonb,
  strategy_key_risks JSONB DEFAULT '[]'::jsonb,
  strategy_suggested_stance TEXT,
  notes TEXT,
  outcome TEXT,
  linked_claim_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dispute_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dispute cases viewable by dealer and admin"
  ON public.dispute_cases FOR SELECT
  USING (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = dispute_cases.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE POLICY "Dispute cases insertable by dealer and admin"
  ON public.dispute_cases FOR INSERT
  WITH CHECK (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = dispute_cases.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE POLICY "Dispute cases updatable by dealer and admin"
  ON public.dispute_cases FOR UPDATE
  USING (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = dispute_cases.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE POLICY "Dispute cases deletable by dealer and admin"
  ON public.dispute_cases FOR DELETE
  USING (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = dispute_cases.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE TRIGGER update_dispute_cases_updated_at
  BEFORE UPDATE ON public.dispute_cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 4. DEALER SETTINGS
-- ============================================================
CREATE TABLE public.dealer_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dealer_id TEXT NOT NULL UNIQUE,
  monthly_sales_target INTEGER NOT NULL DEFAULT 10,
  max_labour_rate INTEGER NOT NULL DEFAULT 75,
  max_per_claim_limit INTEGER NOT NULL DEFAULT 2500,
  free_warranties_total INTEGER NOT NULL DEFAULT 5,
  free_warranties_used INTEGER NOT NULL DEFAULT 0,
  smart_contribution_mode TEXT NOT NULL DEFAULT 'recommend',
  last_recommendation_date TIMESTAMP WITH TIME ZONE,
  dismissed_recommendation_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dealer_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dealer settings viewable by dealer and admin"
  ON public.dealer_settings FOR SELECT
  USING (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = dealer_settings.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE POLICY "Dealer settings insertable by dealer and admin"
  ON public.dealer_settings FOR INSERT
  WITH CHECK (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = dealer_settings.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE POLICY "Dealer settings updatable by dealer and admin"
  ON public.dealer_settings FOR UPDATE
  USING (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = dealer_settings.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE TRIGGER update_dealer_settings_updated_at
  BEFORE UPDATE ON public.dealer_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 5. WARRANTY LINES
-- ============================================================
CREATE TABLE public.warranty_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dealer_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'not_active',
  phone_number TEXT,
  greeting_message TEXT NOT NULL DEFAULT '',
  forwarding_number TEXT NOT NULL DEFAULT '',
  ivr_enabled BOOLEAN NOT NULL DEFAULT true,
  option1_label TEXT NOT NULL DEFAULT 'New Claim',
  option2_label TEXT NOT NULL DEFAULT 'Existing Claim',
  option3_label TEXT NOT NULL DEFAULT '',
  hold_music_type TEXT NOT NULL DEFAULT 'default',
  voicemail_enabled BOOLEAN NOT NULL DEFAULT false,
  voicemail_email TEXT NOT NULL DEFAULT '',
  business_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.warranty_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Warranty lines viewable by dealer and admin"
  ON public.warranty_lines FOR SELECT
  USING (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = warranty_lines.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE POLICY "Warranty lines insertable by dealer and admin"
  ON public.warranty_lines FOR INSERT
  WITH CHECK (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = warranty_lines.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE POLICY "Warranty lines updatable by dealer and admin"
  ON public.warranty_lines FOR UPDATE
  USING (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = warranty_lines.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE POLICY "Warranty lines deletable by dealer and admin"
  ON public.warranty_lines FOR DELETE
  USING (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.dealer_id = warranty_lines.dealer_id))
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE TRIGGER update_warranty_lines_updated_at
  BEFORE UPDATE ON public.warranty_lines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 6. NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (
    user_id = auth.uid()::text
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );

CREATE POLICY "Notifications insertable by authenticated users"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (
    user_id = auth.uid()::text
    OR (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'))
  );
