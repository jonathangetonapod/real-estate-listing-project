# Architecture

**Analysis Date:** 2026-03-28

## Pattern Overview

**Overall:** Single-Page Application (SPA) with React Router for multi-page experiences. Landing page and waitlist conversion funnel architecture.

**Key Characteristics:**
- Client-side rendering with React 19
- Motion-driven animations for engagement (Framer Motion)
- Marketing landing page focused on conversion funnels
- Two primary routes: home (/) and waitlist (/waitlist)
- Primarily stateless, form-based page interactions
- Component composition with UI primitive library abstractions

## Layers

**Presentation Layer:**
- Purpose: Render UI components with animations and interactivity
- Location: `src/components/`
- Contains: Page components (Hero, Pricing, FAQ, WaitlistPage, etc.) and UI primitives (Button, Input, Card, etc.)
- Depends on: Framer Motion for animations, React Router for navigation, Tailwind CSS for styling
- Used by: App component for route rendering

**Page/Route Layer:**
- Purpose: Define route structure and orchestrate full-page layouts
- Location: `src/App.jsx` (route definitions), `src/components/WaitlistPage.jsx` (dedicated route component)
- Contains: Route definitions (via BrowserRouter and Routes), page-level component composition
- Depends on: React Router DOM, presentation components
- Used by: Entry point (`src/main.jsx`)

**Utility Layer:**
- Purpose: Shared utilities for styling and helpers
- Location: `src/lib/utils.js`
- Contains: `cn()` function for Tailwind class merging (uses clsx + tailwind-merge)
- Depends on: clsx, tailwind-merge
- Used by: All components for className composition

**Styling Layer:**
- Purpose: Global CSS and design system tokens
- Location: `src/index.css`, `src/styles/variables.css`
- Contains: Tailwind CSS configuration, custom theme variables (colors, fonts, spacing), CSS variables for design tokens
- Depends on: Tailwind CSS, TailwindCSS Vite plugin
- Used by: All components via utility classes

## Data Flow

**Landing Page Flow:**

1. User loads `/` → `App.jsx` routes to `LandingPage()` component
2. `LandingPage` composes section components in sequence:
   - `Navbar` (sticky header with CTA)
   - `Hero` (headline, subheadline, CTA)
   - `VideoPlaceholder`, `DashboardMockup`, `StatStrip` (product showcase)
   - `ProblemSection`, `HowItWorks`, `AIComparison`, `LeadTypes` (value propositions)
   - `Pricing`, `FAQ`, `FinalCTA` (conversion)
   - `Footer`
3. Each component manages local state (e.g., Navbar tracks scroll position and mobile menu open/close)
4. Components use Framer Motion's `whileInView` to trigger animations when scrolled into viewport
5. CTAs navigate to `/waitlist` via `<Link to="/waitlist">`

**Waitlist Page Flow:**

1. User clicks "Join the Waitlist" CTA → navigates to `/waitlist`
2. `WaitlistPage` renders multi-step form:
   - Step 1: Email submission → `submitted = true`
   - Step 2: Zip code submission → `zipSubmitted = true`
   - Step 3: Display waitlist confirmation with referral link
3. State mutations trigger UI state changes (rendered via conditional JSX)
4. Form submission handled via `handleEmailSubmit()` and `handleZipSubmit()` with simple email/zip validation
5. Referral link generated from email (format: `offmarket.com/ref/{email.split('@')[0]}`)
6. User can copy referral link via clipboard interaction

**State Management:**
- All state is component-local (useState)
- No global state management (Redux, Context API, Zustand)
- Form data lives in individual components (email, zipCode, submitted, zipSubmitted flags)
- Scroll position tracked in Navbar and WaitlistPage (for animations and counter visibility)

## Key Abstractions

**Component Hierarchy:**

- `App` (routes)
  - `LandingPage` (landing route, composes multiple sections)
    - `Navbar`, `Hero`, `VideoPlaceholder`, etc. (section components)
  - `WaitlistPage` (waitlist route, self-contained form)

**UI Primitives:**

Components in `src/components/ui/` follow shadcn/base-ui patterns:
- `Button`: Wraps `@base-ui/react/button` with CVA variant system
- `Input`: Tailored input with focus states
- `Card`, `CardContent`: Layout containers
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`: Expandable FAQ sections

**Animation Patterns:**

Consistent use of Framer Motion variants for entrance animations:
- `fadeInUp`: Fade in + slide up from below (delay-staggered)
- `whileInView`: Trigger animation when element enters viewport
- `AnimatePresence`: Handle mount/unmount transitions (e.g., FAQ accordion opens)

**Data Structures:**

Benefits/features defined as arrays of objects (in WaitlistPage, Pricing, FAQ):
```javascript
const benefits = [
  { title: '...' , detail: '...' },
  // ...
]
```

FAQ items similarly structured for reusability and map rendering.

## Entry Points

**`src/main.jsx`:**
- Location: `src/main.jsx`
- Triggers: Initial load in browser
- Responsibilities: Mount React app to `#root` DOM element with StrictMode wrapper

**`src/App.jsx`:**
- Location: `src/App.jsx`
- Triggers: Rendered by `main.jsx`
- Responsibilities: Define route structure via BrowserRouter and Routes; render appropriate component based on path

**`index.html`:**
- Location: `index.html`
- Triggers: HTTP request to `/`
- Responsibilities: Provide HTML skeleton with `<div id="root">` mount point and font preloads

**`server.js`:**
- Location: `server.js`
- Triggers: Production startup (via `npm start`)
- Responsibilities: Serve pre-built static assets from `dist/` directory; handle SPA fallback (404 → index.html)

## Error Handling

**Strategy:** Minimal error handling; app assumes success.

**Patterns:**
- Form validation is present but basic (e.g., `if (email.trim())` before setting submitted state)
- No explicit error boundaries or error states for failed submissions
- Server errors not anticipated (static form submission not connected to backend in current implementation)
- Navigation errors handled implicitly by React Router (invalid routes fall back to no component rendered)

## Cross-Cutting Concerns

**Logging:** None present. No analytics, error tracking, or console logs in production code.

**Validation:** Form-level only:
- Email input: `required` attribute (HTML5 validation)
- Zip code input: `maxLength={5}` enforced
- Submit handlers check `.trim()` to prevent empty submissions

**Authentication:** Not applicable. Public landing page with no user authentication required.

**Styling:** Utility-first Tailwind CSS with:
- Design tokens defined in `src/index.css` (custom colors, fonts)
- CVA-based component variants for reusable patterns (Button, Accordion)
- `cn()` utility for dynamic class composition
- Responsive design via Tailwind's `md:` breakpoints

---

*Architecture analysis: 2026-03-28*
