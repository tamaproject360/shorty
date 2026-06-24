# ⚡ Shorty

**A Simple, Speedy, and Secure Link Shortener with Analytics.**

[![License](https://img.shields.io/github/license/miantiao-me/shorty?style=flat&color=000000)](LICENSE)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?style=flat&logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-000000?style=flat)](https://github.com/miantiao-me/shorty/pulls)

Shorty is a modern, analytics-powered link shortener built for teams. Deploy anywhere — Docker, Netlify, Vercel, or bare metal. No vendor lock-in.

> Forked from [Sink](https://github.com/miantiao-me/sink) by @ccbikai — adapted to run independently without Cloudflare dependency.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔗 **Short Links** | Compress URLs to minimal length with custom slugs |
| 📊 **Analytics** | Real-time click tracking, referrers, countries, and device stats |
| 🤖 **AI-Powered** | Smart slug generation using on-device AI |
| 🌐 **Microsites** | Build link-in-bio pages with themes, social links, and rich embeds |
| 📱 **QR Codes** | Auto-generated QR codes for every link |
| 🌍 **Multi-Language** | Full i18n support across 6 languages |
| 🎨 **Dark Mode** | Light, dark, and system-aware themes |
| 📦 **Import/Export** | Bulk migration via JSON files |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 22+
- **pnpm** 10+ (recommended)

### Local Development

```bash
# Clone
git clone https://github.com/miantiao-me/shorty.git
cd shorty

# Install
pnpm install

# Run (defaults to port 7465)
pnpm dev
```

Open [http://localhost:7465](http://localhost:7465).

### Default Login

Set your site token in `.env`:

```env
NUXT_SITE_TOKEN=YourSecretTokenHere
```

---

## 🐳 Docker

```dockerfile
# Coming soon — Docker Compose setup
```

```bash
docker compose up -d
```

---

## 🛠️ Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `NUXT_SITE_TOKEN` | _(required)_ | Dashboard access token (min 8 chars) |
| `NUXT_HOME_URL` | `""` | Your production URL; leave empty for local |
| `NUXT_REDIRECT_STATUS_CODE` | `308` | HTTP redirect code for short links |
| `NUXT_LINK_CACHE_TTL` | `60` | Cache TTL in seconds |
| `NUXT_DATASET` | `shorty` | Storage dataset name |
| `NUXT_AI_MODEL` | `@cf/qwen/qwen3-30b-a3b-fp8` | AI model for slug generation |

See [`.env.example`](.env.example) for all options.

---

## 📁 Project Structure

```
app/                    # Nuxt 4 frontend
  ├── components/       # Vue components (PascalCase)
  │   ├── ui/           # shadcn-vue components
  │   ├── dashboard/    # Dashboard pages
  │   └── home/         # Landing page
  ├── composables/      # Vue composables (camelCase)
  ├── pages/            # File-based routing
  ├── stores/           # Pinia stores
  └── types/            # TypeScript types
server/                 # Nitro server
  ├── api/              # API endpoints
  └── utils/            # Server utilities
schemas/                # Zod validation schemas
tests/                  # Vitest tests
docs/                   # Documentation
```

---

## 📦 Deployment

### Netlify / Vercel

1. Connect your repo
2. Build command: `pnpm build`
3. Publish directory: `.output/server`
4. Set `NUXT_SITE_TOKEN` in environment variables

### Docker / Node.js

```bash
pnpm build
node .output/server/index.mjs
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/amazing`
3. Commit your changes: `git commit -m "feat: amazing thing"`
4. Push to the branch: `git push origin feat/amazing`
5. Open a Pull Request

---

## 💖 Credits

Original project [Sink](https://github.com/miantiao-me/sink) by [@ccbikai](https://github.com/ccbikai).

Shorty extends Sink with platform-agnostic storage via [Unstorage](https://unstorage.unjs.io/), enabling deployment outside Cloudflare.

---

## 📚 Docs

- [API Reference](docs/API.md)
- [Changelog](docs/CHANGELOG.md)
- [Configuration](docs/configuration.md)
- [Deployment Guide](docs/deployment/)

---

## 📜 License

MIT © 2026 Shorty
