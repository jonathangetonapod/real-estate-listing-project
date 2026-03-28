# Roadmap: OffMarket

## Overview

OffMarket is a brownfield project -- the React landing page and waitlist already exist and are deployed on Railway. The roadmap adds a complete backend (Supabase for database + auth, Instantly.ai for email sending, AI API for draft generation) and two new frontend surfaces (admin dashboard, agent dashboard). The four phases progress from foundational infrastructure through the complete lead-to-reply workflow, delivering an MVP that can serve the first 5-10 paying agents.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation, Auth, and Lead Ingestion** - Supabase backend, authentication for admin and agents, CSV lead upload, lead assignment, payment gating
- [ ] **Phase 2: AI Email Generation and Agent Workflow** - AI-drafted pitches from lead data, agent review/edit/approve flow, pipeline view
- [ ] **Phase 3: Sending and Delivery Tracking** - Instantly.ai integration, email queuing, delivery/open tracking, follow-up sequences
- [ ] **Phase 4: Reply Management and Pipeline Completion** - Reply ingestion from Instantly, in-app inbox, agent replies, full pipeline lifecycle

## Phase Details

### Phase 1: Foundation, Auth, and Lead Ingestion
**Goal**: Admin can create agent accounts, upload leads, and gate access by payment status. Agents can log in, see their assigned leads, and filter by lead type.
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, LEAD-01, LEAD-02, LEAD-03, LEAD-04, LEAD-05, LEAD-06, PAY-01, PAY-02, PAY-03
**Success Criteria** (what must be TRUE):
  1. Admin can log in, create an agent account, and that agent can log in with the provided credentials and stay logged in across browser refresh
  2. Admin can upload a PropStream CSV file and the system parses it into individual lead records with correct property data (address, price, equity, days on market, lead type)
  3. Admin can assign uploaded leads to a specific agent, and that agent sees only their assigned leads in the dashboard
  4. Agent can filter their leads by type (expired, FSBO, pre-foreclosure, absentee, high equity, probate) and see each lead's current pipeline status
  5. Agent whose payment status is expired cannot access the dashboard; admin can generate a Stripe payment link and mark an agent as active after payment
**Plans**: TBD

Plans:
- [ ] 01-01: TBD
- [ ] 01-02: TBD
- [ ] 01-03: TBD

### Phase 2: AI Email Generation and Agent Workflow
**Goal**: Every lead gets an AI-drafted email pitch that references its specific property data, and agents can review, edit, approve, skip, or batch-approve emails from their dashboard.
**Depends on**: Phase 1
**Requirements**: EMAIL-01, EMAIL-02, EMAIL-03, EMAIL-04, EMAIL-05, EMAIL-06, PIPE-01, PIPE-02, PIPE-03
**Success Criteria** (what must be TRUE):
  1. System generates a property-specific email draft for a lead that references the address, asking price, nearby comps, days on market, and equity
  2. Agent can view the AI draft for any lead, edit the text, and approve it -- or skip the lead entirely
  3. Agent can select multiple leads and batch-approve their AI drafts in one action
  4. Agent can view their pipeline as a filtered list showing leads at each stage (New through Listed) and manually move leads between stages
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: Sending and Delivery Tracking
**Goal**: Approved emails flow to Instantly.ai for delivery, and agents see real-time send/open status. Follow-up emails auto-queue when leads do not reply.
**Depends on**: Phase 2
**Requirements**: SEND-01, SEND-02, SEND-03, SEND-04, SEND-05
**Success Criteria** (what must be TRUE):
  1. When an agent approves an email, it queues in Instantly.ai and sends on the configured schedule
  2. Agent can see delivery status for every sent email (Queued, Sent, Delivered) and open tracking data in their dashboard
  3. If a lead does not reply within the configured number of days, a follow-up email auto-queues without agent intervention
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Reply Management and Pipeline Completion
**Goal**: Replies from leads flow back into OffMarket as an in-app inbox, agents respond without leaving the platform, and the full lead lifecycle is connected end-to-end.
**Depends on**: Phase 3
**Requirements**: REPLY-01, REPLY-02, REPLY-03, REPLY-04
**Success Criteria** (what must be TRUE):
  1. When a lead replies to a sent email, the reply appears in the agent's in-app inbox within OffMarket (pulled from Instantly API)
  2. Agent can read reply threads linked to the original lead and respond directly from OffMarket
  3. The full pipeline lifecycle works end-to-end: a lead progresses from New through Drafted, Approved, Sent, Opened, Replied, and agent can manually advance to Appointment and Listed
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 --> 2 --> 3 --> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation, Auth, and Lead Ingestion | 0/3 | Not started | - |
| 2. AI Email Generation and Agent Workflow | 0/2 | Not started | - |
| 3. Sending and Delivery Tracking | 0/2 | Not started | - |
| 4. Reply Management and Pipeline Completion | 0/1 | Not started | - |
