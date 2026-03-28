# ListingPitch Landing Page — Design Spec

## Product Summary

**What it is:** A SaaS platform that delivers curated lists of motivated sellers to real estate agents, with AI-assisted email writing tools for outreach.

**Target user:** Solo real estate agents who want a scalable prospecting alternative to cold calling, door knocking, and Zillow leads.

**Core flow:**
1. Agent signs up (email-only waitlist CTA)
2. Agent requests leads for their farm area (zip codes)
3. ListingPitch delivers a curated, verified lead list within 12 hours
4. Agent connects their Gmail for branding/reply routing
5. Agent writes personalized outreach emails with AI assistance
6. Agent tracks pipeline and closes deals

**Price point:** $199-299/month

---

## Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Page type | Standalone marketing landing page | No backend needed for v1, mock data only |
| Tech stack | React + Vite | Component-based, easy to iterate, matches future app stack |
| Architecture | Single-page monolith | Simplest path, flat components folder, CSS Modules, no router |
| Typography | Libre Caslon Text (headlines) + General Sans (body) + JetBrains Mono (data) | PodPitch-style serif/sans pairing, warm authority |
| Color palette | PodPitch-inspired: #FF5924 orange, white-dominant, #1B1B1B dark sections, #B9E97D lime green accent | SaaS-forward, high-contrast, conversion-optimized |
| CTA style | Email-only waitlist | Low friction, human touch, 12hr turnaround promise |
| Social proof | Animated stat counter (pre-launch, no real testimonials) | Momentum feel without fake social proof |
| Video | Styled play button placeholder (link to video later) | Intentional placeholder, not broken |
| Motion | Framer Motion: fade-in-up on scroll, counter animations, smooth hovers | Intentional, not flashy |

---

## Design System

### Color Palette
- **Primary CTA / Accent:** #FF5924 (vibrant orange)
- **Primary Text:** #222B27 (dark charcoal)
- **Dark Sections:** #1B1B1B (near-black)
- **Light Sections:** #F2F4EF (warm light gray)
- **Background:** #FFFFFF (white)
- **Success:** #019F11 (green)
- **Error/Urgent:** #BC1619 (red)
- **Badge/Highlight:** #FFC800 (yellow)
- **AI Section:** #B9E97D (lime green — PodPitch signature)
- **Secondary Text:** #555555
- **Muted Text:** #888888
- **Borders:** #DDDDDD
- **Input Borders:** #D3D6E3

### Typography
- **Headlines:** Libre Caslon Text (serif), 700 weight, tight line-height (1.08-1.15)
- **Body:** General Sans, 400-500 weight, 17-20px, line-height 1.6-1.7
- **Data/Metrics:** JetBrains Mono, 400-500 weight, used for stats and numbers
- **Scale:** H1: 64px, H2: 44px, H3: 18-20px, Body: 17px, Small: 13-14px

### Spacing
- **Base unit:** 8px
- **Section padding:** 80px vertical
- **Card padding:** 28-36px
- **Max content width:** 1100px

### Border Radius
- **Cards:** 16px
- **Buttons (pill):** 24px
- **Nav container:** 20px
- **Inputs:** 14px
- **Icon containers:** 12px
- **Badges:** 20px

### Motion
- **Library:** Framer Motion
- **Scroll animations:** fade-in-up, staggered children
- **Counter animations:** count-up on scroll intersection
- **Hover states:** border-color transitions on cards, subtle scale on buttons
- **Duration:** 200-400ms, ease-out easing

### Button Styles
- **Primary:** bg #FF5924, white text, pill shape, 600 weight, 15px
- **Outline:** 2px border #FF5924, transparent bg, #FF5924 text, pill shape

---

## Page Structure (11 sections)

