# OffMarket

## What This Is

OffMarket is a $99/mo SaaS platform that delivers motivated seller leads to real estate agents with AI-drafted email pitches. Agents review and approve every email before it sends. Replies come back into the platform. The product targets solo real estate agents who spend 5-10 hours/week on manual prospecting and want a scalable, hands-off alternative to cold calling, door knocking, and paying $1,200+/mo for shared Zillow leads.

## Core Value

Agents receive verified motivated seller leads with ready-to-send AI-drafted pitches, and manage all conversations in one place — without cold calling, without shared leads, without doing any of the data work themselves.

## Requirements

### Validated

- ✓ Landing page with product positioning, pricing, video — existing
- ✓ Waitlist page with email capture, zip code collection, founding member offer — existing
- ✓ Remotion explainer video (53s, embedded on landing page) — existing

### Active

- [ ] Admin dashboard: create agent accounts, upload lead lists, manage customers
- [ ] Agent dashboard: view leads, review AI-drafted emails, approve/edit/skip
- [ ] AI email generation: property-specific pitches using lead data (address, price, equity, comps, days on market)
- [ ] Instantly.ai integration: queue approved emails, send via Instantly API, track delivery status
- [ ] Reply management: pull replies from Instantly, display in-platform inbox, agent responds from OffMarket
- [ ] Pipeline tracking: Lead → Drafted → Approved → Sent → Opened → Replied → Appointment → Listed
- [ ] Stripe integration: manual invoice/payment link creation for onboarded customers
- [ ] Authentication: email/password login for agents (accounts created by admin, not self-serve)
- [ ] Lead data model: store property data, lead type, status, AI draft, send history, reply threads
- [ ] CSV upload: admin uploads lead lists (from PropStream), system parses and assigns to agent accounts
- [ ] Follow-up sequences: auto-queue follow-up emails if no reply after configurable number of days

### Out of Scope

- Self-serve signup — manual onboarding via call for v1, prevents bad-fit customers
- PropStream API integration — manual data pull by VA for v1, API later when volume justifies cost
- Agent voice/style training — AI uses a standard professional tone for v1, custom voice matching later
- Mobile app — web-first, responsive design covers mobile access
- Multi-brokerage team features — solo agent focus for v1
- Real-time notifications (push/SMS) — email notifications only for v1
- Analytics/reporting dashboard — basic stats in agent dashboard, no dedicated analytics page

## Context

**Existing frontend:** React 19 + Vite 6 + Tailwind v4 + shadcn/ui landing page and waitlist page, deployed on Railway. Remotion video project for product explainer.

**Sending infrastructure:** Instantly.ai handles email warm-up, rotation, deliverability. OffMarket sends on behalf of agents (agent's name in "from" field, OffMarket infrastructure behind the scenes).

**Data pipeline (v1):** Manual. VA pulls motivated seller lists from PropStream, exports CSV, admin uploads to platform. 250 leads per agent per month.

**Onboarding flow (v1):** Waitlist → onboarding call → admin creates account → Stripe invoice → agent gets access. No self-serve.

**Pricing:** $99/mo (founding members $79/mo for life). Single tier, everything included: 250 leads, AI drafts, sending, reply management, pipeline.

**Market positioning:** "The leads nobody else has." Limited to 5 agents per zip code. Exclusive, not shared.

## Constraints

- **Sending:** Must use Instantly.ai API — already chosen as sending infrastructure
- **Data source:** Manual CSV upload for v1 — no PropStream API dependency
- **Auth:** No self-serve signup — admin creates all accounts
- **Budget:** Lean startup — prefer managed services (Supabase, Vercel, Railway) over self-hosted
- **Timeline:** Ship MVP to first 5-10 paying customers ASAP
- **AI:** Use Claude API or OpenAI API for email generation — needs to reference property-specific data
- **Compliance:** CAN-SPAM compliant emails (real identity, physical address, unsubscribe link)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Manual onboarding, no self-serve | Control quality of early customers, learn through calls | — Pending |
| Manual data pipeline (VA + CSV) | Validate demand before investing in PropStream API | — Pending |
| Agent approves every email | Build trust, get feedback on AI quality, safer for reputation | — Pending |
| Full inbox in OffMarket (not forwarding) | Stickier product, agents live in our tool | — Pending |
| Instantly.ai for sending | Handles warm-up, rotation, deliverability — don't build this | — Pending |
| $99/mo single tier | Low enough for impulse buy, learn what features matter before tiering | — Pending |
| 5 agents per zip code limit | Real scarcity, keeps lead quality high, conversion lever | — Pending |

---
*Last updated: 2026-03-28 after initialization*
