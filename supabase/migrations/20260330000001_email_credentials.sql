-- Add email credentials table (service role only, agent never sees)
CREATE TABLE IF NOT EXISTS public.email_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mailbox_id UUID REFERENCES public.agent_mailboxes(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  imap_password TEXT NOT NULL,
  imap_host TEXT NOT NULL DEFAULT 'inbound.winnr.app',
  imap_port INTEGER NOT NULL DEFAULT 993,
  smtp_host TEXT NOT NULL DEFAULT 'inbound.winnr.app',
  smtp_port INTEGER NOT NULL DEFAULT 465,
  bison_sender_id INTEGER,
  bison_campaign_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- No RLS for agents — only service role can access this table
ALTER TABLE public.email_credentials ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write (no agent-facing policies)
-- This means the anon/authenticated roles cannot access this table at all

-- Index for lookups
CREATE INDEX idx_email_credentials_agent ON public.email_credentials(agent_id);
CREATE INDEX idx_email_credentials_email ON public.email_credentials(email);
