-- ============================================================================
-- OffMarket — Email Accounts Schema
-- Agent domains, mailboxes, and Winnr mappings
-- ============================================================================

CREATE TYPE domain_status AS ENUM ('provisioning', 'active', 'suspended');
CREATE TYPE mailbox_status AS ENUM ('active', 'suspended');

-- ============================================================================
-- Agent Domains
-- ============================================================================

CREATE TABLE public.agent_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL,
  status domain_status NOT NULL DEFAULT 'provisioning',
  mx_verified BOOLEAN DEFAULT FALSE,
  spf_verified BOOLEAN DEFAULT FALSE,
  dkim_verified BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  price DECIMAL(10,2),
  winnr_domain_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_agent_domains_agent ON public.agent_domains(agent_id);
CREATE INDEX idx_agent_domains_name ON public.agent_domains(domain_name);

-- ============================================================================
-- Agent Mailboxes
-- ============================================================================

CREATE TABLE public.agent_mailboxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  domain_id UUID NOT NULL REFERENCES public.agent_domains(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  username TEXT NOT NULL,
  status mailbox_status NOT NULL DEFAULT 'active',
  daily_limit INT NOT NULL DEFAULT 10,
  sent_today INT NOT NULL DEFAULT 0,
  total_sent INT NOT NULL DEFAULT 0,
  health_score INT NOT NULL DEFAULT 0,
  inbox_rate DECIMAL(5,2) DEFAULT 0,
  winnr_user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agent_mailboxes_agent ON public.agent_mailboxes(agent_id, status);
CREATE INDEX idx_agent_mailboxes_domain ON public.agent_mailboxes(domain_id);
CREATE UNIQUE INDEX idx_agent_mailboxes_email ON public.agent_mailboxes(email);

-- ============================================================================
-- Winnr Mappings (admin-only, invisible to agents)
-- ============================================================================

CREATE TABLE public.winnr_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  local_id UUID NOT NULL,
  winnr_id TEXT,
  instantly_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_winnr_mappings_local ON public.winnr_mappings(local_id);
CREATE INDEX idx_winnr_mappings_agent ON public.winnr_mappings(agent_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE public.agent_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_mailboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winnr_mappings ENABLE ROW LEVEL SECURITY;

-- Agent Domains: agents see only their own
CREATE POLICY "Agents can view own domains"
  ON public.agent_domains FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can insert own domains"
  ON public.agent_domains FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Admins can manage all domains"
  ON public.agent_domains FOR ALL
  USING (is_admin());

-- Agent Mailboxes: agents see only their own
CREATE POLICY "Agents can view own mailboxes"
  ON public.agent_mailboxes FOR SELECT
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can insert own mailboxes"
  ON public.agent_mailboxes FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can update own mailboxes"
  ON public.agent_mailboxes FOR UPDATE
  USING (agent_id = auth.uid());

CREATE POLICY "Admins can manage all mailboxes"
  ON public.agent_mailboxes FOR ALL
  USING (is_admin());

-- Winnr Mappings: admins only
CREATE POLICY "Admins can manage winnr mappings"
  ON public.winnr_mappings FOR ALL
  USING (is_admin());

-- ============================================================================
-- Daily send counter reset function (run via cron)
-- ============================================================================

CREATE OR REPLACE FUNCTION reset_daily_send_counts()
RETURNS void AS $$
BEGIN
  UPDATE public.agent_mailboxes SET sent_today = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
