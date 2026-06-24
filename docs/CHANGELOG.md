# Changelog

## 2026-06-24 — Full Rebrand & Homepage Redesign

### 🔄 Complete Rebrand (Sink → Shorty)

- Replaced all `sink` branding with `shorty` across 33+ files
- Renamed `sink.png` → `icon.png` (logo images)
- Updated package name, wrangler config, dataset names
- Changed default site token from `SinkCool` → `ShortyCool`
- Updated all 6 i18n locales with new strings
- Renamed test files, skill directory, and docs
- Removed all hardcoded `sink.cool` domain references

### 🎨 Homepage Redesign (Linear-Style)

- **Hero**: New layout with badge, bold headline, 2 CTAs, dashboard screenshot preview
- **Quote**: Bold two-part tagline section ("A new species of link shortener")
- **Features**: Simplified to 6 items (Short Links, Analytics, AI, Microsites, QR Codes, Multi-Language)
- **CTA**: Clean single-button call-to-action at bottom
- **Testimonials**: 9 English-only entries, removed non-English content

### ❌ Removed

- GitHub star count from header and sidebar
- Homepage Stats section (GitHub stars from sink repo)
- Twitter/X follow badge from hero
- "Start Deploy" button pointing to GitHub repo
- "Built with Nuxt.js" logo section
- "HTML.ZONE" copyright footer
- Non-English testimonials (Chinese, Japanese, Korean)

### 🔧 Technical Fixes

- `NUXT_HOME_URL` now properly reads from env var (prevents redirect to sink.cool)
- Canonical URL dynamically uses `homeURL` runtime config
- OG image URL computed from `homeURL` + relative path
- Server verify endpoint returns dynamic `homeURL`
- AI slug examples updated to shorty references
- Link fallback icon uses local `/icon.png` instead of external URL
- Migrate import/export filenames use `shorty-` prefix
- Social links (twitter/telegram/github) set to empty — hidden from footer

### 🖼️ Observer Plugin

- Installed observer image-reading plugin for multimodal support
- Agent: `~/.config/opencode/agents/observer.md` (uses `opencode-go/Qwen3.7 Plus`)
- Plugin: `~/.config/opencode/plugin/observer-bridge.js`
- Enables reading screenshots, error logs, and design mockups

---

## 2026-06-24 — Quote Section Refinement

### Changed
- Simplified Quote section: removed Nuxt logo and "Built on open source" label
- Clean, minimal two-part headline + body layout

---

## 2026-02-08 — Analytics & Tracking

### Added
- **Analytics Engine**: Local storage-based event tracking for microsite views
- **Analytics Dashboard**: Dedicated page showing total views, timeline, top countries, referrers, and devices
- **Card Actions**: Added "Stats" button to microsite cards

### Modified
- `app/components/dashboard/microsites/MicrositeCard.vue`: Updated footer layout to include Analytics button
- `app/pages/m/[slug].vue`: Added automatic view tracking on page load

## 2026-02-08 — Microsite Visual Upgrades

### Added
- **Bento Grid Layout**: Added support for variable item sizes (1x1, 2x1, 2x2) with a responsive grid layout
- **Background Customization**: Added support for custom background images with adjustable overlay opacity
- **Enhanced Editor**: Added grid size selection for items and background settings section
- **Social Icon Bar**: Dedicated section for social media profiles with automatic icon rendering
- **Rich Media Embeds**: YouTube and Spotify URLs rendered as playable embed cards

### Modified
- `app/types/microsite.ts`: Added `gridSpan`, `bgImage`, `bgOverlayOpacity`, `SocialLink` properties
- `schemas/microsite.ts`: Updated Zod schema for new properties
- `app/components/dashboard/microsites/Editor.vue`: Added Grid Size selector, Background controls, social links UI
- `app/pages/m/[slug].vue`: Implemented grid layout, background rendering, social icons, media embeds

## 2026-02-08 — Microsite Feature Implementation

### Added
- **Microsite Feature (Linktree-style)**: Complete link-in-bio functionality
  - Full CRUD API endpoints
  - Dashboard management page
  - Public microsite pages at `/m/{slug}`
  - Drag-and-drop link item management
  - Theme customization (light/dark/auto)
  - Publish/unpublish toggle

### Files Created
- `schemas/microsite.ts`, `server/utils/microsite-store.ts`
- `server/api/microsite/` (create, list, get, update, delete)
- `app/types/microsite.ts`, `app/stores/microsites.ts`
- `app/pages/dashboard/microsites.vue`
- `app/components/dashboard/microsites/` (Card, Editor, Delete)
- `app/pages/m/[slug].vue`

### Fixed
- Template parsing error in Editor.vue
- All ESLint and TypeScript type checking errors resolved
- Card view missing action buttons in links component
