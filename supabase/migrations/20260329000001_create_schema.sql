-- ============================================================================
-- OffMarket — Supabase Schema Migration
-- Phase 1: MVP Tables
-- ============================================================================

-- Custom types
CREATE TYPE user_role AS ENUM ('agent', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'trial', 'expired', 'suspended');
CREATE TYPE user_plan AS ENUM ('starter', 'pro');
CREATE TYPE order_status AS ENUM ('pending', 'in_progress', 'completed', 'rejected');
CREATE TYPE pitch_status AS ENUM ('new', 'draft', 'sent', 'skipped');
CREATE TYPE delivery_status AS ENUM ('pending', 'sent', 'bounced', 'spam');
CREATE TYPE thread_status AS ENUM ('new', 'read', 'archived');
CREATE TYPE sentiment_label AS ENUM ('interested', 'warm', 'not-interested', 'meeting-set', 'follow-up', 'closed');
CREATE TYPE message_sender AS ENUM ('agent', 'seller', 'system');
CREATE TYPE deal_stage AS ENUM ('Positive Reply', 'Following Up', 'Meeting Scheduled', 'Nurturing', 'Closed');
CREATE TYPE request_event AS ENUM ('Submitted', 'Processing', 'Leads Uploaded', 'Agent Notified', 'Rejected', 'Completed');
CREATE TYPE upload_status AS ENUM ('uploaded', 'processing', 'completed', 'error');
CREATE TYPE activity_type AS ENUM ('lead_requested', 'leads_uploaded', 'pitch_generated', 'email_sent', 'reply_received', 'deal_created', 'deal_advanced', 'subscription_activated', 'subscription_expired');

-- ============================================================================
-- 1. USERS (extends Supabase Auth)
-- ============================================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  initials TEXT,
  role user_role NOT NULL DEFAULT 'agent',
  status user_status NOT NULL DEFAULT 'trial',
  plan user_plan NOT NULL DEFAULT 'starter',
  leads_per_month INT NOT NULL DEFAULT 100,
  market TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

CREATE INDEX idx_users_role_status ON public.users(role, status);
CREATE INDEX idx_users_email ON public.users(email);

-- ============================================================================
-- 2. WAITLIST
-- ============================================================================

CREATE TABLE public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  zip_code TEXT,
  status TEXT NOT NULL DEFAULT 'waitlist',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  claimed_at TIMESTAMPTZ,
  UNIQUE(email, zip_code)
);

CREATE INDEX idx_waitlist_zip_status ON public.waitlist(zip_code, status);

-- ============================================================================
-- 3. LEAD ORDERS
-- ============================================================================

CREATE TABLE public.lead_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  zip_codes TEXT[] NOT NULL DEFAULT '{}',
  lead_types TEXT[] NOT NULL DEFAULT '{}',
  price_min BIGINT,
  price_max BIGINT,
  quantity_requested INT NOT NULL DEFAULT 250,
  quantity_delivered INT,
  notes TEXT,
  status order_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

CREATE INDEX idx_lead_orders_agent_status ON public.lead_orders(agent_id, status);
CREATE INDEX idx_lead_orders_status_date ON public.lead_orders(status, requested_at DESC);

-- ============================================================================
-- 4. LEADS
-- ============================================================================

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.lead_orders(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Property data
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  property_type TEXT,
  sqft INT,
  bed_count INT,
  bath_count INT,
  year_built INT,
  lot_size_acres DECIMAL(10,4),
  zoning_code TEXT,
  county TEXT,

  -- Financial data
  list_price BIGINT,
  sold_price BIGINT,
  loan_amount BIGINT,
  lender TEXT,
  loan_type TEXT,
  interest_rate DECIMAL(5,2),
  total_parcel_value BIGINT,
  improvement_value BIGINT,
  land_value BIGINT,
  tax_bill BIGINT,
  tax_year INT,

  -- Owner & contact
  owner_name TEXT,
  owner_name_2 TEXT,
  mailing_address TEXT,
  phones TEXT[] DEFAULT '{}',
  emails TEXT[] DEFAULT '{}',

  -- Lead categorization
  lead_type TEXT,
  days_on_market INT,
  days_expired INT,
  nod_date DATE,
  is_probate BOOLEAN DEFAULT FALSE,
  absentee_owner BOOLEAN DEFAULT FALSE,

  -- Lead status
  pitch_status pitch_status NOT NULL DEFAULT 'new',
  pitch_sent_at TIMESTAMPTZ,
  was_contacted BOOLEAN DEFAULT FALSE,
  is_skipped BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_leads_agent_status ON public.leads(agent_id, pitch_status);
CREATE INDEX idx_leads_order ON public.leads(order_id);
CREATE INDEX idx_leads_zip_type ON public.leads(zip_code, lead_type);
CREATE INDEX idx_leads_created ON public.leads(created_at DESC);

-- ============================================================================
-- 5. PITCH DRAFTS (3-step sequences)
-- ============================================================================

CREATE TABLE public.pitch_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status pitch_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_edited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ,

  -- Step 1: Initial Outreach
  step_1_subject TEXT,
  step_1_body TEXT,
  step_1_variation_active INT DEFAULT 0,

  -- Step 2: Follow-Up (Day 3)
  step_2_body TEXT,
  step_2_variation_active INT DEFAULT 0,

  -- Step 3: Final Touch (Day 7)
  step_3_body TEXT,
  step_3_variation_active INT DEFAULT 0,

  UNIQUE(lead_id)
);

