# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies (uses bun by default)
bun install
# or: npm install

# Start development server (runs Tina CMS + Astro dev server)
bun run dev
# or: npm run dev

# Build for production
bun run build
# or: npm run build

# Preview production build
bun run preview
# or: npm run preview

# Lint code
bun run lint
# or: npm run lint

# Fix linting issues automatically
bun run lint:fix
# or: npm run lint:fix
```

## Architecture

### Tech Stack
- **Astro 5.x** - Static site generator with partial hydration
- **React 19.x** - Interactive components via `@astrojs/react`
- **Tailwind CSS 4.x** - Utility-first CSS via `@tailwindcss/vite`
- **DaisyUI** - Component library on top of Tailwind
- **TinaCMS** - Git-based headless CMS for content management
- **MDX** - Markdown + JSX support via `@astrojs/mdx`
- **Cloudflare** - Deployment adapter for Cloudflare Pages

### Project Structure
```
src/
├── components/        # React (.tsx) and Astro (.astro) components
├── layouts/          # Page layouts (Layout.astro)
├── pages/            # File-based routing (.astro files)
├── styles/           # Global CSS
├── utils/            # Utility functions
├── assets/           # Static assets
└── content.config.ts # Astro content collections config

content/posts/        # Blog posts (managed by TinaCMS)
tina/                 # TinaCMS configuration and generated files
vite-plugins/         # Custom Vite plugins (code-jump-plugin)
public/               # Static assets served at root
```

### Component Conventions

**Astro Components (.astro)** - Static, server-rendered by default
- Use for: Headers, Footers, static content sections
- No client-side JavaScript unless explicitly hydrated
- Can import and use React components via `<ClientComponent />` syntax

**React Components (.tsx)** - Interactive, client-side hydrated
- Use for: FAQ accordions, modals, tabs, comparison tables
- Require `client:*` directives when imported into `.astro` files
- Common pattern: `import FAQ from '../components/FAQ'` then use as `<FAQ client:load />`

### Content Management (TinaCMS)

TinaCMS provides a Git-based CMS for managing blog posts:

- **Configuration**: `tina/config.ts` - Defines collections and schemas
- **Content Location**: `content/posts/` - Markdown/MDX files
- **Dev Server**: Run `bun run dev` starts both TinaCMS and Astro
- **Admin Build**: Outputs to `public/admin/` directory
- **Schema Sync**: TinaCMS schema must match Astro content collections in `src/content.config.ts`

### Custom Vite Plugins

The project includes a custom Vite plugin for development:

**code-jump-plugin** (`vite-plugins/code-jump-plugin.ts`)
- Adds F2 hotkey to jump from browser to editor
- Requires manual editor configuration in `astro.config.mjs`
- Validates editor availability on startup
- Provides installation guidance if editor is missing

### Styling

- **Tailwind CSS 4.x** via Vite plugin (not PostCSS)
- **DaisyUI** provides pre-built component classes
- **Font**: DM Sans (configured in `tailwind.config.mjs`)
- Use utility classes directly in components
- DaisyUI themes configured in `tailwind.config.mjs`

### TypeScript Configuration

- Extends `astro/tsconfigs/strict`
- JSX set to `react-jsx` with import source `react`
- Strict null checks enabled
- `.astro` files excluded from ESLint (handled separately)

### Deployment

- **Adapter**: Cloudflare Pages (`@astrojs/cloudflare`)
- Build output: `dist/` directory
- Environment variables for TinaCMS:
  - `NEXT_PUBLIC_TINA_CLIENT_ID`
  - `TINA_TOKEN`
  - `GITHUB_BRANCH` / `VERCEL_GIT_COMMIT_REF` / `HEAD`

### Pages

- **index.astro** - Homepage
- **astra.astro** - Astra AI Agent landing page
- **pricing.astro** - Pricing page with interactive tabs and comparison tables

### Common Interactive Patterns

**FAQ Component** (`FAQ.tsx`)
- Collapsible accordion with state management
- Used in landing pages for Q&A sections

**Comparison Table** (`ComparisonTable.tsx`, `PricingComparisonTable.tsx`)
- Desktop: Table view
- Mobile: Tab-based switching
- Responsive pattern for feature comparisons

**Modal Components** (`BookDemoModal.tsx`, `CalendlyModal.tsx`)
- Form popups with HubSpot/Calendly integration
- DaisyUI modal classes

**Pricing Tabs** (`PricingTabs.tsx`)
- Monthly/annual billing toggle
- Updates pricing display across the page
