import type { MicrositeSchema } from '@@/schemas/microsite'
import type { H3Event } from 'h3'
import type { z } from 'zod'
import { getDb } from './db'

type Microsite = z.infer<typeof MicrositeSchema>

export function normalizeMicrositeSlug(event: H3Event, slug: string): string {
  const { caseSensitive } = useRuntimeConfig(event)
  return caseSensitive ? slug : slug.toLowerCase()
}

export async function putMicrosite(_event: H3Event, microsite: Microsite): Promise<void> {
  const db = getDb()
  db.prepare(`
    INSERT INTO microsites (id, slug, title, description, avatar, theme, social_links, links, bg_image, bg_overlay_opacity, text_color, published, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title, description = excluded.description, avatar = excluded.avatar,
      theme = excluded.theme, social_links = excluded.social_links, links = excluded.links,
      bg_image = excluded.bg_image, bg_overlay_opacity = excluded.bg_overlay_opacity,
      text_color = excluded.text_color, published = excluded.published, updated_at = unixepoch()
  `).run(
    microsite.id,
    microsite.slug,
    microsite.title,
    microsite.description || null,
    microsite.avatar || null,
    microsite.theme || 'auto',
    JSON.stringify(microsite.socialLinks || []),
    JSON.stringify(microsite.links || []),
    microsite.bgImage || null,
    microsite.bgOverlayOpacity ?? 0.5,
    microsite.textColor || null,
    microsite.published ? 1 : 0,
    microsite.createdAt,
    microsite.updatedAt,
  )
}

export async function getMicrosite(_event: H3Event, slug: string): Promise<Microsite | null> {
  const db = getDb()
  const row = db.prepare('SELECT * FROM microsites WHERE slug = ?').get(slug) as Record<string, unknown> | undefined
  if (!row)
    return null
  return rowToMicrosite(row)
}

export async function deleteMicrosite(_event: H3Event, slug: string): Promise<void> {
  const db = getDb()
  db.prepare('DELETE FROM microsites WHERE slug = ?').run(slug)
}

export async function micrositeExists(event: H3Event, slug: string): Promise<boolean> {
  return await getMicrosite(event, slug) !== null
}

interface ListMicrositesOptions {
  limit: number
  cursor?: string
}

interface ListMicrositesResult {
  microsites: (Microsite | null)[]
  list_complete: boolean
  cursor?: string
}

export async function listMicrosites(_event: H3Event, options: ListMicrositesOptions): Promise<ListMicrositesResult> {
  const db = getDb()
  const offset = options.cursor ? Number.parseInt(options.cursor) : 0
  const rows = db.prepare(
    'SELECT * FROM microsites ORDER BY created_at DESC LIMIT ? OFFSET ?',
  ).all(options.limit + 1, offset) as Record<string, unknown>[]

  const list_complete = rows.length <= options.limit
  const items = rows.slice(0, options.limit)

  return {
    microsites: items.map(rowToMicrosite),
    list_complete,
    cursor: list_complete ? undefined : (offset + options.limit).toString(),
  }
}

function rowToMicrosite(row: Record<string, unknown>): Microsite {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string,
    avatar: row.avatar as string,
    theme: (row.theme as 'light' | 'dark' | 'auto') || 'auto',
    socialLinks: row.social_links ? JSON.parse(row.social_links as string) : [],
    links: row.links ? JSON.parse(row.links as string) : [],
    bgImage: row.bg_image as string,
    bgOverlayOpacity: row.bg_overlay_opacity as number,
    textColor: row.text_color as string,
    published: !!(row.published),
    createdAt: row.created_at as number,
    updatedAt: row.updated_at as number,
  }
}
