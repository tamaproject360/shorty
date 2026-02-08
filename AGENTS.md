# Repository Guidelines

Guidelines for agentic coding agents operating in the Shorty codebase.

## Project Overview

Shorty is a link shortener with analytics, running 100% on Cloudflare. Uses Nuxt 4 frontend and Cloudflare Workers backend.

## Project Structure

```
app/                    # Nuxt 4 application
  ├── components/       # Vue components (PascalCase)
  │   ├── ui/           # shadcn-vue components (DO NOT EDIT)
  │   ├── dashboard/    # Dashboard components
  │   │   ├── links/    # Link management components
  │   │   ├── microsites/  # Microsite (link-in-bio) components
  │   │   └── sidebar/  # Sidebar components
  │   └── home/         # Landing page components
  ├── composables/      # Vue composables (camelCase)
  ├── pages/            # File-based routing
  │   ├── dashboard/    # Dashboard pages (links, microsites, etc.)
  │   └── m/            # Public microsite pages (/m/[slug])
  ├── stores/           # Pinia stores
  │   ├── links.ts      # Link management store
  │   └── microsites.ts # Microsite management store
  ├── types/            # TypeScript types
  │   ├── link.ts       # Link types
  │   ├── microsite.ts  # Microsite types
  │   └── index.ts      # Type exports
  ├── utils/            # Utility functions
  └── lib/              # Shared helpers
server/                 # Nitro server (Cloudflare Workers)
  ├── api/              # API endpoints
  │   ├── link/         # Link CRUD endpoints
  │   └── microsite/    # Microsite CRUD endpoints
  └── utils/            # Server utilities
    ├── link-store.ts   # Link storage functions
    └── microsite-store.ts  # Microsite storage functions
schemas/                # Zod validation schemas
  ├── link.ts           # Link validation
  └── microsite.ts      # Microsite validation
tests/                  # Vitest tests
docs/                   # Documentation
  ├── CHANGELOG.md      # Change log
  ├── task.md           # Implementation summary
  └── API.md            # API documentation
```

## Commands

Use **pnpm** (v10+) with **Node.js 22+**.

```bash
pnpm dev                  # Start dev server (port 7465)
pnpm build                # Production build
pnpm preview              # Worker preview via wrangler
pnpm lint:fix             # ESLint with auto-fix
pnpm types:check          # TypeScript type check

# Testing (Vitest + Cloudflare Workers pool)
pnpm vitest               # Watch mode
pnpm vitest run           # CI mode (run once)
pnpm vitest tests/sink.spec.ts           # Single file
pnpm vitest tests/api/link.spec.ts       # Single API test
pnpm vitest -t "returns 200"             # Pattern match

# Deployment
pnpm deploy:pages         # Deploy to Cloudflare Pages
pnpm deploy:worker        # Deploy to Cloudflare Workers
```

## Code Style

Uses `@antfu/eslint-config`. Run `pnpm lint:fix` before committing.

- **Indentation**: 2 spaces | **Quotes**: Single | **Semicolons**: None | **Trailing commas**: Always

### TypeScript

- Use TypeScript for all code; prefer `interface` for objects, `type` for unions
- Avoid `any`; use proper types or `unknown`
- Use Zod for runtime validation (see `schemas/`)

```typescript
interface Link { id: string, url: string, slug: string }

export const LinkSchema = z.object({
  id: z.string().trim().max(26),
  url: z.string().trim().url().max(2048),
  slug: z.string().trim().max(2048),
})
```

### Vue Components

Use `<script setup lang="ts">` always. Files: PascalCase (`LinkEditor.vue`).

```vue
<script setup lang="ts">
import type { Link } from '@/types'

const props = defineProps<{ link: Link }>()
const emit = defineEmits<{ update: [link: Link] }>()
</script>

<template>
  <div>{{ props.link.slug }}</div>
</template>
```

### Imports

- **Prefer Nuxt auto-imports** (`ref`, `computed`, `useFetch`, etc.)
- Explicit imports: external libs (`import { z } from 'zod'`), types (`import type { Link } from '@/types'`), icons (`import { Copy } from 'lucide-vue-next'`)
- Path aliases: `@/` (app), `@@/` (root)

### Naming Conventions

| Item           | Convention       | Example                  |
| -------------- | ---------------- | ------------------------ |
| Components     | PascalCase       | `LinkEditor.vue`         |
| Composables    | `use` prefix     | `useDashboardRoute()`    |
| Stores         | `use...Store`    | `useDashboardLinksStore` |
| API routes     | method suffix    | `create.post.ts`         |
| Directories    | kebab-case       | `dashboard/links/`       |
| Functions/vars | camelCase        | `getLink`                |
| Constants      | UPPER_SNAKE_CASE | `DASHBOARD_ROUTES`       |

### Error Handling

```typescript
// Server API - use createError for HTTP errors
export default eventHandler(async (event) => {
  const link = await readValidatedBody(event, LinkSchema.parse)
  if (existingLink) {
    throw createError({ status: 409, statusText: 'Link already exists' })
  }
})
```

## UI Components

- Use shadcn-vue from `app/components/ui/` — **Never edit** (auto-generated)
- Use `ResponsiveModal` for mobile-optimized dialogs
- Use Tailwind CSS v4 for styling

