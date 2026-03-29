-- ============================================================================
-- Fix RLS circular dependency causing query timeouts
-- is_admin() queries public.users → users RLS calls is_admin() → infinite loop
-- ============================================================================

-- Drop is_admin and ALL dependent policies with CASCADE
DROP FUNCTION IF EXISTS is_admin() CASCADE;

-- Recreate is_admin with plpgsql + explicit search_path to avoid RLS recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  _role text;
BEGIN
  SELECT role INTO _role FROM public.users WHERE id = auth.uid();
  RETURN _role = 'admin';
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate all admin policies that were dropped by CASCADE
-- Using is_admin() which now works without circular dependency

-- users
CREATE POLICY "Admins can read all users"
  ON public.users FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all users"
  ON public.users FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can insert users"
  ON public.users FOR INSERT WITH CHECK (is_admin());

-- waitlist
CREATE POLICY "Admins can read waitlist"
  ON public.waitlist FOR SELECT USING (is_admin());

-- lead_orders
CREATE POLICY "Admins can manage all orders"
  ON public.lead_orders FOR ALL USING (is_admin());

-- leads
CREATE POLICY "Admins can manage all leads"
  ON public.leads FOR ALL USING (is_admin());

-- pitch_drafts
CREATE POLICY "Admins can view all pitches"
  ON public.pitch_drafts FOR SELECT USING (is_admin());

-- pitch_sends
CREATE POLICY "Admins can manage all sends"
  ON public.pitch_sends FOR ALL USING (is_admin());

-- inbox_threads
CREATE POLICY "Admins can view all threads"
  ON public.inbox_threads FOR SELECT USING (is_admin());

-- inbox_messages
CREATE POLICY "Admins can view all messages"
  ON public.inbox_messages FOR SELECT USING (is_admin());

-- deals
CREATE POLICY "Admins can view all deals"
  ON public.deals FOR SELECT USING (is_admin());

-- deal_stage_history
CREATE POLICY "Admins can view all deal history"
  ON public.deal_stage_history FOR SELECT USING (is_admin());

-- lead_request_history
CREATE POLICY "Admins can manage all request history"
  ON public.lead_request_history FOR ALL USING (is_admin());

-- csv_uploads
CREATE POLICY "Admins can manage uploads"
  ON public.csv_uploads FOR ALL USING (is_admin());

-- activity_feed
CREATE POLICY "Admins can view all activity"
  ON public.activity_feed FOR SELECT USING (is_admin());

-- notifications
CREATE POLICY "Admins can manage all notifications"
  ON public.notifications FOR ALL USING (is_admin());

-- agent_domains
CREATE POLICY "Admins can manage all domains"
  ON public.agent_domains FOR ALL USING (is_admin());

-- agent_mailboxes
CREATE POLICY "Admins can manage all mailboxes"
  ON public.agent_mailboxes FOR ALL USING (is_admin());

-- winnr_mappings
CREATE POLICY "Admins can manage winnr mappings"
  ON public.winnr_mappings FOR ALL USING (is_admin());
