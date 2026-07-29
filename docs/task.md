# Development Roadmap & Task List

This document outlines the development status, gap analysis, and future roadmap for the Shorty application.

## ✅ Completed Features

### 0.8 User Management and RBAC - Completed Jul 2026

- **Status:** Completed
- **Description:** Added local account authentication and role-based dashboard access.
- **Key Changes:**
  - Added username/password login with the seeded `admin` / `shorty@123` account
  - Added administrator-only user management below Microsites in the sidebar
  - Added Admin, Editor, and Viewer authorization for the API

### 0.7 Microsite Import Save Fix — _Completed Jun 2026_

- **Status:** Completed
- **Description:** Fixed microsite save failures after importing dashboard links with empty metadata.
- **Key Changes:**
  - Normalized null microsite item descriptions to optional values during schema validation
  - Added schema regression coverage for imported link items with null descriptions

### 0.6 Gitea Mirror Sync Repair — _Completed Jun 2026_

- **Status:** Completed
- **Description:** Restored Gitea mirror synchronization for the `tamaproject360/shorty` repository on LXC 106.
- **Key Changes:**
  - Confirmed `tamaproject360` is a Gitea organization owner, not a duplicate user account
  - Identified root-owned files inside affected bare mirror repositories as the cause of failed fetches
  - Restored repository ownership to the Gitea `git` service user and verified `shorty` matches GitHub `master`

### 0.5 Analysis and Realtime Repairs — _Completed Jun 2026_

- **Status:** Completed
- **Description:** Fixed broken analysis/realtime data loading paths and improved empty/realtime UI behavior.
- **Key Changes:**
  - Added shared click query filtering so stats/log endpoints generate valid SQL with or without filters
  - Updated counters, views, heatmap, metrics, events, and locations endpoints to use the shared filter
  - Added 15-second realtime refresh and newest-first logs
  - Fixed no-data UI for metrics and removed blur from valid zero counters

### 0.4 Microsite Link Import — _Completed Jun 2026_

- **Status:** Completed
- **Description:** Added a bulk import flow so existing dashboard links can be reused as microsite Link components.
- **Key Changes:**
  - Added an `Import Links` action in the microsite editor items toolbar
  - Added searchable multi-select modal backed by the existing `/api/link/list` endpoint
  - Imported selected links into the microsite item list with title, URL, description, and default icon

### 0.3 Microsite Rich Components — _Completed Jun 2026_

- **Status:** Completed
- **Description:** Expanded microsite items beyond links and separators with a richer component picker for link-in-bio pages.
- **Key Changes:**
  - Added searchable component picker in the microsite editor
  - Added Link, Separator, Text, Profile, Image, Embed, WhatsApp, Email, Phone, Instagram, Facebook, TikTok, Telegram, and Countdown item types
  - Updated live preview and public microsite rendering for the new item types
  - Added schema test coverage for supported item types and Maps rejection

### 0.2 Microsite Editor Live Preview — _Completed Jun 2026_

- **Status:** Completed
- **Description:** Added a live Linktree-style phone preview to the microsite create/edit modal so users can design with immediate visual feedback.
- **Key Changes:**
  - Added desktop live preview panel for title, slug, avatar, theme, background, and item list
  - Preserved mobile editing layout by hiding the preview on smaller screens
  - Updated `MicrositeItem` typing to include link/separator item type used by the editor and schema

### 0.1 Link Editor Modal Width — _Completed Jun 2026_

- **Status:** Completed
- **Description:** Expanded the dashboard link create/edit modal on desktop to make link information easier to fill in.
- **Key Changes:**
  - Added a wider desktop content width to the link editor `ResponsiveModal`
  - Preserved the existing mobile drawer layout

### 0. SQLite Migration — _Completed Jun 2026_

- **Status:** Production Ready
- **Description:** Removed all Cloudflare dependencies. Migrated storage, analytics, and geoip to SQLite stack.
- **Key Changes:**
  - SQLite (`better-sqlite3`) for links, microsites, and analytics
  - `geoip-lite` for IP-to-location (replaces Cloudflare `request.cf`)
  - AI: OpenAI-compatible API (replaces Workers AI)
  - Removed 9 Cloudflare packages + `worker-configuration.d.ts` (8800 lines)
  - Rewrote 6 analytics endpoints to SQLite queries
  - Docker deployment with persistent SQLite volume

### 1. Full Rebrand & Homepage Redesign — _Completed Jun 2026_

- **Status:** Production Ready
- **Description:** Complete rebrand from Sink to Shorty with Linear-style homepage.
- **Key Changes:**
  - All 33+ sink references replaced with shorty across codebase
  - Logo renamed from `sink.png` → `icon.png`
  - Homepage redesigned with Linear-inspired layout (Hero, Quote, Features, Testimonials, CTA)
  - GitHub star counts removed from header and sidebar
  - All social links (twitter/telegram/github) set to empty — hidden from UI
  - 6 i18n locales updated with new translations
  - Testimonials cleaned to English-only (9 entries)
  - Observer image-reading plugin installed

### 2. Microsite Feature (Linktree-style) — _Completed Feb 2026_

