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

### API Routes

Server-side endpoints in `src/pages/api/` use Astro's file-based routing:

- **`/api/ai/command`** - AI command endpoint for editor operations (generate, edit, comment)
- **`/api/ai/copilot`** - AI copilot endpoint
- **`/api/uploadthing`** - File upload integration via Uploadthing

**Important**: All API routes must set `export const prerender = false;` to enable server-side execution on Cloudflare Pages.

### Content Collections

Blog posts and MDX content are managed through Astro Content Collections:

- **Collection**: `posts` located in `content/posts/`
- **Config**: Defined in `src/content.config.ts`
- **Schema**: Validates frontmatter with `title`, `description`, `updatedDate`, `heroImage`
- **Query**: Use `await getCollection('posts')` in Astro pages

### Path Aliases

The `@/*` path alias is configured in `tsconfig.json`:
- Import from `@/components/Header.astro` instead of `../../components/Header.astro`
- Resolves to `src/*` directory

### Plate Editor Architecture

The rich text editor (`src/components/PlateEditor.tsx`) is built on Plate.js with a modular plugin architecture:

**Plugin Kits** (`src/components/editor/plugins/`):
- **Base kits**: `editor-base-kit.tsx`, `basic-nodes-kit.tsx`, `basic-marks-kit.tsx`
- **Feature kits**: `ai-kit.tsx`, `copilot-kit.tsx`, `comment-kit.tsx`, `table-kit.tsx`
- **UI kits**: `fixed-toolbar-kit.tsx`, `floating-toolbar-kit.tsx`, `slash-kit.tsx`
- **Advanced**: `dnd-kit.tsx` (drag-drop), `font-kit.tsx`, `align-kit.tsx`, `indent-kit.tsx`

**Kit Pattern**:
- `*-base-kit.tsx` files provide base implementations
- `*-kit.tsx` files wrap with additional UI/functionality
- Import from `@platejs/` packages for core plugins

**AI Integration**:
- Commands handled by `src/lib/command/prompt/` utilities
- Gateway provider supports multiple models (OpenAI, Gemini)
- Streaming responses via AI SDK (`ai` package)

### Utility Functions

- **`cn()`** (`src/utils/index.ts`): Merges Tailwind classes using `clsx` + `tailwind-merge`
- Use for conditional class composition: `cn("base-class", isActive && "active-class")`
