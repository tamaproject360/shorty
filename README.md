# ⚡ Shorty

**A Simple, Speedy, and Secure Link Shortener with Analytics.**

[![License](https://img.shields.io/badge/license-MIT-000000?style=flat)](LICENSE)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?style=flat&logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?style=flat&logo=sqlite&logoColor=white)](https://sqlite.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com)

Shorty is a modern, self-hosted link shortener with built-in analytics. Deploy anywhere — Docker, LXC, VPS, or bare metal. **SQLite for storage, zero external dependencies, no vendor lock-in.**

> Forked from [Sink](https://github.com/miantiao-me/sink) by @ccbikai — completely de-Cloudflared with SQLite + geoip-lite.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔗 **Short Links** | Compress URLs to minimal length with custom slugs |
| 📊 **Analytics** | Click tracking with country, browser, OS, device breakdown |
| 🤖 **AI Slug** | Smart slug generation via OpenAI-compatible API |
| 🌐 **Microsites** | Link-in-bio pages with themes, social links, embeds |
| 📱 **QR Codes** | Auto-generated QR codes for every link |
| 🌍 **Multi-Language** | 6 languages with full i18n support |
| 🎨 **Dark Mode** | Light, dark, and system-aware themes |
| 💾 **SQLite** | Single-file persistent storage, easy to backup |

---

## 🚀 Quick Start

**Requirements:** Node.js 22+, pnpm 10+

```bash
git clone https://github.com/tamaproject360/shorty
cd shorty
pnpm install
pnpm dev
```

Open [http://localhost:7465](http://localhost:7465).

Default token: set `NUXT_SITE_TOKEN` in `.env` (min 8 chars).

---

## 🐳 Docker

```bash
git clone https://github.com/tamaproject360/shorty.git
cd shorty
echo "NUXT_SITE_TOKEN=YourSecretToken" >> .env
docker compose up -d
```

Data persists in `shorty_data` volume. The SQLite database lives at `.data/shorty.db`.

---

## 🛠️ Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `NUXT_SITE_TOKEN` | *(required)* | Dashboard access token |
| `NUXT_HOME_URL` | `""` | Production URL (leave empty for local) |
| `NUXT_OPENAI_API_KEY` | `""` | OpenAI API key for AI slug generation |
| `NUXT_OPENAI_BASE_URL` | `https://api.openai.com/v1` | OpenAI-compatible endpoint (Groq, Ollama, etc.) |
| `NUXT_AI_MODEL` | `gpt-4o-mini` | AI model name |
| `NUXT_REDIRECT_STATUS_CODE` | `308` | HTTP redirect code |

See [`.env.example`](.env.example) for all options.

---

## 📁 Project Structure

```
app/                    # Nuxt 4 frontend
  ├── components/       # Vue components
  │   ├── ui/           # shadcn-vue components
  │   ├── dashboard/    # Dashboard
  │   └── home/         # Landing page
  ├── pages/            # File-based routing
  ├── stores/           # Pinia stores
  └── types/            # TypeScript types
server/                 # Nitro server
  ├── api/              # REST API endpoints
  └── utils/            # SQLite storage, analytics, auth
schemas/                # Zod validation schemas
tests/                  # Vitest tests
```

---

## 📦 Deployment

### Docker (Recommended)

```bash
docker compose up -d
```

### Bare Metal

```bash
pnpm build
node .output/server/index.mjs
```

---

## 🤝 Contributing

1. Fork → `git checkout -b feat/amazing` → `git commit -m "feat: thing"` → Push → PR

---

## 💖 Credits

Original project [Sink](https://github.com/miantiao-me/sink) by [@ccbikai](https://github.com/ccbikai). Shorty replaces Cloudflare dependencies with SQLite + geoip-lite for full self-hosting.

---

## 📜 License

MIT