### 1. Sticky Navigation
- White background with 1px border, 20px border-radius (rounded container)
- Logo left: "Listing" + "Pitch" (Pitch in #FF5924)
- Links center: How It Works | Pricing | FAQ | Log In
- CTAs right: "Book Demo" (outline) + "Get Early Access" (primary)
- Sticky on scroll, z-index 100

### 2. Hero Section
- White background
- Yellow badge pill: "Now onboarding agents in select markets"
- H1 (Libre Caslon, 64px): "Your Next *Listing* Is Already Waiting." (*Listing* in italic #FF5924)
- Subheadline (General Sans, 20px, #555): "We find motivated sellers in your farm area and deliver verified contact data within 12 hours. You connect your Gmail, write personalized pitches with AI, and close more listings."
- Email input + "Get Early Access" button (inline, white bg, border, rounded)
- Trust text: "We'll reach out within 12 hours to set up your farm area. No credit card required."

### 3. Video Placeholder
- 16:9 aspect ratio container, #F2F4EF bg, 16px radius
- Centered play button: 72px circle, #FF5924 bg, white triangle
- Label: "See how it works in 90 seconds"
- Max width: 700px

### 4. Dashboard Mockup
- Browser chrome (3 colored dots)
- 4 metric cards: Leads Delivered (327), Pitches Sent (214), Replies (18), Appointments (6)
- 3 lead rows with: name, address, match score (monospace orange), status badge
- Badge variants: "Pitch Ready" (green), "FSBO" (orange), "Expired 47d" (red)
- Background: #F2F4EF, 16px radius

### 5. Stat Counter Strip
- Dark background (#1B1B1B)
- 4 stats centered: 12,847 pitches sent | 500+ agents | 94% deliverability | 12hrs turnaround
- Numbers in JetBrains Mono, #FF5924
- Labels in #999
- Animated count-up on scroll

### 6. Problem Section
- White background
- H2: "You Know Who Wants to Sell. You Just Can't Reach Them All."
- 3 pain point cards (1px border, 16px radius):
  1. "Expired listings go stale fast." (clock icon)
  2. "Cold calling is dead. Door knocking doesn't scale." (phone icon)
  3. "Generic templates get deleted." (trash icon)

### 7. How It Works
- Light gray background (#F2F4EF)
- H2: "From Farm Area to Listing Appointment"
- 4 steps with orange numbered circles:
  1. **We Find Your Sellers** — deliver curated list within 12 hours
  2. **Verified Data, Ready to Go** — verified emails, property details, equity, days on market
  3. **Connect Your Gmail** — one-click link, replies to real inbox
  4. **Write Emails with AI** — agent in control, AI assists, send when ready

### 8. AI Personalization (Lime Green Section)
- Background: #B9E97D
- H2: "Not Another Template Tool. This Actually Sounds Like You."
- Side-by-side comparison cards (white bg, 16px radius):
  - Left: X icon (red) + "Generic template" — bland placeholder email
  - Right: Checkmark (green) + "ListingPitch AI" — personalized, property-specific pitch

### 9. Lead Types Grid
- White background
- H2: "Find Sellers Before They Find Another Agent"
- Subtitle: data sourcing explanation
- 3x2 grid of cards, each with:
  - Color-coded icon in tinted container
  - Lead type name (Libre Caslon)
  - Real stat in JetBrains Mono orange
  - Description with source citations
- Types: Expired Listings, FSBOs, Pre-Foreclosure, Absentee Owners, High Equity, Probate/Estate
- Stats sourced from NAR, ATTOM Data, CoreLogic (2023-2024)

### 10. Pricing
- Light gray background (#F2F4EF)
- H2: "Less Than One Showing's Worth of Gas Money"
- 2 cards side-by-side (max 800px):
  - **Starter $199/mo:** 1 farm area, 500 emails, AI voice, all leads, warm-up, tracking
  - **Growth $299/mo:** Unlimited farms, 1500 emails, AI + follow-ups, Kanban pipeline, priority support
  - Growth card has #FF5924 border (featured)
- Footer: "No contracts. Cancel anytime."

### 11. FAQ Section
- White background
- 8 collapsible accordion items (Libre Caslon questions, General Sans answers)
- "+" indicator in #FF5924, rotates to "x" when open
- Smooth expand/collapse animation

### 12. Final CTA
- Dark background (#1B1B1B)
- H2: "Your Next Listing Is Already Waiting." (Listing in #FF5924)
- Subtitle + email input (dark-styled)
- Trust badges: "No credit card required. Cancel anytime. Your data stays private."

### 13. Footer
- Dark background (#1B1B1B), border-top #333
- Logo left, links right
- "Not affiliated with any MLS or brokerage."

---

## Technical Requirements

### Stack
- React 18 + Vite
- Framer Motion (animations)
- CSS Modules (scoping)
- Google Fonts: Libre Caslon Text, General Sans (via Fontsource or CDN), JetBrains Mono

### Component Structure
```
src/
  App.jsx
  components/
    Navbar.jsx
    Hero.jsx
    VideoPlaceholder.jsx
    DashboardMockup.jsx
    StatStrip.jsx
    ProblemSection.jsx
    HowItWorks.jsx
    AIComparison.jsx
    LeadTypes.jsx
    Pricing.jsx
    FAQ.jsx
    FinalCTA.jsx
    Footer.jsx
  styles/
    variables.css (design tokens)
    [ComponentName].module.css (per-component)
  hooks/
    useScrollAnimation.js (intersection observer for fade-in)
    useCountUp.js (animated counter)
```

### Interactive Elements
- Email input in hero: on submit, show confirmation message ("You're in. We'll reach out within 12 hours.")
- FAQ accordion: expand/collapse with smooth animation
- Stat counter: count-up animation triggered by scroll intersection
- Sticky nav: background opacity change on scroll
- All cards: hover state with orange border

### Performance Targets
- < 3s first meaningful paint
- Lazy load below-fold images
- System font fallbacks while Google Fonts load

### Deployment
- Railway (static site or Node serve)
- Build: `npm run build` -> `dist/`
