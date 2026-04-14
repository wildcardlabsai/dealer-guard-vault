
-- Fix audit_log INSERT to require authentication
DROP POLICY "Audit log insertable" ON public.audit_log;
CREATE POLICY "Authenticated users can insert audit log" ON public.audit_log FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
