# ⚡ Shorty

**A Simple, Speedy, and Secure Link Shortener.**

> **Note**: This is a modified fork of [Sink](https://github.com/miantiao-me/sink) designed to run **Locally** (Node.js) or on **Netlify/Docker**, without requiring Cloudflare Workers/KV/Analytics.

## ✨ Key Features

- **🏠 Run Anywhere:** Works on Localhost, Netlify, Vercel, or any Node.js environment.
- **🔗 Link Shortening:** Create clean, short URLs instantly.
- **🌐 Microsites (Link-in-Bio):** Create beautiful Linktree-style landing pages with customizable themes.
- **📂 Local Storage:** Uses file-system based storage by default (no complex database setup required).
- **📊 Analytics:** Tracks clicks, referrers, and user agents (stored locally).
- **🎨 Custom Slugs:** Choose your own URL ending or let AI generate one.
- **🖼️ QR Codes:** Auto-generated QR codes for every link.
- **📱 Responsive UI:** Beautiful dashboard managed with Nuxt UI & Tailwind CSS.
- **👁️ View Options:** Toggle between Card and List views for easier management.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/shorty.git
   cd shorty
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start Development Server**
   ```bash
   pnpm dev
   ```
   Access the dashboard at: `http://localhost:7465`

### 🔑 Default Login

The first time you run the app, use the default site token or check your `.env` file if you set one.

- Default Site Token: Check your console output or set `NUXT_SITE_TOKEN` in `.env`.
- If not set, it generates a random one. **Check the terminal logs on startup.**

## 🎯 Features Guide

### Link Shortening

Create short URLs with custom slugs or auto-generated ones. Track clicks, referrers, and manage all your links from the dashboard.

### Microsites (Link-in-Bio)

Create beautiful landing pages similar to Linktree:

- **Custom branding**: Add your avatar, title, and description
- **Multiple links**: Add unlimited links to your microsite
- **Theme options**: Choose from light, dark, or auto themes
- **Publish control**: Toggle visibility of your microsite
- **Custom slugs**: Access your microsite at `yourdomain.com/m/your-slug`

To create a microsite:

1. Go to Dashboard → Microsites
2. Click "Create Microsite"
3. Fill in your details and add links
4. Publish and share your microsite URL

## 🛠️ Configuration

Edit `nuxt.config.ts` or use `.env` variables to configure:

- `NUXT_SITE_TOKEN`: The password to access the dashboard.
- `NUXT_PUBLIC_SITE_URL`: Your deployed URL (for generating correct short links).
- `NUXT_HOME_URL`: Leave empty to prevent redirects (default: empty).

## 📁 Project Structure

```
app/                    # Nuxt 4 application
  ├── components/       # Vue components
  │   ├── ui/           # shadcn-vue components (auto-generated)
  │   ├── dashboard/    # Dashboard components
  │   │   ├── links/    # Link management components
  │   │   └── microsites/  # Microsite components
  │   └── home/         # Landing page components
  ├── composables/      # Vue composables
  ├── pages/            # File-based routing
  │   ├── dashboard/    # Dashboard pages
  │   └── m/            # Public microsite pages
  ├── stores/           # Pinia stores
  ├── types/            # TypeScript types
  ├── utils/            # Utility functions
  └── lib/              # Shared helpers
server/                 # Nitro server
  ├── api/              # API endpoints
  │   ├── link/         # Link management APIs
  │   └── microsite/    # Microsite APIs
  └── utils/            # Server utilities
schemas/                # Zod validation schemas
tests/                  # Vitest tests
docs/                   # Documentation
```

## 📦 Deployment

### Netlify

1. Connect your repo to Netlify.
2. Build command: `npm run build`
3. Publish directory: `.output/server`
4. **Important**: Add environment variables (`NUXT_SITE_TOKEN`) in Netlify dashboard.

### Docker / Node.js

Build the application:

```bash
pnpm build
node .output/server/index.mjs
```

## 💖 Credits

Original project [Sink](https://github.com/miantiao-me/sink) by @ccbikai.
This fork modifies the storage layer to be platform-agnostic using [Unstorage](https://unstorage.unjs.io/).

## 📚 Additional Documentation

- [API Documentation](docs/API.md) - Complete API reference
- [Changelog](docs/CHANGELOG.md) - Recent changes and updates
- [Task Summary](docs/task.md) - Current implementation status

## 🛡️ License

MIT License - see LICENSE file for details
