# Technology Stack

**Analysis Date:** 2026-03-28

## Languages

**Primary:**
- JavaScript (JSX) - Frontend React components in `src/`
- TypeScript - Video generation project in `video/src/`, strict mode enabled

**Secondary:**
- Node.js JavaScript - Server runtime in `server.js`

## Runtime

**Environment:**
- Node.js 18.0.0+ (specified in `package.json` engines)

**Package Manager:**
- npm - Lockfile: `package-lock.json` present
- Mono-project structure with root and `video/` subproject

## Frameworks

**Core:**
- React 19.2.4 - UI library for landing page and dashboard mockup
- React Router DOM 7.13.2 - Client-side routing between landing page and waitlist page
- Vite 6.4.1 - Frontend build tool and dev server with HMR

**Styling & UI:**
- Tailwind CSS 4.2.2 - Utility-first CSS framework
- @tailwindcss/vite 4.2.2 - Vite plugin for Tailwind
- class-variance-authority 0.7.1 - Style variants and CVA utility
- tailwind-merge 3.5.0 - Merge Tailwind class utilities
- Base UI (React) 1.3.0 - Unstyled, accessible component primitives
- shadcn - Component library (CLI-based installation at version 4.1.1)

**Animation:**
- framer-motion 12.38.0 - Motion and animation library for React components
- tw-animate-css 1.4.1 - Tailwind animation utilities

**Icons:**
- lucide-react 1.7.0 - SVG icon library

**Typography:**
- @fontsource-variable/geist 5.2.8 - Variable font for Geist typeface

**Testing:**
- Not detected

**Build/Dev:**
- @vitejs/plugin-react 4.7.0 - Official React plugin for Vite (uses Oxc parser)
- ESLint 9.39.4 - Linting with flat config
- @eslint/js 9.39.4 - ESLint core rules
- eslint-plugin-react-hooks 7.0.1 - Rules for React hooks
- eslint-plugin-react-refresh 0.5.2 - Enforce React fast refresh rules
- globals 17.4.0 - Global variable definitions for browser environment

**Video Generation:**
- Remotion 4.0.441 - React-based video creation framework
- @remotion/cli 4.0.441 - CLI for Remotion commands
- @remotion/media 4.0.441 - Media handling (audio, video)
- @remotion/transitions 4.0.441 - Transition effects for video
- @remotion/google-fonts 4.0.441 - Google Fonts integration for video
- TypeScript 6.0.2 - Type checking for video project

## Key Dependencies

**Critical:**
- React 19.2.4 - Core UI framework
- Vite 6.4.1 - Essential build and dev server
- Tailwind CSS 4.2.2 - Styling foundation
- Remotion 4.0.441 - Video generation capability (video project only)

**Infrastructure:**
- framer-motion 12.38.0 - Interaction animations throughout landing page
- react-router-dom 7.13.2 - Page routing (index → /waitlist)
- Base UI 1.3.0 - Accessible component foundations

## Configuration

**Environment:**
- `.env` files: Not detected in repository
- Configuration approach: Static build-time values (prices, spots, messaging hardcoded in components)
- Node environment: PORT environment variable used in `server.js` (defaults to 3000 in dev, 4173 in preview)

**Build:**
- `vite.config.js` - Main build configuration with React and Tailwind plugins
- `tsconfig.json` (video only) - TypeScript strict mode with commonjs module output
- `eslint.config.js` - Flat config with React hooks and refresh rules
- `components.json` - shadcn CLI configuration (Base Nova style, JSX, tailwind with CSS variables)

**Runtime:**
- `server.js` - Node.js HTTP server for production serving of built assets
- Listens on 0.0.0.0 (all interfaces), reads PORT from env or defaults to 3000
- Serves static files from `dist/` directory with proper MIME type handling

## Platform Requirements

**Development:**
- Node.js 18+
- npm package manager
- Port 5173 (Vite default) for dev server

**Production:**
- Node.js 18+ runtime
- Configurable PORT (environment variable)
- Pre-built `dist/` directory from Vite build

---

*Stack analysis: 2026-03-28*