CREATE INDEX idx_pitch_drafts_agent_status ON public.pitch_drafts(agent_id, status);
CREATE INDEX idx_pitch_drafts_lead ON public.pitch_drafts(lead_id);

-- ============================================================================
-- 6. PITCH SENDS (email audit log)
-- ============================================================================

CREATE TABLE public.pitch_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID NOT NULL REFERENCES public.pitch_drafts(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  step_number INT NOT NULL CHECK (step_number BETWEEN 1 AND 3),
  email_to TEXT NOT NULL,
  email_from TEXT,
  subject_line TEXT,
  body_text TEXT NOT NULL,
  variant_used TEXT CHECK (variant_used IN ('A', 'B', 'C')),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ,
  delivery_status delivery_status NOT NULL DEFAULT 'pending',
  opened_at TIMESTAMPTZ,
  opened_count INT DEFAULT 0
);

CREATE INDEX idx_pitch_sends_agent ON public.pitch_sends(agent_id, sent_at DESC);
CREATE INDEX idx_pitch_sends_lead_step ON public.pitch_sends(lead_id, step_number);
CREATE INDEX idx_pitch_sends_delivery ON public.pitch_sends(delivery_status);

-- ============================================================================
-- 7. INBOX THREADS
-- ============================================================================

CREATE TABLE public.inbox_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject_line TEXT,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status thread_status NOT NULL DEFAULT 'new',
  label_sentiment sentiment_label,
  custom_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  moved_to_deals_at TIMESTAMPTZ
);

CREATE INDEX idx_threads_agent_status ON public.inbox_threads(agent_id, status, last_message_at DESC);
CREATE INDEX idx_threads_agent_label ON public.inbox_threads(agent_id, label_sentiment);
CREATE INDEX idx_threads_lead ON public.inbox_threads(lead_id);

-- ============================================================================
-- 8. INBOX MESSAGES
-- ============================================================================

CREATE TABLE public.inbox_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.inbox_threads(id) ON DELETE CASCADE,
  from_type message_sender NOT NULL,
  from_name TEXT NOT NULL,
  from_email TEXT,
  body_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reply_to_message_id UUID REFERENCES public.inbox_messages(id)
);

CREATE INDEX idx_messages_thread ON public.inbox_messages(thread_id, created_at);

-- ============================================================================
-- 9. DEALS
-- ============================================================================

CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  thread_id UUID REFERENCES public.inbox_threads(id) ON DELETE SET NULL,
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  price TEXT,
  source TEXT DEFAULT 'manual',
  stage deal_stage NOT NULL DEFAULT 'Positive Reply',
  stage_entered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  next_action_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  closed_with_listing BOOLEAN DEFAULT FALSE,
  listing_price BIGINT
);

CREATE INDEX idx_deals_agent_stage ON public.deals(agent_id, stage);
CREATE INDEX idx_deals_agent_action ON public.deals(agent_id, next_action_date);
CREATE UNIQUE INDEX idx_deals_lead ON public.deals(lead_id) WHERE lead_id IS NOT NULL;

-- ============================================================================
-- 10. DEAL STAGE HISTORY
-- ============================================================================

CREATE TABLE public.deal_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  from_stage deal_stage,
  to_stage deal_stage NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by_user_id UUID REFERENCES public.users(id),
  reason TEXT
);

CREATE INDEX idx_deal_history ON public.deal_stage_history(deal_id, changed_at);

-- ============================================================================
-- 11. LEAD REQUEST HISTORY
-- ============================================================================

CREATE TABLE public.lead_request_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.lead_orders(id) ON DELETE CASCADE,
  status request_event NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by_admin_id UUID REFERENCES public.users(id),
  detail_text TEXT,
  rejection_reason TEXT
);

CREATE INDEX idx_request_history_order ON public.lead_request_history(order_id, changed_at DESC);

-- ============================================================================
-- 12. CSV UPLOADS
-- ============================================================================

CREATE TABLE public.csv_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.lead_orders(id) ON DELETE CASCADE,
  uploaded_by_admin_id UUID NOT NULL REFERENCES public.users(id),
  file_name TEXT NOT NULL,
  file_size BIGINT,
  row_count INT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  status upload_status NOT NULL DEFAULT 'uploaded',
  error_message TEXT,
  storage_path TEXT
);

CREATE INDEX idx_csv_uploads_order ON public.csv_uploads(order_id);

-- ============================================================================
-- 13. ACTIVITY FEED
-- ============================================================================

CREATE TABLE public.activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action_type activity_type NOT NULL,
  subject_id UUID,
  subject_type TEXT,
  detail_text TEXT NOT NULL,
  is_highlighted BOOLEAN DEFAULT FALSE,
  is_warning BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_actor ON public.activity_feed(actor_user_id, created_at DESC);
CREATE INDEX idx_activity_type ON public.activity_feed(action_type, created_at DESC);

-- ============================================================================
-- 14. NOTIFICATIONS
-- ============================================================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, read_at, created_at DESC);

-- ============================================================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
