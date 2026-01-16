# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies (uses bun by default)
bun install
# or: npm install

# Start development server
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
- **Tailwind CSS 4.x** - Utility-first CSS via `@tailwindcss/vite` (Vite plugin, not PostCSS)
- **DaisyUI** - Component library on top of Tailwind
- **MDX** - Markdown + JSX support via `@astrojs/mdx`
- **Plate.js** - Rich text editor with AI capabilities
- **@ai-sdk/google** - Google AI integration for editor AI features
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

content/posts/        # Blog posts
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

### Import Path Aliases

The project uses the `@/*` path alias for cleaner imports:
- Configured in `tsconfig.json`: `"@/*": ["./src/*"]`
- Use: `import { foo } from '@/components/foo'` instead of `'../../components/foo'`

### Custom Vite Plugins

The project includes a custom Vite plugin for development:

**code-jump-plugin** (`vite-plugins/code-jump-plugin.ts`)
- Adds F2 hotkey to jump from browser to editor
- Requires manual editor configuration in `astro.config.mjs`
- Validates editor availability on startup with graceful degradation
- Supports many editors: Cursor, VS Code, Neovim, Vim, JetBrains IDEs, etc.
- Provides installation guidance if configured editor is missing

### Styling

- **Tailwind CSS 4.x** via Vite plugin (not PostCSS)
- **DaisyUI** provides pre-built component classes
- **Font**: DM Sans (configured in `tailwind.config.mjs`)
- Use utility classes directly in components
- DaisyUI themes configured in `tailwind.config.mjs`

### TypeScript & ESLint Configuration

**TypeScript:**
- Extends `astro/tsconfigs/strict`
- JSX set to `react-jsx` with import source `react`
- Strict null checks enabled

**ESLint:**
- Configured in `eslint.config.js` (flat config format)
- `.astro` files excluded from linting (handled separately by Astro)
- Import ordering enforced with `eslint-plugin-import`
- React hooks rules enforced

### Deployment

- **Adapter**: Cloudflare Pages (`@astrojs/cloudflare`)
- Build output: `dist/` directory

### Pages

- **index.astro** - Homepage
- **editor.astro** - Blog editor page with AI-powered rich text editing
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

## API Routes

Server-side endpoints are defined in `src/pages/api/` using Astro's file-based routing:

**Pattern:**
- Export `POST`/`GET`/`PUT`/`DELETE` functions with `APIRoute` type
- Set `export const prerender = false;` for SSR routes
- Request body accessed via `await request.json()`
- Return `Response` objects with appropriate status codes

**Current routes:**
- `/api/ai/command` - AI command endpoint using `@ai-sdk/google` for text generation
- `/api/ai/copilot` - AI copilot endpoint for editor assistance using Google Gemini
- `/api/uploadthing` - File upload integration with UploadThing

## Plate.js Editor Architecture

The rich text editor (`src/components/editor/`) is built on **Plate.js** with modular plugins:

**Plugin Organization:**
- `BaseEditorKit` - Core editor plugin bundle (`editor-base-kit.tsx`)
- `plugins/` - Individual feature plugins (ai-kit, table-kit, markdown-kit, etc.)
- Each plugin has `*-base-kit.tsx` (base configuration) and `*-kit.tsx` (full configuration)

**Key Editor Features:**
- AI-powered commands via `/api/ai/command` using Google Gemini (generate, edit, comment on content)
- Table editing with multi-cell support
- Markdown export/import
- Comment/discussion system
- Drag-and-drop blocks
- File uploads via UploadThing

**Editor State Management:**
- Uses Plate's `SlateEditor` with plugin composition
- Server-side editor instances created in API routes for AI processing
- Client-side editor uses `usePlateEditor` hook
- API routes use `@ai-sdk/google` with `createGoogleGenerativeAI()` for model instantiation

## Content Collections

Blog posts and content are managed via Astro Content Collections:

**Configuration** (`src/content.config.ts`):
- Posts defined with Zod schema for type-safe frontmatter
- Files loaded from `content/posts/` directory (`.md` and `.mdx`)
- Accessible via `astro.getCollection('posts')` in pages

## Environment Variables

Required environment variables (set in `.env` or deployment platform):
- `GOOGLE_API_KEY` - Google AI API key for editor AI features (get one at https://ai.google.dev)
