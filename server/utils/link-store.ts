import type { LinkSchema } from '@@/schemas/link'
import type { H3Event } from 'h3'
import type { z } from 'zod'
import { getDb } from './db'

type Link = z.infer<typeof LinkSchema>

export function normalizeSlug(event: H3Event, slug: string): string {
  const { caseSensitive } = useRuntimeConfig(event)
  return caseSensitive ? slug : slug.toLowerCase()
}

export function buildShortLink(event: H3Event, slug: string): string {
  return `${getRequestProtocol(event)}://${getRequestHost(event)}/${slug}`
}

export async function putLink(_event: H3Event, link: Link): Promise<void> {
  const db = getDb()
  db.prepare(`
    INSERT INTO links (id, url, slug, comment, title, description, image, expiration, apple, google, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      url = excluded.url, comment = excluded.comment, title = excluded.title,
      description = excluded.description, image = excluded.image,
      expiration = excluded.expiration, apple = excluded.apple, google = excluded.google,
      updated_at = unixepoch()
  `).run(
    link.id,
    link.url,
    link.slug,
    link.comment || null,
    link.title || null,
    link.description || null,
    link.image || null,
    link.expiration || null,
    link.apple || null,
    link.google || null,
    link.createdAt,
    link.updatedAt,
  )
}

export async function getLink(_event: H3Event, slug: string): Promise<Link | null> {
  const db = getDb()
  const row = db.prepare('SELECT * FROM links WHERE slug = ?').get(slug) as Record<string, unknown> | undefined
  if (!row)
    return null
  return rowToLink(row)
}

export async function getLinkWithMetadata(event: H3Event, slug: string): Promise<{ link: Link | null, metadata: Record<string, unknown> | null }> {
  const link = await getLink(event, slug)
  if (!link)
    return { link: null, metadata: null }
  return {
    link,
    metadata: { url: link.url, comment: link.comment },
  }
}

export async function deleteLink(_event: H3Event, slug: string): Promise<void> {
  const db = getDb()
  db.prepare('DELETE FROM links WHERE slug = ?').run(slug)
}

export async function linkExists(event: H3Event, slug: string): Promise<boolean> {
  return await getLink(event, slug) !== null
}

interface ListLinksOptions {
  limit: number
  cursor?: string
}

interface ListLinksResult {
  links: (Link | null)[]
  list_complete: boolean
  cursor?: string
}

export async function listLinks(_event: H3Event, options: ListLinksOptions): Promise<ListLinksResult> {
  const db = getDb()
  const offset = options.cursor ? Number.parseInt(options.cursor) : 0
  const rows = db.prepare(
    'SELECT * FROM links ORDER BY created_at DESC LIMIT ? OFFSET ?',
  ).all(options.limit + 1, offset) as Record<string, unknown>[]

  const list_complete = rows.length <= options.limit
  const items = rows.slice(0, options.limit)

  return {
    links: items.map(rowToLink),
    list_complete,
    cursor: list_complete ? undefined : (offset + options.limit).toString(),
  }
}

export async function searchLinks(_event: H3Event, query: string, limit: number): Promise<Link[]> {
  const db = getDb()
  const pattern = `%${query}%`
  const rows = db.prepare(
    'SELECT * FROM links WHERE slug LIKE ? OR url LIKE ? OR comment LIKE ? OR title LIKE ? LIMIT ?',
  ).all(pattern, pattern, pattern, pattern, limit) as Record<string, unknown>[]
  return rows.map(rowToLink)
}

function rowToLink(row: Record<string, unknown>): Link {
  return {
    id: row.id as string,
    url: row.url as string,
    slug: row.slug as string,
    comment: row.comment as string,
    title: row.title as string,
    description: row.description as string,
    image: row.image as string,
    expiration: row.expiration as number,
    apple: row.apple as string,
    google: row.google as string,
    createdAt: row.created_at as number,
    updatedAt: row.updated_at as number,
  }
}
