# Testing Patterns

**Analysis Date:** 2026-03-28

## Test Framework

**Status:** Not currently implemented

**Observations:**
- No test files found in `src/` directory or its subdirectories
- No test configuration files present (`jest.config.js`, `vitest.config.js`, etc.)
- No testing libraries in `devDependencies` (no `jest`, `vitest`, `@testing-library/react`, etc.)
- `package.json` has no test script

**Implications:**
- All code is untested (frontend components, utilities, hooks)
- Risk of regressions when refactoring components or adding features
- No automated validation of component behavior or animation states

## Current State

**No Testing Infrastructure**

The codebase currently lacks:
- Test runner (Jest, Vitest, etc.)
- Testing library for React components (@testing-library/react, react test utils)
- Assertion library (Jest built-in, Vitest built-in, or standalone)
- Test utilities or fixtures
- CI/CD test pipeline

**Available for Testing:**
- ESLint linting (`npm run lint`)
- Manual browser QA during development (`npm run dev`)
- Build verification (`npm run build`)

## Recommended Testing Approach

**Phase 1 - Setup (Prerequisites):**
1. Add testing framework: `vitest` (modern, fast, ESM-native) or `jest` (broader ecosystem)
2. Add React testing library: `@testing-library/react`
3. Add assertion utilities: Built-in (vitest/jest) or standalone (`chai`)
4. Add testing config file: `vitest.config.js` or `jest.config.js`

**Phase 2 - Critical Areas to Test:**

**Component Tests:**
- Location: Colocated with components (e.g., `Hero.test.jsx` next to `Hero.jsx`)
- Priority components: `WaitlistPage.jsx`, `Navbar.jsx`, `FAQ.jsx` (interactive state)
- Test scope: Rendering, state changes, event handling, conditional rendering

**Hook Tests:**
- Location: `src/hooks/__tests__/` or colocated
- Example: `useCountUp()` custom hook in `WaitlistPage.jsx` should test animation progress

**Utility Tests:**
- Location: `src/lib/__tests__/`
- Example: `cn()` utility should test class merging behavior

## Testing Patterns (To Implement)

**Suggested Component Test Structure:**

```jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '@/components/Navbar';

describe('Navbar', () => {
  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it('renders logo', () => {
    renderNavbar();
    expect(screen.getByText('OffMarket')).toBeInTheDocument();
  });

  it('toggles mobile menu on hamburger click', () => {
    renderNavbar();
    const hamburger = screen.getByLabelText('Toggle menu');

    fireEvent.click(hamburger);
    expect(screen.getByText('How It Works')).toBeVisible();
  });

  it('applies shadow when scrolled', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation');

    window.scrollY = 15;
    fireEvent.scroll(window, { target: { scrollY: 15 } });

    expect(nav).toHaveClass('shadow-sm');
  });
});
```

**Form Submission Tests:**

```jsx
describe('WaitlistPage Email Form', () => {
  it('submits email and shows zip code input', async () => {
    const { getByPlaceholderText, getByRole } = render(<WaitlistPage />);

    const emailInput = getByPlaceholderText('Enter your email');
    const submitBtn = getByRole('button', { name: /Join the Waitlist/ });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.click(submitBtn);

    expect(getByPlaceholderText('Your zip code')).toBeVisible();
  });

  it('validates email is not empty', async () => {
    const { getByRole } = render(<WaitlistPage />);
    const submitBtn = getByRole('button', { name: /Join the Waitlist/ });

    fireEvent.click(submitBtn);

    // Form should not advance without email
    expect(screen.queryByPlaceholderText('Your zip code')).not.toBeInTheDocument();
  });
});
```

**Animation/Framer Motion Tests:**

```jsx
describe('Hero Animations', () => {
  it('renders motion components with correct variants', () => {
    const { getByText } = render(<Hero />);

    const headline = getByText(/Stop Competing for Leads/);
    expect(headline).toHaveAttribute('data-testid', 'hero-headline');
    // Use data-testid to target motion components
  });
});
```

**Hook Test Example:**

```jsx
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCountUp } from '@/components/WaitlistPage';

describe('useCountUp', () => {
  it('animates from 0 to target value', async () => {
    const { result, rerender } = renderHook(
      ({ target, duration, shouldStart }) => useCountUp(target, duration, shouldStart),
      { initialProps: { target: 100, duration: 100, shouldStart: false } }
    );

    expect(result.current).toBe(0);

    rerender({ target: 100, duration: 100, shouldStart: true });

    await waitFor(() => {
      expect(result.current).toBeGreaterThan(0);
    });
  });
});
```

## Coverage Strategy

**Phase 1 Priority (High Impact):**
- Interactive components: `Navbar`, `WaitlistPage`, `FAQ` (state, events)
- Form handling and validation
- Utility functions: `cn()` class merging

**Phase 2 (Medium Priority):**
- Animation components: `Hero`, `Pricing` (visual regression)
- Custom hooks: `useCountUp`
- Conditional rendering logic

**Phase 3 (Nice to Have):**
- Snapshot tests for UI structure (if component design is stable)
- Integration tests for multi-page navigation

## What to Mock

**Mock (External Dependencies):**
- `window.scrollY` and scroll events (use `fireEvent.scroll()`)
- `navigator.clipboard` for copy functionality
- `requestAnimationFrame` for animations (vitest provides built-in support)
- `IntersectionObserver` if testing visibility triggers

**Don't Mock (Keep Real):**
- React Router navigation (wrap in `<BrowserRouter>`)
- Framer Motion animations (test for presence/visibility, not animation details)
- Component state changes from user events

## Test Configuration Template

**vitest.config.js (Recommended):**

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/'],
    },
  },
});
```

**package.json scripts (To Add):**

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

## Gotchas & Considerations

**React Router Integration:**
- Components using `<Link>` or `useNavigate()` must be wrapped in `<BrowserRouter>` for tests

**Framer Motion:**
- Animations don't run in test environment by default; test presence and visibility, not animation timing
- Use `screen.debug()` to inspect final rendered state

**Scroll Events:**
- `window.scrollY` requires manual mock/fireEvent in tests
- Intersection Observer requires polyfill or mock

**Form Testing:**
- Use `fireEvent.change()` for input updates
- Use `fireEvent.submit()` for form submission
- Validate state changes occur after submission

## Current Testing Maturity: 0/5

- No tests written
- No test infrastructure
- Recommend implementing Phase 1 (setup + critical component tests) before next feature release

---

*Testing analysis: 2026-03-28*
