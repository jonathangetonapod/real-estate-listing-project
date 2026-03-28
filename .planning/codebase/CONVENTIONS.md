# Coding Conventions

**Analysis Date:** 2026-03-28

## Naming Patterns

**Files:**
- React components use PascalCase: `Hero.jsx`, `Navbar.jsx`, `WaitlistPage.jsx`
- Utility functions use camelCase: `utils.js`
- UI components in `src/components/ui/` use PascalCase: `button.jsx`, `accordion.jsx`

**Functions:**
- Component functions use PascalCase: `Hero()`, `Navbar()`, `FAQ()`
- Hook functions use camelCase with `use` prefix: `useCountUp()`, `useEffect()`
- Utility functions use camelCase: `cn()`, `easeOut()`
- Event handlers use camelCase with verb prefix: `handleScroll()`, `handleEmailSubmit()`, `toggleMobile()`

**Variables:**
- State variables use camelCase: `email`, `submitted`, `scrolled`, `mobileOpen`
- Constants use UPPER_CASE: `FOUNDING_PRICE`, `REGULAR_PRICE`, `SPOTS_PER_MARKET`
- Object keys use camelCase: `label`, `href`, `q`, `a` (for data objects)
- Array elements follow object conventions

**Types:**
- No TypeScript strict typing currently used (JSX/JS codebase)
- Component props use inline destructuring
- Object shapes defined inline or as constants

## Code Style

**Formatting:**
- ESLint configured with `@eslint/js` (v9.39.4)
- React Hooks plugin enabled: `eslint-plugin-react-hooks`
- React Refresh plugin enabled: `eslint-plugin-react-refresh`
- No Prettier config file; ESLint rules enforce style

**Linting:**
- Unused variables flagged with pattern: `varsIgnorePattern: '^[A-Z_]'` (allows uppercase and underscore-prefixed vars)
- React Hooks rules enforced (dependency arrays, etc.)
- React Refresh rules enforced for HMR compatibility
- Run with: `npm run lint`

**Spacing & Indentation:**
- 2-space indentation (inferred from code samples)
- Consistent spacing around operators and imports
- JSX attributes aligned with opening tag

## Import Organization

**Order:**
1. React/third-party library imports: `import { useState, useEffect } from 'react'`
2. Local component imports from alias paths: `import { Button } from '@/components/ui/button'`
3. Local utilities/lib imports: `import { cn } from '@/lib/utils'`

**Path Aliases:**
- `@/*` → `./src/*` (configured in `jsconfig.json` and `vite.config.js`)
- Used throughout: `@/components`, `@/lib`, `@/components/ui`
- Enables clean imports without relative paths

## Error Handling

**Patterns:**
- No try-catch blocks found in examined components
- Form submission errors handled at component level with state validation: `if (email.trim())`
- No centralized error boundary observed
- Implicit error prevention through input validation rather than exception handling

## Logging

**Framework:** `console` (no logger library used)

**Patterns:**
- No `console.log()` statements observed in production components
- Conditional logging likely disabled in dev vs. production
- Prefer inline validation and state management over debug logging

## Comments

**When to Comment:**
- Comments used only for non-obvious behavior
- Example: Line 154 in `WaitlistPage.jsx`: `// No fake social proof numbers — show real product stats instead`
- HTML comments mark section boundaries: `{/* Badge */}`, `{/* Headline */}`, `{/* Mobile menu */}`

**JSDoc/TSDoc:**
- Not used in this codebase (no TypeScript, minimal function documentation)
- Comments are inline and explain intent rather than documenting signatures

## Function Design

**Size:**
- Components generally kept under 500 lines (e.g., `WaitlistPage.jsx` is ~500 lines)
- Smaller utility functions (e.g., `cn()` is 6 lines, animation variants are 10-15 lines)

**Parameters:**
- React components use props destructuring: `function Hero() {}` (no props passed)
- Event handlers receive event object: `const handleScroll = () => {...}`
- Custom hooks receive configuration: `function useCountUp(target, duration = 2000, shouldStart = false)`

**Return Values:**
- React components return JSX wrapped in fragments or elements
- Animation variant objects return plain JavaScript objects defining animation states
- Utility functions return single values (classNames for `cn()`, boolean for handlers)

## Module Design

**Exports:**
- Named exports for components: `export function Hero() {}`
- Default export repeated at end: `export default Hero;`
- Named export for utilities: `export function cn(...inputs) {}`
- UI components export both component and variants: `export { Button, buttonVariants }`

**Barrel Files:**
- `src/components/ui/` contains individual component files (no barrel exports observed)
- Components imported individually: `import { Button } from '@/components/ui/button'`

## Component Patterns

**Functional Components:**
- All components are functional (no class components)
- Hooks used for state: `useState()`, `useEffect()`, `useRef()`
- Framer Motion animations applied with `motion` wrapper: `<motion.div>`, `<motion.h1>`

**State Management:**
- Local component state for UI concerns: `setScrolled()`, `setMobileOpen()`, `setEmail()`
- No global state management library (Redux, Context) observed
- State passed through props and event handlers

**Animation Patterns:**
Example from `Hero.jsx`:
```jsx
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
};

<motion.div
  variants={fadeInUp}
  initial="hidden"
  animate="visible"
  custom={0}
>
```

**Conditional Rendering:**
- Ternary operators for simple conditions: `{submitted ? <div>...</div> : <form>...</form>}`
- Conditional rendering with `&&`: `{mobileOpen && 'flex md:hidden'}`
- No render prop patterns; using standard JSX

**Array Rendering:**
- `map()` with index key when unique identifier unavailable: `{navLinks.map((link) => (...))}`
- Data arrays (FAQ, features) stored as constants at top of component

## Styling Conventions

**Tailwind CSS:**
- Configured with Tailwind v4.2.2 and `@tailwindcss/vite`
- All styles applied inline as className strings (no CSS modules)
- Responsive breakpoints used: `md:` prefix for medium breakpoints and up
- Color variables used: `text-orange`, `text-charcoal`, `bg-white`, etc.

**CSS Utility Application:**
- Using `cn()` utility to merge Tailwind classes: `cn('base-class', condition && 'conditional-class')`
- Classes use spacing scale: `px-4`, `py-6`, `gap-3`, etc.
- Responsive spacing: `px-4 md:px-6`, `py-12 md:py-20`

---

*Convention analysis: 2026-03-28*
