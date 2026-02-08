# Changelog

## 2026-02-08 - Analytics & Tracking

### Added
- **Analytics Engine**: Local storage-based event tracking for microsite views.
- **Analytics Dashboard**: Dedicated page showing total views, timeline, top countries, referrers, and devices.
- **Card Actions**: Added "Stats" button to microsite cards.

### Modified
- `app/components/dashboard/microsites/MicrositeCard.vue`: Updated footer layout to include Analytics button.
- `app/pages/m/[slug].vue`: Added automatic view tracking on page load.

## 2026-02-08 - Microsite Visual Upgrades

### Added (Phase 1 Continued)
- **Bento Grid Layout**: Added support for variable item sizes (1x1, 2x1, 2x2) with a responsive grid layout.
- **Background Customization**: Added support for custom background images with adjustable overlay opacity.
- **Enhanced Editor**: Added grid size selection for items and background settings section.

### Modified
- `app/types/microsite.ts`: Added `gridSpan`, `bgImage`, `bgOverlayOpacity` properties.
- `schemas/microsite.ts`: Updated Zod schema for new properties.
- `app/components/dashboard/microsites/Editor.vue`: Added Grid Size selector and Background controls.
- `app/pages/m/[slug].vue`: Implemented grid layout logic and background image rendering.

### Added
- **Social Icon Bar**: Dedicated section for social media profiles (GitHub, Twitter, Instagram, etc.) with automatic icon rendering.
- **Rich Media Embeds**: Automatically converts YouTube and Spotify URLs into playable embed cards on public microsite pages.
- **Improved Editor**: Added social links management section to the microsite editor.

### Modified
- `app/types/microsite.ts`: Added `SocialLink` interface and `socialLinks` array to `Microsite` type.
- `schemas/microsite.ts`: Updated Zod schema to validate social links.
- `app/components/dashboard/microsites/Editor.vue`: Added UI for adding/removing social links.
- `app/pages/m/[slug].vue`: Added rendering logic for social icons and media embeds.

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
