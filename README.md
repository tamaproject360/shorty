# ⚡ Shorty

**A Simple, Speedy, and Secure Link Shortener.**

> **Note**: This is a modified fork of [Sink](https://github.com/miantiao-me/sink) designed to run **Locally** (Node.js) or on **Netlify**, without requiring Cloudflare Workers/KV/Analytics.

## ✨ Key Features

- **🏠 Run Anywhere:** Works on Localhost, Netlify, Vercel, or any Node.js environment.
- **🔗 Link Shortening:** Create clean, short URLs instantly.
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

## 🛠️ Configuration

Edit `nuxt.config.ts` or use `.env` variables to configure:

- `NUXT_SITE_TOKEN`: The password to access the dashboard.
- `NUXT_PUBLIC_SITE_URL`: Your deployed URL (for generating correct short links).

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

Original project [Sink](https://github.com/miantiao-me/sink) by [ccbikai](https://github.com/ccbikai).
This fork modifies the storage layer to be platform-agnostic using [Unstorage](https://unstorage.unjs.io/).
