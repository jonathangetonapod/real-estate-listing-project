# Codebase Concerns

**Analysis Date:** 2026-03-28

## Component Size & Complexity

**WaitlistPage.jsx exceeds maintainability threshold:**
- Issue: `src/components/WaitlistPage.jsx` is 502 lines — significantly larger than the 200-line guideline. Contains form state management, FAQItem sub-component, useCountUp custom hook, and full page layout in one file.
- Files: `src/components/WaitlistPage.jsx`
- Impact: Difficult to test individual concerns, hard to reuse FAQItem and useCountUp elsewhere, increases cognitive load for modifications.
- Fix approach: Extract FAQItem as separate component file (`src/components/FAQItem.jsx`), move useCountUp hook to `src/hooks/useCountUp.js`, split form logic into separate component (`src/components/WaitlistForm.jsx`). Target max 250 lines.

**DashboardMockup.jsx is complex and tightly coupled:**
- Issue: `src/components/DashboardMockup.jsx` is 363 lines with 4 state variables managing UI interactions. Contains hardcoded mock data, multiple color/style maps, and MatchBar sub-component inline.
- Files: `src/components/DashboardMockup.jsx`
- Impact: Difficult to swap mock data for real API integration, style maps aren't reusable, sub-components can't be tested independently.
- Fix approach: Extract MatchBar to `src/components/ui/match-bar.jsx`, move color/style maps to `src/constants/dashboardStyles.js`, extract mock data to `src/mocks/dashboardData.js`, refactor lead table rendering logic into separate component.

**AIComparison.jsx has algorithmic complexity:**
- Issue: `src/components/AIComparison.jsx` line 76-108 contains `highlightText()` function that performs text parsing and JSX generation. Uses `indexOf()` for text matching which is fragile with overlapping highlights.
- Files: `src/components/AIComparison.jsx`
- Impact: Hard to understand, brittle highlight logic fails if overlapping text is attempted, not testable without extracting.
- Fix approach: Extract `highlightText()` to utility file `src/utils/highlightText.js` with unit tests, add guard for overlapping highlight ranges, add JSDoc documentation.

## Unused Code & Dead Variables

**Unused variable in WaitlistPage:**
- Issue: `src/components/WaitlistPage.jsx` line 155 defines `const unused = counterVisible;` with a comment "keep observer for animation trigger" but `unused` is never read.
- Files: `src/components/WaitlistPage.jsx:155`
- Impact: ESLint may flag (though varsIgnorePattern allows uppercase), adds confusion about intent, suggests incomplete refactoring.
- Fix approach: Remove unused variable entirely. The `IntersectionObserver` setup (lines 146-152) already has side effects via `setCounterVisible(true)` — the observer doesn't need to be "kept" via a reference.

**Unused imports in some components:**
- Issue: Several components import React utilities that may not be fully utilized in all paths (checked with ESLint varsIgnorePattern).
- Files: Generic across most component files
- Impact: Low — eslint.config.js rule allows uppercase pattern variables. Minor namespace pollution.
- Fix approach: Run `npm run lint` regularly and clean up unused imports in refactor phases.

## Missing Error Handling

**No error boundaries or try-catch blocks:**
- Issue: Entire application has no error boundaries, try-catch handlers, or error recovery. All form submissions are synchronous without validation or error feedback. Video playback has no fallback for missing media file.
- Files: `src/App.jsx`, `src/components/WaitlistPage.jsx`, `src/components/VideoPlaceholder.jsx`, all components with form submissions
- Impact: Any runtime error crashes entire app. Form submission failures (e.g., network, validation) give no user feedback. Missing video file silently fails.
- Fix approach: Create `src/components/ErrorBoundary.jsx` wrapping BrowserRouter, add form validation before submit in `WaitlistPage.jsx`, add video error handler in `VideoPlaceholder.jsx`, implement error state management for future API integration.

**No input validation:**
- Issue: Email input in WaitlistPage has `required` attribute but no client-side format validation. Zip code accepts up to 5 chars but no validation that it's numeric.
- Files: `src/components/WaitlistPage.jsx` lines 223-230, 257-263
- Impact: Invalid data can be submitted, poor user feedback. When API integration happens, validation must move server-side anyway.
- Fix approach: Add client-side regex validation for email format and numeric-only zip codes, show error messages, disable submit button on validation failure.

## Performance Concerns