## Accessibility

Use static English for `aria-label` (no `$t()` translations):

```vue
<button aria-label="Open menu">
...
</button>  <!-- Good -->

<button :aria-label="$t('menu.open')">
...
</button>  <!-- Bad -->
```

# Aturan 1: Akses Dokumentasi dan cari Informasi menggunakan MCP Context7/Firecrawl ataupun web search Sebelum Menjalankan Kode

## Deskripsi

Apabila saat mau eksekusi atau implementasi kode apa pun tetapi kamu bingung dan tidak paham tentang dokumentasi implementasi suatu pustaka ataupun penulisan kode, konsultasikan terlebih dahulu dengan MCP server Context7 atau MCP Firecrawl untuk mengakses dokumentasi dan contoh kode terbaru dari pustaka dan framework yang relevan. Hal ini memastikan bahwa implementasi didasarkan pada praktik terbaik terkini dan penggunaan API yang akurat.

# Aturan 2 : Manajemen Berkas & Sistem

- Hindari operasi destruktif seperti `rm -rf`; gunakan alternatif yang lebih aman seperti `trash`
- Jangan gunakan `sudo` kecuali benar-benar diperlukan. Jika perlu, minta pengguna untuk menjalankan `sudo` di jendela terminal terpisah
- Setelah melakukan operasi, simpan log perubahan atau ringkasan perubahan dalam berkas markdown di docs/CHANGELOG.md
- Selalu simpan dokumentasi dalam berkas markdown di /docs, DILARANG KERAS dan JANGAN PERNAH meletakan dokumetasi di direktori utama (root)

# Aturan 3 : Membuat UI mengacu pada design-system

## Deskripsi

Untuk membuat UI harus selalu mengacu pada design-system.xml dan best practice dan standar industri, pastikan design konsisten di semua halaman termasuk dengan animasinya.

# Auran 4: Kualitas & Standar Kode

## Ikuti prinsip-prinsip berikut dalam setiap kode yang kamu generate:

- Clean Code: Tulis kode yang mudah dibaca dan dipahami
- SOLID Principles: Terapkan Single Responsibility, jangan buat function yang melakukan terlalu banyak hal
- DRY (Don't Repeat Yourself): Hindari duplikasi kode, buat reusable functions
- Gunakan naming convention yang konsisten (camelCase untuk variabel/function, PascalCase untuk class)
- Tambahkan error handling yang proper
- Tulis komentar hanya untuk logika yang kompleks, bukan yang sudah jelas
- Pecah fungsi monolitik yang besar menjadi fungsi-fungsi yang lebih kecil dan dapat digunakan kembali
- Hapus kode yang dikomentari dari versi final; jika kode tidak diperlukan, hapus saja
- Tangani peringatan linting dan pemformatan dengan segera

Code Convention:

- Gunakan 2 spasi untuk indentasi
- Gunakan single quotes untuk string
- Tambahkan semicolon di akhir statement
- Gunakan async/await instead of promises chains
- Tulis JSDoc untuk function yang exported

# Aturan 5: Dependensi & Pustaka

- Gunakan hanya pustaka yang stabil dan terpelihara dengan baik
- Hindari pustaka yang sudah usang (deprecated), kedaluwarsa, eksperimental, atau versi beta
- Jaga agar dependensi tetap mutakhir dengan versi stabil terbaru

# Aturan 6: Keamanan & Konfigurasi

- JANGAN PERNAH dan DILARANG KERAS menyertakan informasi sensitif (kunci API, kata sandi, data pribadi) secara hardcode
- Gunakan berkas konfigurasi atau variabel lingkungan misal seperti .env alih-alih nilai yang ditulis langsung (hardcoded)

# Aturan 7 : Selalu Buat Checkpoint Setelah Menyelesaikan Tugas dan update progress serta Menyelesaikan Fitur atau perbaikan selalu akhiri dengan commit .git

## Deskripsi

Setelah menyelesaikan suatu tugas atau mencapai tonggak penting, selalu buat checkpoint dengan memperbarui daftar tugas (todo list). Hal ini memastikan pelacakan kemajuan dan memungkinkan rollback (kembali ke kondisi sebelumnya) jika diperlukan. Jangan membuat dokumentasi apapun setelah setiap menyelesaikan tugas, kamu hanya membuat dokumentasi apabila di minta secara explicit oleh pengguna.

## Pedoman

- **Checkpoint Penyelesaian Tugas**: Saat tugas selesai, perbarui daftar tugas dengan status “selesai” dan sampaikan ringkasan ke pengguna mengenai apa yang telah dicapai dan juga mengupdate docs/task.md
- **Dokumentasi Tonggak**: Untuk tugas kompleks dengan beberapa langkah, buat checkpoint pada titik-titik logis untuk melacak kemajuan.
- **Pelestarian Kondisi**: Pastikan semua perubahan tersimpan dengan benar dan proyek berada dalam kondisi berfungsi sebelum menandai tugas sebagai selesai.
- **Integrasi dengan Alur Kerja**: Jadikan pembuatan checkpoint sebagai bagian standar dari setiap penyelesaian tugas.
- **Commit dan Push ke GitHub**: Setelah menyelesaikan fitur atau perbaikan, selalu lakukan commit pada repository git lokal.
