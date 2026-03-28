# External Integrations

**Analysis Date:** 2026-03-28

## APIs & External Services

**Not detected** - No external API integrations found in codebase at this time. The application is a landing page and waitlist signup form with no backend API calls to third-party services.

## Data Storage

**Databases:**
- Not detected - Application is frontend-only landing page

**File Storage:**
- Local filesystem only - Static assets served from `dist/` directory by Node.js server in `server.js`

**Caching:**
- Browser caching via HTTP headers from `server.js` MIME type responses

## Authentication & Identity

**Auth Provider:**
- None - No user authentication system implemented
- Landing page and waitlist are public, unauthenticated pages

## Monitoring & Observability

**Error Tracking:**
- Not detected

**Logs:**
- Console logging only: `console.log()` in `server.js` when server starts on PORT

## CI/CD & Deployment

**Hosting:**
- Railway (configured in `railway.json` file present)
- Local static server via Node.js `server.js` during preview/production

**CI Pipeline:**
- Not detected - No automated testing or CI workflow configured

## Environment Configuration

**Required env vars:**
- `PORT` - Optional, defaults to 3000 in production (`server.js`), 4173 in Vite preview mode
- No other environment variables required (all configuration hardcoded)

**Secrets location:**
- Not applicable - No secrets, API keys, or credentials in use
- No `.env` files detected in repository

## Webhooks & Callbacks

**Incoming:**
- Not implemented - Form submissions do not trigger external webhooks

**Outgoing:**
- Not implemented - No outgoing API calls or webhooks to third parties

## Form Data & Waitlist Management

**Current Implementation:**
- Email and zip code captured in `WaitlistPage` (`src/components/WaitlistPage.jsx`)
- Form state managed locally in React component state (`email`, `zipCode`, `submitted`, `zipSubmitted`)
- No persistence - Data is not sent anywhere or stored
- Form submission handlers are client-side only: `handleEmailSubmit()` and `handleZipSubmit()` update local state

**Limitations:**
- Waitlist signups are not actually recorded
- No email verification or confirmation
- No backend to store or process user data
- Spots available counter (hardcoded as "11 of 5") is static and not dynamically updated

## Key Implementation Notes

**No Backend Required Yet:**
- This is a marketing/landing page with marketing page routing (React Router)
- Product is not yet launched (references "when market opens", "waves of onboarding")
- Waitlist is informational only - suggests future integration with:
  - Email service (SendGrid, Mailgun, etc.) for confirmation and notifications
  - Database (PostgreSQL, MongoDB) for waitlist persistence
  - Stripe or payment processor for handling founding member pricing
  - Email infrastructure for managing outbound sales emails (mentioned as core service)

**Video Generation Stack (Separate Project):**
- `video/` directory contains Remotion project for creating explainer video
- Builds independent of main landing page
- Output: `out/offmarket-explainer.mp4`
- No external API integrations in video project

---

*Integration audit: 2026-03-28*
