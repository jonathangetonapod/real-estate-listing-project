# Requirements: OffMarket

**Defined:** 2026-03-28
**Core Value:** Agents receive verified motivated seller leads with ready-to-send AI-drafted pitches, and manage all conversations in one place.

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: Admin can create agent accounts with email and password
- [ ] **AUTH-02**: Agent can log in with email and password
- [ ] **AUTH-03**: Agent session persists across browser refresh
- [ ] **AUTH-04**: Agent can reset password via email link
- [ ] **AUTH-05**: Admin can log in with elevated permissions

### Lead Management

- [ ] **LEAD-01**: Admin can upload CSV of leads (from PropStream export)
- [ ] **LEAD-02**: System parses CSV and stores property data (address, price, equity, days on market, lead type)
- [ ] **LEAD-03**: Admin can assign leads to specific agent accounts
- [ ] **LEAD-04**: Agent can view their assigned leads in dashboard
- [ ] **LEAD-05**: Agent can filter leads by type (expired, FSBO, pre-foreclosure, absentee, high equity, probate)
- [ ] **LEAD-06**: Lead status tracks through pipeline stages

### AI Email Generation

- [ ] **EMAIL-01**: System generates property-specific email pitch for each lead using AI (Claude/OpenAI API)
- [ ] **EMAIL-02**: AI draft references property address, asking price, nearby comps, days on market, equity
- [ ] **EMAIL-03**: Agent can view AI-drafted email for each lead
- [ ] **EMAIL-04**: Agent can edit the AI draft before approving
- [ ] **EMAIL-05**: Agent can approve or skip each email
- [ ] **EMAIL-06**: Agent can batch-approve multiple emails at once

### Sending & Tracking

- [ ] **SEND-01**: Approved emails queue and send via Instantly.ai API
- [ ] **SEND-02**: System tracks delivery status per email (Queued -> Sent -> Delivered)
- [ ] **SEND-03**: System tracks email opens via Instantly
- [ ] **SEND-04**: Follow-up emails auto-queue if no reply after configurable days
- [ ] **SEND-05**: Agent sees real-time send/open status in dashboard

### Reply Management

- [ ] **REPLY-01**: System pulls reply data from Instantly API
- [ ] **REPLY-02**: Replies display in in-app inbox within OffMarket
- [ ] **REPLY-03**: Agent can respond to replies directly from OffMarket
- [ ] **REPLY-04**: Reply threads are linked to the original lead

### Pipeline

- [ ] **PIPE-01**: Leads move through stages: New -> Drafted -> Approved -> Sent -> Opened -> Replied -> Appointment -> Listed
- [ ] **PIPE-02**: Agent can manually move leads between pipeline stages
- [ ] **PIPE-03**: Agent can view pipeline as a list with status filters

### Payments

- [ ] **PAY-01**: Admin can generate Stripe payment link for a customer
- [ ] **PAY-02**: System tracks payment status per agent account (active/expired)
- [ ] **PAY-03**: Agent access is gated by active payment status

## v2 Requirements

### Self-Serve Signup
- **SIGNUP-01**: Agent can sign up without onboarding call
- **SIGNUP-02**: Stripe Checkout integration for self-serve payment
- **SIGNUP-03**: Automated account provisioning after payment

### Data Pipeline Automation
- **DATA-01**: PropStream API integration for automated lead pulling
- **DATA-02**: Automated skip-tracing and email verification
- **DATA-03**: Scheduled lead delivery (daily/weekly refresh)

### AI Voice Training
- **VOICE-01**: Agent can upload writing samples to train AI on their voice
- **VOICE-02**: AI generates pitches in agent's specific writing style

### Analytics
- **ANALYTICS-01**: Weekly performance summary (leads, sends, opens, replies, appointments)
- **ANALYTICS-02**: Lead type performance comparison
- **ANALYTICS-03**: Market-level insights

### Auto-Send Mode
- **AUTO-01**: Agent can enable auto-send (AI drafts and sends without approval)
- **AUTO-02**: Agent can set auto-send rules (lead types, schedule, max per day)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mobile native app | Web-first, responsive design covers mobile |
| Real-time push notifications | Email notifications sufficient for v1 |
| Multi-brokerage teams | Solo agent focus, team features add complexity |
| Direct mail/postcard integration | Email-only channel for v1 |
| CRM integrations (Follow Up Boss, KV Core) | Build our own pipeline first, integrate later |
| PropStream API | Manual CSV upload for v1, API when volume justifies |
| OAuth/social login | Email/password sufficient for v1 |
| Agent-facing billing portal | Admin manages billing manually for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 1 | Pending |
| LEAD-01 | Phase 1 | Pending |
| LEAD-02 | Phase 1 | Pending |
| LEAD-03 | Phase 1 | Pending |
| LEAD-04 | Phase 1 | Pending |
| LEAD-05 | Phase 1 | Pending |
| LEAD-06 | Phase 1 | Pending |
| EMAIL-01 | Phase 2 | Pending |
| EMAIL-02 | Phase 2 | Pending |
| EMAIL-03 | Phase 2 | Pending |
| EMAIL-04 | Phase 2 | Pending |
| EMAIL-05 | Phase 2 | Pending |
| EMAIL-06 | Phase 2 | Pending |
| SEND-01 | Phase 3 | Pending |
| SEND-02 | Phase 3 | Pending |
| SEND-03 | Phase 3 | Pending |
| SEND-04 | Phase 3 | Pending |
| SEND-05 | Phase 3 | Pending |
| REPLY-01 | Phase 4 | Pending |
| REPLY-02 | Phase 4 | Pending |
| REPLY-03 | Phase 4 | Pending |
| REPLY-04 | Phase 4 | Pending |
| PIPE-01 | Phase 2 | Pending |
| PIPE-02 | Phase 2 | Pending |
| PIPE-03 | Phase 2 | Pending |
| PAY-01 | Phase 1 | Pending |
| PAY-02 | Phase 1 | Pending |
| PAY-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 32 total
- Mapped to phases: 32
- Unmapped: 0

---
*Requirements defined: 2026-03-28*
*Last updated: 2026-03-28 after roadmap creation*