**Framer Motion animation on every page section:**
- Issue: Nearly every component uses `motion.div` with `whileInView` and `AnimatePresence`. On a landing page with many sections, this creates excessive DOM mutations and re-renders. No memoization on repeated animations.
- Files: Multiple — `src/components/Hero.jsx`, `src/components/Pricing.jsx`, `src/components/WaitlistPage.jsx`, etc.
- Impact: Potential jank on lower-end devices, unnecessary animation recalculations for off-screen content due to IntersectionObserver on every component.
- Fix approach: Consider reducing animation complexity on mobile, use `prefers-reduced-motion` media query, extract common animation variants to reusable config object (`src/constants/animations.js`), consider lazy-loading sections below fold.

**useCountUp uses requestAnimationFrame without optimization:**
- Issue: `src/components/WaitlistPage.jsx` useCountUp hook (lines 74-92) uses `requestAnimationFrame` for all animations but doesn't use `useCallback` to stabilize function reference, causing potential re-renders.
- Files: `src/components/WaitlistPage.jsx`
- Impact: Hook recreated on every render, RAF callback reference unstable, may trigger unnecessary effect re-runs in parent components.
- Fix approach: Wrap `tick` function in `useCallback`, extract to separate hook file, memoize easing function.

**No code splitting or lazy loading:**
- Issue: Single large component-based landing page with all components imported at top level in `src/App.jsx`. No route-based code splitting, no lazy component loading.
- Files: `src/App.jsx`
- Impact: Entire app bundle includes all components even if user only visits landing page. No lazy loading for below-the-fold sections.
- Fix approach: Use React.lazy() and Suspense for route components, consider Route-based splitting between landing and waitlist pages.

## State Management & Data Flow

**Mixed state management patterns:**
- Issue: Different components use different approaches: component-level useState (most), useRef for DOM references, hardcoded mock data as const objects. No unified state pattern for shared data.
- Files: Multiple components
- Impact: When API integration occurs, unclear where to add global state. Difficult to share data between routes.
- Fix approach: Plan for context API or state management library before integrating backend. Document where form submissions should hit API (likely new endpoint for waitlist signup).

**Mock data not centralized:**
- Issue: Mock data is defined inline in components: benefits array in `WaitlistPage.jsx`, allLeads in `DashboardMockup.jsx`, examples in `AIComparison.jsx`, features in `Pricing.jsx`.
- Files: Multiple
- Impact: Difficult to update copy/messaging across components, impossible to swap with API data without refactoring multiple files.
- Fix approach: Create `src/mocks/` directory with separate files for each data type, export as constants, import where needed.

## Accessibility Issues

**Missing ARIA labels and semantic structure:**
- Issue: `src/components/WaitlistPage.jsx` line 297-302 has button with `onClick` for clipboard copy but no accessible label or role indication. Multiple carousel tabs and buttons lack `aria-label` or description of function.
- Files: `src/components/WaitlistPage.jsx`, `src/components/DashboardMockup.jsx`, `src/components/AIComparison.jsx`
- Impact: Screen reader users can't understand button purposes, keyboard navigation may be incomplete, not WCAG 2.1 AA compliant.
- Fix approach: Add `aria-label="Copy referral link"` to clipboard button, ensure all buttons have descriptive text or aria-label, test with keyboard navigation, validate with aXe or WAVE tools.

**Carousel navigation not keyboard accessible:**
- Issue: `src/components/AIComparison.jsx` carousel navigation uses button elements which are good, but no indication of current slide or keyboard handling for arrow keys.
- Files: `src/components/AIComparison.jsx`
- Impact: Keyboard-only users can't navigate carousel with arrow keys, no visual indication of which slide is active besides button styling.
- Fix approach: Add arrow key handlers, add `aria-current="page"` to active slide button, add visible skip links if needed.

**Video player not fully accessible:**
- Issue: `src/components/VideoPlaceholder.jsx` implements custom play button (lines 53-66) instead of using native `<video>` controls. Play button lacks proper semantics.
- Files: `src/components/VideoPlaceholder.jsx`
- Impact: Keyboard users can't play video via button (tabIndex is -1), screen readers don't understand play intent.
- Fix approach: Keep native controls visible or enhance accessibility, ensure play button is keyboard-focusable (`tabIndex={0}`), add `role="button"` explicitly.

## Security Considerations

**No input sanitization:**
- Issue: Email and zip code inputs are used directly in JSX output without sanitization (e.g., referral link construction at line 295).
- Files: `src/components/WaitlistPage.jsx:295`
- Impact: Low risk on this frontend (React auto-escapes), but forms basis for bad habit. When user-generated data is displayed, could lead to XSS.
- Fix approach: Establish pattern of sanitizing all user inputs even if React auto-escapes. Use `xss` library or careful string validation for any user-generated display.

