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

# Start development server with local Cloudflare emulation
bun run dev:cf
# Requires wrangler.toml configuration

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
- **Cloudflare** - Deployment adapter for Cloudflare Pages with D1, KV, and R2

### Project Structure
```
src/
├── components/        # React (.tsx) and Astro (.astro) components
├── layouts/          # Page layouts (Layout.astro, LayoutNoHeader.astro)
├── pages/            # File-based routing (.astro files for pages, /api/ for endpoints)
├── lib/              # Utilities (auth.ts, command prompts, etc.)
├── db/               # Database schema and client (Drizzle ORM)
├── styles/           # Global CSS
└── utils/            # Utility functions

content/posts/        # Blog posts (Astro Content Collections)
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

**code-jump-plugin** (`vite-plugins/code-jump-plugin.ts`)
- Adds F2 hotkey to jump from browser to editor
- Requires manual editor configuration in `astro.config.mjs`
- Validates editor availability on startup with graceful degradation

### Styling

- **Tailwind CSS 4.x** via Vite plugin (not PostCSS)
- **DaisyUI** provides pre-built component classes
- **Font**: DM Sans (configured in `tailwind.config.mjs`)

### TypeScript & ESLint Configuration

**TypeScript:**
- Extends `astro/tsconfigs/strict`
- JSX set to `react-jsx` with import source `react`
- Strict null checks enabled

**ESLint:**
- Configured in `eslint.config.js` (flat config format)
- `.astro` files excluded from linting (handled separately by Astro)

### Deployment

- **Adapter**: Cloudflare Pages (`@astrojs/cloudflare`)
- Build output: `dist/` directory
- **Runtime**: Access to D1 database, KV storage, R2 object storage via `App.Locals`

## Cloudflare Services Integration

### Database (D1)

**Schema** (`src/db/schema/index.ts`):
- `users` - User accounts with email, username, password hash, roles
- `blogs` - Blog posts with Plate editor content (JSON), status, cover images
- `sessions` - Session tokens for auth

**Client** (`src/db/index.ts`):
- Uses Drizzle ORM with D1 adapter
- `createDB(d1)` creates a database client
- Access via `locals.db` in API routes and pages

### Storage (R2)

File upload integration via UploadThing:
- Configuration in `src/pages/api/uploadthing/route.ts`
- Files stored in R2 bucket, accessible via `locals.r2`

### KV Storage

Accessible via `locals.kv` for caching and session storage.

### Authentication System

**AuthService** (`src/lib/auth.ts`):
- JWT-based auth using Web Crypto API (no external dependencies)
- Password hashing with SHA-256 + salt
- Token verification and cookie management
- Supports both `Authorization: Bearer` header and cookie-based auth

**Auth API Routes** (`src/pages/api/auth/`):
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

**Protected Routes Pattern:**
```typescript
const token = AuthService.extractToken(request);
if (!token) return new Response('Unauthorized', { status: 401 });
const payload = await AuthService.verifyToken(token);
if (!payload) return new Response('Invalid token', { status: 401 });
```

## Pages Overview

### Marketing Pages
- **index.astro** - Homepage
- **astra.astro** - Astra AI Agent landing page
- **new-astra.astro** - New Astra landing page variant
- **pricing.astro** - Pricing page with interactive tabs

### Blog/CMS Pages
- **blogs.astro** - Public blog listing (fetches from WordPress API)
- **dashboard.astro** - CMS dashboard for managing user's blogs
- **/blogs/new** - Create new blog post (WordPress-style editor)
- **/blogs/[id]/edit** - Edit existing blog post
- **/blogs/[id]** - View published blog post
- **login.astro** - User login page
- **register.astro** - User registration page

### WordPress-Style Editor (`/blogs/new`)

The blog creation page (`src/pages/blogs/new.astro`) provides a WordPress-like editing experience:

**Layout:**
- Fixed top toolbar with back, title, last saved time, focus mode toggle, preview, publish
- Large title input (4xl) that auto-generates permalink
- Main editor area with Plate.js rich text editor
- Fixed right sidebar (320px) with collapsible panels:
  - **Publish** - Status, visibility, save draft/publish buttons
  - **Featured Image** - URL input with preview
  - **Tags** - Add/remove tags with Enter or comma
  - **Excerpt** - Custom excerpt with character count
  - **Categories** - (placeholder for future)

**Features:**
- Focus mode (distraction-free writing, hides toolbar/sidebar)
- Auto-save every 3 seconds to draft
- Keyboard shortcuts: `Ctrl+S` save, `Ctrl+Shift+P` publish, `ESC` exit focus mode
- Unsaved changes warning on navigation
- Real-time cover image preview
- Tag management with visual chips

**Data Flow:**
1. User enters title → permalink auto-generated from title
2. Content changes → dispatched as `editor-content-change` event
3. Auto-save triggers → creates new blog via `POST /api/blogs`
4. After creation → URL updates to `/blogs/:id/edit`
5. Subsequent saves → updates via `PUT /api/blogs/:id`

### Editor
- **editor.astro** - Standalone rich text editor with AI features

### Legacy Content Pages
- **/posts/** - Astro Content Collections pages

## API Routes

Server-side endpoints in `src/pages/api/` use Astro's file-based routing:

**Important**: All API routes must set `export const prerender = false;` to enable server-side execution on Cloudflare Pages.

**Astro Routing Convention**: Routes are defined as `path.ts` or `path/index.ts`, NOT `path/route.ts`.
- ✅ Correct: `src/pages/api/blogs.ts`
- ✅ Correct: `src/pages/api/blogs/[id].ts`
- ❌ Wrong: `src/pages/api/blogs/route.ts` (will return 404)
- ❌ Wrong: `src/pages/api/blogs/[id]/route.ts` (will return 404)

### AI Endpoints
- **`/api/ai/command`** - AI command endpoint for editor operations (generate, edit, comment)
- **`/api/ai/copilot`** - AI copilot endpoint for editor assistance

### CMS Endpoints
- **`GET /api/blogs`** - List current user's blogs (supports `?status=` filter)
  - Super admin (userId="super-admin") sees all blogs
  - Regular users see only their own blogs
- **`POST /api/blogs`** - Create new blog
  - Super admin: `user_id` set to `null`
  - Regular users: `user_id` set to their userId
  - Auto-generates unique slug from title
- **`GET /api/blogs/[id]`** - Get single blog
- **`PUT /api/blogs/[id]`** - Update blog
- **`DELETE /api/blogs/[id]`** - Delete blog

### Upload Endpoints
- **`/api/uploadthing`** - UploadThing integration
- **`/api/upload`** - Direct file upload to R2
- **`/api/upload/[key]`** - Get uploaded file by key

### Admin Endpoints
- **`POST /api/seed-admin`** - Create super admin account from environment variables
- **`GET /api/seed-admin`** - Check if admin account exists

## Plate Editor Architecture

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

## Utility Functions

- **`cn()`** (`src/utils/index.ts`): Merges Tailwind classes using `clsx` + `tailwind-merge`
- Use for conditional class composition: `cn("base-class", isActive && "active-class")`

## Environment Variables

Required environment variables (set in `.env` or deployment platform):
- `JWT_SECRET` - Secret for JWT token signing
- `AI_GATEWAY_API_KEY` - API gateway key for AI features
- `OPENAI_API_KEY` - OpenAI API key (optional, for alternative AI provider)
- `GOOGLE_API_KEY` - Google AI API key for editor AI features (get one at https://ai.google.dev)

### Super Admin Account

Optional environment variables for creating the initial admin account:
- `ADMIN_EMAIL` - Admin email address
- `ADMIN_PASSWORD` - Admin password (use a strong password!)
- `ADMIN_USERNAME` - Admin username (default: "admin")
- `ADMIN_FIRST_NAME` - Admin first name (default: "Admin")
- `ADMIN_LAST_NAME` - Admin last name (default: "User")

**Super admin uses a fixed `userId` of "super-admin"** and is authenticated via environment variables, not stored in the database. The super admin can:
- Create/edit/view all blogs (blogs have nullable `user_id`)
- Bypass regular user permission checks

Login validates against `ADMIN_EMAIL` and `ADMIN_PASSWORD` first before checking the database.

## Database Migrations

Migrations are stored in `migrations/` directory:

```bash
# Initialize local database
bun run db:init:local

# Initialize remote database
bun run db:init:remote

# Run migrations (for schema updates)
bun run db:migrate:local
bun run db:migrate:remote
```

**Important**: The `blogs.user_id` column is nullable to support super admin blogs. When a super admin creates a blog, `user_id` is set to `null` instead of a user reference.

## Cloudflare Pages Deployment

The project uses `@astrojs/cloudflare` adapter. Configure bindings in Cloudflare Pages dashboard:
- **D1 Database**: Bind as `DB`
- **KV Namespace**: Bind as `KV`
- **R2 Bucket**: Bind as `R2`

Access these via `locals.db`, `locals.kv`, `locals.r2` in API routes.
