# Changelog

## 2026-02-08 - Microsite Feature Implementation

### Added
- **Microsite Feature (Linktree-style)**: Complete implementation of microsite/link-in-bio functionality
  - Backend API endpoints for full CRUD operations (create, read, update, delete, list)
  - Frontend dashboard for managing microsites
  - Public-facing microsite pages at `/m/{slug}`
  - Drag-and-drop link item management in editor
  - Theme customization (light/dark/auto)
  - Publish/unpublish toggle
  - Avatar and description support

### Files Created
- `schemas/microsite.ts` - Zod validation schemas
- `server/utils/microsite-store.ts` - Storage utilities
- `server/api/microsite/` - API endpoints (create, list, get, update, delete)
- `app/types/microsite.ts` - TypeScript interfaces
- `app/stores/microsites.ts` - Pinia store for state management
- `app/pages/dashboard/microsites.vue` - Dashboard management page
- `app/components/dashboard/microsites/` - Components (Card, Editor, Delete)
- `app/pages/m/[slug].vue` - Public microsite display page

### Modified
- `.env` - Fixed auto-redirect issue by clearing NUXT_HOME_URL
- `server/api/link/search.get.ts` - Refactored to use Nitro Storage
- `app/stores/links.ts` - Added missing viewMode export
- `app/components/dashboard/links/Link.vue` - Fixed card view action buttons
- `app/composables/dashboard.ts` - Added microsites routes
- `app/components/dashboard/sidebar/AppSidebar.vue` - Added microsites menu item
- `i18n/locales/en-US.json` - Added microsites translation
- `app/app.config.ts` - Reserved 'm' slug for microsites

### Fixed
- Template parsing error in `Editor.vue` (extra closing div tag)
- All ESLint and TypeScript type checking errors resolved
- Card view missing action buttons in links component

### Technical Details
- Using Nitro Storage with filesystem driver for development
- Storage-agnostic design for easy Cloudflare KV migration
- Follows project conventions (shadcn-vue, Tailwind CSS, Zod validation)
- Responsive design with mobile-optimized modals
- Event-driven state updates using Pinia stores

### Testing
- Dev server running successfully on port 3000
- No build errors or type checking issues
- Lint-staged pre-commit hooks passing

### Commit
- Hash: 405c1fb
- Message: "feat: add microsite feature (linktree-style) with full CRUD functionality"