**Clipboard API usage without permission check:**
- Issue: `src/components/WaitlistPage.jsx` line 299 uses `navigator.clipboard?.copyToText()` with optional chaining but no error handling if permission denied.
- Files: `src/components/WaitlistPage.jsx:299`
- Impact: Copy silently fails on restricted browsers/contexts with no user feedback.
- Fix approach: Wrap in try-catch, provide fallback (select text or show modal with copyable text), show success/error toast to user.

## Styling & Theming Issues

**Color values hardcoded throughout:**
- Issue: Components use hardcoded color strings like `#FF5F56`, `#FFBD2E`, `#27C93F` (browser chrome colors in DashboardMockup), `#FFE8E8`, `#e6f9e9` (tinted backgrounds) scattered throughout JSX.
- Files: `src/components/DashboardMockup.jsx:137-139`, `src/components/AIComparison.jsx` multiple locations
- Impact: Difficult to maintain consistent color palette, impossible to swap themes without grep-and-replace.
- Fix approach: Move all colors to `src/constants/colors.js` or Tailwind config, use semantic color names (e.g., `colors.BROWSER_RED` not `#FF5F56`), leverage Tailwind utility classes instead of inline hex.

**Inconsistent spacing and sizing patterns:**
- Issue: Padding and margins use mixed patterns: sometimes Tailwind utilities (`p-4 md:p-6`), sometimes inline styles, sometimes magic numbers. Font sizes vary (`text-xs`, `text-[11px]`, `text-[13px]` etc).
- Files: All component files
- Impact: Visual inconsistency, difficult for new developers to maintain design system.
- Fix approach: Standardize on Tailwind utilities, create design tokens for custom sizes, document spacing guidelines.

## Missing Test Coverage

**No test files in entire project:**
- Issue: No `.test.jsx`, `.spec.js`, or test directory found in codebase. No Jest/Vitest configuration.
- Files: None exist
- Impact: Cannot verify component behavior, refactoring is risky, regressions go unnoticed.
- Fix approach: Set up Vitest with React Testing Library, start with critical paths: form submission, state changes, conditional rendering. Target 60%+ coverage for landing page components.

## Browser Compatibility

**HTML5 video element assumption:**
- Issue: `src/components/VideoPlaceholder.jsx` uses `<video>` tag without checking for browser support or fallbacks.
- Files: `src/components/VideoPlaceholder.jsx:71-78`
- Impact: Older browsers or restrictive CSP policies may not load video file.
- Fix approach: Add `onError` handler to video element, provide fallback (e.g., link to YouTube), detect codec support.

## Deployment & Build Concerns

**No environment variable configuration:**
- Issue: Video path hardcoded as `/listsignal-explainer.mp4`. No environment-based configuration for different deployment targets.
- Files: `src/components/VideoPlaceholder.jsx:74`
- Impact: Cannot easily point to CDN or different video URL without code change.
- Fix approach: Use import.meta.env or .env files for API endpoints and media URLs, document required env vars.

**Build output not optimized:**
- Issue: vite.config.js uses default build settings. No mention of image optimization, code splitting strategy, or build analysis.
- Files: `vite.config.js`
- Impact: Bundle size unknown, potential inclusion of unnecessary dependencies, slow load times.
- Fix approach: Run `vite build --analyze`, set up image optimization (e.g., imagemin), configure code splitting for routes, check bundle size in CI/CD.

## Dependencies at Risk

**Framer Motion version locked but no stability guarantee:**
- Issue: framer-motion@^12.38.0 is a major dependency for animations but no documented fallback if API breaks.
- Files: `package.json`
- Impact: Major animation library updates could break layouts. React 19 and react-router 7 are also cutting-edge versions.
- Fix approach: Pin versions if stability is critical (e.g., framer-motion@12.38.0), add pre-release testing, monitor breaking changes in release notes.

**Missing TypeScript:**
- Issue: Project uses JSX but no TypeScript. No type checking, potential for prop type errors at runtime.
- Files: All .jsx files
- Impact: Props can be passed incorrectly without warning, harder to refactor large components, documentation must be manual.
- Fix approach: Consider migrating to TypeScript with `jsx: react-jsx`. Start with critical components, use tsconfig for gradual adoption.

---

*Concerns audit: 2026-03-28*