- **Status:** Production Ready
- **Description:** Complete implementation of microsite/link-in-bio functionality.
- **Key Capabilities:**
  - Full CRUD operations (Create, Read, Update, Delete)
  - Public-facing profiles at `/m/{slug}`
  - Drag-and-drop link management
  - Theme customization (Light/Dark/Auto)
  - Mobile-responsive design

### 3. Core Link Shortening — _Base Feature_

- **Status:** Production Ready
- **Key Capabilities:**
  - Shorten URLs with custom slugs
  - QR Code generation
  - Basic click analytics
  - Password protection

---

## 🔍 Gap Analysis: What's Missing?

Comparing Shorty to industry leaders (Linktree, Bento.me, Bitly) reveals several opportunities to create a "WOW" effect for users.

| Feature Area     | Current State                         | Competitor Standard (The "Gap")                                           | The "WOW" Opportunity                                                                               |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Visuals**      | Simple list of buttons. Basic themes. | Grid layouts (Bento), video backgrounds, custom fonts, rich media embeds. | **Microsite Studio:** Drag-and-drop grid layout with YouTube/Spotify embeds & animated backgrounds. |
| **Analytics**    | Basic click counts.                   | Geographic heatmaps, device breakdown, time-series charts, CTR analysis.  | **Insight Hub:** Interactive 3D World Map of clicks & real-time traffic visualization.              |
| **Engagement**   | Static links only.                    | Email collection, polls, Q&A, tipping/donations.                          | **Interaction Suite:** "Buy me a Coffee" integration & one-click newsletter signup.                 |
| **Intelligence** | Manual entry.                         | AI bio generator, link summarizer, SEO auto-tagging.                      | **AI Co-pilot:** "Generate my entire profile from my LinkedIn URL."                                 |
| **Sharing**      | Standard QR code.                     | Custom colors, logos, frames.                                             | **QR Branding Studio:** Fully customizable QR codes that match the user's brand identity.           |

---

## 🚀 Upcoming "WOW" Features Roadmap

These features are prioritized to maximize user delight and differentiate the platform.

### Phase 1: Visual Experience Upgrade (The "Look & Feel" Update)

**Goal:** Make microsites look professionally designed with minimal effort.

- [x] **Rich Media Embeds**
  - Detect YouTube, Spotify, Soundcloud, and Tweet URLs.
  - Automatically convert them into playable embed cards instead of simple buttons.
- [x] **"Bento" Grid Layout**
  - Allow items to span 1x1, 2x1, or 2x2 grid slots.
  - Create a masonry-style layout for the public microsite page.
- [x] **Background Customization**
  - Add support for gradient presets (e.g., "Sunset", "Ocean").
  - Allow uploading custom background images with blur/overlay opacity controls.
- [x] **Social Icon Bar**
  - Dedicated section for social media icons (Instagram, TikTok, X, GitHub) at the top or bottom of the profile.

### Phase 2: Deep Analytics (The "Insight" Update)

**Goal:** Give users satisfying data visualization that makes them want to check their dashboard daily.

- [x] **Tracking System**
  - Implemented local event tracking (views, clicks, referrer, device, country).
  - Created storage utility for analytics events.
- [x] **Analytics Dashboard**
  - Created dedicated analytics page per microsite.
  - Visualized total views, views over time (bar chart), top countries, referrers, and devices.
- [ ] **Interactive World Map**
  - Visualize clicks by country using a vector map.
  - Hover effects showing click counts per region.
- [x] **Time-Series Charts**
  - Line/Area chart showing clicks over last 24h, 7d, 30d.
  - Compare current period vs. previous period (e.g., "+20% this week").
- [x] **Device & Referrer Breakdown**
  - Donut charts for Device Type (Mobile vs. Desktop).
  - List of top referring sites (Instagram, Twitter, Direct).

### Phase 3: Engagement & Utilities (The "Power User" Update)

**Goal:** Turn the microsite into a functional tool, not just a signpost.

- [ ] **QR Code Studio**
  - Custom foreground/background colors.
  - Center logo upload.
  - different dot styles (squares, rounded, dots).
  - Download as SVG/PNG.
- [ ] **Contact Card (vCard)**
  - "Save Contact" button that downloads a .vcf file.
- [ ] **Monetization Block**
  - Simple integration for "Buy Me a Coffee", Ko-fi, or PayPal.

---

## 📝 Immediate Task List (Next Sprint)

To verify the "Gap Analysis" and start the roadmap:

1. **Rich Media Embeds**
   - _Task:_ Create a `MicrositeEmbed` component.
   - _Logic:_ Regex match URL to determine type (YouTube, Spotify, etc.).
   - _UI:_ Render iframe for supported media, fallback to button for others.

2. **Social Icon Bar**
   - _Task:_ Add `socialLinks` field to Microsite schema.
   - _UI:_ Add section in Editor to input profiles.
   - _Display:_ Render row of Lucide icons on public page.

3. **Background Customization**
   - _Task:_ Update schema to support `bgImage` and `bgStyle` (gradient/image).
   - _UI:_ Add color picker and image uploader to Editor.

4. **Analytics Foundation**
   - _Task:_ Ensure backend captures IP/User-Agent data (already partially implemented).
   - _Task:_ Create `UseAnalytics` composable to aggregate data for the frontend.
