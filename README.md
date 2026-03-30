# OffMarket

SaaS platform delivering exclusive, AI-personalized seller leads to real estate agents. $99/month per agent, 5-agent limit per zip code.

## What It Does

Agents get 250 verified seller leads per month with AI-drafted 3-step email sequences sent from dedicated sending domains. Replies flow into an in-app inbox, and interested sellers move into a deal pipeline.

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS 4 + Framer Motion
- **Database**: Supabase (PostgreSQL + Auth + Edge Functions + RLS)
- **Email Infrastructure**: Winnr API (domains, mailboxes, DNS, warming)
- **Campaign Sending**: Bison/EmailBison (sequences, inbox, reply tracking)
- **Auth**: Supabase Auth (email/password + Google OAuth)
- **Deployment**: Railway (Node.js static server)

## Architecture

```
Agent App (/app)          Admin Dashboard (/admin)
      |                          |
      v                          v
   Supabase (PostgreSQL + Auth + RLS)
      |
      v
   Edge Functions
      |
   +---------+---------+
   |                   |
   v                   v
 Winnr API         Bison API
 (domains,         (campaigns,
  mailboxes,        sending,
  warming)          replies)
```

## App Structure

### Agent-Facing (`/app`)
- **Dashboard** -- Metrics, pending actions, recent activity
- **Email Accounts** -- Buy domain, create mailboxes (Winnr + Bison behind the scenes)
- **Order New Leads** -- Pick zip codes, lead types, price range
- **Seller Leads** -- Browse leads by order, view property/financial/contact data
- **Generate Pitch** -- 3-step email sequence with A/B/C variations per step
- **Pitches Sent** -- Sequence timeline, delivery status per step
- **Inbox** -- Threaded conversations, sentiment labels, reply composer
- **My Deals** -- Kanban pipeline (Positive Reply -> Following Up -> Meeting -> Nurturing -> Closed)
- **Settings** -- Profile, email signature, logout

### Admin-Facing (`/admin`)
- **Dashboard** -- Active agents, pending requests, leads delivered, revenue
- **Agents** -- Manage agent accounts, plans, status
- **Lead Requests** -- Review/approve/reject lead orders
- **Upload Leads** -- CSV upload with preview, quality scoring, agent assignment
- **Payments** -- (placeholder)
- **Settings** -- (placeholder)

### Public Pages
- **Landing Page** (`/`) -- Hero, how it works, pricing, FAQ, interactive mockup
- **Login** (`/login`) -- Email/password + Google OAuth
- **Sign Up** (`/signup`) -- Full registration flow
- **Waitlist** (`/waitlist`) -- Email + zip code capture

## Database (Supabase)

18 tables with full RLS:

| Category | Tables |
|----------|--------|
| Core | users, waitlist, lead_orders, leads |
| Pitches | pitch_drafts, pitch_sends |
| Inbox | inbox_threads, inbox_messages |
| Deals | deals, deal_stage_history |
| Email Infra | agent_domains, agent_mailboxes, email_credentials, winnr_mappings |
| Admin | lead_request_history, csv_uploads, activity_feed, notifications |

## Email Pipeline

When an agent creates mailboxes, a Supabase Edge Function orchestrates:

1. **Winnr**: Bulk create mailboxes on agent's domain
2. **Winnr**: Export CSV (gets IMAP/SMTP passwords)
3. **Transform**: Winnr CSV format -> Bison CSV format
4. **Bison**: Upload sender emails
5. **Bison**: Create campaign + attach sender emails
6. **Supabase**: Save mailboxes, credentials, and mappings

API keys stored as Supabase secrets. Agent never sees Winnr or Bison.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build & Deploy

```bash
npm run build      # Vite -> dist/
npm start          # node server.js (serves dist/ on Railway)
```

## Environment

Supabase URL and anon key are in `src/lib/supabase.js`. Winnr and Bison API keys are stored as Supabase Edge Function secrets.
