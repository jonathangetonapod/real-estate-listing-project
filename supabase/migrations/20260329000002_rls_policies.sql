-- ============================================================================
-- OffMarket — Row Level Security Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitch_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitch_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbox_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbox_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_request_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.csv_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================================
-- USERS
-- ============================================================================

CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can read all users"
  ON public.users FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update all users"
  ON public.users FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can insert users"
  ON public.users FOR INSERT
  WITH CHECK (is_admin());

-- ============================================================================
-- WAITLIST
-- ============================================================================

CREATE POLICY "Anyone can insert waitlist"
  ON public.waitlist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read waitlist"
  ON public.waitlist FOR SELECT
  USING (is_admin());

-- ============================================================================
-- LEAD ORDERS
-- ============================================================================

CREATE POLICY "Agents can view own orders"
  ON public.lead_orders FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can create own orders"
  ON public.lead_orders FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Admins can manage all orders"
  ON public.lead_orders FOR ALL
  USING (is_admin());

-- ============================================================================
-- LEADS
-- ============================================================================

CREATE POLICY "Agents can view own leads"
  ON public.leads FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can update own lead status"
  ON public.leads FOR UPDATE
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Admins can manage all leads"
  ON public.leads FOR ALL
  USING (is_admin());

-- ============================================================================
-- PITCH DRAFTS
-- ============================================================================

CREATE POLICY "Agents can view own pitches"
  ON public.pitch_drafts FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can create own pitches"
  ON public.pitch_drafts FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can update own pitches"
  ON public.pitch_drafts FOR UPDATE
  USING (agent_id = auth.uid());

CREATE POLICY "Admins can view all pitches"
  ON public.pitch_drafts FOR SELECT
  USING (is_admin());

-- ============================================================================
-- PITCH SENDS
-- ============================================================================

CREATE POLICY "Agents can view own sends"
  ON public.pitch_sends FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "Admins can manage all sends"
  ON public.pitch_sends FOR ALL
  USING (is_admin());

-- ============================================================================
-- INBOX THREADS
-- ============================================================================

CREATE POLICY "Agents can view own threads"
  ON public.inbox_threads FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can update own threads"
  ON public.inbox_threads FOR UPDATE
  USING (agent_id = auth.uid());

CREATE POLICY "Admins can view all threads"
  ON public.inbox_threads FOR SELECT
  USING (is_admin());

-- ============================================================================
-- INBOX MESSAGES
-- ============================================================================

CREATE POLICY "Agents can view own thread messages"
  ON public.inbox_messages FOR SELECT
  USING (
    thread_id IN (
      SELECT id FROM public.inbox_threads WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can insert own thread messages"
  ON public.inbox_messages FOR INSERT
  WITH CHECK (
    thread_id IN (
      SELECT id FROM public.inbox_threads WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all messages"
  ON public.inbox_messages FOR SELECT
  USING (is_admin());

-- ============================================================================
-- DEALS
-- ============================================================================

CREATE POLICY "Agents can manage own deals"
  ON public.deals FOR ALL
  USING (agent_id = auth.uid());

CREATE POLICY "Admins can view all deals"
  ON public.deals FOR SELECT
  USING (is_admin());

-- ============================================================================
-- DEAL STAGE HISTORY
-- ============================================================================

CREATE POLICY "Agents can view own deal history"
  ON public.deal_stage_history FOR SELECT
  USING (
    deal_id IN (
      SELECT id FROM public.deals WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can insert own deal history"
  ON public.deal_stage_history FOR INSERT
  WITH CHECK (changed_by_user_id = auth.uid());

CREATE POLICY "Admins can view all deal history"
  ON public.deal_stage_history FOR SELECT
  USING (is_admin());

-- ============================================================================
-- LEAD REQUEST HISTORY
-- ============================================================================

CREATE POLICY "Agents can view own request history"
  ON public.lead_request_history FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM public.lead_orders WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all request history"
  ON public.lead_request_history FOR ALL
  USING (is_admin());

-- ============================================================================
-- CSV UPLOADS
-- ============================================================================

CREATE POLICY "Admins can manage uploads"
  ON public.csv_uploads FOR ALL
  USING (is_admin());

-- ============================================================================
-- ACTIVITY FEED
-- ============================================================================

CREATE POLICY "Agents can view own activity"
  ON public.activity_feed FOR SELECT
  USING (actor_user_id = auth.uid());

CREATE POLICY "Admins can view all activity"
  ON public.activity_feed FOR SELECT
  USING (is_admin());

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications"
  ON public.notifications FOR ALL
  USING (is_admin());
